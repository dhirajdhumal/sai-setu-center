import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This is a common UX pattern.
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;