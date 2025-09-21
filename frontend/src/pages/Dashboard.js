// import React, { useContext, useEffect, useState } from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Box,
//   CardActions,
//   Button,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import AuthContext from "../context/authContext";

// function Dashboard() {
//   const [services, setServices] = useState([]);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const res = await api.get("/services");
//         setServices(res.data);
//       } catch (err) {
//         console.error("Error fetching services:", err);
//       }
//     };
//     fetchServices();
//   }, []);

//   return (
//     <Box mt={4}>
//       <Typography variant="h4" gutterBottom>
//         Available Services For You, {user.name}
//       </Typography>
//       <Grid container spacing={3}>
//         {services.map((s) => (
//           <Grid item xs={12} sm={6} md={4} key={s.serviceId}>
//             <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom>
//                   {s.title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" paragraph>
//                   {s.description}
//                 </Typography>
//                 <Typography variant="subtitle2">आवश्यक कागदपत्रे</Typography>
//                 <List dense>
//                   {s.requiredDocuments.map((doc, i) => (
//                     <ListItem key={i} sx={{ pl: 2 }}>
//                       <ListItemText primary={`• ${doc}`} />
//                     </ListItem>
//                   ))}
//                 </List>
//               </CardContent>
//               <CardActions>
//                 <Button
//                   size="small"
//                   variant="contained"
//                   onClick={() => navigate(`/apply/${s.serviceId}`)}
//                 >
//                   Apply Now
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

// export default Dashboard;




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

  // Atlassian-inspired card styles
  const cardStyles = {
    border: "1px solid #DFE1E6", // Subtle border
    borderRadius: "3px", // Sharper corners
    boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
    transition: "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
    height: "100%", // Ensure all cards in a row have the same height
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-2px)", // Lift effect on hover
      boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
    },
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Available Services For You, {user?.name || "User"}
      </Typography>
      <Grid container spacing={3}>
        {services.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.serviceId}>
            <Card sx={cardStyles}>
              <CardContent sx={{ flexGrow: 1 }}> {/* Makes content grow to push actions down */}
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {s.description}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "#5E6C84", // Atlassian subtle text color
                    textTransform: "uppercase",
                    mt: 2,
                    mb: 1,
                  }}
                >
                  {/* Changed from Marathi for UI consistency */}
                  आवश्यक कागदपत्रे
                </Typography>
                <List dense sx={{ p: 0 }}>
                  {s.requiredDocuments.map((doc, i) => (
                    <ListItem key={i} sx={{ py: 0.5, px: 0 }}>
                      <ListItemText 
                        primary={`• ${doc}`} 
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  onClick={() => navigate(`/apply/${s.serviceId}`)}
                  sx={{ textTransform: "none", fontWeight: "bold" }}
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