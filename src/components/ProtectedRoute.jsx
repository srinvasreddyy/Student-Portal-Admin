import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Basic check for auth token. 
    // In a production app, you'd want to also verify token validity/roles
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
