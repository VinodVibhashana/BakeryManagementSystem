// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';
import RecipeManagement from './recipe_management/all-recipes';
import AddNewRecipe from './recipe_management/add_new_recipe';
import AddNewInventory from './inventory_management/add_new_inventory';
import CurrentInventory from './inventory_management/current_inventory';
import DailyProductionInput from './Daily_Production/dailyproductionInput'; // Correct import
import DailyProductionHistory from './Daily_Production/productionHistory';
import IngredientsAllocation from './Ingredients_Allocation/ingredientsAllocation';
import Statistics from './Statistics/statistics';


import Header from './components/header';
import FullPageTable from './Sales_Management/FullPageTable';
import Analytics from './Sales_Management/Analytics';
import MainLayout from './Sales_Management/MainLayout';
import ReturnPage from './Sales_Management/ReturnPage';
import TestComponent from './Sales_Management/test';
import OrderPage from './Sales_Management/OrderPage';
import ItemPage from './Sales_Management/ItemPage'; // Correct import

// Define a map of titles for each route
const routeTitles = {
  '/': 'Login Page',
  '/dashboard': 'Dashboard',
  '/RecipeManagement': 'Recipe Management',
  '/recipe-list': 'Recipe List',
  '/recipe/:id': 'Recipe Details',
  '/currentinventory': 'Inventory',
  '/add_new_item': 'Add New Item',
  '/dailyproduction': 'Daily Production',
  '/dailyproductioninput': 'Daily Production Input',
  '/productionhistory': 'Production History',
  '/ingredientsAllocation': 'Ingredients Allocation',
  '/SalesManagement': 'Sales Management',
  '/SalesManagement/Orders': 'Orders',
  '/SalesManagement/Analytics': 'Analytics',
  '/SalesManagement/return': 'Return',
  '/itempage': 'Item Page', 
  '/Statistics/statistics': 'Statistics',
};

const App = () => {
  return (
    <BrowserRouter>
      <Header title={routeTitles[window.location.pathname] || ''} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/RecipeManagement" element={<RecipeManagement />} />
        <Route path="/add_new_recipe" element={<AddNewRecipe />} />
        <Route path="/currentinventory" element={<CurrentInventory />} />
        <Route path="/add_new_item" element={<AddNewInventory />} />
        <Route path="/dailyproductioninput" element={<DailyProductionInput />} />
        <Route path="/productionhistory" element={<DailyProductionHistory />} />
        <Route path="/ingredientsAllocation" element={<IngredientsAllocation />} />
        <Route path="/test" element={<TestComponent />} />
        <Route path="/itempage" element={<ItemPage />} /> {/* Add this line */}
        <Route path="/Statistics" element={<Statistics />} />

        {/* Sales Management routes */}
        <Route path="/SalesManagement" element={<MainLayout />}>
          <Route index element={<FullPageTable />} />
          <Route path="Orders" element={<OrderPage />} />
          <Route path="Analytics" element={<Analytics />} />
          <Route path="return" element={<ReturnPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
