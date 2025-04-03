import mongoose from 'mongoose';
const { Schema } = mongoose;

const SessionSchema = new Schema({
  slot_id: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  volunteer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  session_type: {
    type: String,
    enum: ['live', 'recorded'],
    required: true
  },
  session_date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  feedback: {
    type: String
  },
  student_engagement: {
    type: Number
  }
}, { timestamps: true });

export default mongoose.model('Session', SessionSchema);
