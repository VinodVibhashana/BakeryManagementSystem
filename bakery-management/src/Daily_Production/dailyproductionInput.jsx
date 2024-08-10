import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const NewWebPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [rows, setRows] = useState([{ selectedRecipe: '', amount: '' }]);
  const [recipes, setRecipes] = useState([]);

  // Fetch recipes from Firestore on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const fetchedRecipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    try {
      const dateDocRef = doc(collection(db, 'daily_production'), selectedDate);
      const data = rows.reduce((acc, row, index) => {
        if (row.selectedRecipe && row.amount) {
          acc[`recipe_${index + 1}`] = {
            recipe: row.selectedRecipe,
            amount: row.amount,
          };
        }
        return acc;
      }, {});

      await setDoc(dateDocRef, data);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  // Function to handle adding a new row
  const addRow = () => {
    setRows([...rows, { selectedRecipe: '', amount: '' }]);
  };

  // Function to handle change in a specific row
  const handleRowChange = (index, field, value) => {
    const updatedRows = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  // Get the selected recipes to exclude from the dropdown options
  const selectedRecipes = rows.map(row => row.selectedRecipe);

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  // Function to handle button click next to date selector
  const handleDateButtonClick = () => {
    alert(`Selected Date: ${selectedDate}`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#fc9423', marginBottom: '90px' }}>Daily Production Plan</h1>
      <form onSubmit={handleSubmit} style={{ width: '80%', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          {/* Date input field */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today} // Set min attribute to today's date
            style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
          />
          {/* Button next to date selector */}
          <button
            type="button"
            onClick={handleDateButtonClick}
            style={{ padding: '10px 20px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Check Date
          </button>
        </div>
        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#fc9423', color: 'white' }}>
              <th style={{ padding: '12px', fontWeight: 'bold', color: 'black' }}>#</th>
              <th style={{ padding: '12px', fontWeight: 'bold', color: 'black' }}>Item Name</th>
              <th style={{ padding: '12px', fontWeight: 'bold', color: 'black' }}>Enter Quantity</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows */}
            {rows.map((row, index) => (
              <tr key={index} style={{ backgroundColor: '#f5f5f5', padding: '12px' }}>
                <td style={{ padding: '12px', color: 'black' }}>{index + 1}</td>
                <td style={{ padding: '12px', color: 'black' }}>
                  {/* Dropdown list to select recipe */}
                  <select
                    value={row.selectedRecipe}
                    onChange={(e) => handleRowChange(index, 'selectedRecipe', e.target.value)}
                    style={{ padding: '8px', width: '90%', backgroundColor: '#faddaf', color: 'black' }}
                  >
                    <option value="">Select Recipe</option>
                    {recipes
                      .filter(recipe => !selectedRecipes.includes(recipe.id) || recipe.id === row.selectedRecipe)
                      .map(recipe => (
                        <option key={recipe.id} value={recipe.id}>{recipe.id}</option>
                      ))}
                  </select>
                </td>
                <td style={{ padding: '12px', color: 'black' }}>
                  {/* Input field to input quantity */}
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
                    min="1"
                    max="1000"
                    style={{ padding: '8px', width: '90%', backgroundColor: '#faddaf', color: 'black' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row button */}
        <button
          type="button"
          onClick={addRow}
          style={{ display: 'block', margin: '20px auto', padding: '12px 24px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add New Item
        </button>
        {/* Submit button */}
        <button
          type="submit"
          style={{ display: 'block', margin: '90px auto', padding: '12px 24px', backgroundColor: '#fc5d23', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '250px' }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewWebPage;
