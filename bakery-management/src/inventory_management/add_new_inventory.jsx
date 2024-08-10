import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, setDoc, doc } from 'firebase/firestore';

const AddNewItem = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('pieces'); 
  const navigate = useNavigate();

  const units = ['pieces', 'grams', 'kilograms', 'liters', 'milliliters', 'cups', 'tablespoons', 'teaspoons','bottles']; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      alert('Name of the item cannot be empty');
      return;
    }

    try {
      await setDoc(doc(collection(db, 'inventory'), name), {
        amount: parseInt(amount),
        unit,
        lastUpdated: new Date(),
      });

      setName('');
      setAmount('');
      setUnit('pieces'); 
      alert('Item added successfully');
      navigate('/currentinventory');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding item');
    }
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    // Allow only positive values or empty string
    if (newAmount === '' || (newAmount >= 0 && !isNaN(newAmount))) {
      setAmount(newAmount);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#fc9423' }}>Add a New Item to Inventory</h1>
      <form onSubmit={handleSubmit}>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr style={{ backgroundColor: '#fc9423', color: 'white' }}>
              <th style={{ color: 'black', padding: '12px' }}>Name of Item</th>
              <th style={{ color: 'black', padding: '12px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: 'white', padding: '12px' }}>
              <td style={{ padding: '12px', color: 'black' }}> 
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ padding: '8px', width: '100%', backgroundColor: '#faddaf', color: 'black' }} // Apply color here
                />
              </td>
              <td style={{ padding: '12px', color: 'black' }}> 
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange} 
                  required
                  min="0" 
                  style={{ padding: '8px', marginRight: '8px', width: '60%', backgroundColor: '#faddaf', color: 'black' }} // Apply color here
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ padding: '8px', width: '30%', backgroundColor: '#faddaf', color: 'black' }} 
                >
                  {units.map((u) => (
                    <option key={u} value={u} style={{ color: 'black' }}>
                      {u}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save
        </button>
      </form>
    </div>
  );
};

export default AddNewItem;