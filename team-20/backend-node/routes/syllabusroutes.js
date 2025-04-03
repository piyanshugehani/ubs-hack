import express from 'express';
import { uploadSyllabus, getSyllabus } from '../controllers/syllabusController.js';
import { protect, authorize } from '../utils/auth.js';

const router = express.Router();

router.post('/upload', uploadSyllabus);
router.get('/:id', protect, getSyllabus);

export default router;