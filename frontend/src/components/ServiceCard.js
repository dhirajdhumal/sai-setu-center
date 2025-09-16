import React from 'react';
import { Card, CardContent, Typography, Button, CardActions, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Chip label={`Fees: ₹${service.fees}`} color="primary" sx={{ mb: 1 }} />
                <Typography gutterBottom variant="h5" component="div">
                    {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {service.description}
                </Typography>
                <Typography sx={{ mt: 2, mb: 1 }} variant="subtitle1">Required Documents:</Typography>
                <List dense>
                    {service.requiredDocuments.map((doc, index) => (
                        <ListItem key={index} disableGutters>
                            <ListItemIcon sx={{minWidth: '32px'}}>
                                <DescriptionIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={doc} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => navigate(`/apply/${service.serviceId}`)}
                >
                    Apply Now
                </Button>
            </CardActions>
        </Card>
    );
};

export default ServiceCard;