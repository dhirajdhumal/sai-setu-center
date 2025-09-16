import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography,  List,
  ListItem,
  ListItemText, Box } from "@mui/material";
import api from "../services/api";

function Dashboard() {
  const [services, setServices] = useState([]);

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
        Available Services
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
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;
