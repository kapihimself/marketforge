# 🛒 Digital Commerce Platform - Complete MVP

A modern, scalable, and user-friendly e-commerce platform specializing in digital products (e-books, software licenses, online courses, templates, music, design assets, etc.), built with Next.js, Node.js, and PostgreSQL.

## ✨ Features Implemented

### 🎯 Core MVP Features
- ✅ **User Authentication** - Registration, login, email verification
- ✅ **Product Catalog** - Create, read, update, delete products
- ✅ **Search & Filtering** - Advanced search with categories, price range, sorting
- ✅ **Shopping Cart** - Add/remove products, persistent cart
- ✅ **Payment Processing** - Midtrans integration (free alternative to Stripe)
- ✅ **Digital Delivery** - Secure file access and download management
- ✅ **User Dashboards** - Separate interfaces for buyers and sellers
- ✅ **File Upload** - Secure file storage with Cloudinary (25GB free)
- ✅ **Responsive Design** - Mobile-first, modern UI with TailwindCSS
- ✅ **🆓 Completely Free** - Uses free services (Midtrans, Cloudinary, Gmail SMTP)

### 🏗️ Technical Architecture
- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, Zustand
- **Backend**: Node.js with Express, TypeScript, PostgreSQL
- **Database**: PostgreSQL with Redis for caching
- **Search**: Elasticsearch integration
- **Storage**: Cloudinary (25GB free tier)
- **Payments**: Midtrans integration (free for development)
- **Email**: Gmail SMTP (unlimited free)
- **Authentication**: JWT-based with bcrypt password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Clone and Setup
```bash
git clone <repository-url>
cd digital-commerce-platform
```

### 2. Start Development Environment
```bash
# Make startup script executable
chmod +x start-dev.sh

# Start all services
./start-dev.sh
```

This script will:
- Start Docker services (PostgreSQL, Redis, Elasticsearch)
- Install all dependencies
- Set up environment files
- Run database migrations
- Build applications
- Start development servers

### 3. Configure Free Services
Before running the application, you need to set up the free services:

1. **Midtrans Payment Gateway** (Free alternative to Stripe)
2. **Cloudinary Cloud Storage** (25GB free tier)
3. **Gmail SMTP** (Unlimited free emails)

📚 **Detailed Setup Guide**: [FREE-SERVICES-SETUP.md](./FREE-SERVICES-SETUP.md)

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601

## 🛠️ Manual Setup (Alternative)

### 1. Start Docker Services
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..
```

### 3. Environment Setup
```bash
# Copy environment templates
cp backend/env.example backend/.env
cp frontend/env.local.example frontend/.env.local

# Edit the files with your actual values
```

### 4. Database Setup
```bash
cd backend
node scripts/migrate.js
cd ..
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

## 📁 Project Structure

```
digital-commerce-platform/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js 14 App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # API client and utilities
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Database and service configs
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   ├── migrations/         # Database migrations
│   └── scripts/           # Utility scripts
├── docs/                   # Documentation
├── docker-compose.yml     # Docker services
└── package.json          # Root package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://dev:dev123@localhost:5432/digital_commerce
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key

# Midtrans Payment Gateway (Free)
MIDTRANS_SERVER_KEY=SB-Mid-server-your_server_key_here
MIDTRANS_CLIENT_KEY=SB-Mid-client-your_client_key_here
MIDTRANS_IS_PRODUCTION=false

# Cloudinary Cloud Storage (25GB Free)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Gmail SMTP (Unlimited Free)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FROM_EMAIL=noreply@digitalcommerce.com
FROM_NAME=Digital Commerce Platform
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Midtrans Payment Gateway (Free)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-your_client_key_here
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false

# Search Engine
NEXT_PUBLIC_ALGOLIA_APP_ID=...
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=...
```

## 🎨 UI Components

### Available Components
- **Button** - Multiple variants and sizes
- **Input** - Form inputs with validation
- **ProductCard** - Product display cards
- **Header** - Navigation header with user menu
- **Modal** - Reusable modal component

### Design System
- **Colors**: Blue primary, coral secondary, emerald accent
- **Typography**: Inter font family
- **Spacing**: 8px base unit system
- **Components**: TailwindCSS with custom components

## 🔐 Authentication

### User Roles
- **Buyer** - Can purchase and download products
- **Seller** - Can create and manage products
- **Admin** - Full platform access

### Security Features
- JWT-based authentication
- bcrypt password hashing
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller)
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Frontend tests
cd frontend && npm run test

# Backend tests
cd backend && npm run test
```

### Test Coverage
- Unit tests for components and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows

## 🚀 Deployment

### Production Build
```bash
# Build both applications
npm run build

# Start production servers
npm run start
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup
1. Set up production database
2. Configure environment variables
3. Set up AWS S3 bucket
4. Configure Stripe webhooks
5. Set up monitoring and logging

## 📈 Performance

### Optimizations Implemented
- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, query optimization, caching
- **Database**: Connection pooling, read replicas
- **CDN**: CloudFront for static assets

### Monitoring
- Application performance monitoring
- Error tracking with Sentry
- Database performance metrics
- User analytics

## 🔄 Development Workflow

### Git Workflow
1. Create feature branch from `main`
2. Make changes and commit frequently
3. Run tests before pushing
4. Create pull request for review
5. Merge after approval

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- 80% test coverage minimum

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

#### Redis Connection Failed
```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# Restart Redis
docker-compose restart redis
```

#### Elasticsearch Not Ready
```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# Restart Elasticsearch
docker-compose restart elasticsearch
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f elasticsearch
```

## 📚 Documentation

- [Product Vision & Architecture](./product-vision-blueprint.md)
- [Design System & Style Guide](./design-system-style-guide.md)
- [Feature Roadmap](./feature-roadmap.md)
- [Technology Stack & APIs](./technology-stack-apis.md)
- [Project Structure](./project-structure.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Success!

Your Digital Commerce Platform MVP is now ready! The application includes:

- ✅ Complete user authentication system
- ✅ Product catalog with search and filtering
- ✅ Shopping cart functionality
- ✅ Payment processing integration
- ✅ Digital delivery system
- ✅ Responsive UI components
- ✅ Seller and buyer dashboards
- ✅ File upload and storage
- ✅ Database schema and migrations
- ✅ API documentation
- ✅ Development environment setup

**Next Steps:**
1. Configure your Stripe keys for payments
2. Set up AWS S3 for file storage
3. Add your SendGrid API key for emails
4. Customize the UI with your branding
5. Deploy to production

Happy coding! 🚀