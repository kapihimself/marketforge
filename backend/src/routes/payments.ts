import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireVerified } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { paymentService } from '../services/paymentService';

const router = Router();

// Validation middleware
const validatePayment = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('customerDetails.firstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('customerDetails.lastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('customerDetails.email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('itemDetails')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
];

// @route   POST /api/payments/create-token
// @desc    Create Midtrans payment token
// @access  Private
router.post('/create-token', authenticateToken, requireVerified, validatePayment, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  try {
    const paymentData = {
      orderId: req.body.orderId,
      amount: req.body.amount,
      customerDetails: {
        firstName: req.body.customerDetails.firstName,
        lastName: req.body.customerDetails.lastName,
        email: req.body.customerDetails.email,
        phone: req.body.customerDetails.phone,
      },
      itemDetails: req.body.itemDetails,
    };

    const result = await paymentService.createPaymentToken(paymentData);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment token created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment token creation failed',
    });
  }
}));

// @route   POST /api/payments/create
// @desc    Create direct payment
// @access  Private
router.post('/create', authenticateToken, requireVerified, validatePayment, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  try {
    const paymentData = {
      orderId: req.body.orderId,
      amount: req.body.amount,
      customerDetails: {
        firstName: req.body.customerDetails.firstName,
        lastName: req.body.customerDetails.lastName,
        email: req.body.customerDetails.email,
        phone: req.body.customerDetails.phone,
      },
      itemDetails: req.body.itemDetails,
      paymentType: req.body.paymentType,
    };

    const result = await paymentService.createPayment(paymentData);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment creation failed',
    });
  }
}));

// @route   GET /api/payments/status/:orderId
// @desc    Check payment status
// @access  Private
router.get('/status/:orderId', authenticateToken, asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const status = await paymentService.verifyPayment(orderId);

    res.status(200).json({
      success: true,
      data: status,
      message: 'Payment status retrieved successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment status check failed',
    });
  }
}));

// @route   POST /api/payments/notifications
// @desc    Handle Midtrans payment notifications (webhook)
// @access  Public (webhook)
router.post('/notifications', asyncHandler(async (req, res) => {
  try {
    const notification = await paymentService.handleNotification(req.body);

    // Here you would typically update your database with the payment status
    // For example:
    // await OrderModel.updatePaymentStatus(notification.orderId, notification.transactionStatus);

    res.status(200).json({
      success: true,
      message: 'Notification processed successfully',
    });
  } catch (error) {
    console.error('Payment notification processing failed:', error);
    res.status(400).json({
      success: false,
      error: 'Notification processing failed',
    });
  }
}));

// @route   POST /api/payments/cancel/:orderId
// @desc    Cancel payment
// @access  Private
router.post('/cancel/:orderId', authenticateToken, asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await paymentService.cancelPayment(orderId);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment cancelled successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment cancellation failed',
    });
  }
}));

// @route   POST /api/payments/refund/:orderId
// @desc    Refund payment
// @access  Private
router.post('/refund/:orderId', authenticateToken, asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { amount, reason } = req.body;

  try {
    const result = await paymentService.refundPayment(orderId, amount, reason);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment refunded successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment refund failed',
    });
  }
}));

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', asyncHandler(async (req, res) => {
  try {
    const methods = paymentService.getAvailablePaymentMethods();

    res.status(200).json({
      success: true,
      data: methods,
      message: 'Payment methods retrieved successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to retrieve payment methods',
    });
  }
}));

export default router;
