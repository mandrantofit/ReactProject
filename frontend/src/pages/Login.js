import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import config from '../config';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CAlert,
} from '@coreui/react'; // Importation des composants CoreUI
import '@coreui/coreui/dist/css/coreui.min.css'; // Importation du CSS CoreUI

// Configuration de l'API Axios avec le token
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
    <CContainer className="d-flex justify-content-center align-items-center vh-100">
      <CRow className="w-100 justify-content-center">
        <CCol md={6} lg={4}>
          <CCard className="shadow-lg">
            <CCardBody>
              <h4 className="text-center mb-4">Authentifiez-vous</h4>

              <CForm onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <CFormLabel htmlFor="email">Adresse Email</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Entrez votre adresse email"
                  />
                </div>

                {/* Mot de passe */}
                <div className="mb-3">
                  <CFormLabel htmlFor="password">Mot de Passe</CFormLabel>
                  <div className="input-group">
                    <CFormInput
                      type={isPasswordVisible ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <div
                      className="input-group-append password-icon"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      style={{ cursor: 'pointer', padding: '0.5rem' }}
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && <CAlert color="danger">{error}</CAlert>}

                {/* Bouton de connexion */}
                <CButton type="submit" color="primary" className="w-100">
                  Connexion
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Login;
