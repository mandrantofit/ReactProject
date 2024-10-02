import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import config from '../config';
const api = axios.create({
  baseURL: config.BASE_URL,
});
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      const { token, email: responseEmail, type } = response.data;

      // Stocker les données dans le localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', responseEmail);
      localStorage.setItem('type', type);

      navigate('/materiel'); // Rediriger vers la page "Materiel"
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Authentifiez-vous</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-group">
                <input
                  type={isPasswordVisible ? 'text' : 'password'} // Modifier le type en fonction de la visibilité
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.5rem' }} // Ajoute de l'espace pour l'icône
                />
                <div
                  className="input-group-append"
                  style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '15%' }} // Positionnement de l'icône
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Bascule la visibilité
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Afficher l'icône correspondante */}
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
