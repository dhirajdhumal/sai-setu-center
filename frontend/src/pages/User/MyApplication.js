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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../services/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch applications from server
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/my"); // correct endpoint
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const [form, setForm] = useState({
    mobileNumber: "",
  });

  // Get color for status chip
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const hasSubmitted = applications.some(app => app.status === "Submitted");


  const handleUpdate = async () => {
    try {
      const { _id } = editingApplication;
      const { data } = await api.put(`/applications/${_id}`, form);

      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app._id === _id ? data : app))
      );
      setEditingApplication(null);
    } catch (err) {
      console.error("Failed to update application:", err);
    }
  };

  const startEdit = (application) => {
    setEditingApplication(application);
    setForm({ mobileNumber: application.mobileNumber || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>

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
                <TableCell>Submittion Time</TableCell>
                <TableCell align="right">Fees Paid</TableCell>
                {hasSubmitted && <TableCell>Update Here</TableCell>}
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
                        if (!doc.filePath) return null; // skip if filePath is undefined

                        // Extract filename from path
                        const fileName = doc.filePath.split("/").pop();

                        return (
                          <ListItem key={i}>
                            <a
                              href={`/${doc.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {fileName} {/* Show only the filename */}
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
      {editingApplication && (
        <Box sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
          <Typography variant="h6">Edit Application</Typography>
          <TextField
            label="Mobile Number"
            value={form.mobileNumber}
            onChange={(e) => setForm({ mobileNumber: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
          <Button variant="text" onClick={() => setEditingApplication(null)}>
            Cancel
          </Button>
        </Box>
      )}
    </>
  );
};

export default MyApplications;
