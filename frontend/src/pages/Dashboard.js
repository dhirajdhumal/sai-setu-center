import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../context/authContext";

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
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Available Services For You, {user.name}
      </Typography>
      <Grid container spacing={3}>
        {services.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.serviceId}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {s.description}
                </Typography>
                <Typography variant="subtitle2">आवश्यक कागदपत्रे</Typography>
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
    </Box>
  );
  
}

export default Dashboard;
