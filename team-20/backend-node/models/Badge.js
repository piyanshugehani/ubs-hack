import mongoose from 'mongoose';
const { Schema } = mongoose;

const BadgeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  points_required: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Badge', BadgeSchema);