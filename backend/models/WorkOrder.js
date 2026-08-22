const mongoose = require('mongoose');

const WorkOrderSchema = new mongoose.Schema({
  workOrderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  complaintTicketId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['EMERGENCY', 'HIGH', 'MEDIUM', 'ROUTINE'],
    default: 'HIGH',
  },
  status: {
    type: String,
    enum: ['DRAFT', 'DISPATCHED', 'IN_EXECUTION', 'COMPLETED', 'CANCELLED'],
    default: 'DISPATCHED',
  },
  assignedContractor: {
    companyName: { type: String, default: 'Apex Civic Infrastructure Ltd.' },
    leadEngineer: { type: String, default: 'Officer Sarah Jenkins' },
    contact: { type: String, default: '+1 (555) 019-2834' },
    teamSize: { type: Number, default: 4 }
  },
  siteLocation: {
    address: { type: String, required: true },
    ward: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  scopeOfWork: [{ type: String }],
  safetyChecklist: [{
    item: { type: String },
    verified: { type: Boolean, default: false }
  }],
  estimatedBudget: {
    labor: { type: Number, default: 350 },
    materials: { type: Number, default: 450 },
    machinery: { type: Number, default: 200 },
    total: { type: Number, default: 1000 },
    currency: { type: String, default: 'USD' }
  },
  issuedBy: {
    officerName: { type: String, default: 'Dr. Aris Thorne' },
    designation: { type: String, default: 'Chief Municipal Engineer' },
    badgeNumber: { type: String, default: 'ENG-9942' }
  },
  scheduledStart: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkOrder', WorkOrderSchema);
