const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaintByTicketId,
  createComplaint,
  updateComplaintStatus,
  assignCrew,
  resolveComplaint
} = require('../controllers/complaintController');

router.route('/')
  .get(getComplaints)
  .post(createComplaint);

router.route('/ticket/:ticketId')
  .get(getComplaintByTicketId);

router.route('/:id/status')
  .patch(updateComplaintStatus);

router.route('/:id/assign-crew')
  .post(assignCrew);

router.route('/:id/resolve')
  .post(resolveComplaint);

module.exports = router;
