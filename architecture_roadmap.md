# Project Architecture & Feature Roadmap

Based on the current state of the e-commerce platform, here is a categorized breakdown of the architectural and feature topics you provided. 

## ✅ Completed (Stuff We've Done)

### Backend
- [x] **Authentication & Security:** Firebase Auth integration, JWT validation, and Role-based Access Control (Admin vs User).
- [x] **Background Jobs:** Configured BullMQ with Redis for asynchronous task processing.
- [x] **Exception Handling:** Implemented a robust `GlobalExceptionFilter` to catch and localize errors safely.
- [x] **API Versioning:** Configured standard URI versioning (`/v1`) across the NestJS app.
- [x] **Swagger Documentation:** OpenAPI/Swagger initialized in `main.ts`.
- [x] **Payment Integration:** Razorpay gateway integrated for checkout flows.
- [x] **Email System:** Configured `nodemailer` with background queues for order notifications.
- [x] **Cart Persistence:** Cart operations backed by database services.
- [x] **Repository Pattern:** Abstracted database logic into dedicated `*DbService` classes (e.g., `user-db.service.ts`, `reviews-db.service.ts`).
- [x] **Centralized Configuration:** Managed securely via `.env` files and NestJS Config.

### Frontend
- [x] **Reusable components (ShadcnUI):** Clean, modular UI using ShadcnUI components (`Card`, `Button`, `Input`, etc.).
- [x] **Localization:** Full `next-intl` setup for dynamic UI translation.

---

## 🚀 Next Steps (High Priority)

These are core features that will significantly improve the immediate functionality, performance, and user experience of the e-commerce platform.

### Backend
- [ ] **Database Translation (Localization):** Implementing the *Translation Table* pattern we discussed to translate products/categories into Tamil dynamically.
- [x] **Pagination & Search:** Adding proper pagination limits and full-text search capabilities to the products API so the frontend doesn't load massive payloads.
- [x] **Validation:** Enforcing strict DTO validation using `class-validator` to ensure data integrity on incoming API requests.
- [x] **Inventory Locking:** Crucial for e-commerce to prevent overselling items during the checkout flow (reserving stock while the user pays).
- [ ] ~~**File Upload:** Handling image uploads securely (e.g., via Firebase Storage or AWS S3) for admin product management.~~ (Cancelled: Pricing concerns)

### Frontend
- [ ] **Performance Optimization:** Fixing React warnings (e.g., missing `sizes` on `next/image`, React Hook order rules in `AutoLogout`).
- [ ] **Caching (Next.js ISR):** Implementing Incremental Static Regeneration for the Product Catalog to make page loads lightning fast while keeping data fresh.
- [ ] **SEO:** Adding dynamic `<title>`, meta tags, and structured data (JSON-LD) for products to improve Google search rankings.

---

## 📅 Future Enhancements (To Do Later)

These are advanced enterprise features that are better suited for when the core platform is fully stable and preparing for a large-scale production launch.

### Backend
- [ ] **Caching (Redis Data Cache):** Caching heavy database queries (like popular products) in Redis to reduce database load.
- [ ] **Event-Driven Architecture:** Decoupling services further using Kafka or RabbitMQ.
- [ ] **Logging & Monitoring:** Integrating structured logging (Winston/Pino) and monitoring tools (Datadog/New Relic).
- [ ] **Audit Logs & Distributed Tracing:** Tracking exactly who changed what data (Admin actions) and tracing requests across microservices.
- [ ] **Soft Delete:** Preventing accidental permanent deletion of critical records (Orders, Users).
- [ ] **Coupon Engine & Wishlist:** Secondary e-commerce features for marketing and user engagement.
- [ ] **Recommendation Engine:** Using AI or collaborative filtering to suggest products to users.
- [ ] **Notification System:** In-app websockets or push notifications.
- [ ] **CI/CD & Docker:** Containerizing the application and automating testing/deployment pipelines.
- [ ] **Testing:** Writing Unit (Jest) and End-to-End (Cypress/Playwright) tests.
- [ ] **Feature Flags:** Safely rolling out new features to a subset of users.
- [ ] **Architecture Documentation:** Formalizing the system design in Markdown or Wiki formats.
