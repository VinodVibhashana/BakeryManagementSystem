import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firebase config

const SalesForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch item IDs from the 'price' collection
    const fetchItemIds = async () => {
      try {
        const querySnapshot = await db.collection('price').get();
        const itemIds = querySnapshot.docs.map(doc => doc.id);
        setItems(itemIds);
      } catch (error) {
        console.error('Error fetching item IDs:', error);
      }
    };

    fetchItemIds();
  }, []);

  const handleItemChange = (e) => {
    const selectedItem = e.target.value;
    setSelectedItem(selectedItem);
    
    // Reset total if the selected item changes
    setTotal(0);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
    
    // Calculate total based on selected item price and new quantity
    const selectedItemPrice = items.find(item => item.id === selectedItem)?.price || 0;
    const newTotal = selectedItemPrice * newQuantity;
    setTotal(newTotal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Store sales data in Firestore
      await db.collection('sales').add({
        item: selectedItem,
        quantity: quantity,
        total: total,
        timestamp: new Date()
      });
      // Reset form fields
      setSelectedItem('');
      setQuantity(1);
      setTotal(0);
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#fc9423' }}>New Sale</h1>
      <label htmlFor="itemSelect">Select Item:</label>
      <select id="itemSelect" value={selectedItem} onChange={handleItemChange} style={{ margin: '10px', padding: '8px' }}>
        <option value="">Select an item</option>
        {items.map(itemId => (
          <option key={itemId} value={itemId}>{itemId}</option>
        ))}
      </select>
      <br />
      <label htmlFor="quantityInput">Quantity:</label>
      <input type="number" id="quantityInput" value={quantity} onChange={handleQuantityChange} style={{ margin: '10px', padding: '8px' }} />
      <br />
      <p>Total: ${total}</p>
      <br />
      <button type="submit" style={{ backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer' }}>Record Sale</button>
    </form>
  );
};

export default SalesForm;
