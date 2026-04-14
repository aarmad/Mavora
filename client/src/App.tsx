import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing   from './pages/Landing';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services  from './pages/Services';
import VIPCard   from './pages/VIPCard';
import Profile   from './pages/Profile';

import AdminLayout   from './pages/admin/AdminLayout';
import AdminUsers    from './pages/admin/AdminUsers';
import AdminServices from './pages/admin/AdminServices';
import AdminRequests from './pages/admin/AdminRequests';
import AdminCodes    from './pages/admin/AdminCodes';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<Landing />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/services" element={
            <ProtectedRoute><Services /></ProtectedRoute>
          } />
          <Route path="/carte-vip" element={
            <ProtectedRoute><VIPCard /></ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/utilisateurs" replace />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
            <Route path="services"     element={<AdminServices />} />
            <Route path="demandes"     element={<AdminRequests />} />
            <Route path="codes"        element={<AdminCodes />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
