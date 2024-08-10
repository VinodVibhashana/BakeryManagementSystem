import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [calculatedQuantities, setCalculatedQuantities] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    ingredients: [{ name: '', qty: '', units: 'Kg' }],
  });

  const unitsOptions = ['Kg', 'Grams', 'Mg', 'Liter', 'ml', 'Per'];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Righteous&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

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

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(selectedRecipe?.id === recipe.id ? null : recipe);
    setCalculatedQuantities({});
    setQuantity('');
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleCalculate = (recipeId) => {
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid number greater than 0');
      return;
    }

    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const updatedQuantities = recipe.ingredients.map(ingredient => ({
      ...ingredient,
      qty: (ingredient.qty * quantity).toFixed(2),
    }));
    setCalculatedQuantities(prev => ({ ...prev, [recipeId]: updatedQuantities }));
  };

  const handleEditClick = (recipe) => {
    setIsEditing(true);
    setEditForm({
      name: recipe.id,
      description: recipe.description,
      ingredients: recipe.ingredients,
    });
    setSelectedRecipe(recipe);
  };

  const handleInputChange = (e, index, field) => {
    const value = e.target.value;
    const newIngredients = [...editForm.ingredients];
    if (field === 'name' && /\d/.test(value)) {
      alert('Ingredient name cannot contain numbers');
      return;
    }
    if (field === 'qty' && isNaN(value)) {
      alert('Quantity must be a number');
      return;
    }
    newIngredients[index][field] = value;
    setEditForm({ ...editForm, ingredients: newIngredients });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = async () => {
    if (
      !editForm.name ||
      !editForm.description ||
      editForm.ingredients.some(ingredient => !ingredient.name || !ingredient.qty || !ingredient.units)
    ) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const recipeRef = doc(db, 'recipes', selectedRecipe.id);
      await updateDoc(recipeRef, {
        description: editForm.description,
        ingredients: editForm.ingredients,
      });
      setRecipes(recipes.map(recipe => (recipe.id === selectedRecipe.id ? { ...recipe, ...editForm } : recipe)));
      setIsEditing(false);
      setSelectedRecipe(null);
      alert('Recipe updated successfully');
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error updating recipe');
    }
  };

  const handleDelete = async (recipeId) => {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      alert('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Error deleting recipe');
    }
  };

  const handleAddIngredient = () => {
    setEditForm({
      ...editForm,
      ingredients: [...editForm.ingredients, { name: '', qty: '', units: 'Kg' }]
    });
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...editForm.ingredients];
    newIngredients.splice(index, 1);
    setEditForm({ ...editForm, ingredients: newIngredients });
  };

  const handleDownloadPDF = (recipe) => {
    const doc = new jsPDF();
    doc.setFont('Righteous', 'sans-serif');

    doc.text('Recipe Name: ' + recipe.id, 10, 10);
    doc.text('Description: ' + recipe.description, 10, 20);

    const ingredients = (calculatedQuantities[recipe.id] || recipe.ingredients).map((ingredient, index) => [
      (index + 1).toString(),
      ingredient.name,
      `${ingredient.qty} ${ingredient.units}`
    ]);

    doc.autoTable({
      head: [['#', 'Name', 'Quantity']],
      body: ingredients,
      startY: 30,
    });

    doc.save(`${recipe.id}.pdf`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Righteous, sans-serif' }}>
      <h1 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif' }}>All Recipes</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', width: '80%', marginLeft: 'auto', marginRight: 'auto', fontFamily: 'Righteous, sans-serif' }}>
        <Link to="/add_new_recipe" style={{ textDecoration: 'none', fontFamily: 'Righteous, sans-serif' }}>
          <button style={{ padding: '12px 24px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif' }}>
            Add New Recipe
          </button>
        </Link>
      </div>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%', fontFamily: 'Righteous, sans-serif' }}>
        <thead>
          <tr style={{ backgroundColor: '#fc9423', color: 'black', fontFamily: 'Righteous, sans-serif' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'Righteous, sans-serif' }}>Recipe Name</th>
            <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'Righteous, sans-serif' }}>Last Updated Date</th>
            <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'Righteous, sans-serif' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map(recipe => (
            <React.Fragment key={recipe.id}>
              <tr style={{ backgroundColor: '#f5f5f5', fontFamily: 'Righteous, sans-serif' }}>
                <td style={{ padding: '12px', textAlign: 'left', fontFamily: 'Righteous, sans-serif' }}>
                  <button
                    onClick={() => handleRecipeClick(recipe)}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#fc9423', fontFamily: 'Righteous, sans-serif', cursor: 'pointer', textAlign: 'left' }}
                  >
                    {recipe.id}
                  </button>
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontFamily: 'Righteous, sans-serif', color: 'black' }}>
                  {new Date(recipe.lastUpdated.seconds * 1000).toLocaleString()}
                </td>
                <td style={{ padding: '12px', textAlign: 'left', fontFamily: 'Righteous, sans-serif' }}>
                  <button
                    onClick={() => handleEditClick(recipe)}
                    style={{ backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', fontFamily: 'Righteous, sans-serif', cursor: 'pointer' }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    style={{ backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', fontFamily: 'Righteous, sans-serif', cursor: 'pointer', marginLeft: '10px' }}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
              {selectedRecipe?.id === recipe.id && (
                <tr>
                  <td colSpan="3" style={{ padding: '20px', backgroundColor: '#e0e0e0', color: 'black', fontFamily: 'Righteous, sans-serif', textAlign: 'left' }}>
                    {isEditing ? (
                      <div>
                        <div style={{ textAlign: 'center' }}>
                          <h2 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif', fontSize: '24px' }}>Edit Recipe</h2>
                        </div>
                        <h3 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif' }}>Ingredients</h3>
                        {editForm.ingredients.map((ingredient, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <input
                              type="text"
                              value={ingredient.name}
                              onChange={(e) => handleInputChange(e, index, 'name')}
                              placeholder="Ingredient Name"
                              style={{ marginRight: '10px', padding: '5px', fontFamily: 'Righteous, sans-serif' }}
                            />
                            <input
                              type="number"
                              value={ingredient.qty}
                              onChange={(e) => handleInputChange(e, index, 'qty')}
                              placeholder="Quantity"
                              style={{ marginRight: '10px', padding: '5px', fontFamily: 'Righteous, sans-serif' }}
                            />
                            <select
                              value={ingredient.units}
                              onChange={(e) => handleInputChange(e, index, 'units')}
                              style={{ marginRight: '10px', padding: '5px', fontFamily: 'Righteous, sans-serif' }}
                            >
                              {unitsOptions.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleRemoveIngredient(index)}
                              style={{ padding: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif' }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleAddIngredient}
                          style={{ padding: '10px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif', marginBottom: '20px' }}
                        >
                          Add Ingredient
                        </button>
                        <div>
                          <h4 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif' }}>Description</h4>
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleFormChange}
                            rows="4"
                            style={{ width: '100%', padding: '10px', fontFamily: 'Righteous, sans-serif' }}
                          />
                        </div>
                        <button
                          onClick={handleSave}
                          style={{ padding: '10px 20px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif', marginTop: '20px' }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ textAlign: 'center' }}>
                          <h2 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif', fontSize: '24px' }}>{recipe.id}</h2>
                        </div>
                        <h3 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif' }}>Ingredients</h3>
                        {recipe.ingredients && (calculatedQuantities[recipe.id] || recipe.ingredients).map((ingredient, index) => (
                          <div key={index} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span>{index + 1}. {ingredient.name}</span>
                              <span>{ingredient.qty} {ingredient.units}</span>
                            </div>
                          </div>
                        ))}
                        <h4 style={{ color: '#fc9423', fontFamily: 'Righteous, sans-serif' }}>Description</h4>
                        <p style={{ color: 'black', whiteSpace: 'pre-wrap' }}>{recipe.description}</p>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                          <p style={{ color: 'black' }}>This recipe makes one piece. Give me the recipe for:</p>
                          <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            placeholder="Enter quantity"
                            style={{ padding: '8px', fontFamily: 'Righteous, sans-serif' }}
                          />
                          <button
                            onClick={() => handleCalculate(recipe.id)}
                            style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif' }}
                          >
                            Show Recipe
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(recipe)}
                            style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Righteous, sans-serif' }}
                          >
                            Download as PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllRecipes;
