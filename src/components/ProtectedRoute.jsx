import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
        // 1. Check strict role match if "ADMIN" is required
        // Note: Backend strictly checks "ROLE_ADMIN" or authorities.
        // Frontend storedRole might be "ADMIN" or "USER" from Login.jsx logic.

        // Normalize logic: Login.jsx stores "ADMIN" or "USER".
        // So we check against that.

        if (requiredRole === 'ADMIN' && storedRole !== 'ADMIN') {
            return <Navigate to="/" replace />; // Unauthorized
        }
    }

    return children;
};

export default ProtectedRoute;
