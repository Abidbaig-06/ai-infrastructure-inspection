import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchComplaints,
  submitComplaint,
  updateComplaintStatus,
  assignFieldCrew,
  resolveComplaintTicket,
  fetchAnalytics,
  fetchWorkOrders,
  createWorkOrder
} from '../services/api';

const GrievanceContext = createContext(null);

export const GrievanceProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters for dashboard
  const [filters, setFilters] = useState({
    category: 'ALL',
    severity: 'ALL',
    status: 'ALL',
    ward: 'ALL',
    search: '',
    sortBy: 'risk' // 'risk' | 'date'
  });

  // Selected complaint for deep-dive AI inspection modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);

  // Load complaints & analytics — each request is independent so one failure
  // (e.g. analytics or work-orders) never wipes the complaints list.
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [compRes, anaRes, woRes] = await Promise.allSettled([
      fetchComplaints(filters),
      fetchAnalytics(),
      fetchWorkOrders()
    ]);

    if (compRes.status === 'fulfilled' && compRes.value?.success) {
      setComplaints(compRes.value.data);
    } else {
      console.error('Failed to load complaints:', compRes.reason || compRes.value);
      setError('Failed to sync grievances with municipal database');
    }
    if (anaRes.status === 'fulfilled' && anaRes.value?.success) setAnalytics(anaRes.value.data);
    else console.warn('Analytics load failed:', anaRes.reason || anaRes.value);
    if (woRes.status === 'fulfilled' && woRes.value?.success) setWorkOrders(woRes.value.data);
    else console.warn('Work orders load failed:', woRes.reason || woRes.value);

    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Citizen submit complaint
  const registerComplaint = async (formData) => {
    setLoading(true);
    try {
      const res = await submitComplaint(formData);
      if (res.success && res.data) {
        setComplaints(prev => [res.data, ...prev]);
        loadData(); // refresh aggregated stats
        return res.data;
      }
      throw new Error(res.message || 'Complaint registration failed');
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Officer updates status
  const updateStatus = async (id, status, note, officerName) => {
    try {
      const res = await updateComplaintStatus(id, { status, note, officerName });
      if (res.success && res.data) {
        setComplaints(prev => prev.map(c => c._id === id || c.ticketId === id ? res.data : c));
        if (selectedComplaint && (selectedComplaint._id === id || selectedComplaint.ticketId === id)) {
          setSelectedComplaint(res.data);
        }
        loadData();
        return res.data;
      }
    } catch (err) {
      console.error('Status update error:', err);
      throw err;
    }
  };

  // Dispatch crew
  const dispatchCrew = async (id, crewPayload, officerName) => {
    try {
      const res = await assignFieldCrew(id, { ...crewPayload, officerName });
      if (res.success && res.data) {
        setComplaints(prev => prev.map(c => c._id === id || c.ticketId === id ? res.data : c));
        if (selectedComplaint && (selectedComplaint._id === id || selectedComplaint.ticketId === id)) {
          setSelectedComplaint(res.data);
        }
        loadData();
        return res.data;
      }
    } catch (err) {
      console.error('Dispatch error:', err);
      throw err;
    }
  };

  // Resolve complaint
  const resolveComplaint = async (id, resolvePayload) => {
    try {
      const res = await resolveComplaintTicket(id, resolvePayload);
      if (res.success && res.data) {
        setComplaints(prev => prev.map(c => c._id === id || c.ticketId === id ? res.data : c));
        if (selectedComplaint && (selectedComplaint._id === id || selectedComplaint.ticketId === id)) {
          setSelectedComplaint(res.data);
        }
        loadData();
        return res.data;
      }
    } catch (err) {
      console.error('Resolve error:', err);
      throw err;
    }
  };

  // Generate Work Order
  const generateMaintenanceWorkOrder = async (orderPayload) => {
    try {
      const res = await createWorkOrder(orderPayload);
      if (res.success && res.data) {
        setWorkOrders(prev => [res.data, ...prev]);
        loadData();
        return res.data;
      }
    } catch (err) {
      console.error('Work order creation error:', err);
      throw err;
    }
  };

  const openAiInspector = (complaint) => {
    setSelectedComplaint(complaint);
    setIsAiModalOpen(true);
  };

  const openDispatch = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDispatchModalOpen(true);
  };

  const openWorkOrder = (complaint) => {
    setSelectedComplaint(complaint);
    setIsWorkOrderModalOpen(true);
  };

  return (
    <GrievanceContext.Provider
      value={{
        complaints,
        analytics,
        workOrders,
        loading,
        error,
        filters,
        setFilters,
        selectedComplaint,
        setSelectedComplaint,
        selectComplaint: setSelectedComplaint,
        isAiModalOpen,
        setIsAiModalOpen,
        isDispatchModalOpen,
        setIsDispatchModalOpen,
        isWorkOrderModalOpen,
        setIsWorkOrderModalOpen,
        openAiInspector,
        openDispatch,
        openWorkOrder,
        registerComplaint,
        updateStatus,
        dispatchCrew,
        resolveComplaint,
        generateMaintenanceWorkOrder,
        refreshData: loadData
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
};

export const useGrievance = () => {
  const context = useContext(GrievanceContext);
  if (!context) {
    throw new Error('useGrievance must be used within a GrievanceProvider');
  }
  return context;
};
