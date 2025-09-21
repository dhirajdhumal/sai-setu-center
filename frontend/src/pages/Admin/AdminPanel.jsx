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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AuthContext from "../../context/authContext";

function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    requiredDocuments: "",
  });
  const [editingService, setEditingService] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services
  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services");
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        requiredDocuments: form.requiredDocuments
          .split(",")
          .map((doc) => doc.trim()),
      };

      if (editingService) {
        await api.put(`/services/${editingService.serviceId}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        await api.post(
          "/services",
          { ...payload, serviceId: Date.now().toString() },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }

      setForm({ title: "", description: "", requiredDocuments: "" });
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  const confirmDelete = (service) => {
    setSelectedService(service);
    setOpenDelete(true);
  };

  const handleDelete = async (serviceId) => {
    try {
      await api.delete(`/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setServices(services.filter((s) => s.serviceId !== serviceId));
      setOpenDelete(false);
      setSelectedService(null);
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const startEdit = (service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description,
      requiredDocuments: service.requiredDocuments.join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingService(null);
    setForm({ title: "", description: "", requiredDocuments: "" });
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        mb={3}
      >
        <Typography variant="h4" gutterBottom>
          Admin Panel – Manage Services
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/submitted-applications")}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          View Users Applications
        </Button>
      </Box>

      {/* Create/Edit Service Form */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          {editingService ? "Edit Service" : "Create New Service"}
        </Typography>
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
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingService ? "Update Service" : "Create Service"}
          </Button>
          {editingService && (
            <Button onClick={cancelEdit} sx={{ ml: 2 }}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      {/* Existing Services */}
      <Typography variant="h5" gutterBottom>
        Existing Services
      </Typography>
      <Grid container spacing={3}>
        {loadingServices ? (
          <CircularProgress />
        ) : (
          services.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.serviceId}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {s.description}
                  </Typography>
                  <Typography variant="subtitle2">
                    Required Documents
                  </Typography>
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
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => startEdit(s)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => confirmDelete(s)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Button to navigate to Submitted Applications */}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedService?.title}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(selectedService?.serviceId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;
