import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState(''); // Nouveau champ pour le code MFA
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isMfaRequired, setIsMfaRequired] = useState(false); // Pour contrôler l'étape du MFA
  const navigate = useNavigate();

  // Fonction pour soumettre l'email et le mot de passe
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      // Envoyer l'email et le mot de passe pour l'authentification initiale
      const response = await axios.post('http://172.25.52.205:8000/login', { email, password });
      setIsMfaRequired(true); // Passer à la deuxième étape pour entrer le code MFA
      setError(''); // Réinitialiser l'erreur
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  // Fonction pour soumettre le code MFA
  const handleSubmitMfa = async (e) => {
    e.preventDefault();
    try {
      // Envoyer l'email et le code MFA pour vérification
      const response = await axios.post('http://172.25.52.205:8000/login/verify-mfa', { email, mfaCode });
      const { token, email: responseEmail, type } = response.data;

      // Stocker les données dans le localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', responseEmail);
      localStorage.setItem('type', type);

      navigate('/materiel'); // Rediriger vers la page "Materiel"
    } catch (err) {
      setError('Invalid MFA code');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Authentifiez-vous</h4>
          
          {/* Afficher le formulaire pour entrer l'email et le mot de passe */}
          {!isMfaRequired ? (
            <form onSubmit={handleSubmitLogin}>
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
                    type={isPasswordVisible ? 'text' : 'password'}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <div
                    className="input-group-append"
                    style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '15%' }}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-100">Suivant</button>
            </form>
          ) : (
            // Afficher le formulaire pour entrer le code MFA
            <form onSubmit={handleSubmitMfa}>
              <div className="form-group mb-3">
                <label htmlFor="mfaCode">Code de vérification</label>
                <input
                  type="text"
                  className="form-control"
                  id="mfaCode"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Entrez le code envoyé par e-mail"
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-100">Vérifier</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
