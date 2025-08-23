// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProfile from './pages/vendor/VendorProfile';
import VendorApplications from './pages/vendor/VendorApplications';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingUsers from './pages/admin/PendingUsers';
import AllVendors from './pages/admin/AllVendors';
import AllApplications from './pages/admin/AllApplications';
import PublicVendors from './pages/PublicVendors';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vendors" element={<PublicVendors />} />
              
              {/* Vendor Routes */}
              <Route 
                path="/vendor/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['ROLE_VENDOR']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendor/profile" 
                element={
                  <ProtectedRoute allowedRoles={['ROLE_VENDOR']}>
                    <VendorProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendor/applications" 
                element={
                  <ProtectedRoute allowedRoles={['ROLE_VENDOR']}>
                    <VendorApplications />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pending-users" 
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <PendingUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/vendors" 
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AllVendors />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/applications" 
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AllApplications />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;