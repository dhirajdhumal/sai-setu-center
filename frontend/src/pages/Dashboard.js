import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../context/authContext";

// Import the new CSS file
import "./Dashboard.css";

function Dashboard() {
  const [services, setServices] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    // Use className for the main container
    <div className="dashboard-container">
      <Typography variant="h4" gutterBottom className="dashboard-title">
        Available Services For You, {user?.name}
      </Typography>
      <Grid container spacing={4}>
        {services.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.serviceId}>
            {/* Use className on the Card */}
            <Card className="service-card">
              <CardContent className="card-content">
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {s.description}
                </Typography>
                <Typography variant="subtitle2">आवश्यक कागदपत्रे</Typography>
                <List dense className="document-list">
                  {s.requiredDocuments.map((doc, i) => (
                    <ListItem key={i} sx={{ py: 0.5, px: 2 }}>
                      <ListItemText primary={`• ${doc}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              {/* Use className on CardActions */}
              <CardActions className="card-actions">
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(`/apply/${s.serviceId}`)}
                >
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Dashboard;