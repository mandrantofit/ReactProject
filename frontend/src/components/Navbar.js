import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Inclure le JavaScript de Bootstrap
import canalLogo from '../assets/canal_plus.svg'; // Import du logo
import '../styles/Navbar.css';
import { FaSignOutAlt } from 'react-icons/fa';
import jwt_decode from 'jwt-decode';
const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('type');
    localStorage.removeItem('email');
    window.location.href = '/login'; // Redirige vers la page de login
  };
// Supposons que vous ayez stocké le token dans localStorage
const token = localStorage.getItem('token');

let isAdmin = false;
if (token) {
  const decoded = jwt_decode(token);
  isAdmin = decoded.type === 'admin'; // Assurez-vous que le champ 'type' existe dans le token
}

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={canalLogo} alt="Canal+" style={{ height: '40px' }} /> {/* Ajout du logo ici */}
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Dropdown pour Matériel */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle text-light" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Matériel
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/materiel">Matériel</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/consomable">Consommable</Link>
                </li>
              </ul>
            </li>
            {/* Dropdown pour Affectation */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle text-light" to="#" id="navbarDropdownAffectation" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Affectation
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownAffectation">
                <li>
                  <Link className="dropdown-item" to="/affectation">Affectation</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/affectationConsomable">Affectation Consommable</Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/stock">Stock</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/employé">Employé</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/aide">Aide</Link> {/* Ajouter le lien vers Aide */}
            </li>
            {/* Afficher le lien Admin uniquement si l'utilisateur est un admin */}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-light" to="/admin">Admin</Link>
              </li>
            )}
          </ul>
          {/* Déplacement du bouton Logout dans la liste des liens */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="btn btn-danger nav-link" id="logout-btn" onClick={handleLogout} style={{ border: 'none' }}>
                <FaSignOutAlt />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
