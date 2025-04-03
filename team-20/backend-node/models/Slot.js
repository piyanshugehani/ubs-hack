// models/Slot.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SlotSchema = new Schema({
  chapter_id: { 
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  topics_covered: {
    type: [Schema.Types.ObjectId],
    ref: 'Topic'
  },
  language: {
    type: String
  },
  assignedOrNot: {
    type: String,
    enum: ['unassigned', 'assigned'],
    default: 'unassigned'
  },
  is_urgent: {
    type: Boolean,
    default: false
  },
  volunteer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Volunteer'
  }
}, { timestamps: true });

export default mongoose.model('Slot', SlotSchema);
