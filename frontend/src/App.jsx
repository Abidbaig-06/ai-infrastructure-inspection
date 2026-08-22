import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ComplaintPortalPage } from './pages/ComplaintPortalPage';
import { InspectionWorkspacePage } from './pages/InspectionWorkspacePage';
import { TrackTicketPage } from './pages/TrackTicketPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { WorkOrdersPage } from './pages/WorkOrdersPage';
import { MeeBhoomiRegistryPage } from './pages/MeeBhoomiRegistryPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GrievanceProvider } from './context/GrievanceContext';
import { ROUTES } from './config/routes';

export const App = () => {
  return (
    <AuthProvider>
      <GrievanceProvider>
        <Routes>
          {/* Main INFRASPECTION Landing Portal */}
          <Route path={ROUTES.HOME} element={<LandingPage />} />

          {/* Citizen Public Issue Reporting Application */}
          <Route path={ROUTES.COMPLAINT_APP_URL} element={<ComplaintPortalPage />} />

          {/* Authorized Inspector / Officer Inspection Workspace */}
          <Route path={ROUTES.INSPECTOR_WORKSPACE} element={<InspectionWorkspacePage />} />

          {/* Public Ticket Tracking */}
          <Route path="/track/:ticketId" element={<TrackTicketPage />} />
          <Route path={ROUTES.TRACK_TICKET} element={<TrackTicketPage />} />

          {/* Mee Bhoomi Guntur Land & Infrastructure Registry */}
          <Route path={ROUTES.MEE_BHOOMI_REGISTRY} element={<MeeBhoomiRegistryPage />} />
          <Route path="/mee-bhoomi" element={<MeeBhoomiRegistryPage />} />
          <Route path="/land-assets" element={<MeeBhoomiRegistryPage />} />

          {/* Executive Analytics & Work Orders */}
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />

          {/* Direct Aliases for Navigation Convenience */}
          <Route path="/dashboard" element={<InspectionWorkspacePage />} />
          <Route path="/ai-agent" element={<InspectionWorkspacePage />} />
          <Route path="/login" element={<LandingPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </GrievanceProvider>
    </AuthProvider>
  );
};

export default App;
