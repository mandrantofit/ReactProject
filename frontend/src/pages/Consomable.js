import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
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

const Consomable = () => {
    const [consomables, setConsomables] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [possibilites, setPossibilites] = useState([]);
    const [formData, setFormData] = useState({
        numero_inventaire: '',
        code: '',
        modele: '',
        marque: '',
        ID_fournisseur: '',
        bon_de_commande: '',
        config: '',
        bon_de_livraison: '',
        quantite: 1,
    });
    const [selectedId, setSelectedId] = useState(null); // ID sélectionné pour modification
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isIncrementModalOpen, setIsIncrementModalOpen] = useState(false); // Nouveau modal pour incrémenter la quantité

    // Fetch consomables
    const fetchConsomables = async () => {
        try {
            const response = await api.get('/consomables');
            setConsomables(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des consommables:', error);
            setLoading(false);
        }
    };

    const fetchPossibilites = async () => {
        try {
            const response = await api.get('/materiel/possibilite');

            // Trie les possibilités par possibilite_code
            const sortedPossibilites = response.data.sort((a, b) => {
                if (a.possibilite_code < b.possibilite_code) return -1;
                if (a.possibilite_code > b.possibilite_code) return 1;
                return 0;
            });

            setPossibilites(sortedPossibilites); // Stocke les possibilités triées
        } catch (error) {
            console.error('Erreur lors de la récupération des possibilités:', error);
        }
    };

    // Fetch fournisseurs
    const fetchFournisseurs = async () => {
        try {
            const response = await api.get('/getFournisseur');
            setFournisseurs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des fournisseurs:', error);
        }
    };

    useEffect(() => {
        fetchConsomables();
        fetchFournisseurs();
        fetchPossibilites();
    }, []);

    const handleCodeChange = (e) => {
        const selectedCode = e.target.value;
        const selectedPossibilite = possibilites.find(pos => pos.possibilite_code === selectedCode);

        if (selectedPossibilite) {
            setFormData({
                ...formData,
                code: selectedPossibilite.possibilite_code,
                marque: selectedPossibilite.possibilite_marque,
                modele: selectedPossibilite.possibilite_modele
            });
        }
    };

    const handleFieldChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Ajouter un consommable
    const handleAddConsomable = async (e) => {
        e.preventDefault();
        try {
            await api.post('/consomables', formData);
            toast.success('Consommable ajouté avec succès !');
            setIsModalOpen(false);
            fetchConsomables();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du consommable.");
        }
    };

    // Mettre à jour un consommable
    const handleUpdateConsomable = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/consomables/${selectedId}`, formData);
            toast.success('Consommable mis à jour avec succès !');
            setIsUpdateModalOpen(false);
            fetchConsomables();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du consommable.");
        }
    };

    // Supprimer un consommable
    const handleDeleteConsomable = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce consommable ?")) {
            try {
                await api.delete(`/consomables/${id}`);
                toast.success('Consommable supprimé avec succès !');
                fetchConsomables();
            } catch (error) {
                toast.error("Erreur lors de la suppression du consommable.");
            }
        }
    };

    const handleEditConsomable = (id) => {
        const selectedConsomable = consomables.find((consomable) => consomable.ID_materiel_consomable === id);
        console.log("Selected Consomable:", selectedConsomable);
        if (!selectedConsomable) {
            console.error("Aucun consommable sélectionné avec cet ID.");
            return;
        }
        const fournisseur = fournisseurs.find((four) => four.nom.trim() === selectedConsomable.fournisseur.trim());
        console.log("Fournisseur sélectionné:", fournisseur);
        const ID_fournisseur = fournisseur ? fournisseur.ID_fournisseur : '';
        console.log("ID Fournisseur mappé:", ID_fournisseur);
        setFormData({
            numero_inventaire: selectedConsomable.numero_inventaire,
            code: selectedConsomable.code,
            modele: selectedConsomable.modele,
            marque: selectedConsomable.marque,
            ID_fournisseur, // Utilisation de l'ID mappé
            bon_de_commande: selectedConsomable.bon_de_commande,
            config: selectedConsomable.config,
            bon_de_livraison: selectedConsomable.bon_de_livraison,
            quantite: selectedConsomable.quantite,
        });

        setSelectedId(id);
        setIsUpdateModalOpen(true);
    };

    // Gérer l'incrémentation de la quantité
    const handleIncrementQuantity = (id) => {
        setSelectedId(id); // Stocke l'ID du consommable sélectionné
        setFormData({ ...formData, quantite: 1 }); // Définit une quantité par défaut à ajouter
        setIsIncrementModalOpen(true); // Ouvre le modal pour incrémenter la quantité
    };

    const handleIncrementQuantitySubmit = async (e) => {
        e.preventDefault();
        try {
            // Envoyer la requête pour mettre à jour la quantité
            await api.put(`/consomables/quantity/${selectedId}`, { quantite: formData.quantite });
            toast.success('Quantité mise à jour avec succès !');
            setIsIncrementModalOpen(false);
            fetchConsomables(); // Rafraîchir la liste des consommables
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la quantité.");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsUpdateModalOpen(false);
        setIsIncrementModalOpen(false); // Réinitialiser la sélection
        setSelectedId(null);  // Réinitialiser l'ID sélectionné
        setFormData({
            numero_inventaire: '',
            code: '',
            modele: '',
            marque: '',
            ID_fournisseur: '',
            bon_de_commande: '',
            config: '',
            bon_de_livraison: '',
            quantite: 1,
        });  // Réinitialiser le formulaire
    };

    const columns = [
        { field: 'numero_inventaire', headerName: 'Numéro d\'Inventaire', width: 150 },
        { field: 'code', headerName: 'Code', width: 150 },
        { field: 'marque', headerName: 'Marque', width: 120 },
        { field: 'modele', headerName: 'Modèle', width: 150 },
        { field: 'quantite', headerName: 'Quantité', width: 100 },
        //{ field: 'config', headerName: 'Details', width: 100 },
        { field: 'fournisseur', headerName: 'Fournisseur', width: 200 },
        { field: 'bon_de_commande', headerName: 'Bon de Commande', width: 200 },
        { field: 'bon_de_livraison', headerName: 'Bon de Livraison', width: 200 },
        {
            field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => (
                <div>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditConsomable(params.row.ID_materiel_consomable)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteConsomable(params.row.ID_materiel_consomable)}>
                        <FaTrash />
                    </button>
                    <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleIncrementQuantity(params.row.ID_materiel_consomable)}>
                        <FaPlus />
                    </button>
                </div>
            )
        },
    ];

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                    <h4 className="mb-0">Liste des Consommables</h4>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                        <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>
                            Ajouter Consommable
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div style={{ height: 450, width: '100%' }}>
                            <DataGrid
                                rows={consomables}
                                columns={columns}
                                pageSize={5}
                                getRowId={(row) => row.ID_materiel_consomable}
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
                                <h5 className="modal-title">Ajouter un Consommable</h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddConsomable}>
                                    <div className="mb-3">
                                        <label className="form-label">Numéro d'inventaire</label>
                                        <input
                                            type="text"
                                            name="numero_inventaire"
                                            value={formData.numero_inventaire}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Code</label>
                                        <select
                                            name="code"
                                            value={formData.code}
                                            onChange={handleCodeChange}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Sélectionner un code</option>
                                            {possibilites.map((possibilite) => (
                                                <option key={possibilite.ID_possibilite} value={possibilite.possibilite_code}>
                                                    {possibilite.possibilite_code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Champ Marque - Automatiquement mis à jour */}
                                    <div className="mb-3">
                                        <label className="form-label">Marque</label>
                                        <input
                                            type="text"
                                            name="marque"
                                            value={formData.marque}
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                    {/* Champ Modèle - Automatiquement mis à jour */}
                                    <div className="mb-3">
                                        <label className="form-label">Modèle</label>
                                        <input
                                            type="text"
                                            name="modele"
                                            value={formData.modele}
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fournisseur</label>
                                        <select
                                            name="ID_fournisseur"
                                            value={formData.ID_fournisseur}
                                            onChange={handleFieldChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Sélectionner un fournisseur</option>
                                            {fournisseurs.map((fournisseur) => (
                                                <option key={fournisseur.ID_fournisseur} value={fournisseur.ID_fournisseur}>
                                                    {fournisseur.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Bon de Commande</label>
                                        <input
                                            type="text"
                                            name="bon_de_commande"
                                            value={formData.bon_de_commande}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Bon de Livraison</label>
                                        <input
                                            type="text"
                                            name="bon_de_livraison"
                                            value={formData.bon_de_livraison}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quantité</label>
                                        <input
                                            type="number"
                                            name="quantite"
                                            value={formData.quantite}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Ajouter</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => handleCancel()}>Annuler</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'incrémentation de la quantité */}
            {isIncrementModalOpen && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Incrémenter la Quantité</h5>
                                <button type="button" className="btn-close" onClick={() => setIsIncrementModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleIncrementQuantitySubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Quantité à ajouter</label>
                                        <input
                                            type="number"
                                            name="quantite"
                                            value={formData.quantite}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Incrémenter</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsIncrementModalOpen(false)}>Annuler</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de mise à jour */}
            {isUpdateModalOpen && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Mettre à jour le Consommable</h5>
                                <button type="button" className="btn-close" onClick={() => setIsUpdateModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateConsomable}>
                                    <div className="mb-3">
                                        <label className="form-label">Numéro d'inventaire</label>
                                        <input
                                            type="text"
                                            name="numero_inventaire"
                                            value={formData.numero_inventaire}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Code</label>
                                        <select
                                            name="code"
                                            value={formData.code}
                                            onChange={handleCodeChange}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Sélectionner un code</option>
                                            {possibilites.map((possibilite) => (
                                                <option key={possibilite.ID_possibilite} value={possibilite.possibilite_code}>
                                                    {possibilite.possibilite_code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Champ Marque - Automatiquement mis à jour */}
                                    <div className="mb-3">
                                        <label className="form-label">Marque</label>
                                        <input
                                            type="text"
                                            name="marque"
                                            value={formData.marque}
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                    {/* Champ Modèle - Automatiquement mis à jour */}
                                    <div className="mb-3">
                                        <label className="form-label">Modèle</label>
                                        <input
                                            type="text"
                                            name="modele"
                                            value={formData.modele}
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fournisseur</label>
                                        <select
                                            name="ID_fournisseur"
                                            value={formData.ID_fournisseur}
                                            onChange={handleFieldChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Sélectionner un fournisseur</option>
                                            {fournisseurs.map((fournisseur) => (
                                                <option key={fournisseur.ID_fournisseur} value={fournisseur.ID_fournisseur}>
                                                    {fournisseur.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Bon de Commande</label>
                                        <input
                                            type="text"
                                            name="bon_de_commande"
                                            value={formData.bon_de_commande}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Bon de Livraison</label>
                                        <input
                                            type="text"
                                            name="bon_de_livraison"
                                            value={formData.bon_de_livraison}
                                            onChange={handleFieldChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Mettre à jour</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => handleCancel()}>Annuler</button>
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

export default Consomable;
