import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import config from '../config';
import '../styles/Login.css'; // Fichier CSS pour le style Canal+

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
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="login-container-canal">
      <div className="login-card-canal shadow-lg">
        <div className="card-body">
          <h4 className="card-title text-center mb-4">
            <span className="brand">Canal+</span> {/* Thème Canal+ */}
          </h4>

          {/* Texte d'accueil */}
          <p className="text-center mb-4 text-muted">Connectez-vous à votre compte</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="text-white">Adresse Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password" className="text-white">Mot de Passe</label>
              <div className="input-group">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="form-control form-control-lg"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button type="submit" className="btn btn-light w-100 btn-lg mt-3">Connexion</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
