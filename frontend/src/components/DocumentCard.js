import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const DocumentCard = ({ service }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {/* Display the icon passed from the service object */}
                    {service.icon}
                    <Typography variant="h6" component="div" sx={{ ml: 1.5 }}>
                        {service.name}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Documents required:
                </Typography>
                <List dense>
                    {service.docs.map((doc, index) => (
                        <ListItem key={index} disableGutters>
                            <ListItemIcon sx={{ minWidth: '32px' }}>
                                <CheckCircleOutlineIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={doc} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default DocumentCard;