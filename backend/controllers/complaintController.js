const Complaint = require('../../database/models/Complaint');
const { isUsingMongo, getMemoryDb, persistMemoryDb } = require('../../database/connection');
const { analyzeComplaintAI } = require('../services/aiAnalysisEngine');
const { seedComplaints } = require('../../database/seed/seedData');

// Initialize memory db complaints if empty
const initMemoryComplaints = () => {
  const db = getMemoryDb();
  if (!db.complaints || db.complaints.length === 0) {
    db.complaints = JSON.parse(JSON.stringify(seedComplaints));
    persistMemoryDb();
  }
};

// Generate unique Ticket ID e.g. CP-2026-8941
const generateTicketId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CP-${year}-${randomNum}`;
};

// @desc Get all complaints with filtering & sorting
exports.getComplaints = async (req, res) => {
  try {
    const { category, severity, status, ward, search, sortBy, limit = 50 } = req.query;

    if (isUsingMongo()) {
      let query = {};
      if (category && category !== 'ALL') query.category = category;
      if (severity && severity !== 'ALL') query['aiAnalysis.severity'] = severity;
      if (status && status !== 'ALL') query.status = status;
      if (ward && ward !== 'ALL') query['location.ward'] = ward;
      if (search) {
        query.$or = [
          { ticketId: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } }
        ];
      }

      const sortOption = sortBy === 'risk' 
        ? { 'aiAnalysis.riskScore': -1 } 
        : { createdAt: -1 };

      const complaints = await Complaint.find(query).sort(sortOption).limit(Number(limit));
      return res.json({ success: true, count: complaints.length, data: complaints });
    } else {
      initMemoryComplaints();
      let list = [...getMemoryDb().complaints];

      if (category && category !== 'ALL') {
        list = list.filter(c => c.category === category);
      }
      if (severity && severity !== 'ALL') {
        list = list.filter(c => c.aiAnalysis?.severity === severity);
      }
      if (status && status !== 'ALL') {
        list = list.filter(c => c.status === status);
      }
      if (ward && ward !== 'ALL') {
        list = list.filter(c => c.location?.ward === ward);
      }
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(c => 
          c.ticketId?.toLowerCase().includes(s) ||
          c.title?.toLowerCase().includes(s) ||
          c.description?.toLowerCase().includes(s) ||
          c.location?.address?.toLowerCase().includes(s)
        );
      }

      if (sortBy === 'risk') {
        list.sort((a, b) => (b.aiAnalysis?.riskScore || 0) - (a.aiAnalysis?.riskScore || 0));
      } else {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json({ success: true, count: list.length, data: list.slice(0, Number(limit)) });
    }
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving complaints' });
  }
};

// @desc Get single complaint by ticketId
exports.getComplaintByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (isUsingMongo()) {
      const complaint = await Complaint.findOne({ ticketId: ticketId.toUpperCase() });
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Grievance ticket not found' });
      }
      return res.json({ success: true, data: complaint });
    } else {
      initMemoryComplaints();
      const complaint = getMemoryDb().complaints.find(c => c.ticketId?.toUpperCase() === ticketId.toUpperCase() || c._id === ticketId);
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Grievance ticket not found' });
      }
      return res.json({ success: true, data: complaint });
    }
  } catch (err) {
    console.error('Error fetching complaint:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving ticket' });
  }
};

// @desc Create a new complaint with instant AI hazard analysis
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      imageUrl,
      multiAngleImages,
      latitude,
      longitude,
      address,
      landmark,
      ward,
      zone,
      pincode,
      citizenName,
      citizenPhone,
      citizenEmail,
      priorityClaimed,
      anonymous
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, category, and description' });
    }

    const ticketId = generateTicketId();

    // Trigger AI Vision & Hazard Assessment
    const aiAnalysis = await analyzeComplaintAI({
      title,
      description,
      category,
      ward: ward || 'Ward 04 - Lakshmipuram Main Road & Hindu College',
      location: { latitude, longitude, address },
      imageUrl,
      priorityClaimed
    });

    const newComplaintData = {
      ticketId,
      title,
      description,
      category,
      imageUrl: imageUrl || multiAngleImages?.front || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      multiAngleImages: multiAngleImages || {},
      location: {
        latitude: Number(latitude) || 16.3125,
        longitude: Number(longitude) || 80.4280,
        address: address || 'Lakshmipuram Main Road, Guntur',
        landmark: landmark || '',
        ward: ward || 'Ward 04 - Lakshmipuram Main Road & Hindu College',
        zone: zone || 'Zone 2 - Guntur West',
        pincode: pincode || '522007'
      },
      citizen: {
        name: anonymous ? 'Anonymous Citizen' : (citizenName || 'GMC Citizen'),
        phone: citizenPhone || 'N/A',
        email: citizenEmail || '',
        anonymous: Boolean(anonymous)
      },
      status: 'AI_TRIAGED',
      aiAnalysis,
      assignedCrew: {
        crewId: null,
        teamLead: null,
        contactPhone: null,
        dispatchedAt: null,
        etaMinutes: null,
        status: 'UNASSIGNED'
      },
      workOrderRef: null,
      timeline: [
        {
          action: 'Citizen Grievance Registered',
          by: anonymous ? 'Anonymous Citizen' : (citizenName || 'Citizen Portal'),
          timestamp: new Date().toISOString(),
          note: `Registered with Guntur GPS coordinates (${Number(latitude) || 16.3125}, ${Number(longitude) || 80.4280})`,
          badgeColor: 'blue'
        },
        {
          action: 'AI Vision & Hazard Triage Completed',
          by: 'CivicPulse Neural Triage Engine',
          timestamp: new Date().toISOString(),
          note: `Classified as ${aiAnalysis.severity} severity (Risk Score: ${aiAnalysis.riskScore}/100). SLA: ${aiAnalysis.slaHours}h.`,
          badgeColor: aiAnalysis.severity === 'CRITICAL' ? 'red' : aiAnalysis.severity === 'HIGH' ? 'amber' : 'green'
        }
      ],
      resolutionProof: {
        resolvedAt: null,
        resolvedBy: null,
        beforeImageUrl: imageUrl || '',
        afterImageUrl: '',
        resolutionNotes: '',
        citizenFeedbackRating: null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isUsingMongo()) {
      const complaint = await Complaint.create(newComplaintData);
      return res.status(201).json({ success: true, data: complaint });
    } else {
      initMemoryComplaints();
      newComplaintData._id = 'cmp_' + Date.now();
      getMemoryDb().complaints.unshift(newComplaintData);
      persistMemoryDb();
      return res.status(201).json({ success: true, data: newComplaintData });
    }
  } catch (err) {
    console.error('Error creating complaint:', err);
    res.status(500).json({ success: false, message: 'Server error registering grievance' });
  }
};

// @desc Update complaint status & timeline
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, officerName } = req.body;

    const timelineEntry = {
      action: `Status Updated to ${status.replace('_', ' ')}`,
      by: officerName || 'Municipal Officer',
      timestamp: new Date().toISOString(),
      note: note || `Progress status updated to ${status}.`,
      badgeColor: status === 'RESOLVED' ? 'green' : status === 'CREW_DISPATCHED' ? 'amber' : 'blue'
    };

    if (isUsingMongo()) {
      const complaint = await Complaint.findOne({ $or: [{ _id: id }, { ticketId: id }] });
      if (!complaint) return res.status(404).json({ success: false, message: 'Ticket not found' });

      complaint.status = status;
      complaint.timeline.push(timelineEntry);
      complaint.updatedAt = new Date();
      await complaint.save();

      return res.json({ success: true, data: complaint });
    } else {
      initMemoryComplaints();
      const complaint = getMemoryDb().complaints.find(c => c._id === id || c.ticketId === id);
      if (!complaint) return res.status(404).json({ success: false, message: 'Ticket not found' });

      complaint.status = status;
      complaint.timeline = complaint.timeline || [];
      complaint.timeline.push(timelineEntry);
      complaint.updatedAt = new Date().toISOString();
      persistMemoryDb();

      return res.json({ success: true, data: complaint });
    }
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

// @desc Assign Field Crew to complaint
exports.assignCrew = async (req, res) => {
  try {
    const { id } = req.params;
    const { crewId, teamLead, contactPhone, etaMinutes, officerName } = req.body;

    const crewPayload = {
      crewId: crewId || 'CREW-RAPID-01',
      teamLead: teamLead || 'Field Supervisor Marcus Vance',
      contactPhone: contactPhone || '+1 (555) 019-2834',
      dispatchedAt: new Date().toISOString(),
      etaMinutes: Number(etaMinutes) || 20,
      status: 'EN_ROUTE'
    };

    const timelineEntry = {
      action: 'Field Crew Dispatched',
      by: officerName || 'Dispatcher',
      timestamp: new Date().toISOString(),
      note: `Assigned to ${crewPayload.teamLead} (${crewPayload.crewId}). Estimated arrival in ${crewPayload.etaMinutes} mins.`,
      badgeColor: 'amber'
    };

    if (isUsingMongo()) {
      const complaint = await Complaint.findOne({ $or: [{ _id: id }, { ticketId: id }] });
      if (!complaint) return res.status(404).json({ success: false, message: 'Ticket not found' });

      complaint.status = 'CREW_DISPATCHED';
      complaint.assignedCrew = crewPayload;
      complaint.timeline.push(timelineEntry);
      complaint.updatedAt = new Date();
      await complaint.save();

      return res.json({ success: true, data: complaint });
    } else {
      initMemoryComplaints();
      const complaint = getMemoryDb().complaints.find(c => c._id === id || c.ticketId === id);
      if (!complaint) return res.status(404).json({ success: false, message: 'Ticket not found' });

      complaint.status = 'CREW_DISPATCHED';
      complaint.assignedCrew = crewPayload;
      complaint.timeline.push(timelineEntry);
      complaint.updatedAt = new Date().toISOString();
      persistMemoryDb();

      return res.json({ success: true, data: complaint });
    }
  } catch (err) {
    console.error('Error assigning crew:', err);
    res.status(500).json({ success: false, message: 'Server error assigning field crew' });
  }
};

// @desc Resolve complaint with completion proof
exports.resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { afterImageUrl, resolutionNotes, resolvedBy, citizenFeedbackRating } = req.body;

    const resolutionPayload = {
      resolvedAt: new Date().toISOString(),
      resolvedBy: resolvedBy || 'Field Engineering Unit',
      afterImageUrl: afterImageUrl || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
      resolutionNotes: resolutionNotes || 'All corrective repair work completed according to municipal code standards.',
      citizenFeedbackRating: citizenFeedbackRating || 5
    };

    const timelineEntry = {
      action: 'Corrective Work Completed & Verified',
      by: resolutionPayload.resolvedBy,
      timestamp: new Date().toISOString(),
      note: resolutionPayload.resolutionNotes,
      badgeColor: 'green'
    };

    if (isUsingMongo()) {
      const complaint = await Complaint.findOne({ $or: [{ _id: id }, { ticketId: id }] });
      if (!complaint) return res.status(404).json({ success: false, message: 'Ticket not found' });

      complaint.status = 'RESOLVED';
      complaint.resolutionProof = resolutionPayload;
      if (complaint.assignedCrew) complaint.assignedCrew.status = 'COMPLETED';
      complaint.timeline.push(timelineEntry);
      complaint.updatedAt = new Date();
      await complaint.save();

      return res.json({ success: true, data: complaint });
    } else {
      initMemoryComplaints();
      const complaint = getMemoryDb().complaints.find(c => c._id === id || c.ticketId === id);
      if (!complaint) return res.status(404).json({ success: false, message: 'Ticket not found' });

      complaint.status = 'RESOLVED';
      complaint.resolutionProof = resolutionPayload;
      if (complaint.assignedCrew) complaint.assignedCrew.status = 'COMPLETED';
      complaint.timeline.push(timelineEntry);
      complaint.updatedAt = new Date().toISOString();
      persistMemoryDb();

      return res.json({ success: true, data: complaint });
    }
  } catch (err) {
    console.error('Error resolving complaint:', err);
    res.status(500).json({ success: false, message: 'Server error resolving complaint' });
  }
};
