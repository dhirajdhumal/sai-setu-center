import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  CircularProgress,
  TextField
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Apply() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [files, setFiles] = useState({});
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${serviceId}`);
        setService(data);
      } catch (err) {
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  // Handle file uploads
  const handleFileChange = (e, docName) => {
    setFiles(prev => ({ ...prev, [docName]: e.target.files[0] }));
  };

  // Submit application
  const handleSubmit = async () => {
  if (!mobileNumber.trim()) {
    alert("Please enter your mobile number");
    return;
  }

  const formData = new FormData();
  formData.append("service", service._id); // service ID
  formData.append("mobileNumber", mobileNumber); // just the number as string

  // Append files for remaining documents
  service.requiredDocuments.slice(1).forEach(doc => {
    if (files[doc]) formData.append(doc, files[doc]); // use formData, not mobileNumber
  });

  try {
    await api.post("/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Application submitted successfully!");
    navigate("/my-applications");
  } catch (err) {
    console.error("Error submitting application:", err.response || err);
    alert("Failed to submit application");
  }
};


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!service) return <Typography color="error">Service not found</Typography>;

  return (
    <Paper sx={{ p: 4, mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Apply for {service.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {service.description}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Upload Required Documents
      </Typography>
      <Grid container spacing={2}>
        {/* First field: Mobile Number */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {service.requiredDocuments[0]} (Enter Mobile Number)
          </Typography>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            value={mobileNumber}
            onChange={e => setMobileNumber(e.target.value)}
          />
        </Grid>

        {/* Remaining documents as file uploads */}
        {service.requiredDocuments.slice(1).map((doc, i) => (
          <Grid item xs={12} key={i}>
            <Typography variant="subtitle1">{doc}</Typography>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={e => handleFileChange(e, doc)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit Application
        </Button>
      </Box>
    </Paper>
  );
}

export default Apply;
