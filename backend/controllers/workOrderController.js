const WorkOrder = require('../../database/models/WorkOrder');
const Complaint = require('../../database/models/Complaint');
const { isUsingMongo, getMemoryDb, persistMemoryDb } = require('../../database/connection');
const { seedWorkOrders } = require('../../database/seed/seedData');

const initMemoryWorkOrders = () => {
  const db = getMemoryDb();
  if (!db.workOrders || db.workOrders.length === 0) {
    db.workOrders = JSON.parse(JSON.stringify(seedWorkOrders));
    persistMemoryDb();
  }
};

const generateWorkOrderNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `WO-${year}-${rand}`;
};

// @desc Get all maintenance work orders
exports.getWorkOrders = async (req, res) => {
  try {
    if (isUsingMongo()) {
      const orders = await WorkOrder.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    } else {
      initMemoryWorkOrders();
      const orders = [...getMemoryDb().workOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: orders.length, data: orders });
    }
  } catch (err) {
    console.error('Error fetching work orders:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving work orders' });
  }
};

// @desc Create new official maintenance work order from complaint
exports.createWorkOrder = async (req, res) => {
  try {
    const {
      complaintTicketId,
      title,
      department,
      priority,
      contractorName,
      leadEngineer,
      scopeOfWork,
      safetyChecklist,
      budgetLabor,
      budgetMaterials,
      budgetMachinery,
      deadlineHours = 24,
      officerName,
      badgeNumber,
      siteAddress,
      ward,
      latitude,
      longitude
    } = req.body;

    const workOrderNumber = generateWorkOrderNumber();
    const labor = Number(budgetLabor) || 400;
    const materials = Number(budgetMaterials) || 500;
    const machinery = Number(budgetMachinery) || 250;

    const newOrderData = {
      workOrderNumber,
      complaintTicketId: complaintTicketId || 'CP-2026-MANUAL',
      title: title || 'Emergency Public Infrastructure Repair Order',
      department: department || 'Department of Transportation & Roads',
      priority: priority || 'HIGH',
      status: 'DISPATCHED',
      assignedContractor: {
        companyName: contractorName || 'Civic Infrastructure Works Ltd.',
        leadEngineer: leadEngineer || 'Supervisor Marcus Vance',
        contact: '+1 (555) 019-2834',
        teamSize: 4
      },
      siteLocation: {
        address: siteAddress || 'Lakshmipuram Main Road, Guntur',
        ward: ward || 'Ward 04 - Lakshmipuram',
        coordinates: {
          latitude: Number(latitude) || 16.3125,
          longitude: Number(longitude) || 80.4280
        }
      },
      scopeOfWork: Array.isArray(scopeOfWork) && scopeOfWork.length > 0 ? scopeOfWork : [
        'Cordon off work zone with statutory safety barricades',
        'Excavate and remove compromised substrate',
        'Install approved engineering replacement materials',
        'Perform quality inspection and post-repair photographic logging'
      ],
      safetyChecklist: Array.isArray(safetyChecklist) && safetyChecklist.length > 0 ? safetyChecklist : [
        { item: 'Statutory high-visibility warning signage in place', verified: true },
        { item: 'Mandatory PPE (Class 3 Vest, Hardhat, Safety Boots)', verified: true },
        { item: 'Underground utility clearance verification', verified: true }
      ],
      estimatedBudget: {
        labor,
        materials,
        machinery,
        total: labor + materials + machinery,
        currency: 'USD'
      },
      issuedBy: {
        officerName: officerName || 'Dr. Aris Thorne',
        designation: 'Chief Municipal Engineer',
        badgeNumber: badgeNumber || 'ENG-8821'
      },
      scheduledStart: new Date().toISOString(),
      deadline: new Date(Date.now() + Number(deadlineHours) * 3600 * 1000).toISOString(),
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isUsingMongo()) {
      const order = await WorkOrder.create(newOrderData);

      // Link to complaint if ticketId exists
      if (complaintTicketId) {
        await Complaint.findOneAndUpdate(
          { ticketId: complaintTicketId },
          { 
            workOrderRef: workOrderNumber,
            status: 'CREW_DISPATCHED',
            $push: {
              timeline: {
                action: 'Maintenance Work Order Generated',
                by: newOrderData.issuedBy.officerName,
                timestamp: new Date().toISOString(),
                note: `Official Work Order #${workOrderNumber} issued to ${newOrderData.assignedContractor.companyName}.`,
                badgeColor: 'amber'
              }
            }
          }
        );
      }

      return res.status(201).json({ success: true, data: order });
    } else {
      initMemoryWorkOrders();
      newOrderData._id = 'wo_' + Date.now();
      getMemoryDb().workOrders.unshift(newOrderData);

      // Link to complaint in memory DB
      if (complaintTicketId) {
        const comp = getMemoryDb().complaints?.find(c => c.ticketId === complaintTicketId);
        if (comp) {
          comp.workOrderRef = workOrderNumber;
          comp.status = 'CREW_DISPATCHED';
          comp.timeline = comp.timeline || [];
          comp.timeline.push({
            action: 'Maintenance Work Order Generated',
            by: newOrderData.issuedBy.officerName,
            timestamp: new Date().toISOString(),
            note: `Official Work Order #${workOrderNumber} issued to ${newOrderData.assignedContractor.companyName}.`,
            badgeColor: 'amber'
          });
        }
      }

      persistMemoryDb();
      return res.status(201).json({ success: true, data: newOrderData });
    }
  } catch (err) {
    console.error('Error creating work order:', err);
    res.status(500).json({ success: false, message: 'Server error generating work order' });
  }
};

// @desc Update work order status
exports.updateWorkOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (isUsingMongo()) {
      const order = await WorkOrder.findOne({ $or: [{ _id: id }, { workOrderNumber: id }] });
      if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' });

      order.status = status;
      if (status === 'COMPLETED') order.completedAt = new Date();
      order.updatedAt = new Date();
      await order.save();

      return res.json({ success: true, data: order });
    } else {
      initMemoryWorkOrders();
      const order = getMemoryDb().workOrders.find(o => o._id === id || o.workOrderNumber === id);
      if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' });

      order.status = status;
      if (status === 'COMPLETED') order.completedAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();
      persistMemoryDb();

      return res.json({ success: true, data: order });
    }
  } catch (err) {
    console.error('Error updating work order:', err);
    res.status(500).json({ success: false, message: 'Server error updating work order' });
  }
};
