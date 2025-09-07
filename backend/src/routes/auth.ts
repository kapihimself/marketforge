import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller'])
    .withMessage('Role must be either buyer or seller'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { email, password, firstName, lastName, role } = req.body;

  try {
    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    });
  }
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    });
  }
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
    message: 'User profile retrieved successfully',
  });
}));

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Private
router.post('/verify-email', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const user = await AuthService.verifyEmail(req.user!.id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Email verification failed',
    });
  }
}));

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Private
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const newToken = AuthService.generateToken(req.user!);

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
      },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Token refresh failed',
    });
  }
}));

export default router;
