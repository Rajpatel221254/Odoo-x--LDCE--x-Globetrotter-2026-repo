import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/authentication/pages/login.jsx';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/sign up" element={<Login />} />
      <Route path="/sign-up" element={<Login />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AllRoutes;
