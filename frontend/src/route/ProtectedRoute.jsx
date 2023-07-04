import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const ProtectedRoute = ({ isAdmin, children}) => {
    const { loading, user } = useSelector((state) => state.user);
    if (loading) {
      return <Loader/>;
    }
    if(!isAdmin && user.role !== 'admin'){
        return <Navigate to="/login"/>;
    }
    return children
};

export default ProtectedRoute;