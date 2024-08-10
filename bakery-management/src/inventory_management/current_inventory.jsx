import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Timestamp } from 'firebase/firestore';

const CurrentInventory = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'inventory'));
        const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleOpen = (item) => {
    setCurrentItem(item);
    setNewAmount(item.amount);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
    setNewAmount('');
  };

  const handleSave = async () => {
    try {
      const itemRef = doc(db, 'inventory', currentItem.id);
      await updateDoc(itemRef, { amount: newAmount, lastUpdated: Timestamp.now() });
      setItems(items.map(item => item.id === currentItem.id ? { ...item, amount: newAmount, lastUpdated: Timestamp.now() } : item));
      handleClose();
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Name of Item', 'Amount in Inventory', 'Last Updated Date'];
    const tableRows = items.map(item => [
      item.id,
      item.amount,
      item.lastUpdated instanceof Timestamp ? item.lastUpdated.toDate().toLocaleString() : 'N/A'
    ]);

    doc.text('Current Inventory', 14, 16);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 26,
    });
    doc.save('current_inventory.pdf');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#fc9423' }}>Current Inventory</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Link to="/add_new_item" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '12px 24px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add New Item
          </button>
        </Link>
        <button 
          onClick={downloadPDF} 
          style={{ padding: '12px 24px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '20px' }}>
          Download PDF
        </button>
      </div>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr style={{ backgroundColor: '#fc9423', color: 'white' }}>
            <th style={{ color: 'black', padding: '12px' }}>Name of Item</th>
            <th style={{ color: 'black', padding: '12px' }}>Amount in Inventory</th>
            <th style={{ color: 'black', padding: '12px' }}>Last Updated Date</th>
            <th style={{ color: 'black', padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ backgroundColor: '#f5f5f5', padding: '12px' }}>
              <td style={{ color: 'black', padding: '12px' }}>{item.id}</td>
              <td style={{ color: 'black', padding: '12px' }}>{item.amount}</td>
              <td style={{ color: 'black', padding: '12px' }}>
                {item.lastUpdated instanceof Timestamp ? item.lastUpdated.toDate().toLocaleString() : 'N/A'}
              </td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleOpen(item)}
                  style={{ marginRight: '8px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', padding: '6px' }}
                >
                  <AddIcon />
                </button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adjust Inventory
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Update the amount for {currentItem?.id}
          </Typography>
          <TextField
            label="New Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
          />
          <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px',backgroundColor: '#fc9423' }}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CurrentInventory;
