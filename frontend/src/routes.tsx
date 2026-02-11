import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import InfrastructurePage from './pages/InfrastructurePage';
import ChatPage from './pages/ChatPage';
import PipelineOverview from './pages/PipelineOverview';
import CodeQuality from './pages/CodeQuality';
import Security from './pages/Security';
import History from './pages/History';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes with Persistent Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pipeline" element={<PipelineOverview />} />
          <Route path="/quality" element={<CodeQuality />} />
          <Route path="/security" element={<Security />} />
          <Route path="/history" element={<History />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
