const API_BASE = '/api';

export const fetchComplaints = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/complaints?${query}`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchComplaints:', err);
    throw err;
  }
};

export const fetchComplaintByTicket = async (ticketId) => {
  try {
    const res = await fetch(`${API_BASE}/complaints/ticket/${ticketId}`);
    if (!res.ok) throw new Error('Failed to fetch ticket');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchComplaintByTicket:', err);
    throw err;
  }
};

export const submitComplaint = async (complaintData) => {
  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData)
    });
    if (!res.ok) throw new Error('Failed to submit complaint');
    return await res.json();
  } catch (err) {
    console.error('API Error submitComplaint:', err);
    throw err;
  }
};

export const updateComplaintStatus = async (id, statusData) => {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  } catch (err) {
    console.error('API Error updateComplaintStatus:', err);
    throw err;
  }
};

export const assignFieldCrew = async (id, crewData) => {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/assign-crew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crewData)
    });
    if (!res.ok) throw new Error('Failed to assign crew');
    return await res.json();
  } catch (err) {
    console.error('API Error assignFieldCrew:', err);
    throw err;
  }
};

export const resolveComplaintTicket = async (id, resolveData) => {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resolveData)
    });
    if (!res.ok) throw new Error('Failed to resolve complaint');
    return await res.json();
  } catch (err) {
    console.error('API Error resolveComplaintTicket:', err);
    throw err;
  }
};

export const fetchAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchAnalytics:', err);
    throw err;
  }
};

export const fetchWorkOrders = async () => {
  try {
    const res = await fetch(`${API_BASE}/work-orders`);
    if (!res.ok) throw new Error('Failed to fetch work orders');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchWorkOrders:', err);
    throw err;
  }
};

export const createWorkOrder = async (orderData) => {
  try {
    const res = await fetch(`${API_BASE}/work-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to create work order');
    return await res.json();
  } catch (err) {
    console.error('API Error createWorkOrder:', err);
    throw err;
  }
};

export const loginOfficer = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid login credentials');
    return data;
  } catch (err) {
    console.error('API Error loginOfficer:', err);
    throw err;
  }
};

export const registerOfficer = async (userData) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (err) {
    console.error('API Error registerOfficer:', err);
    throw err;
  }
};

export const fetchDemoOfficers = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/demo-officers`);
    if (!res.ok) throw new Error('Failed to fetch demo officers');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchDemoOfficers:', err);
    throw err;
  }
};

// AI Infrastructure Inspection & Maintenance Agent Endpoints
export const inspectInfrastructureAI = async (inspectionData) => {
  try {
    const res = await fetch(`${API_BASE}/ai-agent/inspect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inspectionData)
    });
    if (!res.ok) throw new Error('Inspection agent inference failed');
    return await res.json();
  } catch (err) {
    console.error('API Error inspectInfrastructureAI:', err);
    throw err;
  }
};

export const fetchPrioritizedPlan = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/ai-agent/prioritize?${query}`);
    if (!res.ok) throw new Error('Failed to fetch maintenance prioritization plan');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchPrioritizedPlan:', err);
    throw err;
  }
};

export const fetchAssetHistory = async (assetId) => {
  try {
    const res = await fetch(`${API_BASE}/ai-agent/history/${assetId}`);
    if (!res.ok) throw new Error('Failed to fetch asset maintenance history');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchAssetHistory:', err);
    throw err;
  }
};

export const fetchAllAssets = async () => {
  try {
    const res = await fetch(`${API_BASE}/ai-agent/assets`);
    if (!res.ok) throw new Error('Failed to fetch infrastructure assets');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchAllAssets:', err);
    throw err;
  }
};

