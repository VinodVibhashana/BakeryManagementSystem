import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);

      const itemsSnapshot = await getDocs(collection(db, "quantity"));
      const itemList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        quantity: doc.data().quantity,
      }));

      if (itemList.length === 0) {
        setError("No items found.");
      }

      setItems(itemList);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const handleRefresh = () => {
      fetchItems();
    };

    window.addEventListener("refreshItems", handleRefresh);

    return () => {
      window.removeEventListener("refreshItems", handleRefresh);
    };
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Item List", 14, 16);

    doc.autoTable({
      head: [["Item Name", "Quantity"]],
      body: items.map((item) => [item.id, item.quantity]),
    });

    doc.save("item-list.pdf");
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        sx={{ bgcolor: "#f4f4f4", height: "100%" }}
      >
        <Sidebar />
      </Grid>
      <Grid item xs={12} sm={9} md={10} lg={10}>
        <Box sx={{ padding: "2rem", overflow: "auto", height: "100%" }}>
          <Typography variant="h4" sx={{ color: "#FFA726", mb: 2 }}>
            Item List
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1976d2", color: "#fff", mr: 2 }} // Adjusted margin-right
              onClick={generatePDF}
            >
              Download PDF
            </Button>
          </Box>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.1rem" }}>Item Name</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>No items found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ItemPage;
