# Assumptions & Future Enhancements

## Current System Assumptions

### **Data Processing**
- Files are uploaded one at a time (manual selection)
- All offers in a file are processed sequentially
- AI matching is performed synchronously per offer
- Invalid/incomplete data rows are tracked but not retried

### **AI Integration**
- Primary dependency on Google Gemini AI (gemini-2.5-flash model)
- API key is required and configured in environment
- AI service availability assumed (503 errors handled with fallback)
- No local AI model for offline processing

### **Procurement Workflow**
- Manual review and decision-making for pending offers
- AI auto-decision based on confidence thresholds (85%/50%)
- Price comparison done manually by procurement team
- No automated percentage-based price difference alerts

### **Database Design**
- Current schema supports core features
- Manual migrations required for schema changes
- No automated schema evolution based on detected patterns

### **Communication**
- No automated email/notification system
- Manual communication with suppliers required
- No integration with external messaging services

### **Performance**
- Recent matches limited to last 5 files (3 matches each) for UI performance
- No pagination on supplier offers list
- No rate limiting implemented
- Single-instance deployment (no microservices)

---

## Future Enhancements

### **1. Multiple File Upload**
- **Objective**: Allow batch processing of multiple supplier offer files
- **Benefits**: Faster data ingestion, reduced manual effort
- **Implementation**: 
  - Update frontend to support multi-file drag-and-drop
  - Backend queue system for parallel processing
  - Batch processing with progress tracking

---

### **2. Price Difference Analytics**
- **Objective**: Automated percentage difference calculation in procurement dashboard
- **Benefits**: Quick identification of cost savings, better negotiation insights
- **Implementation**:
  - Calculate % difference from average/median prices
  - Visual indicators (red/green) for price deviations
  - Historical price trend analysis

---

### **3. AI Auto-Detection per Item**
- **Objective**: Use AI to auto-detect product categories, brands, and specifications from item names
- **Benefits**: Richer product data, better matching accuracy
- **Implementation**:
  - Extract brand names from product descriptions
  - Identify product categories automatically
  - Parse technical specifications

---

### **4. Automated Logging for Data Quality Issues**
- **Objective**: Comprehensive logging and analytics for failed/invalid data rows
- **Benefits**: Identify supplier data quality patterns, guide improvement requests
- **Implementation**:
  - Dashboard showing top data quality issues by supplier
  - Export invalid rows report for supplier feedback
  - Track improvement trends over time

---

### **5. Local AI Model (Backup System)**
- **Objective**: Deploy a local AI model for offline processing and fallback when cloud AI is unavailable
- **Benefits**: System resilience, reduced API costs, faster response times
- **Implementation**:
  - Train a lightweight local model (e.g., BERT, DistilBERT)
  - Use embeddings-based similarity matching
  - Fallback logic: Cloud AI → Local AI → Rule-based matching

---

### **6. Item Quality Analysis (AI-Powered)**
- **Objective**: Analyze product descriptions/remarks to detect condition (brand new, pre-loved, refurbished)
- **Benefits**: Better procurement decisions, avoid quality mismatches
- **Implementation**:
  - NLP-based keyword extraction from description/remarks fields
  - Classify condition: New, Used, Refurbished, Unknown
  - Alert if condition doesn't match expected standard

---

### **7. Advanced Identifier Detection**
- **Objective**: Detect and extract multiple types of identifiers (UPC, EAN, ASIN, MPN, etc.)
- **Benefits**: Improved matching accuracy, better product deduplication
- **Implementation**:
  - Regex patterns for common identifier formats
  - AI-based extraction for unstructured data
  - Multi-identifier matching strategy

---

### **8. Auto Schema Evolution**
- **Objective**: Dynamically adjust database schema based on detected data patterns (with engineer monitoring)
- **Benefits**: Adapt to new supplier data formats without downtime
- **Implementation**:
  - Detect new columns in uploaded files
  - Propose schema changes to engineer via dashboard
  - Automated migration scripts with approval workflow

---

### **9. Automated Communication System**
- **Objective**: Auto-email suppliers/procurement team upon offer approval/rejection
- **Benefits**: Faster communication, reduced manual work
- **Implementation**:
  - Configurable email templates
  - Optional auto-send (can be disabled per workflow)
  - Integration with SMTP/SendGrid/AWS SES
  - SMS notifications for urgent approvals

---

### **10. Pagination & Performance Optimization**
- **Objective**: Implement pagination across all list views (files, offers, products)
- **Benefits**: Better performance with large datasets, improved UX
- **Implementation**:
  - Server-side pagination with configurable page size
  - Cursor-based pagination for real-time data
  - Lazy loading for file detail views

---

### **11. Rate Limiting & Security**
- **Objective**: Implement API rate limiting to prevent abuse
- **Benefits**: Protect system resources, prevent DoS attacks
- **Implementation**:
  - Rate limiting per user/IP (e.g., 100 requests/min)
  - Different limits for authenticated vs anonymous users
  - Graceful degradation with retry-after headers

---

### **12. Microservices Architecture**
- **Objective**: Split system into specialized microservices
- **Benefits**: Scalability, maintainability, independent deployment
- **Proposed Services**:
  - **File Processing Service**: Handle uploads and parsing
  - **AI Matching Service**: Dedicated AI inference engine
  - **Local AI Model Service**: Local model inference
  - **Notification Service**: Email/SMS delivery
  - **Dictionary/Cache Service**: Store common patterns and responses
  - **Analytics Service**: Generate reports and insights

---

### **13. AI Response Dictionary (Caching)**
- **Objective**: Cache common AI matching patterns and responses
- **Benefits**: Faster responses, reduced AI API costs, offline capability
- **Implementation**:
  - Store high-confidence matches in local cache
  - Use similarity search for repeated patterns
  - Update cache with validated matches
  - Fallback to cache when AI service is down

---

## Implementation Priority

**Phase 1 (Quick Wins)**
1. Pagination
2. Price difference analytics
3. Automated data quality logging

**Phase 2 (Medium Complexity)**
4. Multiple file upload
5. Rate limiting
6. Email notifications (optional)

**Phase 3 (Advanced)**
7. Local AI model training
8. Microservices migration
9. Auto schema evolution

**Phase 4 (AI Enhancements)**
10. Item quality analysis
11. Advanced identifier detection
12. AI response caching

---

## Technical Considerations

- **Backward Compatibility**: All enhancements should maintain existing API contracts
- **Data Migration**: Plan for zero-downtime migrations
- **Testing**: Comprehensive test coverage for new features
- **Documentation**: Update guides for new functionality
- **Monitoring**: Add metrics and logging for new services

---

## Notes

- These enhancements are designed to scale with business needs
- Implementation timeline depends on business priorities
- Some features (e.g., local AI) require significant infrastructure investment
- All features are optional and can be enabled/disabled via configuration

