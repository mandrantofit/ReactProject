import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Commande = () => {
  const [commandes, setCommandes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    numero_serie: '',
    bon_de_commande: '',
    bon_de_livraison: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommandes();
  }, []);

  // Fonction pour récupérer toutes les commandes
  const fetchCommandes = async () => {
    try {
      const response = await axios.get('http://172.25.52.205:8000/materiel/commandes');
      setCommandes(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors de la récupération des commandes');
      setLoading(false);
    }
  };

  const handleOpenModal = (action, row = {}) => {
    setIsEditMode(action === 'update');
    setFormData({
      id: row.ID_commande || '',
      numero_serie: row.numero_serie || '',
      bon_de_commande: row.bon_de_commande || '',
      bon_de_livraison: row.bon_de_livraison || ''
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({ id: '', numero_serie: '', bon_de_commande: '', bon_de_livraison: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://172.25.52.205:8000/materiel/commandes/${formData.id}`, {
          numero_serie: formData.numero_serie,
          bon_de_commande: formData.bon_de_commande,
          bon_de_livraison: formData.bon_de_livraison
        });
        toast.success('Commande mise à jour avec succès');
      } else {
        await axios.post('http://172.25.52.205:8000/materiel/commandes', {
          numero_serie: formData.numero_serie,
          bon_de_commande: formData.bon_de_commande,
          bon_de_livraison: formData.bon_de_livraison
        });
        toast.success('Commande créée avec succès');
      }
      fetchCommandes();
      handleCancel();
    } catch (error) {
      toast.error('Erreur lors de la soumission du formulaire');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://172.25.52.205:8000/materiel/commandes/${id}`);
      toast.success('Commande supprimée avec succès');
      fetchCommandes();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la commande');
    }
  };

  const columns = [
    //{ field: 'ID_commande', headerName: 'ID', width: 90 },
    { field: 'numero_serie', headerName: 'Numéro de Série', width: 200 },
    { field: 'bon_de_commande', headerName: 'Bon de Commande', width: 200 },
    { field: 'bon_de_livraison', headerName: 'Bon de Livraison', width: 200 },
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
            onClick={() => handleDelete(params.row.ID_commande)}
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
        <h5 className="mb-0">Gestion des Commandes</h5>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-success"
            onClick={() => {
              handleOpenModal('create');
            }}
          >
            Ajouter une Commande
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
              rows={commandes}
              columns={columns}
              pageSize={5}
              getRowId={(row) => row.ID_commande}
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
                <h5 className="modal-title">{isEditMode ? 'Modifier une Commande' : 'Ajouter une Commande'}</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAdd}>
                  <div className="mb-3">
                    <label className="form-label">Numéro de Série</label>
                    <input
                      type="text"
                      className="form-control"
                      name="numero_serie"
                      value={formData.numero_serie}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bon de Commande</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bon_de_commande"
                      value={formData.bon_de_commande}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bon de Livraison</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bon_de_livraison"
                      value={formData.bon_de_livraison}
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

export default Commande;
