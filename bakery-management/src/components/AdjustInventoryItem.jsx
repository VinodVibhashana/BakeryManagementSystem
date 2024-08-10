import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AdjustInventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [addAmount, setAddAmount] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'inventory', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem(docSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching inventory item:', error);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddAmountChange = (e) => {
    setAddAmount(Number(e.target.value));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'inventory', id);
      const newAmount = item.amount + addAmount;
      await updateDoc(docRef, { amount: newAmount, lastUpdated: new Date() });
      navigate('/currentinventory');
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#fc9423' }}>Restock Item: {id}</h1>
      <div style={{ marginBottom: '20px' }}>
        <strong>Current Amount:</strong> {item.amount}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Amount to Add:</strong>
          <input
            type="number"
            value={addAmount}
            onChange={handleAddAmountChange}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>
      <button
        onClick={handleSave}
        style={{
          padding: '12px 24px',
          backgroundColor: '#fc9423',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Save
      </button>
    </div>
  );
};

export default AdjustInventoryItem;
