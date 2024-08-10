import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { db } from '../firebase'; // Ensure correct path
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";

const OrderPage = () => {
  const [dateAndTime, setDateAndTime] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [telephoneNumberError, setTelephoneNumberError] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState({});
  const [amount, setAmount] = useState(15); // Default amount per item if no price found
  const [existingOrders, setExistingOrders] = useState([]);
  const [selectedExistingOrder, setSelectedExistingOrder] = useState(null);
  const [deletePhoneNumber, setDeletePhoneNumber] = useState("");
  const [fetchedOrders, setFetchedOrders] = useState([]);
  const [selectedOrderToDelete, setSelectedOrderToDelete] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching recipes...');
        
        // Fetch recipes
        const recipeSnapshot = await getDocs(collection(db, "recipes"));
        const recipeNames = recipeSnapshot.docs.map(doc => doc.id);
        console.log('Fetched recipe names:', recipeNames);

        // Fetch prices
        const priceMap = {};
        for (const recipeName of recipeNames) {
          const priceDocRef = doc(db, "price", recipeName);
          const priceDoc = await getDoc(priceDocRef);
          if (priceDoc.exists()) {
            priceMap[recipeName] = priceDoc.data().price;
          } else {
            console.warn(`Price not found for: ${recipeName}`);
          }
        }

        console.log('Fetched price data:', priceMap);
        
        // Set orders and prices
        setOrders(recipeNames);
        setPrices(priceMap);
        if (recipeNames.length > 0) {
          setSelectedOrder(recipeNames[0]); // Set default selection
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchExistingOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "order"));
        const ordersData = [];
        
        for (const orderDoc of ordersSnapshot.docs) {
          const subOrdersSnapshot = await getDocs(collection(db, "order", orderDoc.id, "subOrders"));
          for (const subOrderDoc of subOrdersSnapshot.docs) {
            ordersData.push({
              id: subOrderDoc.id,
              data: subOrderDoc.data(),
              parentId: orderDoc.id,
            });
          }
        }

        setExistingOrders(ordersData);
      } catch (error) {
        console.error('Error fetching existing orders:', error);
      }
    };

    fetchExistingOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setAmount(prices[selectedOrder] || 15); // Update amount based on selected order
    }
  }, [selectedOrder, prices]);

  const handleTelephoneNumberChange = (event) => {
    const enteredNumber = event.target.value;
    const isValid = /^0[0-9]{9}$/.test(enteredNumber); // Sri Lankan phone number format

    setTelephoneNumber(enteredNumber);
    setTelephoneNumberError(!isValid);
  };

  const handleSaveOrder = async () => {
    if (telephoneNumberError || !quantity || !dateAndTime || !selectedOrder) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const orderData = {
      orderName: selectedOrder,
      dateAndTime,
      telephoneNumber,
      quantity: parseFloat(quantity),
      amount,
      total: total.toFixed(2),
    };

    try {
      const parentDocRef = doc(db, "order", telephoneNumber);
      const subCollectionRef = collection(parentDocRef, "subOrders");
      await setDoc(doc(subCollectionRef), orderData); // Save order with auto-generated ID
      alert("Order saved successfully!");
      setDateAndTime("");
      setTelephoneNumber("");
      setQuantity("");
      setSelectedOrder("");
      setExistingOrders([...existingOrders, { id: telephoneNumber, data: orderData }]);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order.");
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletePhoneNumber || telephoneNumberError || !selectedOrderToDelete) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const parentDocRef = doc(db, "order", deletePhoneNumber);
      const subOrderQuery = query(collection(parentDocRef, "subOrders"), where("orderName", "==", selectedOrderToDelete));
      const subOrderSnapshot = await getDocs(subOrderQuery);

      if (!subOrderSnapshot.empty) {
        const subOrderDoc = subOrderSnapshot.docs[0];
        await deleteDoc(doc(db, "order", deletePhoneNumber, "subOrders", subOrderDoc.id));
        alert("Order deleted successfully!");
        setFetchedOrders(fetchedOrders.filter(order => order.id !== subOrderDoc.id));
        setSelectedOrderToDelete("");
      } else {
        alert("No matching order found.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

  const handleFetchOrders = async () => {
    if (!telephoneNumber || telephoneNumberError) {
      alert("Please enter a valid telephone number.");
      return;
    }

    try {
      const parentDocRef = doc(db, "order", telephoneNumber);
      const subOrdersSnapshot = await getDocs(collection(parentDocRef, "subOrders"));
      const ordersData = subOrdersSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }));

      setFetchedOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders.");
    }
  };

  // Calculate total based on quantity and amount
  const total = parseFloat(quantity) * amount;

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" sx={{ color: "#FFA726", mb: 2 }}>
        Order
      </Typography>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="order-select-label">Select Order</InputLabel>
          <Select
            labelId="order-select-label"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            fullWidth
          >
            {orders.map((orderName) => (
              <MenuItem key={orderName} value={orderName}>
                {orderName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "1.1rem" }}>Order Name</TableCell>
              <TableCell sx={{ fontSize: "1.1rem" }}>Time @ Date</TableCell>
              <TableCell sx={{ fontSize: "1.1rem" }}>TEL</TableCell>
              <TableCell sx={{ fontSize: "1.1rem" }}>Quantity</TableCell>
              <TableCell sx={{ fontSize: "1.1rem" }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{selectedOrder}</TableCell>
              <TableCell>
                <TextField
                  type="datetime-local"
                  value={dateAndTime}
                  onChange={(e) => setDateAndTime(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="tel"
                  value={telephoneNumber}
                  onChange={handleTelephoneNumberChange}
                  error={telephoneNumberError}
                  helperText={
                    telephoneNumberError
                      ? "Enter a valid Sri Lankan phone number (e.g., 07********)"
                      : ""
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </TableCell>
              <TableCell>
                {amount ? `${amount.toFixed(2)}/=` : "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}></TableCell>
              <TableCell sx={{ fontSize: "1.2rem", color: "#388E3C" }}>
                Total: {total ? `${total.toFixed(2)}/=` : "N/A"}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        sx={{ bgcolor: "#FFA726", mb: 2, mt: 2 }}
        onClick={handleSaveOrder}
      >
        Save Order
      </Button>
      <Typography variant="h6" sx={{ color: "#FFA726", mt: 2 }}>
        View Existing Orders
      </Typography>
      <Box sx={{ mb: 2, mt: 2 }}>
        <FormControl fullWidth>
          <TextField
            label="Enter Telephone Number"
            value={telephoneNumber}
            onChange={(e) => setTelephoneNumber(e.target.value)}
            error={telephoneNumberError}
            helperText={
              telephoneNumberError
                ? "Enter a valid Sri Lankan phone number (e.g., 07********)"
                : ""
            }
          />
        </FormControl>
        <Button
          variant="contained"
          sx={{ bgcolor: "#FFA726", mt: 2 }}
          onClick={handleFetchOrders}
        >
          Fetch Orders
        </Button>
      </Box>
      {fetchedOrders.length > 0 && (
        <>
          <Box sx={{ mb: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="existing-order-select-label">Select Order to Delete</InputLabel>
              <Select
                labelId="existing-order-select-label"
                value={selectedOrderToDelete}
                onChange={(e) => setSelectedOrderToDelete(e.target.value)}
                fullWidth
              >
                {fetchedOrders.map((order) => (
                  <MenuItem key={order.id} value={order.data.orderName}>
                    {order.data.orderName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="h6" sx={{ color: "#FFA726", mt: 2 }}>
            Delete Order
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              label="Telephone Number"
              value={deletePhoneNumber}
              onChange={(e) => setDeletePhoneNumber(e.target.value)}
              error={telephoneNumberError}
              helperText={
                telephoneNumberError
                  ? "Enter a valid Sri Lankan phone number (e.g., 07********)"
                  : ""
              }
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              sx={{ bgcolor: "#FFA726" }}
              onClick={handleDeleteOrder}
            >
              Delete
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default OrderPage;
