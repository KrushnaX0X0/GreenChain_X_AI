import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }

        if (requiredRole === 'ADMIN') {
            // Check if token has ROLE_ADMIN
            const roles = decoded.roles || [];
            if (!roles.includes('ROLE_ADMIN')) {
                return <Navigate to="/" replace />;
            }
        }

    } catch (error) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
