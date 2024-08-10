import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const IngredientAllocation = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [ingredientData, setIngredientData] = useState([]);

  useEffect(() => {
    const fetchIngredientData = async () => {
      if (!selectedDate) return;

      try {
        const dailyProductionRef = doc(db, 'daily_production', selectedDate);
        const dailyProductionSnap = await getDoc(dailyProductionRef);

        if (dailyProductionSnap.exists()) {
          const dailyProductionData = dailyProductionSnap.data();
          const ingredientsNeeded = {};

          const recipeFetchPromises = Object.keys(dailyProductionData).map(async key => {
            if (key.startsWith('recipe_')) {
              const item = dailyProductionData[key];
              const recipeName = item.recipe;

              const recipeRef = doc(db, 'recipes', recipeName);
              const recipeSnap = await getDoc(recipeRef);

              if (recipeSnap.exists()) {
                const recipeData = recipeSnap.data();
                const recipeIngredients = recipeData.ingredients;

                if (!Array.isArray(recipeIngredients)) {
                  console.error(`Invalid ingredients format for recipe ${recipeName}. Expected an array.`);
                  return;
                }

                for (const ingredient of recipeIngredients) {
                  const ingredientName = ingredient.name;
                  const ingredientAmountPerUnit = parseFloat(ingredient.qty);
                  const itemAmount = parseFloat(item.amount);

                  if (isNaN(ingredientAmountPerUnit) || isNaN(itemAmount)) {
                    console.error(`Invalid ingredient amount for ${ingredientName} in recipe ${recipeName}.`);
                    continue;
                  }

                  const ingredientAmount = ingredientAmountPerUnit * itemAmount;

                  if (!ingredientsNeeded[ingredientName]) {
                    ingredientsNeeded[ingredientName] = 0;
                  }

                  ingredientsNeeded[ingredientName] += ingredientAmount;
                }
              } else {
                console.error(`Recipe document ${recipeName} does not exist.`);
              }
            }
          });

          await Promise.all(recipeFetchPromises);

          const formattedIngredientData = Object.keys(ingredientsNeeded).map(ingredientName => ({
            name: ingredientName,
            amount: ingredientsNeeded[ingredientName]
          }));

          setIngredientData(formattedIngredientData);
        } else {
          console.log('No data available for the selected date.');
          setIngredientData([]);
        }
      } catch (error) {
        console.error('Error fetching ingredient data:', error);
      }
    };

    fetchIngredientData();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Ingredient', 'Amount Needed'];
    const tableRows = ingredientData.map(ingredient => [ingredient.name, ingredient.amount]);

    doc.text('Daily Ingredient Allocation', 14, 16);
    doc.text(`Date: ${selectedDate}`, 14, 22);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 26,
    });
    doc.save(`ingredient_allocation_${selectedDate}.pdf`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ color: '#fc9423' }}>Daily Ingredient Allocation</h1>
      <label htmlFor="datePicker" style={{ color: 'black' }}>Select Date: </label>
      <input
        type="date"
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
        style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}
      />
      <button onClick={downloadPDF} style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}>Download PDF</button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ width: '80%', borderCollapse: 'collapse', border: '1px solid #ddd', color: 'black' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#fc9423', color: 'white' }}>
              <th style={{ padding: '12px', fontWeight: 'bold', color: 'black' }}>Ingredient</th>
              <th style={{ padding: '12px', fontWeight: 'bold', color: 'black' }}>Amount Needed</th>
            </tr>
          </thead>
          <tbody>
            {ingredientData.map((ingredient, index) => (
              <tr key={index} style={{ backgroundColor: '#f5f5f5', padding: '12px' }}>
                <td style={{ padding: '12px', color: 'black' }}>{ingredient.name}</td>
                <td style={{ padding: '12px', color: 'black' }}>{ingredient.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientAllocation;
