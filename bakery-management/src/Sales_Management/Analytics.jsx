import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Modal } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const billsCollection = collection(db, 'bills');
        const billsSnapshot = await getDocs(billsCollection);

        let fetchedData = [];
        let total = 0;

        for (const billDoc of billsSnapshot.docs) {
          const billData = billDoc.data();
          const orders = billData.orders || [];

          const aggregatedOrders = orders.reduce((acc, order) => {
            acc.names.push(order.name);
            acc.quantities.push(order.quantity);
            acc.amounts.push(order.amount);
            total += order.quantity * order.amount;
            return acc;
          }, { names: [], quantities: [], amounts: [] });

          fetchedData.push({
            id: billDoc.id,
            orders: orders,
            ...aggregatedOrders
          });
        }

        setData(fetchedData);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (bill) => {
    setSelectedBill(bill);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBill(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title to the PDF
    doc.text("Today Sales Analytics", 14, 16);

    // Add a table to the PDF
    doc.autoTable({
      head: [['Bill ID', 'Item Names', 'Quantities', 'Amounts']],
      body: data.map(item => [
        item.id,
        item.names.join(', '),
        item.quantities.join(', '),
        item.amounts.map((amount, idx) => `$${(amount * item.quantities[idx]).toFixed(2)}`).join(', ')
      ])
    });

    // Add total amount to the PDF
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

    // Save the PDF
    doc.save('analytics.pdf');
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '2rem', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#FFA726', mb: 2 }}>
        Today Sales Analytics
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error">{error}</Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              variant="contained" 
              sx={{ backgroundColor: '#1976d2', color: '#fff' }} 
              onClick={generatePDF}
            >
              Download PDF
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '1.1rem' }}>Bill ID</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>Item Names</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>Quantities</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>Amounts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <TableRow key={index} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.names.join(', ')}</TableCell>
                      <TableCell>{item.quantities.join(', ')}</TableCell>
                      <TableCell>
                        {item.amounts.map((amount, idx) => `$${(amount * item.quantities[idx]).toFixed(2)}`).join(', ')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total Amount: ${totalAmount.toFixed(2)}
      </Typography>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="bill-details-title"
        aria-describedby="bill-details-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          {selectedBill ? (
            <>
              <Typography id="bill-details-title" variant="h6" component="h2">
                Bill ID: {selectedBill.id}
              </Typography>
              {selectedBill.orders.map((order, idx) => (
                <Box key={idx} sx={{ mt: 2 }}>
                  <Typography>
                    <strong>Item Name:</strong> {order.name}
                  </Typography>
                  <Typography>
                    <strong>Quantity:</strong> {order.quantity}
                  </Typography>
                  <Typography>
                    <strong>Amount:</strong> ${order.amount.toFixed(2)}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> ${(order.quantity * order.amount).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </>
          ) : (
            <Typography>No bill selected.</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Analytics;
