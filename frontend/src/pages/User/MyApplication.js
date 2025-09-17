import React, { useEffect, useState } from 'react';
import { 
  Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Box, CircularProgress 
} from '@mui/material';
import api from '../../services/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications from server
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/applications/my'); // correct endpoint
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Get color for status chip
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Submitted': return 'primary';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                <TableCell align="right">Fees Paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map(app => (
                <TableRow key={app._id}>
                  <TableCell>
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{app.service?.title || 'N/A'}</TableCell>
                  <TableCell>{app.mobileNumber || '-'}</TableCell>

                  <TableCell>
                    <Chip label={app.status || 'N/A'} color={getStatusChipColor(app.status)} />
                  </TableCell>
                  <TableCell align="right">₹{app.service?.fees || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default MyApplications;
