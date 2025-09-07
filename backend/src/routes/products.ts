import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { ProductModel } from '../models/Product';
import { authenticateToken, requireRole, requireVerified } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Validation middleware
const validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category is required'),
  body('tags')
    .isArray()
    .withMessage('Tags must be an array'),
  body('fileUrl')
    .isURL()
    .withMessage('File URL must be a valid URL'),
  body('fileName')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('File name is required'),
  body('fileSize')
    .isInt({ min: 1 })
    .withMessage('File size must be a positive integer'),
  body('fileType')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('File type is required'),
];

const validateSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }),
  query('sortBy')
    .optional()
    .isIn(['price', 'rating', 'date', 'popularity']),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc']),
];

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', validateSearch, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = req.query;

  const products = await ProductModel.findAll({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    category: category as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: products.length,
      totalPages: Math.ceil(products.length / parseInt(limit as string)),
    },
    message: 'Products retrieved successfully',
  });
}));

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', validateSearch, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const {
    q: query,
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
  } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
    });
  }

  const products = await ProductModel.search(query as string, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    category: category as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
  });

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: products.length,
      totalPages: Math.ceil(products.length / parseInt(limit as string)),
    },
    message: 'Search results retrieved successfully',
  });
}));

// @route   GET /api/products/categories
// @desc    Get all product categories
// @access  Public
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await ProductModel.getCategories();

  res.status(200).json({
    success: true,
    data: categories,
    message: 'Categories retrieved successfully',
  });
}));

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    data: product,
    message: 'Product retrieved successfully',
  });
}));

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Seller)
router.post('/', authenticateToken, requireVerified, requireRole(['seller', 'admin']), validateProduct, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const productData = {
    ...req.body,
    sellerId: req.user!.id,
  };

  const product = await ProductModel.create(productData);

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully',
  });
}));

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Seller/Admin)
router.put('/:id', authenticateToken, requireVerified, requireRole(['seller', 'admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  // Check if user owns the product or is admin
  if (product.sellerId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this product',
    });
  }

  const updatedProduct = await ProductModel.update(id, req.body);
  if (!updatedProduct) {
    return res.status(400).json({
      success: false,
      error: 'Failed to update product',
    });
  }

  res.status(200).json({
    success: true,
    data: updatedProduct,
    message: 'Product updated successfully',
  });
}));

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Seller/Admin)
router.delete('/:id', authenticateToken, requireVerified, requireRole(['seller', 'admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  // Check if user owns the product or is admin
  if (product.sellerId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this product',
    });
  }

  const deleted = await ProductModel.delete(id);
  if (!deleted) {
    return res.status(400).json({
      success: false,
      error: 'Failed to delete product',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
}));

// @route   GET /api/products/seller/:sellerId
// @desc    Get products by seller
// @access  Public
router.get('/seller/:sellerId', validateSearch, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { sellerId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const products = await ProductModel.findBySeller(sellerId, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: products.length,
      totalPages: Math.ceil(products.length / parseInt(limit as string)),
    },
    message: 'Seller products retrieved successfully',
  });
}));

export default router;
