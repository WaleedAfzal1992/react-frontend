import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BlogList from './components/BlogList';
import BlogCreate from './components/BlogCreate';
import BlogDetail from './components/BlogDetail';
import BlogUpdate from './components/BlogUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <NavbarWrapper /> {/* Wrapping Navbar rendering logic */}
      
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <BlogCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog-list"
          element={
            <ProtectedRoute>
              <BlogList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <BlogDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-blog/:id"
          element={
            <ProtectedRoute>
              <BlogUpdate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

// NavbarWrapper component that conditionally renders the Navbar based on the route
const NavbarWrapper = () => {
  const location = useLocation();

  // Don't show Navbar on login or register page
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null; // Don't render Navbar
  }

  return <Navbar />; // Render Navbar for other pages
};


export default App;
