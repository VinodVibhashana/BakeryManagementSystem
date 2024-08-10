import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import jsPDF from 'jspdf'; 

const ProductionHistory = () => {
  const [productionData, setProductionData] = useState([]);
  const [editingDate, setEditingDate] = useState(null);
  const [editedQuantities, setEditedQuantities] = useState({});

  // Fetch production data from Firestore on component mount
  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'daily_production'));
        const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductionData(fetchedData);
      } catch (error) {
        console.error('Error fetching production data:', error);
      }
    };
    fetchProductionData();
  }, []);

  // Handle quantity change
  const handleQuantityChange = (e, recipe) => {
    setEditedQuantities(prev => ({
      ...prev,
      [recipe]: e.target.value
    }));
  };

  // Handle save
  const handleSave = async (date) => {
    try {
      const dateDocRef = doc(db, 'daily_production', date);
      const updates = Object.entries(editedQuantities).reduce((acc, [recipe, amount]) => {
        acc[`recipe_${recipe}`] = {
          recipe: recipe,
          amount: amount
        };
        return acc;
      }, {});

      await updateDoc(dateDocRef, updates);
      alert('Data updated successfully!');
      setEditingDate(null);
      setEditedQuantities({});
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data. Please try again.');
    }
  };

  // Function to generate and download PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    const tableData = [];

    // Add table header
    tableData.push(['Date', 'Product', 'Quantity', 'Actions']);

    // Add table data
    productionData.forEach(item => {
      const items = Object.keys(item)
        .filter(key => key.startsWith('recipe_'))
        .map(key => ({ recipe: item[key].recipe, amount: item[key].amount }));

      items.forEach(subItem => {
        tableData.push([item.id, subItem.recipe, subItem.amount, '']); // Add empty 'Actions' for PDF
      });
    });

    // AutoTable configuration
    doc.autoTable({
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
      startY: 20, // Start Y position of the table
      styles: {
        cellPadding: 5, // Cell padding
        fontSize: 10, // Font size
        textColor: '#000' // Text color
      }
    });

    // Save PDF
    doc.save('production_history.pdf');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#fc9423' }}>Production History</h1>
      <button onClick={downloadPdf} style={{ padding: '8px 16px', backgroundColor: '#fc5d23', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}>
        Download PDF
      </button>
      <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#fc9423', color: 'white' }}>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Date</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Product</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Quantity</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productionData.map((item) => {
            const items = Object.keys(item)
              .filter(key => key.startsWith('recipe_'))
              .map(key => ({ recipe: item[key].recipe, amount: item[key].amount }));

            const isEditable = new Date(item.id) >= new Date();

            return (
              <React.Fragment key={item.id}>
                {items.map((subItem, index) => (
                  <tr key={`${item.id}_${index}`} style={{ borderBottom: index === items.length - 1 ? '2px solid #ddd' : 'none' }}>
                    <td style={{ padding: '12px', color: 'black', backgroundColor: '#f5f5f5' }}>
                      {index === 0 ? item.id : ''}
                    </td>
                    <td style={{ padding: '12px', color: 'black', backgroundColor: '#f5f5f5' }}>{subItem.recipe}</td>
                    <td style={{ padding: '12px', color: 'black', backgroundColor: '#f5f5f5' }}>
                      {editingDate === item.id ? (
                        <input
                          type="number"
                          value={editedQuantities[subItem.recipe] || subItem.amount}
                          onChange={(e) => handleQuantityChange(e, subItem.recipe)}
                          min="1"
                          max="1000"
                          style={{ padding: '8px', width: '80%' }}
                        />
                      ) : (
                        subItem.amount
                      )}
                    </td>
                    {index === items.length - 1 && (
                      <td style={{ padding: '12px', color: 'black', backgroundColor: '#f5f5f5' }}>
                        {isEditable && (
                          <>
                            {editingDate === item.id ? (
                              <button
                                onClick={() => handleSave(item.id)}
                                style={{ padding: '8px 16px', backgroundColor: '#fc5d23', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingDate(item.id)}
                                style={{ padding: '8px 16px', backgroundColor: '#fc5d23', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Edit
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionHistory;