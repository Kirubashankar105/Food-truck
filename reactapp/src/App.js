import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './components/public/Home';
import VendorList from './components/public/VendorList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VendorDashboard from './components/vendor/VendorDashboard';
import VendorProfile from './components/vendor/VendorProfile';
import ApplicationForm from './components/vendor/ApplicationForm';
import ApplicationStatus from './components/vendor/ApplicationStatus';
import AdminDashboard from './components/admin/AdminDashboard';
import VendorManagement from './components/admin/VendorManagement';
import ApplicationManagement from './components/admin/ApplicationManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/vendors" element={<VendorList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Vendor Protected Routes */}
              <Route 
                path="/vendor/dashboard" 
                element={
                  <ProtectedRoute requiredRole="ROLE_VENDOR">
                    <VendorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendor/profile" 
                element={
                  <ProtectedRoute requiredRole="ROLE_VENDOR">
                    <VendorProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendor/application" 
                element={
                  <ProtectedRoute requiredRole="ROLE_VENDOR">
                    <ApplicationForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendor/applications" 
                element={
                  <ProtectedRoute requiredRole="ROLE_VENDOR">
                    <ApplicationStatus />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Protected Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="ROLE_ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/vendors" 
                element={
                  <ProtectedRoute requiredRole="ROLE_ADMIN">
                    <VendorManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/applications" 
                element={
                  <ProtectedRoute requiredRole="ROLE_ADMIN">
                    <ApplicationManagement />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;