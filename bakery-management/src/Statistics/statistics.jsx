import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path to match your project structure
import html2canvas from 'html2canvas'; // Import html2canvas for download functionality
import jsPDF from 'jspdf'; // Import jspdf for PDF generation

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const Statistics = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [productionData, setProductionData] = useState([]);

  useEffect(() => {
    const fetchInventoryData = async () => {
      const inventoryCollection = collection(db, 'inventory');
      const inventorySnapshot = await getDocs(inventoryCollection);
      const inventoryItems = inventorySnapshot.docs.map(doc => ({
        name: doc.id,
        ...doc.data()
      }));
      setInventoryData(inventoryItems);
    };

    const fetchProductionData = async () => {
      const productionCollection = collection(db, 'daily_production');
      const productionSnapshot = await getDocs(productionCollection);
      const productionItems = productionSnapshot.docs.map(doc => ({
        date: doc.id,
        ...doc.data()
      }));
      setProductionData(productionItems);
    };

    fetchInventoryData();
    fetchProductionData();
  }, []);

  // Prepare data for the Inventory Bar Chart
  const inventoryLabels = inventoryData.map(item => item.name);
  const inventoryAmounts = inventoryData.map(item => item.amount);

  const inventoryChartData = {
    labels: inventoryLabels,
    datasets: [
      {
        label: 'Inventory Amount',
        data: inventoryAmounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  // Prepare data for the Daily Production Line Chart
  const productionLabels = productionData.map(item => item.date);
  const recipeNames = [...new Set(productionData.flatMap(item => Object.keys(item).filter(key => key.startsWith('recipe_'))))];

  const productionChartData = {
    labels: productionLabels,
    datasets: recipeNames.map((recipe, index) => ({
      label: recipe,
      data: productionLabels.map(date => {
        const productionItem = productionData.find(item => item.date === date);
        return productionItem ? (productionItem[recipe]?.amount || 0) : 0;
      }),
      borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
      backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`,
      fill: false
    }))
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const handleDownload = async () => {
    const chartContainer = document.getElementById('chartContainer'); // Get the container of the charts

    try {
      const canvas = await html2canvas(chartContainer); // Capture the charts as a canvas element
      const imgData = canvas.toDataURL('image/png'); // Get the image data URL

      const doc = new jsPDF(); // Create a new jsPDF document
      const imgProps = doc.getImageProperties(imgData); // Get image dimensions
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Add the image to the PDF
      doc.save('statistics.pdf'); // Save the PDF
    } catch (error) {
      console.error('Error downloading chart:', error);
    }
  };

  return (
    <div style={{ padding: '16px' }} id="chartContainer"> {/* Add id to the container */}

      <div style={{ marginBottom: '100px', height: '300px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '50%' }}>
          <h3 style={{ color: '#3498db' }}>Inventory</h3> 
          <Bar data={inventoryChartData} options={options} />
        </div>
      </div>

      <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '50%' }}>
          <h3 style={{ color: '#e74c3c' }}>Daily Production</h3> 
          <Line data={productionChartData} options={options} />
        </div>
      </div>

      <button onClick={handleDownload} style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Download Chart
      </button>
    </div>
  );
};

export default Statistics;