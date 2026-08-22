const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['ADMIN', 'SENIOR_ENGINEER', 'DISPATCH_OFFICER', 'FIELD_SUPERVISOR'],
    default: 'DISPATCH_OFFICER',
  },
  department: { type: String, default: 'Department of Public Works' },
  badgeNumber: { type: String, required: true },
  avatar: { type: String, default: '' },
  assignedWards: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
