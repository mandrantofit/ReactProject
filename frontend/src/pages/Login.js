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
} from '@coreui/react'; // Importation des composants CoreUI
import '@coreui/coreui/dist/css/coreui.min.css'; // Importation du CSS CoreUI
import '../styles/Login.css'; // Style personnalisé pour le thème Canal+

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
    <CContainer className="login-container-coreui d-flex align-items-center justify-content-center">
      <CRow className="w-100 justify-content-center">
        <CCol md={6} lg={4}>
          <CCard className="login-card-coreui shadow-lg">
            <CCardBody>
              <h4 className="text-center mb-4 brand">Canal+</h4>
              <p className="text-center text-muted">Connectez-vous à votre compte</p>

              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel htmlFor="email" className="text-white">Adresse Email</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="password" className="text-white">Mot de Passe</CFormLabel>
                  <div className="input-group">
                    <CFormInput
                      type={isPasswordVisible ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control-lg"
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

                {error && <div className="alert alert-danger">{error}</div>}

                <CButton type="submit" color="light" className="w-100 btn-lg mt-3">
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
