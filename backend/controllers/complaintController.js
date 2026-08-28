const { analyzeComplaintAI } = require('../services/aiAnalysisEngine');
const store = require('../services/complaintStore');

// Generate unique Ticket ID e.g. CP-2026-8941
const generateTicketId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CP-${year}-${randomNum}`;
};

// Apply query filters/sort/limit to a plain complaint array
const applyQuery = (rows, { category, severity, status, ward, search, sortBy, limit = 50 }) => {
  let list = [...rows];
  if (category && category !== 'ALL') list = list.filter(c => c.category === category);
  if (severity && severity !== 'ALL') list = list.filter(c => c.aiAnalysis?.severity === severity);
  if (status && status !== 'ALL') list = list.filter(c => c.status === status);
  if (ward && ward !== 'ALL') list = list.filter(c => c.location?.ward === ward);
  if (search) {
    const s = String(search).toLowerCase();
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
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
  return list.slice(0, Number(limit) || 50);
};

// @desc Get all complaints with filtering & sorting
exports.getComplaints = async (req, res) => {
  try {
    const all = await store.list();
    const data = applyQuery(all, req.query);
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving complaints' });
  }
};

// @desc Get single complaint by ticketId
exports.getComplaintByTicketId = async (req, res) => {
  try {
    const complaint = await store.findByTicket(req.params.ticketId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Grievance ticket not found' });
    }
    return res.json({ success: true, data: complaint });
  } catch (err) {
    console.error('Error fetching complaint:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving ticket' });
  }
};

// @desc Create a new complaint with instant AI hazard analysis
exports.createComplaint = async (req, res) => {
  try {
    const {
      title, description, category, imageUrl, multiAngleImages,
      latitude, longitude, address, landmark, ward, zone, pincode,
      citizenName, citizenPhone, citizenEmail, priorityClaimed, anonymous
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, category, and description' });
    }

    const ticketId = generateTicketId();

    const aiAnalysis = await analyzeComplaintAI({
      title, description, category,
      ward: ward || '',
      location: { latitude, longitude, address },
      imageUrl, priorityClaimed
    });

    const nowIso = new Date().toISOString();
    const newComplaintData = {
      _id: 'cmp_' + Date.now(),
      ticketId,
      title,
      description,
      category,
      imageUrl: imageUrl || multiAngleImages?.front || '',
      multiAngleImages: multiAngleImages || {},
      location: {
        latitude: Number(latitude) || 16.3125,
        longitude: Number(longitude) || 80.4280,
        address: address || '',
        landmark: landmark || '',
        ward: ward ? String(ward).trim() : '',
        zone: zone || '',
        pincode: pincode || ''
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
        crewId: null, teamLead: null, contactPhone: null,
        dispatchedAt: null, etaMinutes: null, status: 'UNASSIGNED'
      },
      workOrderRef: null,
      timeline: [
        {
          action: 'Citizen Grievance Registered',
          by: anonymous ? 'Anonymous Citizen' : (citizenName || 'Citizen Portal'),
          timestamp: nowIso,
          note: `Registered with live GPS coordinates (${Number(latitude) || 16.3125}, ${Number(longitude) || 80.4280})`,
          badgeColor: 'blue'
        },
        {
          action: 'AI Vision & Hazard Triage Completed',
          by: 'CivicPulse Neural Triage Engine',
          timestamp: nowIso,
          note: `Classified as ${aiAnalysis.severity} severity (Risk Score: ${aiAnalysis.riskScore}/100). SLA: ${aiAnalysis.slaHours}h.`,
          badgeColor: aiAnalysis.severity === 'CRITICAL' ? 'red' : aiAnalysis.severity === 'HIGH' ? 'amber' : 'green'
        }
      ],
      resolutionProof: {
        resolvedAt: null, resolvedBy: null,
        beforeImageUrl: imageUrl || '', afterImageUrl: '',
        resolutionNotes: '', citizenFeedbackRating: null
      },
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const saved = await store.create(newComplaintData);
    return res.status(201).json({ success: true, data: saved });
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
      action: `Status Updated to ${String(status || '').replace('_', ' ')}`,
      by: officerName || 'Municipal Officer',
      timestamp: new Date().toISOString(),
      note: note || `Progress status updated to ${status}.`,
      badgeColor: status === 'RESOLVED' ? 'green' : status === 'CREW_DISPATCHED' ? 'amber' : 'blue'
    };

    const updated = await store.update(id, (c) => {
      c.status = status;
      c.timeline = c.timeline || [];
      c.timeline.push(timelineEntry);
      return c;
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Ticket not found' });
    return res.json({ success: true, data: updated });
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

    const updated = await store.update(id, (c) => {
      c.status = 'CREW_DISPATCHED';
      c.assignedCrew = crewPayload;
      c.timeline = c.timeline || [];
      c.timeline.push(timelineEntry);
      return c;
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Ticket not found' });
    return res.json({ success: true, data: updated });
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

    const updated = await store.update(id, (c) => {
      c.status = 'RESOLVED';
      c.resolutionProof = resolutionPayload;
      if (c.assignedCrew) c.assignedCrew.status = 'COMPLETED';
      c.timeline = c.timeline || [];
      c.timeline.push(timelineEntry);
      return c;
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Ticket not found' });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error resolving complaint:', err);
    res.status(500).json({ success: false, message: 'Server error resolving complaint' });
  }
};
