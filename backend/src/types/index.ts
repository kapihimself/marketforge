// User Types
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'seller' | 'admin';
  isVerified: boolean;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'buyer' | 'seller';
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

// Product Types
export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  thumbnailUrl?: string;
  status: 'draft' | 'active' | 'inactive';
  downloadCount: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  thumbnailUrl?: string;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  tags?: string[];
  thumbnailUrl?: string;
  status?: 'draft' | 'active' | 'inactive';
}

// Order Types
export interface Order {
  id: string;
  buyerId: string;
  total: number;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled' | 'refunded';
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  createdAt: Date;
}

export interface CreateOrderData {
  buyerId: string;
  items: {
    productId: string;
    price: number;
  }[];
}

// Cart Types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewData {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

// File Upload Types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface AuthToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'buyer' | 'seller';
}

// Search Types
export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  tags?: string[];
  sortBy?: 'price' | 'rating' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends SearchFilters {
  query?: string;
  page?: number;
  limit?: number;
}

// Dashboard Types
export interface SellerStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface BuyerStats {
  totalPurchases: number;
  totalSpent: number;
  favoriteCategories: string[];
  recentPurchases: Product[];
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Database Query Types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DatabaseResult<T> {
  rows: T[];
  rowCount: number;
}

