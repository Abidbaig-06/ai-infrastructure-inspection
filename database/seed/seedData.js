const seedUsers = [
  {
    _id: 'usr_01',
    name: 'Dr. Aris Thorne (EE, GMC)',
    email: 'engineer@civic.gov',
    password: 'demo',
    role: 'SENIOR_ENGINEER',
    department: 'Guntur Municipal Corporation (GMC) - Public Works',
    badgeNumber: 'GMC-ENG-8821',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedWards: ['Ward 04 - Lakshmipuram', 'Ward 02 - Brodipet', 'Ward 07 - Gorantla']
  },
  {
    _id: 'usr_02',
    name: 'Sarah Jenkins',
    email: 'triage@civic.gov',
    password: 'demo',
    role: 'DISPATCH_OFFICER',
    department: 'GMC Emergency AI Dispatch Control Room',
    badgeNumber: 'GMC-DSP-4019',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedWards: ['Ward 01 - Arundelpet', 'Ward 03 - Kothapet', 'Ward 05 - Pattabhipuram']
  },
  {
    _id: 'usr_03',
    name: 'Marcus Vance',
    email: 'field@civic.gov',
    password: 'demo',
    role: 'FIELD_SUPERVISOR',
    department: 'GMC Rapid Pavement & Maintenance Unit',
    badgeNumber: 'GMC-FLD-2910',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedWards: ['All Guntur Wards']
  }
];

const seedComplaints = [
  {
    _id: 'cmp_101',
    ticketId: 'CP-2026-9812',
    title: 'Severe Pothole with Sub-Base Fracture on Lakshmipuram Main Road',
    description: 'A massive 15cm deep crater has opened up on Lakshmipuram Main Road near Hindu Pharmacy College after heavy rains. Multiple two-wheelers and autos swerving into oncoming traffic causing near-miss accidents.',
    category: 'Road Hazard & Pothole',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    location: {
      latitude: 16.3125,
      longitude: 80.4280,
      address: 'Lakshmipuram Main Road, near Hindu Pharmacy College',
      landmark: 'Opposite Union Bank of India Branch',
      ward: 'Ward 04 - Lakshmipuram',
      zone: 'Zone 2 - Guntur West',
      pincode: '522007'
    },
    citizen: {
      name: 'Ravi Teja Varma',
      phone: '+91 98480 22334',
      email: 'ravi.varma@example.com',
      anonymous: false
    },
    status: 'CREW_DISPATCHED',
    aiAnalysis: {
      severity: 'CRITICAL',
      riskScore: 94,
      urgencyLevel: 'Emergency Response (<4h)',
      slaHours: 4,
      targetResolutionTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      assignedDepartment: 'GMC Roads & Highway Engineering Wing',
      detectedHazards: [
        'Active cratering exceeding 14cm depth on busy transit corridor',
        'Direct vehicle axle and two-wheeler skid hazard',
        'Pedestrian crossing vulnerability near college gate'
      ],
      recommendedEquipment: ['Asphalt Hot-Box Unit', '2-Ton Compactor Roller', 'Reflective Barricade Kit', 'Polymer Cold Mix'],
      estimatedCost: { min: 650, max: 1200, currency: 'USD' },
      safetyPrecaution: 'URGENT: Divert middle lane traffic on Lakshmipuram road. Deploy reflective warning barricades upstream.',
      confidenceScore: 0.98,
      summaryReport: 'AI Computer Vision confirmed critical asphalt depression in Guntur Lakshmipuram. High collision risk during peak evening traffic.',
      analyzedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      engineVersion: 'CivicPulse-Vision-v3.4-GMC'
    },
    assignedCrew: {
      crewId: 'GMC-RAPID-01',
      teamLead: 'Marcus Vance',
      contactPhone: '+91 98491 00234',
      dispatchedAt: new Date(Date.now() - 1800 * 1000).toISOString(),
      etaMinutes: 15,
      status: 'EN_ROUTE'
    },
    workOrderRef: 'WO-2026-0419',
    timeline: [
      {
        action: 'Citizen Grievance Registered',
        by: 'Citizen (Ravi Teja Varma)',
        timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        note: 'Submitted with live GPS pin in Lakshmipuram, Guntur.',
        badgeColor: 'blue'
      },
      {
        action: 'AI Vision & Hazard Triage Completed',
        by: 'CivicPulse GMC Neural Engine',
        timestamp: new Date(Date.now() - 3600 * 1000 * 1.8).toISOString(),
        note: 'Classified as CRITICAL (Score 94/100). SLA target set to 4h.',
        badgeColor: 'red'
      },
      {
        action: 'GMC Field Crew Dispatched',
        by: 'Dispatcher Sarah Jenkins',
        timestamp: new Date(Date.now() - 1800 * 1000).toISOString(),
        note: 'Unit GMC-RAPID-01 deployed with hot asphalt mix trailer.',
        badgeColor: 'amber'
      }
    ],
    resolutionProof: {
      resolvedAt: null,
      resolvedBy: null,
      beforeImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      afterImageUrl: '',
      resolutionNotes: '',
      citizenFeedbackRating: null
    },
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1800 * 1000).toISOString()
  },
  {
    _id: 'cmp_102',
    ticketId: 'CP-2026-9815',
    title: 'High-Pressure Drinking Water Pipeline Rupture in Brodipet',
    description: 'Underground municipal water pipeline burst at Brodipet 4th Line corner. Water is flooding commercial shop fronts and eroding the road foundation near Guntur Railway Station access.',
    category: 'Water Leak & Sewage',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    location: {
      latitude: 16.3080,
      longitude: 80.4420,
      address: 'Brodipet 4th Line, Main Commercial Avenue',
      landmark: 'Near Guntur Railway Station East Gate',
      ward: 'Ward 02 - Brodipet',
      zone: 'Zone 1 - Guntur Central',
      pincode: '522002'
    },
    citizen: {
      name: 'Ananya Chowdary',
      phone: '+91 94401 55678',
      email: 'ananya.c@guntur.org',
      anonymous: false
    },
    status: 'IN_PROGRESS',
    aiAnalysis: {
      severity: 'CRITICAL',
      riskScore: 97,
      urgencyLevel: 'Emergency Response (<2h)',
      slaHours: 2,
      targetResolutionTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      assignedDepartment: 'GMC Water Supply & Sewerage Board',
      detectedHazards: [
        'Active high-velocity pipeline inundation',
        'Sub-surface soil wash away & foundation sinkhole threat',
        'Loss of municipal drinking water supply to Brodipet Ward'
      ],
      recommendedEquipment: ['Submersible De-Watering Sump Pump', 'Hydro-Vacuum Excavator', '6-inch Mechanical Pipe Clamp'],
      estimatedCost: { min: 1400, max: 3200, currency: 'USD' },
      safetyPrecaution: 'ISOLATE FEEDER VALVE AT BRODIPET OVERHEAD TANK GRID IMMEDIATELY.',
      confidenceScore: 0.99,
      summaryReport: 'Critical water main burst in Brodipet commercial hub. High flood risk near railway junction.',
      analyzedAt: new Date(Date.now() - 7200 * 1000).toISOString(),
      engineVersion: 'CivicPulse-Vision-v3.4-GMC'
    },
    assignedCrew: {
      crewId: 'GMC-HYDRO-02',
      teamLead: 'Insp. Kenneth Cole',
      contactPhone: '+91 98492 11456',
      dispatchedAt: new Date(Date.now() - 5400 * 1000).toISOString(),
      etaMinutes: 0,
      status: 'ON_SITE'
    },
    workOrderRef: 'WO-2026-0420',
    timeline: [
      {
        action: 'Citizen Grievance Registered',
        by: 'Citizen (Ananya Chowdary)',
        timestamp: new Date(Date.now() - 7200 * 1000).toISOString(),
        note: 'Urgent notification received.',
        badgeColor: 'blue'
      },
      {
        action: 'AI Triage Severity Escalated',
        by: 'CivicPulse GMC Neural Engine',
        timestamp: new Date(Date.now() - 7100 * 1000).toISOString(),
        note: 'Auto alert broadcast to GMC Water Works Emergency Operations.',
        badgeColor: 'red'
      },
      {
        action: 'Emergency Water Isolation Crew On Site',
        by: 'Insp. Kenneth Cole',
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
        note: 'Valve 4 isolated. Excavation and pipe clamping underway.',
        badgeColor: 'green'
      }
    ],
    resolutionProof: {
      resolvedAt: null,
      resolvedBy: null,
      beforeImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      afterImageUrl: '',
      resolutionNotes: '',
      citizenFeedbackRating: null
    },
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000).toISOString()
  },
  {
    _id: 'cmp_103',
    ticketId: 'CP-2026-9820',
    title: 'Exposed Overhead 440V Cable Sagging Near Arundelpet Rythu Bazaar',
    description: 'Strong thunderstorm snapped tree branch onto overhead power line. Cable is dangling at 1.8m height directly above pedestrian pathway near Arundelpet Rythu Bazaar entrance.',
    category: 'Electrical & Live Wire',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    location: {
      latitude: 16.3040,
      longitude: 80.4480,
      address: '12th Line Arundelpet, near Rythu Bazaar',
      landmark: 'Adjacent to Municipal High School Playground',
      ward: 'Ward 01 - Arundelpet Central',
      zone: 'Zone 1 - Guntur Central',
      pincode: '522002'
    },
    citizen: {
      name: 'Suresh Krishna',
      phone: '+91 98481 99887',
      email: 'suresh.k@gmail.com',
      anonymous: false
    },
    status: 'AI_TRIAGED',
    aiAnalysis: {
      severity: 'CRITICAL',
      riskScore: 99,
      urgencyLevel: 'Emergency Response (<2h)',
      slaHours: 2,
      targetResolutionTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      assignedDepartment: 'APCPDCL / City Power Safety Authority',
      detectedHazards: [
        'Dangling live 440V conductor below statutory ground clearance',
        'Direct electrocution risk to market shoppers & schoolchildren',
        'Arc fire hazard in dense commercial market area'
      ],
      recommendedEquipment: ['Aerial Insulated Boom Truck', 'Phase Voltage Tester', 'Dielectric Barrier Cordon'],
      estimatedCost: { min: 800, max: 1800, currency: 'USD' },
      safetyPrecaution: 'DANGER: Cordon off 10m perimeter. De-energize Arundelpet Feeder 3B immediately.',
      confidenceScore: 0.99,
      summaryReport: 'Life-critical electrical hazard in Arundelpet Guntur. Auto-escalated to APCPDCL emergency line.',
      analyzedAt: new Date(Date.now() - 900 * 1000).toISOString(),
      engineVersion: 'CivicPulse-Vision-v3.4-GMC'
    },
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
        by: 'Citizen (Suresh Krishna)',
        timestamp: new Date(Date.now() - 900 * 1000).toISOString(),
        note: 'Reported with Guntur Arundelpet GPS pin.',
        badgeColor: 'blue'
      },
      {
        action: 'AI Vision Neural Assessment',
        by: 'CivicPulse GMC Neural Engine',
        timestamp: new Date(Date.now() - 850 * 1000).toISOString(),
        note: 'Critical 3-phase live conductor detected. Priority 1.',
        badgeColor: 'red'
      }
    ],
    resolutionProof: {
      resolvedAt: null,
      resolvedBy: null,
      beforeImageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
      afterImageUrl: '',
      resolutionNotes: '',
      citizenFeedbackRating: null
    },
    createdAt: new Date(Date.now() - 900 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 850 * 1000).toISOString()
  },
  {
    _id: 'cmp_104',
    ticketId: 'CP-2026-9824',
    title: 'Solid Waste Overflow & Construction Debris near Old Guntur Bus Stand',
    description: 'Commercial construction debris and domestic solid waste has piled up over the weekend, obstructing the pedestrian footpath near Jinnah Tower Center.',
    category: 'Waste & Garbage Dumping',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    location: {
      latitude: 16.2980,
      longitude: 80.4550,
      address: 'Old Guntur Trunk Road, near RTC Old Bus Stand',
      landmark: 'Near Jinnah Tower Center Plaza',
      ward: 'Ward 08 - Old Guntur',
      zone: 'Zone 3 - Guntur East',
      pincode: '522001'
    },
    citizen: {
      name: 'Koteswara Rao',
      phone: '+91 98485 66778',
      email: 'krao@gunturcorp.com',
      anonymous: false
    },
    status: 'AI_TRIAGED',
    aiAnalysis: {
      severity: 'MEDIUM',
      riskScore: 58,
      urgencyLevel: 'Standard Maintenance (<72h)',
      slaHours: 72,
      targetResolutionTime: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      assignedDepartment: 'GMC Solid Waste Management & Sanitation Wing',
      detectedHazards: [
        'Biological vector breeding ground in Old Guntur Market',
        'Pedestrian walkway encroachment near bus boarding'
      ],
      recommendedEquipment: ['Rear-Loader Compactor Truck', 'Front-End Mini Skid Loader', 'Odor Neutralizer Sprayer'],
      estimatedCost: { min: 220, max: 480, currency: 'USD' },
      safetyPrecaution: 'Sanitation workers must wear protective gloves and safety goggles.',
      confidenceScore: 0.93,
      summaryReport: 'AI classification identified solid waste pile (~3.8 cu.m). Scheduled for GMC morning compact truck.',
      analyzedAt: new Date(Date.now() - 14400 * 1000).toISOString(),
      engineVersion: 'CivicPulse-Vision-v3.4-GMC'
    },
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
        by: 'Citizen (Koteswara Rao)',
        timestamp: new Date(Date.now() - 14400 * 1000).toISOString(),
        note: 'Submitted via portal.',
        badgeColor: 'blue'
      },
      {
        action: 'AI Triage Completed',
        by: 'CivicPulse GMC Neural Engine',
        timestamp: new Date(Date.now() - 14300 * 1000).toISOString(),
        note: 'Ranked MEDIUM severity (58/100).',
        badgeColor: 'yellow'
      }
    ],
    resolutionProof: {
      resolvedAt: null,
      resolvedBy: null,
      beforeImageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      afterImageUrl: '',
      resolutionNotes: '',
      citizenFeedbackRating: null
    },
    createdAt: new Date(Date.now() - 14400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14300 * 1000).toISOString()
  },
  {
    _id: 'cmp_105',
    ticketId: 'CP-2026-9801',
    title: 'Cluster of 6 Non-Operational Streetlamps on Pattabhipuram Main Road',
    description: 'Continuous 200m dark stretch along Pattabhipuram Ring Road near NTR Stadium due to blown master fuse. Morning and evening walkers feel unsafe.',
    category: 'Street Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
    location: {
      latitude: 16.3190,
      longitude: 80.4210,
      address: 'Pattabhipuram Main Ring Road, near Gujjanagundla Junction',
      landmark: 'Near NTR Stadium West Enclosure Gate',
      ward: 'Ward 05 - Pattabhipuram',
      zone: 'Zone 2 - Guntur West',
      pincode: '522006'
    },
    citizen: {
      name: 'Lakshmi Prasanna',
      phone: '+91 94411 77889',
      email: 'lakshmi.p@example.com',
      anonymous: false
    },
    status: 'RESOLVED',
    aiAnalysis: {
      severity: 'HIGH',
      riskScore: 74,
      urgencyLevel: 'High Priority (<24h)',
      slaHours: 24,
      targetResolutionTime: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
      assignedDepartment: 'GMC Electrical & Street Lighting Division',
      detectedHazards: [
        'Zero-lux public zone on primary ring road during evening hours',
        'Pedestrian safety & transit vulnerability near stadium'
      ],
      recommendedEquipment: ['Hydraulic Scissor Lift Truck', 'LED Modular 150W Drivers', 'Circuit Continuity Tester'],
      estimatedCost: { min: 380, max: 750, currency: 'USD' },
      safetyPrecaution: 'De-energize main Pattabhipuram control panel prior to breaker replacement.',
      confidenceScore: 0.96,
      summaryReport: 'Dark zone along Pattabhipuram stadium corridor. Upgraded to HIGH priority.',
      analyzedAt: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
      engineVersion: 'CivicPulse-Vision-v3.4-GMC'
    },
    assignedCrew: {
      crewId: 'GMC-ELEC-03',
      teamLead: 'Lineman Jordan Bell',
      contactPhone: '+91 98493 22334',
      dispatchedAt: new Date(Date.now() - 86400 * 1000 * 1.5).toISOString(),
      etaMinutes: 0,
      status: 'COMPLETED'
    },
    workOrderRef: 'WO-2026-0415',
    timeline: [
      {
        action: 'Citizen Grievance Registered',
        by: 'Citizen (Lakshmi Prasanna)',
        timestamp: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
        note: 'Reported night-time lighting failure.',
        badgeColor: 'blue'
      },
      {
        action: 'AI Risk Scored',
        by: 'CivicPulse GMC Neural Engine',
        timestamp: new Date(Date.now() - 86400 * 1000 * 1.9).toISOString(),
        note: 'Classified HIGH (74/100). SLA 24h.',
        badgeColor: 'amber'
      },
      {
        action: 'Repair Completed & Verified',
        by: 'Lineman Jordan Bell',
        timestamp: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
        note: 'Replaced master 32A breaker and installed 6 new LED luminaires. Lux rating verified.',
        badgeColor: 'green'
      }
    ],
    resolutionProof: {
      resolvedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      resolvedBy: 'Lineman Jordan Bell (Badge GMC-ELEC-302)',
      beforeImageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
      resolutionNotes: 'All 6 luminaires in Pattabhipuram operational. 45 Lux achieved.',
      citizenFeedbackRating: 5
    },
    createdAt: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
  }
];

const seedWorkOrders = [
  {
    _id: 'wo_01',
    workOrderNumber: 'WO-2026-0419',
    complaintTicketId: 'CP-2026-9812',
    title: 'Emergency Asphalt Resurfacing & Deep Sub-Base Grouting - Lakshmipuram',
    department: 'GMC Roads & Highway Engineering Wing',
    priority: 'EMERGENCY',
    status: 'IN_EXECUTION',
    assignedContractor: {
      companyName: 'Guntur Infrastructure & Civil Works Ltd',
      leadEngineer: 'Marcus Vance',
      contact: '+91 98491 00234',
      teamSize: 5
    },
    siteLocation: {
      address: 'Lakshmipuram Main Road, near Hindu Pharmacy College',
      ward: 'Ward 04 - Lakshmipuram',
      coordinates: { latitude: 16.3125, longitude: 80.4280 }
    },
    scopeOfWork: [
      'Mill and saw-cut damaged asphalt perimeter (3.2m x 2.4m) on Lakshmipuram Road',
      'Excavate degraded wet sub-base aggregate to 20cm depth',
      'Apply quick-curing hydraulic aggregate base with vibro-compaction',
      'Apply hot polymer asphalt overlay and seal joints with rubberized bitumen'
    ],
    safetyChecklist: [
      { item: 'Deploy high-visibility Type-III traffic barricades on Lakshmipuram Road', verified: true },
      { item: 'Position dynamic LED arrow board 50m upstream', verified: true },
      { item: 'Personal Protective Equipment (Hardhats, Hi-Vis Class 3, Steel-toe boots)', verified: true },
      { item: 'Underground gas/telecom line clearance scanned with GMC utility map', verified: true }
    ],
    estimatedBudget: {
      labor: 450,
      materials: 550,
      machinery: 200,
      total: 1200,
      currency: 'USD'
    },
    issuedBy: {
      officerName: 'Dr. Aris Thorne',
      designation: 'Executive Engineer, GMC',
      badgeNumber: 'GMC-ENG-8821'
    },
    scheduledStart: new Date(Date.now() - 1800 * 1000).toISOString(),
    deadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    completedAt: null,
    createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1800 * 1000).toISOString()
  }
];

module.exports = {
  seedUsers,
  seedComplaints,
  seedWorkOrders
};
