import React, { useEffect, useState } from 'react';
import { db } from '../firebase.js'; 
import { collection, getDocs } from 'firebase/firestore';

const TestComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "recipes"));
        const docs = snapshot.docs.map(doc => doc.data());
        console.log('Fetched data:', docs);
        setData(docs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestComponent;
