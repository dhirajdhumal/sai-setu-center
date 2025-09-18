import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../services/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]); // ✅ fetch services for dropdown
  const [editingApplication, setEditingApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    mobileNumber: "",
    service: "",
  });

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/my");
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch services (for dropdown)
  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services");
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchServices();
  }, []);

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Submitted":
        return "primary";
      case "In Progress":
        return "warning";
      case "Completed":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const hasSubmitted = applications.some((app) => app.status === "Submitted");

  // Start editing
  const startEdit = (application) => {
    setEditingApplication(application);
    setForm({
      mobileNumber: application.mobileNumber || "",
      service: application.service?._id || "", // ✅ store ID, not title
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingApplication(null);
    setForm({ mobileNumber: "", service: "" });
  };

  // Save changes
  const handleUpdate = async () => {
    try {
      const { _id } = editingApplication;
      const { data } = await api.put(`/applications/${_id}`, form);

      setApplications((prev) =>
        prev.map((app) => (app._id === _id ? data : app))
      );
      cancelEdit();
    } catch (err) {
      console.error("Failed to update application:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>

      {/* ✅ Edit Application Form (like AdminPanel style) */}
      {editingApplication && (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Edit Application
            </Typography>
            <TextField
              label="Mobile Number"
              value={form.mobileNumber}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, mobileNumber: e.target.value }))
              }
              fullWidth
              margin="normal"
            />

            <TextField
              select
              label="Service"
              value={form.service}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, service: e.target.value }))
              }
              fullWidth
              margin="normal"
            >
              {services.map((srv) => (
                <MenuItem key={srv._id} value={srv._id}>
                  {srv.title}
                </MenuItem>
              ))}
            </TextField>

            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
              <Button onClick={cancelEdit} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Applications Table */}
      {applications.length === 0 ? (
        <Typography>You have not submitted any applications yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application Date</TableCell>
                <TableCell>Service Name</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Submission Time</TableCell>
                <TableCell align="right">Fees Paid</TableCell>
                {hasSubmitted && <TableCell>Edit</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{app.service?.title || "N/A"}</TableCell>
                  <TableCell>{app.mobileNumber || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.status || "N/A"}
                      color={getStatusChipColor(app.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <List dense>
                      {(app.documents || []).map((doc, i) => {
                        if (!doc.filePath) return null;
                        const fileName = doc.filePath.split("/").pop();
                        return (
                          <ListItem key={i}>
                            <a
                              href={`/${doc.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {fileName}
                            </a>
                          </ListItem>
                        );
                      })}
                    </List>
                  </TableCell>
                  <TableCell>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell align="right">₹{app.service?.fees || 0}</TableCell>
                  <TableCell>
                    {app.status === "Submitted" && (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => startEdit(app)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyApplications;
