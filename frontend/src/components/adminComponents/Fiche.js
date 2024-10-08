import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config';
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
const Fiche = () => {
  const [possibilites, setPossibilites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: '', possibilite_code: '', possibilite_marque: '', possibilite_modele: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPossibilites();
  }, []);

  // Fonction pour récupérer les possibilités
  const fetchPossibilites = async () => {
    try {
      const response = await api.get('/materiel/possibilite');
      setPossibilites(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors de la récupération des possibilités');
      setLoading(false);
    }
  };

  const handleOpenModal = (action, row = {}) => {
    setIsEditMode(action === 'update');
    setFormData({
      id: row.ID_possibilite || '',
      possibilite_code: row.possibilite_code || '',
      possibilite_marque: row.possibilite_marque || '',
      possibilite_modele: row.possibilite_modele || ''
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({ id: '', possibilite_code: '', possibilite_marque: '', possibilite_modele: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/materiel/possibilite/${formData.id}`, {
          possibilite_code: formData.possibilite_code,
          possibilite_marque: formData.possibilite_marque,
          possibilite_modele: formData.possibilite_modele
        });
        toast.success('Possibilité mise à jour avec succès');
      } else {
        await api.post('/materiel/possibilite', {
          possibilite_code: formData.possibilite_code,
          possibilite_marque: formData.possibilite_marque,
          possibilite_modele: formData.possibilite_modele
        });
        toast.success('Possibilité créée avec succès');
      }
      fetchPossibilites();
      handleCancel();
    } catch (error) {
      toast.error('Erreur lors de la soumission du formulaire');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/materiel/possibilite/${id}`);
      toast.success('Possibilité supprimée avec succès');
      fetchPossibilites();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la possibilité');
    }
  };

  const columns = [
    { field: 'ID_possibilite', headerName: 'ID', width: 90 },
    { field: 'possibilite_code', headerName: 'Code', width: 200 },
    { field: 'possibilite_marque', headerName: 'Marque', width: 200 },
    { field: 'possibilite_modele', headerName: 'Modèle', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => handleOpenModal('update', params.row)}
          >
            <FaEdit />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(params.row.ID_possibilite)}
          >
            <FaTrash />
          </button>
        </>
      )
    }
  ];

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">Gestion des Fiches</h5>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-success"
            onClick={() => {
              handleOpenModal('create');
            }}
          >
            Ajouter une Possibilité
          </button>
        </div>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Chargement...</span>
            </div>
          </div>
        ) : (
          <div style={{ height: '300px', width: '100%' }}>
            <DataGrid
              rows={possibilites}
              columns={columns}
              pageSize={5}
              getRowId={(row) => row.ID_possibilite}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              className="bg-light"
            />
          </div>
        )}
      </div>
      {/* Modal d'ajout/édition */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditMode ? 'Modifier une Possibilité' : 'Ajouter une Possibilité'}</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAdd}>
                  <div className="mb-3">
                    <label className="form-label">Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="possibilite_code"
                      value={formData.possibilite_code}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Marque</label>
                    <input
                      type="text"
                      className="form-control"
                      name="possibilite_marque"
                      value={formData.possibilite_marque}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Modèle</label>
                    <input
                      type="text"
                      className="form-control"
                      name="possibilite_modele"
                      value={formData.possibilite_modele}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary me-2">
                    {isEditMode ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Annuler
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Fiche;
