import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import LabResultsPage from '@/pages/LabResultsPage';
import CarePlanPage from '@/pages/CarePlanPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import LoginPage from '@/pages/LoginPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lab-results" element={<LabResultsPage />} />
        <Route path="/care-plan" element={<CarePlanPage />} />
        <Route path="/profile/settings" element={<ProfileSettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
