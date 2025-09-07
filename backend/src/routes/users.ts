import { Router } from 'express';
import { authenticateToken, requireVerified } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { UserModel } from '../models/User';

const router = Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
    message: 'Profile retrieved successfully',
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, requireVerified, asyncHandler(async (req, res) => {
  const { firstName, lastName, bio, avatar } = req.body;

  const updatedUser = await UserModel.update(req.user!.id, {
    firstName,
    lastName,
    bio,
    avatar,
  });

  if (!updatedUser) {
    return res.status(400).json({
      success: false,
      error: 'Failed to update profile',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    },
    message: 'Profile updated successfully',
  });
}));

export default router;
