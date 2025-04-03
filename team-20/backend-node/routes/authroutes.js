import express from 'express';
import { registerSchool, loginSchool, registerVolunteer, loginVolunteer, logout, getMe } from '../controllers/authController.js';
import { protect, authorize } from '../utils/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/schools/register', registerSchool);
router.post('/auth/schools/login', loginSchool);
router.post('/auth/volunteers/register', registerVolunteer);
router.post('/auth/volunteers/login', loginVolunteer);
router.get('/auth/logout', logout);
router.get('/auth/me', protect, getMe);

// Protected routes example
router.get('/schools/dashboard', protect, authorize('school', 'admin'), (req, res) => {
  res.status(200).json({ success: true, data: 'School dashboard data' });
});

router.get('/volunteers/dashboard', protect, authorize('volunteer', 'admin'), (req, res) => {
  res.status(200).json({ success: true, data: 'Volunteer dashboard data' });
});

export default router;