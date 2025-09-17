import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  List,
  ListItem,
} from "@mui/material";
import api from "../../services/api";
import AuthContext from "../../context/authContext";

function SubmittedApplications() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(
        `/applications/${appId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!applications || applications.length === 0) {
    return <Typography>No applications submitted yet.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Submitted Applications
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Submitted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell>{app.user?.name || "N/A"}</TableCell>
                <TableCell>{app.service?.title || "N/A"}</TableCell>
                <TableCell>{app.mobileNumber || "-"}</TableCell>
                <TableCell>
                  <Select
                    value={app.status || "Submitted"}
                    onChange={(e) =>
                      handleStatusChange(app._id, e.target.value)
                    }
                  >
                    <MenuItem value="Submitted">Submitted</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default SubmittedApplications;
