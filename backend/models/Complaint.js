const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Road Hazard & Pothole',
      'Water Leak & Sewage',
      'Electrical & Live Wire',
      'Street Lighting',
      'Waste & Garbage Dumping',
      'Structural Damage',
      'Public Safety & Obstruction',
      'Other'
    ],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    ward: { type: String, required: true },
    zone: { type: String, default: 'Zone A - Central Metro' },
    pincode: { type: String, default: '10001' },
  },
  citizen: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    anonymous: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'AI_TRIAGED', 'CREW_DISPATCHED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'AI_TRIAGED',
  },
  aiAnalysis: {
    severity: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
    riskScore: { type: Number, min: 0, max: 100, default: 50 },
    urgencyLevel: { type: String, default: 'Standard Maintenance (<72h)' },
    slaHours: { type: Number, default: 72 },
    targetResolutionTime: { type: Date },
    assignedDepartment: { type: String, default: 'Public Works & Infrastructure' },
    detectedHazards: [{ type: String }],
    recommendedEquipment: [{ type: String }],
    estimatedCost: {
      min: { type: Number, default: 200 },
      max: { type: Number, default: 500 },
      currency: { type: String, default: 'USD' }
    },
    safetyPrecaution: { type: String, default: 'Standard safety perimeter required.' },
    confidenceScore: { type: Number, default: 0.92 },
    summaryReport: { type: String, default: '' },
    analyzedAt: { type: Date, default: Date.now },
    engineVersion: { type: String, default: 'CivicPulse-Vision-v3.4' }
  },
  assignedCrew: {
    crewId: { type: String, default: null },
    teamLead: { type: String, default: null },
    contactPhone: { type: String, default: null },
    dispatchedAt: { type: Date, default: null },
    etaMinutes: { type: Number, default: null },
    status: { type: String, default: 'UNASSIGNED' }
  },
  workOrderRef: {
    type: String,
    default: null
  },
  timeline: [
    {
      action: { type: String, required: true },
      by: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      note: { type: String, default: '' },
      badgeColor: { type: String, default: 'blue' }
    }
  ],
  resolutionProof: {
    resolvedAt: { type: Date, default: null },
    resolvedBy: { type: String, default: null },
    beforeImageUrl: { type: String, default: '' },
    afterImageUrl: { type: String, default: '' },
    resolutionNotes: { type: String, default: '' },
    citizenFeedbackRating: { type: Number, min: 1, max: 5, default: null }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
