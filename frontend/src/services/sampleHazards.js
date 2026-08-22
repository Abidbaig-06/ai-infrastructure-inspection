export const sampleHazards = [
  {
    id: 'sample-pothole',
    category: 'Road Hazard & Pothole',
    title: 'Severe 15cm Pothole on Lakshmipuram Main Road',
    description: 'Deep road crater with jagged asphalt edges on Lakshmipuram Main Road near Hindu Pharmacy College. Multiple vehicles and two-wheelers swerving into oncoming traffic causing near-miss collisions. Sub-base aggregate visibly eroded.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    ward: 'Ward 04 - Lakshmipuram Main Road & Hindu College',
    zone: 'Zone 2 - Guntur West',
    address: 'Lakshmipuram Main Road, near Hindu Pharmacy College',
    landmark: 'Opposite Union Bank of India Branch',
    pincode: '522007',
    latitude: 16.3125,
    longitude: 80.4280,
    badge: 'Lakshmipuram Pothole',
    inspectorName: 'Ramesh Kumar',
    inspectorRole: 'Field Inspector, GMC - Engineering Department',
    inspectionDate: '21 Aug 2026, 09:42 AM',
    submissionSource: 'Field Inspection App',
    isAnonymous: false,
    relatedComplaints: [
      {
        ticketId: 'CP-2026-7701',
        title: 'Water logging and pothole causing vehicle damage.',
        reporter: 'John D.',
        date: '20 Aug 2026, 08:15 AM',
        status: 'OPEN',
        statusColor: 'bg-red-950 text-red-300 border-red-800'
      },
      {
        ticketId: 'CP-2026-7332',
        title: 'Deep pothole on main road, difficult for commuters.',
        reporter: 'Priya S.',
        date: '18 Aug 2026, 11:03 AM',
        status: 'IN PROGRESS',
        statusColor: 'bg-amber-950 text-amber-300 border-amber-800'
      }
    ]
  },
  {
    id: 'sample-water',
    category: 'Water Leak & Sewage',
    title: 'High-Pressure Water Main Burst in Brodipet',
    description: 'Underground municipal drinking water pipeline ruptured at high pressure along Brodipet 4th Line. Water is flooding commercial shop entrances and eroding road foundation near Guntur Railway Station.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    ward: 'Ward 02 - Brodipet Main Commercial & 4th Line',
    zone: 'Zone 1 - Central Guntur',
    address: 'Brodipet 4th Line, Main Commercial Avenue',
    landmark: 'Near Guntur Railway Station East Gate',
    pincode: '522002',
    latitude: 16.3080,
    longitude: 80.4420,
    badge: 'Brodipet Water Burst',
    inspectorName: 'Insp. Kenneth Cole',
    inspectorRole: 'Superintendent, GMC Water Works Wing',
    inspectionDate: '21 Aug 2026, 11:15 AM',
    submissionSource: 'Citizen Water Portal',
    isAnonymous: false,
    relatedComplaints: [
      {
        ticketId: 'CP-2026-8104',
        title: 'Drinking water gushing out onto Brodipet commercial street.',
        reporter: 'Ananya C.',
        date: '21 Aug 2026, 10:20 AM',
        status: 'IN PROGRESS',
        statusColor: 'bg-amber-950 text-amber-300 border-amber-800'
      },
      {
        ticketId: 'CP-2026-7992',
        title: 'Low tap pressure and roadway flooding near station.',
        reporter: 'Venkatesh K.',
        date: '21 Aug 2026, 09:40 AM',
        status: 'OPEN',
        statusColor: 'bg-red-950 text-red-300 border-red-800'
      }
    ]
  },
  {
    id: 'sample-wire',
    category: 'Electrical & Live Wire',
    title: 'Exposed High-Voltage Cable Near Arundelpet Rythu Bazaar',
    description: 'Thunderstorm snapped overhead support arm. 440V line dangling within arm reach above pedestrian walkway right near Arundelpet Rythu Bazaar entrance.',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    ward: 'Ward 01 - Arundelpet Central & Rythu Bazaar',
    zone: 'Zone 1 - Central Guntur',
    address: '12th Line Arundelpet, near Rythu Bazaar',
    landmark: 'Adjacent to Municipal High School Playground',
    pincode: '522002',
    latitude: 16.3040,
    longitude: 80.4480,
    badge: 'Arundelpet Live Wire',
    inspectorName: 'Anonymous',
    inspectorRole: 'User information was not provided',
    inspectionDate: '21 Aug 2026, 12:30 PM',
    submissionSource: 'AI Anomaly Detection',
    isAnonymous: true,
    relatedComplaints: [
      {
        ticketId: 'CP-2026-9041',
        title: 'Sparking wire hanging low over market pedestrian path.',
        reporter: 'Suresh K.',
        date: '21 Aug 2026, 12:10 PM',
        status: 'OPEN',
        statusColor: 'bg-red-950 text-red-300 border-red-800'
      },
      {
        ticketId: 'CP-2026-8890',
        title: 'Snaped branch resting on electric cable near high school.',
        reporter: 'Anonymous Citizen',
        date: '21 Aug 2026, 11:55 AM',
        status: 'OPEN',
        statusColor: 'bg-red-950 text-red-300 border-red-800'
      }
    ]
  },
  {
    id: 'sample-waste',
    category: 'Waste & Garbage Dumping',
    title: 'Illegal Commercial Debris & Garbage near Old Guntur Bus Stand',
    description: 'Massive accumulation of commercial construction debris and domestic solid waste blocking the pedestrian footpath near Jinnah Tower Center.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    ward: 'Ward 08 - Old Guntur & Jinnah Tower Circle',
    zone: 'Zone 3 - Guntur East',
    address: 'Old Guntur Trunk Road, near RTC Old Bus Stand',
    landmark: 'Near Jinnah Tower Center Plaza',
    pincode: '522001',
    latitude: 16.2980,
    longitude: 80.4550,
    badge: 'Old Guntur Debris',
    inspectorName: 'Koteswara Rao',
    inspectorRole: 'Sanitation Supervisor, GMC East Zone',
    inspectionDate: '21 Aug 2026, 08:30 AM',
    submissionSource: 'Sanitation Inspection App',
    isAnonymous: false,
    relatedComplaints: [
      {
        ticketId: 'CP-2026-6540',
        title: 'Footpath blocked by packing crates and waste pile.',
        reporter: 'Manohar P.',
        date: '20 Aug 2026, 06:45 PM',
        status: 'IN PROGRESS',
        statusColor: 'bg-amber-950 text-amber-300 border-amber-800'
      },
      {
        ticketId: 'CP-2026-6412',
        title: 'Odor and road obstruction near Jinnah Tower.',
        reporter: 'Kishore B.',
        date: '20 Aug 2026, 04:20 PM',
        status: 'OPEN',
        statusColor: 'bg-red-950 text-red-300 border-red-800'
      }
    ]
  }
];
