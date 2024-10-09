import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');

  let isAdmin = false;
  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.type === 'admin'; // Assurez-vous que le champ 'type' existe dans le token
  }

  // Vérifie si le type d'utilisateur est admin
  if (isAdmin) {
    // Redirige vers la page d'accueil ou une autre page si l'utilisateur n'est pas admin
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
