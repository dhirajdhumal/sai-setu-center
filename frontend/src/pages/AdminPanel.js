// src/pages/AdminPanel.js
import React, { useEffect, useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CardActions,
} from "@mui/material";
import api from "../services/api";
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from "../context/authContext";

function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", requiredDocuments: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services");
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await api.post(
        "/services",
        {
          serviceId: Date.now().toString(),
          title: form.title,
          description: form.description,
          requiredDocuments: form.requiredDocuments.split(",").map((doc) => doc.trim()),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setForm({ title: "", description: "", requiredDocuments: "" });
      fetchServices();
    } catch (err) {
      console.error("Error creating service:", err);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await api.delete(`/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setServices(services.filter((s) => s.serviceId !== serviceId));
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel – Manage Services
      </Typography>

      {/* Create Service Form */}
      <Box mb={3}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Required Documents (comma separated)"
          name="requiredDocuments"
          value={form.requiredDocuments}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mt: 2 }}>
          Create Service
        </Button>
      </Box>

      {/* Existing Services */}
      <Typography variant="h5" gutterBottom>
        Existing Services
      </Typography>
      <Grid container spacing={3}>
        {services.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.serviceId}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {s.description}
                </Typography>
                <Typography variant="subtitle2">Required Documents:</Typography>
                <List dense>
                  {s.requiredDocuments.map((doc, i) => (
                    <ListItem key={i} sx={{ pl: 2 }}>
                      <ListItemText primary={`• ${doc}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon = {<DeleteIcon />}
                  onClick={() => handleDelete(s.serviceId)}
                  >
                    Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminPanel;
