// src/dashboard.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleDailyProductionClick = () => {
    navigate('/dailyproductioninput'); // Ensure the path matches the route in App.jsx
  };

  const handleProductionHistoryClick = () => {
    navigate('/productionhistory'); // Ensure the path matches the route in App.jsx
  };

  const handleIngredientAllocationClick = () => {
    navigate('/ingredientsAllocation'); // Ensure the path matches the route in App.jsx
  };

  const handleNewSaleClick = () => {
    navigate('/SalesManagement'); // Ensure the path matches the route in App.jsx
  };

  const handleStatisticsClick = () => {
    navigate('/statistics'); // Ensure the path matches the route in App.jsx
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
      <button
        onClick={handleDailyProductionClick}
        style={{ width: '70%', marginBottom: '16px', padding: '12px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Daily Production
      </button>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <Link to="/recipemanagement" style={{ textDecoration: 'none' }}>
          <button style={{ width: '400px', padding: '12px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px' }}>
            View/Manage Recipes
          </button>
        </Link>

        <Link to="/currentinventory" style={{ textDecoration: 'none' }}>
          <button style={{ width: '400px', padding: '12px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px' }}>
            View Inventory
          </button>
        </Link>
      </div>

      <button
        onClick={handleProductionHistoryClick}
        style={{ width: '70%', marginBottom: '16px', padding: '12px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Production History
      </button>

      <button
        onClick={handleIngredientAllocationClick}
        style={{ width: '70%', marginBottom: '16px', padding: '12px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Ingredient Allocation
      </button>

      <button 
        onClick={handleNewSaleClick} 
        style={{ width: '70%', marginBottom: '16px', padding: '12px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px' }}>
        New Sale Order
      </button>

      <button 
        onClick={handleStatisticsClick} 
        style={{ width: '70%', padding: '12px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '16px' }}>
        Statistics
      </button>
    </div>
  );
};

export default Dashboard;
