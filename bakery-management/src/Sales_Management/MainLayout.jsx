// src/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, padding: '2rem' }}>
        <Outlet /> {/* Renders child routes */}
      </Box>
    </Box>
  );
};

export default MainLayout;
