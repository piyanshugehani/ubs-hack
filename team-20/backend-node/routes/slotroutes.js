import express from 'express';
import { createSlot, getAllSlots,updateSlotStatus } from '../controllers/slotcontroller.js';
import { protect, authorize } from '../utils/auth.js';

const router = express.Router();

router.post('/:chapter_id', protect, authorize('school'), createSlot);
router.get('/', protect, getAllSlots);
router.patch('/:slot_id/status', protect, updateSlotStatus);

export default router;