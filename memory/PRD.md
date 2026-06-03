# SAI TECH - Precision CNC Machining Website PRD

## Project Overview
Premium industrial dynamic website for SAI TECH, a Precision CNC Machining Company located in Vadodara, Gujarat.

## Tech Stack (As Specified)
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM (SQLite for preview)
- **Frontend**: React 19 + Tailwind CSS + Framer Motion
- **Image Storage**: Multer (local /uploads folder)
- **Email**: Nodemailer (Yahoo SMTP - ready for configuration)

## User Personas
1. **Industrial Clients**: Procurement managers, engineers looking for precision machining services
2. **Manufacturing Companies**: Businesses needing automotive, aerospace, industrial components
3. **Admin Users**: SAI TECH staff managing website content

## Core Requirements (Static)
- ✅ Dark industrial theme (no white backgrounds)
- ✅ Premium cinematic design
- ✅ HD hero slideshow with 4 industrial images
- ✅ SAI TECH logo (no white background, blended)
- ✅ Product showcase with image galleries
- ✅ Services display with descriptions
- ✅ Machines table with specifications
- ✅ Contact form with Google Maps
- ✅ WhatsApp floating button
- ✅ Secure admin panel with JWT auth

---

## What's Been Implemented (March 23, 2026)

### Backend (Express.js + Prisma)
- ✅ All API endpoints working (100% tested)
- ✅ JWT authentication with bcrypt password hashing
- ✅ Multer file upload system (/uploads folder)
- ✅ Nodemailer email configuration (ready for app password)
- ✅ Prisma ORM with PostgreSQL-ready schema
- ✅ Seed data endpoint for initial content

### Frontend (React + Tailwind + Framer Motion)
- ✅ HD hero slideshow with 4 industrial images
- ✅ SAI TECH logo in navbar (clean, no white background)
- ✅ Improved color scheme (lighter, better visibility)
- ✅ Responsive design with mobile menu
- ✅ Products page with detail modals
- ✅ Services page with card layout
- ✅ Machines page with table view
- ✅ Contact form with Google Maps
- ✅ WhatsApp floating button on all pages
- ✅ Full admin panel with CRUD operations

### Admin Panel Features
- ✅ JWT authenticated login
- ✅ Dashboard with statistics
- ✅ Home content management
- ✅ Products CRUD with multi-image support
- ✅ Services CRUD with image support
- ✅ Machines CRUD
- ✅ Contact messages viewer

### Database Schema (Prisma)
```
- AdminUser (id, email, password, timestamps)
- HomeContent (hero, about, cta fields)
- Product (name, description, specs, applications, qualityNote)
- ProductImage (imageUrl, productId)
- Service (name, description, imageUrl)
- Machine (name, capacity, specs, imageUrl)
- ContactMessage (name, email, phone, subject, message, isRead)
- ClientLogo (name, imageUrl)
```

---

## Admin Credentials
- **Email**: admin@saitech.com
- **Password**: Admin@123

## Key URLs
- **Website**: https://sai-tech-cnc.preview.emergentagent.com
- **Admin Panel**: https://sai-tech-cnc.preview.emergentagent.com/admin/login
- **WhatsApp**: https://wa.me/919574007081

## Environment Variables Required
```
DATABASE_URL=postgresql://... (from Render)
JWT_SECRET=your_secret_key
EMAIL_USER=shreeji_engg7822@yahoo.co.in
EMAIL_PASS=yahoo_app_password
```

---

## Files Delivered

### Backend (/app/backend-express/)
- `server.js` - Main Express server
- `package.json` - Dependencies
- `.env.example` - Environment template
- `prisma/schema.prisma` - SQLite schema (dev)
- `prisma/schema.postgresql.prisma` - PostgreSQL schema (production)
- `routes/` - All API route handlers
- `middleware/` - Auth and upload middleware
- `README.md` - Complete documentation

### Frontend (/app/frontend/)
- Full React application with all pages
- Admin panel with CRUD functionality
- Responsive design with Framer Motion animations

---

## Deployment Steps for Render

1. **Create PostgreSQL Database** on Render
2. **Copy External Database URL**
3. **Replace schema** with schema.postgresql.prisma
4. **Deploy Backend** as Web Service
5. **Deploy Frontend** as Static Site
6. **Run seed endpoint** to populate data

---

## Next Action Items

1. **Provide PostgreSQL URL** from Render for production database
2. **Provide Yahoo App Password** to enable contact form emails
3. **Replace sample images** with actual product/factory photos (optional)
4. **Custom domain** setup when ready for production

---

## Test Results (March 23, 2026)
- **Backend**: 100% success (15/15 endpoints)
- **Frontend**: 100% success (all features working)
- **Admin Panel**: Fully functional
- **Responsive Design**: Mobile-ready
