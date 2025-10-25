# QRIP.GE - Complete Project Documentation

##  Table of Contents
1. [Project Overview](#project-overview)
2. [Source Code Structure](#source-code-structure)
3. [Environment Configuration](#environment-configuration)
4. [Database Structure](#database-structure)
5. [Assets & Static Files](#assets--static-files)
6. [Translation Files](#translation-files)
7. [Deployment Instructions](#deployment-instructions)
8. [API Documentation](#api-documentation)
9. [Payment Integration](#payment-integration)
10. [Social Login Setup](#social-login-setup)
11. [Admin Credentials](#admin-credentials)
12. [Third-Party Integrations](#third-party-integrations)
13. [GitHub Repository](#github-repository)
14. [Design & Assets](#design--assets)

---

##  Project Overview

**QRIP.GE** is a comprehensive digital memorial platform that allows users to create, manage, and share digital memorials for their loved ones. The platform includes QR code generation, subscription management, payment processing, and multi-language support.

 Key Features:
- Digital memorial creation and management
- QR code generation for physical memorials
- Subscription-based pricing plans
- Multi-language support (English, Georgian, Russian)
- Payment processing via Bank of Georgia
- File storage via AWS S3 (Hetzner Object Storage)
- Email notifications via Hetzner SMTP
- Admin dashboard for content management

---

## Source Code Structure

 Frontend (Next.js)
```
qrip-ge/
├── app/                    # Next.js 13+ App Router
│   ├── admin/             # Admin dashboard pages
│   ├── dashboard/          # User dashboard
│   ├── memorial/          # Memorial management
│   ├── subscription/      # Subscription management
│   └── components/         # Reusable components
├── components/            # UI components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utility functions
├── locales/               # Translation files
├── services/              # API services
└── types/                 # TypeScript types
```

 Backend (Node.js/Express)
```
qrip-ge-backend/
├── src/
│   ├── config/            # Configuration files
│   ├── controller/        # Route controllers
│   ├── middlewares/       # Express middlewares
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── service/          # Business logic
│   └── utils/            # Utility functions
├── uploads/              # File uploads
└── index.js              # Application entry point
```

---

##  Environment Configuration

 Required Environment Variables

Create `.env` files in both frontend and backend directories:

# Backend (.env)
```env
# Database
MONGO_URL=mongodb://localhost:27017/qrip-ge
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/qrip-ge

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Bank of Georgia Payment Integration
BOG_CLIENT_ID=your-bog-client-id
BOG_CLIENT_SECRET=your-bog-client-secret
BOG_PRODUCT_ID=your-bog-product-id
PAYMENT_TEST_MODE=false

# AWS S3 (Hetzner Object Storage)
AWS_S3_ACCESS_KEY=your-hetzner-access-key
AWS_S3_SECRET_KEY=your-hetzner-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name

# Email Configuration (Hetzner SMTP)
SMTP_HOST=mail.your-server.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@qrip.ge
SMTP_PASS=your-email-password
EMAIL_FROM_NAME=Qrip.ge Support
EMAIL_FROM_ADDRESS=info@qrip.ge
EMAIL_REPLY_TO=info@qrip.ge
```

# Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Database Structure

 MongoDB Collections

# 1. Users Collection
```javascript
{
  _id: ObjectId,
  firstname: String,
  lastname: String,
  email: String (unique),
  password: String (hashed),
  location: String,
  bio: String,
  profileImage: String,
  phone: String,
  userType: String (enum: ["user", "admin"]),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  subscriptionExpiresAt: Date,
  accountStatus: String (enum: ["active", "suspended"]),
  shippingDetails: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

# 2. Memorials Collection
```javascript
{
  _id: ObjectId,
  createdBy: ObjectId (ref: User),
  slug: String (unique),
  qrCode: String,
  firstName: String,
  lastName: String,
  profileImage: String,
  birthDate: Date,
  deathDate: Date,
  location: String,
  gps: {
    lat: Number,
    lng: Number
  },
  lifeStory: String,
  biography: String,
  photoGallery: [String],
  videoGallery: [String],
  documents: [String],
  familyTree: [{
    name: String,
    relationship: String,
    birthDate: Date,
    deathDate: Date,
    photo: String
  }],
  isPublic: Boolean,
  allowComments: Boolean,
  enableEmailNotifications: Boolean,
  allowSlideshow: Boolean,
  achievements: [String],
  moderationStatus: String (enum: ["pending", "approved", "rejected"]),
  status: String (enum: ["active", "inactive", "expired"]),
  purchase: ObjectId (ref: MemorialPurchase),
  memorialPaymentStatus: String (enum: ["draft", "pending_payment", "active"]),
  subscription: ObjectId (ref: UserSubscription),
  viewsCount: Number,
  scanCount: Number,
  isAdminDiscounted: Boolean,
  adminDiscountType: String (enum: ["percentage", "fixed", "free", null]),
  adminDiscountValue: Number,
  createdAt: Date,
  updatedAt: Date
}
```

# 3. User Subscriptions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  planId: ObjectId (ref: SubscriptionPlan),
  duration: String (enum: ["1_month", "3_months", "6_months", "1_year", "2_years"]),
  durationPrice: Number,
  bogInitialOrderId: String (unique),
  bogSubscriptionId: String (unique),
  status: String (enum: ["pending", "active", "payment_failed", "canceled", "expired", "inactive"]),
  startDate: Date,
  endDate: Date,
  nextBillingDate: Date,
  lastPaymentDate: Date,
  retryAttemptCount: Number,
  lastRetryAttemptDate: Date,
  transactionHistory: [{
    bogTransactionId: String,
    bogOrderId: String,
    amount: Number,
    status: String,
    date: Date,
    receiptUrl: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

# 4. Subscription Plans Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  planType: String (enum: ["minimal", "medium", "premium"]),
  isActive: Boolean,
  isPopular: Boolean,
  features: [{
    text: String,
    included: Boolean
  }],
  color: String,
  bgColor: String,
  borderColor: String,
  maxPhotos: Number,
  allowSlideshow: Boolean,
  allowVideos: Boolean,
  maxVideoDuration: Number,
  ctaButtonText: String,
  durationOptions: [{
    duration: String,
    price: Number,
    discount: Number,
    isActive: Boolean
  }],
  defaultDuration: String,
  createdAt: Date,
  updatedAt: Date
}
```

# 5. Memorial Purchases Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  memorialId: ObjectId (ref: Memorial),
  planId: ObjectId (ref: SubscriptionPlan),
  duration: String,
  durationPrice: Number,
  bogOrderId: String,
  amount: Number,
  finalPricePaid: Number,
  appliedPromoCode: ObjectId (ref: PromoCode),
  isAdminDiscount: Boolean,
  discountDetails: {
    type: String,
    value: Number
  },
  status: String (enum: ["pending", "completed", "failed"]),
  transactionId: String,
  paymentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

# 6. Additional Collections
- **QRStickerOrder**: Physical QR sticker orders
- **QRStickerOption**: Available sticker types
- **PromoCodeSchema**: Discount codes
- **Testimonial**: User testimonials
- **Terms**: Terms and conditions
- **SiteSettings**: Site configuration

---

## 📁 Assets & Static Files

 Frontend Assets (`qrip-ge/public/`)
```
public/
├── hero-bg.png              # Hero section background
├── man.png                 # Placeholder image
├── placeholder-logo.png    # Logo placeholder
├── placeholder-logo.svg    # SVG logo
├── placeholder-user.jpg    # User avatar placeholder
├── placeholder.jpg         # General placeholder
└── placeholder.svg         # SVG placeholder
```

 Backend Uploads (`qrip-ge-backend/uploads/`)
```
uploads/
└── languages/
    ├── en.json             # English translations
    ├── ka.json             # Georgian translations
    └── ru.json             # Russian translations
```

---

## 🌐 Translation Files

 Supported Languages
- **English (en.json)**: Primary language
- **Georgian (ka.json)**: Local language
- **Russian (ru.json)**: Secondary language

 Translation Structure
Each language file contains translations for:
- Headers and navigation
- Home page content
- Hero section
- Memorial details
- Features section
- Pricing plans
- Testimonials
- Authentication forms
- Dashboard interface
- Memorial creation/editing
- QR generator
- Subscription management
- Admin dashboard
- Profile management
- Sticker management
- Testimonial management

---

## 🚀 Deployment Instructions

 Prerequisites
- Node.js 18+ 
- MongoDB 6+
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate

 Step-by-Step Deployment on Hetzner

# 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

# 2. Application Deployment
```bash
# Clone repository
git clone <repository-url> /var/www/qrip-ge
cd /var/www/qrip-ge

# Install dependencies
cd qrip-ge
npm install
npm run build

cd ../qrip-ge-backend
npm install
```

# 3. Environment Configuration
```bash
# Create environment files
cp .env.example .env
# Edit .env with your configuration
```

# 4. PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'qrip-ge-backend',
      script: 'index.js',
      cwd: '/var/www/qrip-ge/qrip-ge-backend',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'qrip-ge-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/qrip-ge/qrip-ge',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

# 5. Start Applications
```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

# 6. Nginx Configuration
Create `/etc/nginx/sites-available/qrip-ge`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# 7. SSL Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

# 8. Database Setup
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use qrip-ge
db.createUser({
  user: "qrip-user",
  pwd: "your-password",
  roles: ["readWrite"]
})
```

---

## 📚 API Documentation

 Base URL
```
Production: https://api.yourdomain.com/api
Development: http://localhost:5000/api
```

 Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <jwt-token>
```

 API Endpoints

# Authentication Routes (`/api/auth`)
- `POST /signup` - User registration
- `POST /signin` - User login
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset
- `GET /details` - Get user details
- `PUT /update-password` - Update password
- `PUT /users/:userId` - Update user
- `GET /users/subscription` - Get subscription plans
- `GET /stats/:userId` - Get user statistics
- `PATCH /update-profile/:userId` - Update user profile

# Memorial Routes (`/api/memorial`)
- `GET /slug/:slug` - Get public memorial by slug
- `POST /` - Create memorial (authenticated)
- `PUT /:id` - Update memorial (authenticated)
- `POST /create-update` - Create or update memorial
- `POST /:id/photos` - Add photos to memorial
- `POST /:id/video` - Add video to memorial
- `PUT /:id/family-tree` - Update family tree
- `POST /:id/documents` - Add documents to memorial
- `GET /my-memorials` - Get user's memorials
- `GET /my-memorial/:id` - Get specific memorial
- `POST /view` - Track memorial view
- `PUT /:memorialId/toggle-slideshow` - Toggle slideshow
- `GET /:id` - Get memorial by ID
- `DELETE /:id` - Delete memorial
- `POST /create-draft` - Create draft memorial

# Payment Routes (`/api/payments`)
- `POST /initiate` - Initiate subscription payment
- `POST /callback` - Payment webhook
- `POST /initiate-one-time-payment` - One-time payment
- `POST /initiate-memorial-payment` - Memorial payment
- `POST /restart-free` - Restart free plan
- `GET /active` - Get active subscription
- `GET /cron` - Manual cron job trigger
- `POST /retry-subscription` - Retry failed payment

# Subscription Routes (`/api/subscriptions`)
- `GET /plans` - Get all subscription plans
- `GET /user-subscriptions` - Get user subscriptions
- `POST /create` - Create subscription
- `PUT /:id` - Update subscription
- `DELETE /:id` - Cancel subscription

# QR Code Routes (`/api/qrcode`)
- `POST /generate` - Generate QR code
- `GET /:id` - Get QR code by ID

# QR Sticker Routes (`/api/qr-sticker`)
- `GET /options` - Get sticker options
- `POST /order` - Create sticker order
- `GET /orders` - Get user orders

# Admin Routes (`/api/admin`)
- `GET /dashboard` - Admin dashboard stats
- `GET /users` - Get all users
- `GET /memorials` - Get all memorials
- `PUT /memorials/:id/approve` - Approve memorial
- `PUT /memorials/:id/reject` - Reject memorial
- `GET /subscriptions` - Get all subscriptions
- `GET /testimonials` - Get testimonials
- `POST /testimonials` - Create testimonial
- `PUT /testimonials/:id` - Update testimonial
- `DELETE /testimonials/:id` - Delete testimonial

# Translation Routes (`/api/translations`)
- `GET /` - Get all translations
- `GET /:language` - Get specific language
- `POST /` - Create translation
- `PUT /:id` - Update translation
- `DELETE /:id` - Delete translation

 Request/Response Examples

# User Registration
```javascript
// POST /api/auth/signup
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt-token-here"
}
```

# Create Memorial
```javascript
// POST /api/memorial
{
  "firstName": "Jane",
  "lastName": "Smith",
  "birthDate": "1950-01-01",
  "deathDate": "2023-12-01",
  "location": "Tbilisi, Georgia",
  "lifeStory": "A wonderful person..."
}

// Response
{
  "success": true,
  "memorial": {
    "_id": "memorial-id",
    "slug": "jane-smith-abc123",
    "qrCode": "qr-code-url"
  }
}
```

# Payment Initiation
```javascript
// POST /api/payments/initiate
{
  "planId": "plan-id",
  "duration": "1_month"
}

// Response
{
  "redirectUrl": "https://payment.bog.ge/...",
  "orderId": "bog-order-id"
}
```

---

## 💳 Payment Integration

 Bank of Georgia (BOG) Setup

# 1. BOG Credentials
```env
BOG_CLIENT_ID=your-client-id
BOG_CLIENT_SECRET=your-client-secret
BOG_PRODUCT_ID=your-product-id
```

# 2. Webhook Endpoints
- **Callback URL**: `https://api.yourdomain.com/api/payments/callback`
- **Success URL**: `https://yourdomain.com/dashboard/subscription/success`
- **Failure URL**: `https://yourdomain.com/dashboard/subscription/failure`

# 3. Payment Flow
1. User selects subscription plan
2. System creates BOG order
3. User redirected to BOG payment page
4. Payment processed by BOG
5. Webhook notifies system of payment status
6. System activates subscription

# 4. Recurring Payments
- Automatic subscription renewals
- Failed payment retry logic (3 attempts)
- Email notifications for payment failures
- Subscription lifecycle management

# 5. Test Mode
```env
PAYMENT_TEST_MODE=true  # Uses 0.01 GEL for testing
```

---

## 🔐 Social Login Setup

**Note**: Social login (Google/Facebook) is not currently implemented in the codebase. The application uses email/password authentication only.

To implement social login, you would need to:
1. Add OAuth providers (Google, Facebook)
2. Configure OAuth apps
3. Implement OAuth callbacks
4. Update user model for social IDs

---

## 👨‍💼 Admin Credentials

 Default Admin Account
```
Email: admin@qrip.ge
Password: [Set during first deployment]
```

 Admin Features
- User management
- Memorial moderation
- Subscription management
- Testimonial management
- Site settings
- Analytics dashboard

 Admin Routes
- `/admin/dashboard` - Main admin panel
- `/admin/users` - User management
- `/admin/memorials` - Memorial moderation
- `/admin/subscriptions` - Subscription management
- `/admin/testimonials` - Testimonial management

---

## 🔌 Third-Party Integrations

 1. Email Service (Hetzner SMTP)
```env
SMTP_HOST=mail.your-server.de
SMTP_PORT=587
SMTP_USER=info@qrip.ge
SMTP_PASS=your-email-password
```

**Email Types**:
- Welcome emails
- Order confirmations
- Subscription notifications
- Payment failure alerts
- Password reset emails

 2. File Storage (AWS S3 - Hetzner Object Storage)
```env
AWS_S3_ACCESS_KEY=your-access-key
AWS_S3_SECRET_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name
```

**Storage Features**:
- Image uploads (memorial photos)
- Video uploads
- Document storage
- QR code generation
- File deletion management

 3. Database (MongoDB)
- User data storage
- Memorial content
- Subscription management
- Payment tracking
- Analytics data

 4. Payment Gateway (Bank of Georgia)
- Subscription payments
- One-time payments
- Recurring billing
- Webhook processing
- Payment retry logic

---

## 📦 GitHub Repository

 Repository Structure
```
qrip-ge/
├── qrip-ge/              # Frontend (Next.js)
├── qrip-ge-backend/      # Backend (Node.js)
├── README.md
├── .gitignore
└── documentation/
```

 Installation Commands
```bash
# Clone repository
git clone <repository-url>
cd qrip-ge

# Install frontend dependencies
cd qrip-ge
npm install

# Install backend dependencies
cd ../qrip-ge-backend
npm install

# Start development servers
# Frontend (Terminal 1)
cd qrip-ge
npm run dev

# Backend (Terminal 2)
cd qrip-ge-backend
npm start
```

 Dependencies

# Frontend Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@radix-ui/react-*": "^1.0.0",
  "tailwindcss": "^3.0.0",
  "axios": "^1.0.0",
  "leaflet": "^1.0.0",
  "qrcode.react": "^3.0.0",
  "framer-motion": "^10.0.0",
  "zod": "^3.0.0"
}
```

# Backend Dependencies
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5",
  "aws-sdk": "^2.0.0",
  "axios": "^1.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "multer": "^1.4.0",
  "nodemailer": "^6.9.0",
  "qrcode": "^1.5.0"
}
```

---

## 🎨 Design & Assets

 Color Scheme
- **Primary Green**: #547455
- **Background**: #f5f5f5
- **Text**: #333333
- **Success**: #28a745
- **Warning**: #ffc107
- **Error**: #dc3545

 Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Line Height**: 1.6

 Logo & Branding
- **Logo**: placeholder-logo.svg
- **Favicon**: placeholder.svg
- **Hero Background**: hero-bg.png

 UI Components
- **Framework**: Radix UI + Tailwind CSS
- **Icons**: Custom SVG icons
- **Animations**: Framer Motion
- **Responsive**: Mobile-first design

 Asset Requirements
- **Images**: WebP/PNG format, optimized
- **Videos**: MP4 format, max 100MB
- **Documents**: PDF format, max 50MB
- **QR Codes**: PNG format, 300x300px

---

## 🚀 Quick Start Guide

 1. Local Development
```bash
# Clone and setup
git clone <repository-url>
cd qrip-ge

# Backend setup
cd qrip-ge-backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start

# Frontend setup (new terminal)
cd qrip-ge
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

 2. Production Deployment
```bash
# Build applications
cd qrip-ge
npm run build

cd ../qrip-ge-backend
# No build step needed for Node.js

# Deploy with PM2
pm2 start ecosystem.config.js
```

 3. Database Setup
```bash
# Start MongoDB
sudo systemctl start mongod

# Create database
mongo
use qrip-ge
```

 4. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com
```

---

## 📞 Support & Contact

- **Email**: info@qrip.ge
- **Documentation**: This file
- **Issues**: GitHub Issues
- **Deployment**: Follow deployment instructions above

---

## 🔄 Updates & Maintenance

 Regular Tasks
- Monitor PM2 processes: `pm2 status`
- Check logs: `pm2 logs`
- Update dependencies: `npm update`
- Backup database: `mongodump`
- Monitor disk space and performance

 Security Updates
- Keep Node.js updated
- Update dependencies regularly
- Monitor security advisories
- Use strong passwords
- Enable firewall rules


