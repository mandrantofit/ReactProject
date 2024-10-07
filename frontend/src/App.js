import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Admin from './pages/Admin';
import AdminRoute from './routes/AdminRoute';
import Login from './pages/Login';
import Materiel from './pages/Materiel';
import Stock from './pages/Stock';
import Affectation from './pages/Affectation';
import Employee from './pages/Employee';
import Consomable from './pages/Consomable';
import AffectationConsomable from './pages/Affectation_consomable';
import Aide from './pages/Aide'; // Importer la page Aide
import NotFound from './pages/NotFound';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const location = useLocation(); // Hook pour obtenir la route actuelle

  return (
    <div className="App">
      {/* Affiche Navbar seulement si on n'est pas sur la page de login */}
      {location.pathname !== '/login' && location.pathname !== '/' && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/materiel" element={<PrivateRoute><Materiel /></PrivateRoute>} />
        <Route path="/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
        <Route path="/affectation" element={<PrivateRoute><Affectation /></PrivateRoute>} />
        <Route path="/employé" element={<PrivateRoute><Employee /></PrivateRoute>} />
        <Route path="/consomable" element={<PrivateRoute><Consomable /></PrivateRoute>} />
        <Route path="/affectationConsomable" element={<PrivateRoute><AffectationConsomable /></PrivateRoute>} />
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/aide" element={<PrivateRoute><Aide /></PrivateRoute>} /> {/* Ajouter la route Aide */}
        {/* Route catch-all pour les pages non trouvées */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
