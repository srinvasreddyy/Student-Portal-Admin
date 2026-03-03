import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CompanyAuth from './pages/CompanyAuth';
import UniversityAuth from './pages/UniversityAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import ProjectsView from './pages/dashboard/ProjectsView';
import ChatInterface from './pages/dashboard/ChatInterface';
import TalentSearch from './pages/dashboard/TalentSearch';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={<><Navbar /><main><Home /></main></>} />
          <Route path="/company/*" element={<><Navbar /><main><CompanyAuth /></main></>} />
          <Route path="/university/*" element={<><Navbar /><main><UniversityAuth /></main></>} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="projects" element={<ProjectsView />} />
              <Route path="talent" element={<TalentSearch />} />
              <Route path="chat" element={<ChatInterface />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
