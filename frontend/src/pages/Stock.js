import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
const api = axios.create({
  baseURL: config.BASE_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Récupérer le token

  if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ajouter le token aux en-têtes
  }

  return config; // Retourner la configuration modifiée
}, (error) => {
  return Promise.reject(error); // Gérer l'erreur de la requête
});
const Stock = () => {
  const [inventaire, setInventaire] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventaire = async () => {
      try {
        const response = await api.get('/materiel/inventaire');
        setInventaire(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Erreur lors de la récupération de l\'inventaire :', error);
        setLoading(false);
      }
    };

    fetchInventaire();
  }, []);

  const columns = [
    { field: 'code', headerName: 'Code', width: 250 },
    { field: 'marque', headerName: 'Marque', width: 100 },
    { field: 'modele', headerName: 'Modèle', width: 550 },
    { field: 'non_attribue', headerName: 'Non Attribué', width: 100 },
  ];

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Liste des matériels non attribués</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center" style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={inventaire}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row.code}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                className="bg-light"
              />
            </div>
          )}
        </div>

      </div>
      <ToastContainer />
    </div>
  );
};

export default Stock;
