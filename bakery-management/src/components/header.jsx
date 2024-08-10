import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = ({ title }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDashboardClick = () => {
    navigate('/dashboard'); // Navigate to the dashboard route
  };

  return ( 
    <div style={{ backgroundColor: '#fc9423', padding: '10px 20px', textAlign: 'center', width: '100vw', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 'auto' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '40px' }} />
      </div>
      <h2 style={{ marginLeft: '-150px', color: 'white', flexGrow: 1 }}>{title}</h2>
      <div style={{ marginLeft: 'auto' }}> 
        <button onClick={handleDashboardClick} style={{ padding: '8px 16px', backgroundColor: 'white', color: '#fc9423', border: 'none', borderRadius: '4px', cursor: 'pointer',marginRight:'60px' }}>
          Dashboard
        </button>
      </div> 
    </div>
  );
};

export default Header;