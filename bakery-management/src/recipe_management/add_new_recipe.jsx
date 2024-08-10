import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const unitsOptions = ['Kg', 'Grams', 'Mg', 'Liter', 'ml', 'Per'];

const AddNewRecipe = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', qty: '', units: unitsOptions[0] }]);
  const [pieces, setPieces] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Righteous&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', qty: '', units: unitsOptions[0] }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (name.trim() === '' || description.trim() === '' || pieces.trim() === '') {
      alert('Please complete all fields.');
      return;
    }

    if (ingredients.some(ingredient => ingredient.name.trim() === '' || ingredient.qty.trim() === '' || ingredient.units === '')) {
      alert('Please complete all ingredient fields.');
      return;
    }

    if (ingredients.some(ingredient => isNaN(ingredient.qty) || Number(ingredient.qty) <= 0)) {
      alert('Quantity must be a positive number.');
      return;
    }

    if (/\d/.test(name) || ingredients.some(ingredient => /\d/.test(ingredient.name))) {
      alert('Recipe name and ingredient names cannot contain numbers.');
      return;
    }

    if (pieces === '' || isNaN(pieces) || Number(pieces) <= 0) {
      alert('Number of pieces must be a positive number.');
      return;
    }

    // Calculate ingredient quantities based on number of pieces
    const numPieces = Number(pieces);
    const updatedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      qty: (Number(ingredient.qty) / numPieces).toFixed(2), // Divide quantity and fix to 2 decimal places
    }));

    try {
      await setDoc(doc(collection(db, 'recipes'), name), {
        description,
        ingredients: updatedIngredients,
        lastUpdated: new Date(),
        pieces: numPieces,
      });

      // Clear form
      setName('');
      setDescription('');
      setIngredients([{ name: '', qty: '', units: unitsOptions[0] }]);
      setPieces('');

      // Notify user and navigate back
      alert('Recipe added successfully');
      navigate(-1); // Navigate to the previous page
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding recipe');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Righteous, sans-serif' }}>
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{
          width: '90%',
          maxWidth: '800px',
          border: '2px solid #fc9423',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#ffffff',
          overflowX: 'auto',
        }}>
          <h1 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif', textAlign: 'center' }}>Add a New Recipe</h1>
          <form onSubmit={handleSubmit} style={{ fontFamily: 'Righteous, sans-serif' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'black' }}>Name of Recipe</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ padding: '8px', width: '100%', backgroundColor: '#faddaf', color: 'black', fontFamily: 'Righteous, sans-serif' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif' }}>Ingredients</h2>
              {ingredients.map((ingredient, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Name of Ingredient"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      style={{ padding: '8px', flex: '1', backgroundColor: '#faddaf', color: 'black', fontFamily: 'Righteous, sans-serif' }}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={ingredient.qty}
                      onChange={(e) => handleIngredientChange(index, 'qty', e.target.value)}
                      style={{ padding: '8px', width: '80px', backgroundColor: '#faddaf', color: 'black', fontFamily: 'Righteous, sans-serif' }}
                    />
                    <select
                      value={ingredient.units}
                      onChange={(e) => handleIngredientChange(index, 'units', e.target.value)}
                      style={{ padding: '8px', width: '120px', backgroundColor: '#faddaf', color: 'black', fontFamily: 'Righteous, sans-serif' }}
                    >
                      {unitsOptions.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      style={{ backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', fontFamily: 'Righteous, sans-serif' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredient}
                style={{ marginTop: '10px', padding: '12px 24px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif' }}
              >
                Add Ingredient
              </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'black' }}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  padding: '8px',
                  width: '100%',
                  height: '100px',
                  backgroundColor: '#faddaf',
                  color: 'black',
                  fontFamily: 'Righteous, sans-serif',
                  resize: 'vertical',
                  whiteSpace: 'pre-wrap'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: 'black' }}>This Recipe is for</span>
              <input
                type="number"
                value={pieces}
                onChange={(e) => setPieces(e.target.value)}
                min="1"
                style={{ marginLeft: '10px', padding: '8px', width: '80px', backgroundColor: '#faddaf', color: 'black', fontFamily: 'Righteous, sans-serif' }}
              />
              <span style={{ marginLeft: '10px', color: 'black' }}>pieces of {name}</span>
            </div>
            <button
              type="submit"
              style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif' }}
            >
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddNewRecipe;
