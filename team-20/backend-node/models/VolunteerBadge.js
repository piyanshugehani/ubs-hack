import mongoose from 'mongoose';
const { Schema } = mongoose;

const VolunteerBadgeSchema = new Schema({
  volunteer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  badge_id: {
    type: Schema.Types.ObjectId,
    ref: 'Badge',
    required: true
  },
  awarded_date: {
    type: Date,
    default: Date.now
  }
});

VolunteerBadgeSchema.index({ volunteer_id: 1, badge_id: 1 }, { unique: true });

export default mongoose.model('VolunteerBadge', VolunteerBadgeSchema);