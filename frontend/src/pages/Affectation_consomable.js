import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
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
const AffectationConsomable = () => {
    const [affectations, setAffectations] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [consommables, setConsommables] = useState([]);
    const [formData, setFormData] = useState({
        ID_utilisateur: '',
        ID_materiel_consomable: '',
        quantite_affecter: 1,
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch affectations
    const fetchAffectations = async () => {
        try {
            const response = await api.get('/affectationconsomables');
            setAffectations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des affectations:', error);
            setLoading(false);
        }
    };

    // Fetch utilisateurs
    const fetchUtilisateurs = async () => {
        try {
            const response = await api.get('/getUser');
            setUtilisateurs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    // Fetch consommables
    const fetchConsommables = async () => {
        try {
            const response = await api.get('/consomables');
            setConsommables(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des consommables:', error);
        }
    };

    useEffect(() => {
        fetchAffectations();
        fetchUtilisateurs();
        fetchConsommables();
    }, []);

    const handleFieldChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Ajouter une nouvelle affectation
    const handleAddAffectation = async (e) => {
        e.preventDefault();
        try {
            await api.post('/affectationconsomables', formData);
            toast.success('Affectation créée avec succès !');
            fetchAffectations(); // Rafraîchir la liste
            setFormData({
                ID_utilisateur: '',
                ID_materiel_consomable: '',
                quantite_affecter: 1,
            }); // Réinitialiser le formulaire
            setIsModalOpen(false); // Fermer le modal
        } catch (error) {
            toast.error("Erreur lors de la création de l'affectation. Stock insufisant");
        }
    };

    const columns = [
        { field: 'ID_affectation_consomable', headerName: 'ID', width: 90 },
        { field: 'nom_utilisateur', headerName: 'Nom Utilisateur', width: 150 },
        { field: 'nom_service', headerName: 'Nom Service', width: 180 },
        { field: 'lieu', headerName: 'Lieu', width: 150 },
        { field: 'modele', headerName: 'Modèle', width: 150 },
        { field: 'marque', headerName: 'Marque', width: 150 },
        { field: 'quantite_affecter', headerName: 'Quantité Affectée', width: 150 },
        { field: 'date_affectation', headerName: 'Date Affectation', width: 180 },
    ];

    return (
        <div className="container mt-4">
            <h2>Affectations de Consommables</h2>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-dark text-white">
                    <h4 className="mb-0">Liste des Affectations des consommables</h4>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                        <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>
                             Affecter
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={affectations}
                                columns={columns}
                                pageSize={5}
                                getRowId={(row) => row.ID_affectation_consomable}
                                rowsPerPageOptions={[5]}
                                disableSelectionOnClick
                                className="bg-light"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal d'ajout */}
            {isModalOpen && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Ajouter une Affectation</h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddAffectation}>
                                    <div className="mb-3">
                                        <label className="form-label">Utilisateur</label>
                                        <select
                                            name="ID_utilisateur"
                                            value={formData.ID_utilisateur}
                                            onChange={handleFieldChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Sélectionner un utilisateur</option>
                                            {utilisateurs.map((utilisateur) => (
                                                <option key={utilisateur.ID_utilisateur} value={utilisateur.ID_utilisateur}>
                                                    {utilisateur.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Consommable</label>
                                        <select
                                            name="ID_materiel_consomable"
                                            value={formData.ID_materiel_consomable}
                                            onChange={handleFieldChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Sélectionner un consommable</option>
                                            {consommables.map((consomable) => (
                                                <option key={consomable.ID_materiel_consomable} value={consomable.ID_materiel_consomable}>
                                                    {consomable.modele} ({consomable.marque})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quantité à affecter</label>
                                        <input
                                            type="number"
                                            name="quantite_affecter"
                                            value={formData.quantite_affecter}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Ajouter</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsModalOpen(false)}>Annuler</button>
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

export default AffectationConsomable;
