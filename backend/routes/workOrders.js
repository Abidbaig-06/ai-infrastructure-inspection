const express = require('express');
const router = express.Router();
const {
  getWorkOrders,
  createWorkOrder,
  updateWorkOrderStatus
} = require('../controllers/workOrderController');

router.route('/')
  .get(getWorkOrders)
  .post(createWorkOrder);

router.route('/:id/status')
  .patch(updateWorkOrderStatus);

module.exports = router;
