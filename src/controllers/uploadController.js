const fs = require('fs').promises;
const path = require('path');
const xlsx = require('xlsx');
const prisma = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const { processOffersFromFile } = require('../services/aiMatchingService');

/**
 * Parse Excel/CSV file to extract supplier offers
 */
function parseFile(filePath, mimetype) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Get total rows (including header) to calculate actual data rows
    const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const totalRawRows = rawData.length;
    const dataRowCount = totalRawRows > 0 ? totalRawRows - 1 : 0; // Exclude header
    
    // Convert to JSON (this skips some invalid rows)
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    return {
      offers: data,
      totalRows: dataRowCount  // Total data rows excluding header
    };
  } catch (error) {
    throw new Error(`Failed to parse file: ${error.message}`);
  }
}

/**
 * Upload and process supplier offer file
 * This is a KEY feature for the assessment
 */
const uploadOfferFile = async (req, res, next) => {
  try {
    if (!req.files || !req.files.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const file = req.files.file;
    
    // Validate file type by mimetype OR extension
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv',
      'application/csv',
      'application/octet-stream' // Sometimes CSV files are sent as this
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = path.extname(file.name).toLowerCase();

    if (!allowedTypes.includes(file.mimetype) && !allowedExtensions.includes(fileExtension)) {
      throw new ApiError(400, 'Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    await file.mv(filepath);

    // Create file record in database
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        filename,
        originalName: file.name,
        mimetype: file.mimetype,
        size: file.size,
        path: filepath,
        uploadedBy: req.user?.id || null,
        processed: false
      }
    });

    // Parse file
    const parseResult = parseFile(filepath, file.mimetype);
    const offers = parseResult.offers;
    const totalRows = parseResult.totalRows;

    if (!offers || offers.length === 0) {
      throw new ApiError(400, 'No data found in file');
    }

    // Return file info and preview
    res.status(201).json({
      success: true,
      message: `File uploaded successfully. Found ${offers.length} offers. Processing will start automatically.`,
      data: {
        file: {
          id: uploadedFile.id,
          filename: uploadedFile.originalName,
          size: uploadedFile.size,
          offersCount: offers.length
        },
        preview: offers.slice(0, 5) // Show first 5 offers as preview
      }
    });

    // Process offers asynchronously (don't wait for response)
    processOffersFromFile(uploadedFile.id, offers, totalRows)
      .then(async (result) => {
        console.log(`✅ Processed ${result.validCount} valid and ${result.skippedCount} skipped offers from file ${uploadedFile.id}`);
        
        // Save summary counts to uploaded_files table
        await prisma.uploadedFile.update({
          where: { id: uploadedFile.id },
          data: {
            totalRows: result.totalRows,
            validCount: result.validCount,
            skippedCount: result.skippedCount,
            matchedToExistingCount: result.matchedToExistingCount,
            newlyCreatedCount: result.newlyCreatedCount
          }
        });

        // Create PERMANENT analysis snapshot (never changes, even if procurement accepts/rejects)
        await prisma.fileAnalysisSnapshot.create({
          data: {
            fileId: uploadedFile.id,
            skippedOffers: result.skippedOffers || [],
            analyzedMatches: result.analyzedMatches || [],
            totalRows: result.totalRows,
            validCount: result.validCount,
            skippedCount: result.skippedCount,
            matchedCount: result.matchedToExistingCount,
            newlyCreatedCount: result.newlyCreatedCount
          }
        });

        console.log(`📸 Permanent analysis snapshot saved for file ${uploadedFile.id}`);
      })
      .catch(err => {
        console.error(`❌ Error processing file ${uploadedFile.id}:`, err);
      });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all uploaded files
 */
const getUploadedFiles = async (req, res, next) => {
  try {
    const files = await prisma.uploadedFile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Use saved count columns (no recalculation needed!)
    const filesWithCounts = files.map(file => {
      const validCount = file.validCount || 0;
      const matchedOffers = file.matchedToExistingCount || 0;
      const newlyCreated = file.newlyCreatedCount || 0;
      const matchRate = validCount > 0 ? ((matchedOffers / validCount) * 100).toFixed(1) + '%' : '0%';

      return {
        ...file,
        _count: {
          offers: validCount,
          matchedOffers: matchedOffers,
          unmatchedOffers: newlyCreated,
          matches: validCount
        },
        matchRate: matchRate
      };
    });

    res.status(200).json({
      success: true,
      count: filesWithCounts.length,
      data: filesWithCounts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get matches for a specific file
 */
const getFileMatches = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
      include: {
        analysisSnapshot: true  // Fetch permanent snapshot
      }
    });

    if (!file) {
      throw new ApiError(404, 'File not found');
    }

    // Use permanent analysis snapshot (never changes!)
    const snapshot = file.analysisSnapshot;
    
    if (!snapshot) {
      // If no snapshot yet, file is still processing
      return res.status(202).json({
        success: false,
        processing: true,
        message: 'File is still being processed. Please try again in a few seconds.',
        data: {
          file: {
            id: file.id,
            filename: file.originalName,
            uploadedAt: file.createdAt,
            processed: file.processed
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        file: {
          id: file.id,
          filename: file.originalName,
          uploadedAt: file.createdAt,
          processed: file.processed
        },
        // Use permanent snapshot data (unaffected by procurement decisions)
        matches: snapshot.analyzedMatches,
        skippedOffers: snapshot.skippedOffers,
        processingMeta: {
          totalRows: snapshot.totalRows,
          validCount: snapshot.validCount,
          skippedCount: snapshot.skippedCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update match status (approve/reject)
 */
const updateMatchStatus = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['approved', 'rejected', 'pending'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const match = await prisma.offerMatch.update({
      where: { id: matchId },
      data: {
        status,
        reviewedBy: req.user?.id || null,
        aiReasoning: notes || undefined
      },
      include: {
        matchedProduct: true
      }
    });

    res.status(200).json({
      success: true,
      message: `Match ${status} successfully`,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard statistics
 */
const getDashboard = async (req, res, next) => {
  try {
    const [
      totalFiles,
      totalMatches,
      matchedOffers,
      unmatchedOffers,
      recentFiles
    ] = await Promise.all([
      prisma.uploadedFile.count(),
      prisma.offerMatch.count(),
      // Count approved + pending (successfully matched, regardless of approval status)
      prisma.offerMatch.count({ 
        where: { 
          matchedProductId: { not: null } 
        } 
      }),
      // Count unmatched + rejected
      prisma.offerMatch.count({ 
        where: { 
          matchedProductId: null 
        } 
      }),
      prisma.uploadedFile.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { matches: true }
          }
        }
      })
    ]);

    const matchRate = totalMatches > 0 
      ? ((matchedOffers / totalMatches) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalFiles,
          totalMatches,
          matchedOffers,
          unmatchedOffers,
          matchRate: `${matchRate}%`
        },
        recentFiles
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadOfferFile,
  getUploadedFiles,
  getFileMatches,
  updateMatchStatus,
  getDashboard
};

