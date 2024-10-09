import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import config from '../config';

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
      setError('Identifiants invalides');
    }
  };

  return (
    <CContainer className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <CRow className="w-100">
        <CCol md={6} lg={4}>
          <CCard className="shadow-lg">
            <CCardBody>
              <h4 className="text-center mb-4">Authentifiez-vous</h4>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel htmlFor="email">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 position-relative">
                  <CFormLabel htmlFor="password">Mot de passe</CFormLabel>
                  <CFormInput
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="position-absolute"
                    style={{ cursor: 'pointer', right: '10px', top: '38%' }}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>

                {error && <div className="text-danger">{error}</div>}

                <CButton type="submit" color="dark" className="w-100 mt-3">Login</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Login;
