// src/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";

const Sidebar = () => {
  return (
    <List
      component="nav"
      sx={{ width: 200, bgcolor: "#FFA726", height: "100vh" }}
    >
      <ListItem
        button
        component={NavLink}
        to="/SalesManagement"
        end
        className={({ isActive }) => (isActive ? "active" : "")}
        sx={{
          "&.active": { backgroundColor: "#faedb7", color: "#FFF" },
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          "&:hover": { backgroundColor: "#faedb7", color: "#FFF" },
        }}
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem
        button
        component={NavLink}
        to="/SalesManagement/Orders"
        className={({ isActive }) => (isActive ? "active" : "")}
        sx={{
          "&.active": { backgroundColor: "#faedb7", color: "#FFF" },
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          "&:hover": { backgroundColor: "#faedb7", color: "#FFF" },
        }}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Order" />
      </ListItem>
      <ListItem
        button
        component={NavLink}
        to="/itempage" // Link to ItemPage
        className={({ isActive }) => (isActive ? "active" : "")}
        sx={{
          "&.active": { backgroundColor: "#faedb7", color: "#FFF" },
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          "&:hover": { backgroundColor: "#faedb7", color: "#FFF" },
        }}
      >
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Item" />
      </ListItem>
      <ListItem
        button
        component={NavLink}
        to="/SalesManagement/Analytics"
        className={({ isActive }) => (isActive ? "active" : "")}
        sx={{
          "&.active": { backgroundColor: "#faedb7", color: "#FFF" },
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          "&:hover": { backgroundColor: "#faedb7", color: "#FFF" },
        }}
      >
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Analytics" />
      </ListItem>
    </List>
  );
};

export default Sidebar;
