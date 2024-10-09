import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import config from '../config';
import '../styles/Login.css'; // Fichier CSS pour un style amélioré

const api = axios.create({
  baseURL: config.BASE_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
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

      localStorage.setItem('token', token);
      localStorage.setItem('email', responseEmail);
      localStorage.setItem('type', type);

      navigate('/materiel');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow-lg">
        <div className="card-body">
          <h4 className="card-title text-center mb-4">
            <span className="brand">VotreApp</span> {/* Nom de votre app avec une animation */}
          </h4>

          {/* Ajout d'un texte accrocheur */}
          <p className="text-center mb-4 text-muted">Bienvenue, veuillez vous connecter à votre compte</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">Adresse Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Mot de Passe</label>
              <div className="input-group">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <div
                  className="input-group-append password-icon"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary w-100 btn-lg mt-3">Connexion</button>

            {/* Lien de réinitialisation du mot de passe */}
            <div className="text-center mt-3">
              <a href="/reset-password" className="text-muted">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
