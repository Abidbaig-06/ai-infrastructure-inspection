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

  // Load complaints & analytics
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [compRes, anaRes, woRes] = await Promise.all([
        fetchComplaints(filters),
        fetchAnalytics(),
        fetchWorkOrders()
      ]);

      if (compRes.success) setComplaints(compRes.data);
      if (anaRes.success) setAnalytics(anaRes.data);
      if (woRes.success) setWorkOrders(woRes.data);
    } catch (err) {
      console.error('Error loading grievance data:', err);
      setError(err.message || 'Failed to sync with municipal database');
    } finally {
      setLoading(false);
    }
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
