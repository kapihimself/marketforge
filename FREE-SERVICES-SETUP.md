# 🆓 Free Services Setup Guide

This guide will help you set up the **completely free** alternatives for your Digital Commerce Platform:

## 🎯 **Free Services Overview**

| Service | Original | Free Alternative | Free Tier |
|---------|----------|------------------|-----------|
| **Payment Gateway** | Stripe | **Midtrans** | Free for development |
| **Cloud Storage** | AWS S3 | **Cloudinary** | 25GB free |
| **Email Service** | SendGrid | **Gmail SMTP** | Unlimited free |

---

## 💳 **1. Midtrans Payment Gateway Setup**

### Why Midtrans?
- ✅ **Free for development** and testing
- ✅ **Multiple payment methods** (Credit Card, Bank Transfer, E-wallets)
- ✅ **Easy integration** with Snap UI
- ✅ **Popular in Southeast Asia**

### Setup Steps:

#### Step 1: Create Midtrans Account
1. Go to [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Sign up for a free account
3. Complete email verification

#### Step 2: Get API Keys
1. Login to your Midtrans dashboard
2. Go to **Settings** → **Access Keys**
3. Copy your **Server Key** and **Client Key**
4. For development, use **Sandbox** keys (starts with `SB-Mid-`)

#### Step 3: Configure Environment Variables
```bash
# Backend (.env)
MIDTRANS_SERVER_KEY=SB-Mid-server-your_server_key_here
MIDTRANS_CLIENT_KEY=SB-Mid-client-your_client_key_here
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js

# Frontend (.env.local)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-your_client_key_here
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

#### Step 4: Test Payment
- Use test credit card: `4811 1111 1111 1114`
- CVV: `123`
- Expiry: Any future date

---

## ☁️ **2. Cloudinary Cloud Storage Setup**

### Why Cloudinary?
- ✅ **25GB free storage** (vs AWS S3 paid)
- ✅ **Image/video optimization** included
- ✅ **CDN delivery** worldwide
- ✅ **Easy file management**

### Setup Steps:

#### Step 1: Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

#### Step 2: Get API Credentials
1. Login to Cloudinary dashboard
2. Go to **Dashboard** → **Product Environment Credentials**
3. Copy your **Cloud Name**, **API Key**, and **API Secret**

#### Step 3: Configure Environment Variables
```bash
# Backend (.env)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Step 4: Test File Upload
- Upload a test image to verify connection
- Check Cloudinary dashboard for uploaded files

---

## 📧 **3. Gmail SMTP Email Setup**

### Why Gmail SMTP?
- ✅ **Completely free** (vs SendGrid paid)
- ✅ **Reliable delivery**
- ✅ **Easy setup**
- ✅ **No monthly limits**

### Setup Steps:

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. This is required for App Passwords

#### Step 2: Generate App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **App passwords**
3. Select **Mail** and **Other (Custom name)**
4. Enter "Digital Commerce Platform"
5. Copy the generated 16-character password

#### Step 3: Configure Environment Variables
```bash
# Backend (.env)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
FROM_EMAIL=noreply@digitalcommerce.com
FROM_NAME=Digital Commerce Platform
```

#### Step 4: Test Email
- Send a test email to verify SMTP connection
- Check Gmail sent folder for confirmation

---

## 🚀 **Quick Setup Script**

Create a setup script to configure all services:

```bash
#!/bin/bash
echo "🆓 Setting up Free Services for Digital Commerce Platform"
echo "========================================================"

# Create environment files
echo "📝 Creating environment files..."

# Backend environment
cat > backend/.env << EOF
# Backend Environment Variables
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://dev:dev123@localhost:5432/digital_commerce
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Midtrans Payment Gateway
MIDTRANS_SERVER_KEY=SB-Mid-server-your_server_key_here
MIDTRANS_CLIENT_KEY=SB-Mid-client-your_client_key_here
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js

# Cloudinary Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Gmail SMTP
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FROM_EMAIL=noreply@digitalcommerce.com
FROM_NAME=Digital Commerce Platform

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
EOF

# Frontend environment
cat > frontend/.env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Midtrans Payment Gateway
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-your_client_key_here
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
EOF

echo "✅ Environment files created!"
echo ""
echo "🔧 Next steps:"
echo "1. Update the API keys in backend/.env and frontend/.env.local"
echo "2. Run: ./start-dev.sh"
echo ""
echo "📚 Service Documentation:"
echo "- Midtrans: https://docs.midtrans.com/"
echo "- Cloudinary: https://cloudinary.com/documentation"
echo "- Gmail SMTP: https://support.google.com/mail/answer/185833"
```

---

## 🧪 **Testing Your Setup**

### Test Payment Integration
```bash
# Test payment token creation
curl -X POST http://localhost:8000/api/payments/create-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderId": "test-order-123",
    "amount": 100,
    "customerDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "itemDetails": [{
      "id": "product-1",
      "price": 100,
      "quantity": 1,
      "name": "Test Product"
    }]
  }'
```

### Test File Upload
```bash
# Test file upload to Cloudinary
curl -X POST http://localhost:8000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg"
```

### Test Email Service
```bash
# Test email sending
curl -X POST http://localhost:8000/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test email"
  }'
```

---

## 💰 **Cost Comparison**

| Service | Original Cost | Free Alternative | Savings |
|---------|---------------|------------------|---------|
| **Stripe** | 2.9% + $0.30 per transaction | **Midtrans** | Free for development |
| **AWS S3** | $0.023/GB/month | **Cloudinary** | $0/month (25GB free) |
| **SendGrid** | $19.95/month (50K emails) | **Gmail SMTP** | $0/month (unlimited) |
| **Total Monthly** | ~$50-100+ | **$0** | **100% savings** |

---

## 🔒 **Security Notes**

### Midtrans Security
- Use HTTPS in production
- Validate webhook signatures
- Store API keys securely

### Cloudinary Security
- Use signed URLs for private files
- Set appropriate access controls
- Monitor usage to stay within free tier

### Gmail SMTP Security
- Use App Passwords (not regular password)
- Enable 2FA on Gmail account
- Monitor for unusual activity

---

## 🆘 **Troubleshooting**

### Common Issues

#### Midtrans Payment Fails
```bash
# Check API keys
echo $MIDTRANS_SERVER_KEY
echo $MIDTRANS_CLIENT_KEY

# Verify sandbox mode
echo $MIDTRANS_IS_PRODUCTION
```

#### Cloudinary Upload Fails
```bash
# Test connection
node -e "
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('Cloudinary configured:', cloudinary.config().cloud_name);
"
```

#### Gmail SMTP Fails
```bash
# Test SMTP connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

---

## 🎉 **You're All Set!**

With these free services, your Digital Commerce Platform will have:

✅ **Professional payment processing** with Midtrans  
✅ **Reliable cloud storage** with Cloudinary  
✅ **Unlimited email delivery** with Gmail SMTP  
✅ **Zero monthly costs** for development  
✅ **Production-ready** infrastructure  

**Total monthly cost: $0** 🎉

Now you can run `./start-dev.sh` and start building your digital marketplace!

