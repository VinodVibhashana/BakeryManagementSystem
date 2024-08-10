// src/SalesManager/ReturnPage.jsx
import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';

const ReturnPage = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleItemNameChange = (event) => {
    setItemName(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: '#Faebd7' }}>
      <Box sx={{ flexGrow: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ color: '#FFA726', mb: 2 }}>
          Return
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Select
            value={itemName}
            onChange={handleItemNameChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Item name' }}
            sx={{ mr: 2, bgcolor: '#FFF', minWidth: 150 }}
          >
            <MenuItem value="" disabled>
              Item name
            </MenuItem>
            <MenuItem value="Item1">Item 1</MenuItem>
            <MenuItem value="Item2">Item 2</MenuItem>
            <MenuItem value="Item3">Item 3</MenuItem>
          </Select>
          <TextField
            value={quantity}
            onChange={handleQuantityChange}
            label="Quantity"
            variant="outlined"
            sx={{ bgcolor: '#FFF', minWidth: 100 }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2, ml:50 }}>
          <Button variant="contained" sx={{ bgcolor: '#FFA726' }}>
            Return
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReturnPage;
