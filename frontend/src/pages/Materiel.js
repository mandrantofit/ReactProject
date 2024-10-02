import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaFileExport } from 'react-icons/fa';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import config from '../config';
const api = axios.create({
  baseURL: config.BASE_URL,
});
const Materiel = () => {
  const [materiels, setMateriels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [etats, setEtats] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    modele: '',
    marque: '',
    numero_serie: '',
    numero_inventaire: '',
    ID_categorie: '',
    ID_etat: '',
    ID_fournisseur: '',
    bon_de_commande: '',
    config: '',
    bon_de_livraison: '',
  });
  const [selectedId, setSelectedId] = useState(null); // ID du matériel sélectionné pour modification
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [possibilites, setPossibilites] = useState([]);

  const [commandes, setCommandes] = useState([]);

  const fetchCommandes = async () => {
    try {
      const response = await api.get('/materiel/commandes');

      // Trie les commandes par numero_serie
      const sortedCommandes = response.data.sort((a, b) => {
        if (a.numero_serie < b.numero_serie) return -1;
        if (a.numero_serie > b.numero_serie) return 1;
        return 0;
      });

      setCommandes(sortedCommandes);  // Stocker les commandes triées
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
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


  const fetchMateriel = async () => {
    try {
      const response = await api.get('/materiel');
      setMateriels(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des matériels:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://172.25.52.205:8000/getCategorie');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const fetchEtats = async () => {
    try {
      const response = await api.get('/getEtat');
      setEtats(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des états:', error);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await api.get('/getFournisseur');
      setFournisseurs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
    }
  };

  useEffect(() => {
    fetchMateriel();
    fetchCategories();
    fetchEtats();
    fetchFournisseurs();
    fetchPossibilites();
    fetchCommandes();
  }, []);


  // Lorsque le code est sélectionné, met automatiquement à jour la marque et le modèle
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

  const handleNumeroSerieChange = (e) => {
    const selectedNumeroSerie = e.target.value;
    const selectedCommande = commandes.find(commande => commande.numero_serie === selectedNumeroSerie);

    if (selectedCommande) {
      setFormData({
        ...formData,
        numero_serie: selectedCommande.numero_serie,
        bon_de_commande: selectedCommande.bon_de_commande,
        bon_de_livraison: selectedCommande.bon_de_livraison
      });
    }
  };


  const handleChange = (e) => {
    console.log('Changed:', e.target.name, e.target.value); // Debugging line
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/materiel', formData);
      setFormData({
        code: '',
        modele: '',
        marque: '',
        numero_serie: '',
        numero_inventaire: '',
        ID_categorie: '',
        ID_etat: '',
        ID_fournisseur: '',
        bon_de_commande: '',
        config: '',
        bon_de_livraison: '',
      });
      toast.success('Matériel ajouté avec succès !');
      setShowModal(false);
      fetchMateriel();
      fetchPossibilites();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'ajout du matériel.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/materiel/${selectedId}`, formData);
      setFormData({
        code: '',
        modele: '',
        marque: '',
        numero_serie: '',
        numero_inventaire: '',
        ID_categorie: '',
        ID_etat: '',
        ID_fournisseur: '',
        bon_de_commande: '',
        config: '',
        bon_de_livraison: '',
      });
      toast.success('Matériel mis à jour avec succès !');
      setShowUpdateModal(false);
      fetchMateriel();
      fetchPossibilites();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour du matériel.");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce matériel ?")) {
      try {
        await api.delete(`/materiel/${id}`);
        toast.success('Matériel supprimé avec succès !');
        fetchMateriel();
        fetchPossibilites(); // Mettre à jour la liste après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression du matériel:", error);
        toast.error("Une erreur est survenue lors de la suppression du matériel.");
      }
    }
  };


  const handleCancel = () => {
    setShowModal(false);
    setShowUpdateModal(false);
    setSelectedId(null);  // Réinitialiser la sélection
    setFormData({
      code: '',
      modele: '',
      marque: '',
      numero_serie: '',
      numero_inventaire: '',
      ID_categorie: '',
      ID_etat: '',
      ID_fournisseur: '',
      bon_de_commande: '',
      config: '',
      bon_de_livraison: '',
    });  // Réinitialiser le formulaire
  };

  const handleEdit = (id) => {
    const selectedMateriel = materiels.find((materiel) => materiel.ID_materiel === id);

    // Mappings pour convertir les noms en IDs
    const categorie = categories.find((cat) => cat.type === selectedMateriel.type);
    const etat = etats.find((et) => et.description === selectedMateriel.etat);
    const fournisseur = fournisseurs.find((four) => four.nom === selectedMateriel.fournisseur);

    setFormData({
      code: selectedMateriel.code || '',
      modele: selectedMateriel.modele || '',
      marque: selectedMateriel.marque || '',
      numero_serie: selectedMateriel.numero_serie || '',
      numero_inventaire: selectedMateriel.numero_inventaire || '',
      ID_categorie: categorie ? categorie.ID_categorie : '',
      ID_etat: etat ? etat.ID_etat : '',
      ID_fournisseur: fournisseur ? fournisseur.ID_fournisseur : '',
      bon_de_commande: selectedMateriel.bon_de_commande || '',
      config: selectedMateriel.config || '',
      bon_de_livraison: selectedMateriel.bon_de_livraison || '',
    });

    setSelectedId(id);
    setShowUpdateModal(true);
  };


  const exportToXLSX = () => {
    // Liste des champs à inclure dans l'export
    const selectedFields = [
      'code',
      'numero_inventaire',
      'marque',
      'modele',
      'numero_serie',
      'type',
      'config', // On garde ce champ comme un seul élément sans séparation
      'etat',
      'fournisseur',
      'bon_de_commande',
      'bon_de_livraison',
      'attribution',
    ];

    // Créer un tableau d'en-têtes spécifiques (correspond à selectedFields)
    const headers = [
      'Code',
      'Numéro d\'Inventaire',
      'Marque',
      'Modèle',
      'Numéro de Série',
      'Catégorie',
      'Configuration', // Champ unique pour config
      'État',
      'Fournisseur',
      'Bon de Commande',
      'Bon de Livraison',
      'Matériel Affecté'
    ];

    // Créer un tableau des lignes de données
    const data = materiels.map(row => {
      return selectedFields.map(field => {
        let value = row[field] || '';  // Si le champ est vide, on met une chaîne vide
        return value;
      });
    });

    // Ajouter l'en-tête aux données
    const finalData = [headers, ...data];

    // Demander à l'utilisateur le type de fichier à télécharger
    const fileType = window.prompt("Entrez le type de fichier à télécharger (xlsx , xls , csv) :", "xlsx");

    // Vérifier le type de fichier et effectuer l'exportation
    if (fileType === 'xlsx' || fileType === 'xls') {
      // Créer une nouvelle feuille de calcul avec les données
      const worksheet = XLSX.utils.aoa_to_sheet(finalData);

      // Créer un classeur (workbook), 
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Matériels");

      // Générer et télécharger le fichier XLSX
      XLSX.writeFile(workbook, `materiels.${fileType}`, { bookType: fileType, type: 'binary' });

      toast.success("Fichier xlsx créé avec succès");
    } else if (fileType === 'csv') {
      // Convertir les données en CSV
      const csvContent = finalData.map(e => e.join(",")).join("\n");

      // Créer un fichier CSV et le télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "materiels.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Fichier CSV créé avec succès");
    } else {
      toast.error("Type de fichier non supporté !");
    }
  };


  const columns = [
    { field: 'numero_inventaire', headerName: 'Numéro d\'Inventaire', width: 150 },
    { field: 'code', headerName: 'code', width: 150 },
    { field: 'marque', headerName: 'Marque', width: 120 },
    { field: 'modele', headerName: 'Modèle', width: 150 },
    { field: 'numero_serie', headerName: 'Numéro de Série', width: 150 },
    { field: 'type', headerName: 'Catégorie', width: 200 },
    { field: 'config', headerName: 'Configuration', width: 200 },
    {
      field: 'etat',
      headerName: 'État',
      width: 120,
      renderCell: (params) => {
        const etatDescription = params.formattedValue; // Utilisez formattedValue

        let badgeClass = 'badge bg-secondary'; // couleur par défaut
        switch (etatDescription) {
          case 'Neuf': badgeClass = 'badge bg-success'; break;
          case 'Utilisable': badgeClass = 'badge bg-primary'; break;
          case 'Réparable': badgeClass = 'badge bg-warning'; break;
          case 'Irréparable': badgeClass = 'badge bg-danger'; break;
          default: badgeClass = 'badge bg-secondary'; // Par défaut
        }

        return (
          <span className={badgeClass}>
            {etatDescription}
          </span>
        );
      },
    },
    { field: 'fournisseur', headerName: 'Fournisseur', width: 100 },
    { field: 'bon_de_commande', headerName: 'Bon de Commande', width: 140 },
    { field: 'bon_de_livraison', headerName: 'Bon de Livraison', width: 140 },
    {
      field: 'attribution',
      headerName: 'Matériel Affecté',
      width: 140,
      renderCell: (params) => {
        const attributionValue = params.value; // Récupérez la valeur de l'attribution

        // Définir la classe de badge en fonction de la valeur
        const badgeClass = attributionValue === 'oui' ? 'badge bg-warning' : 'badge bg-success';

        return (
          <span className={badgeClass}>
            {attributionValue}
          </span>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(params.row.ID_materiel)}>
            <FaEdit />
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(params.row.ID_materiel)}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Liste des Matériels</h4>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-success" onClick={() => setShowModal(true)}>
              Ajouter Matériel
            </button>
            {/* 
            
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="export-tooltip">Exporter en Excel</Tooltip>}
            >
              <button className="btn btn-success mb-3" onClick={exportToXLSX}>
                <FaFileExport className="me-2" />
              </button>
            </OverlayTrigger>
            
            */}

          </div>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          ) : (
            <div style={{ height: 450, width: '100%' }}>
              <DataGrid
                rows={materiels}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row.ID_materiel}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                className="bg-light"
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    sx: {
                      backgroundColor: 'white',
                      color: 'black',
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un Matériel</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAdd}>
                  <h5 className='text-center'>Informations Générales</h5>
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
                    <label className="form-label">Numéro d'inventaire</label>
                    <input
                      type="text"
                      name="numero_inventaire"
                      value={formData.numero_inventaire}
                      onChange={handleChange}
                      className="form-control"

                    />
                  </div>
                  {/* Formulaire pour Détails de la Configuration */}
                  <h5 className='text-center'>Détails de la Configuration</h5>
                  <div className="mb-3">
                    <label className="form-label">Catégorie</label>
                    <select
                      name="ID_categorie"
                      value={formData.ID_categorie}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionner la catégorie</option>
                      {categories.map((categorie) => (
                        <option key={categorie.ID_categorie} value={categorie.ID_categorie}>
                          {categorie.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Configuration</label>
                    <input
                      type="text"
                      name="config"
                      value={formData.config}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">État</label>
                    <select
                      name="ID_etat"
                      value={formData.ID_etat}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionner l'état du Materiel</option>
                      {etats.map((etat) => (
                        <option key={etat.ID_etat} value={etat.ID_etat}>
                          {etat.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Formulaire pour Fournisseur et Documents */}
                  <h5 className='text-center'>Fournisseur et Documents</h5>
                  <div className="mb-3">
                    <label className="form-label">Fournisseur</label>
                    <select
                      name="ID_fournisseur"
                      value={formData.ID_fournisseur}
                      onChange={handleChange}
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
                    <label className="form-label">Numéro de Série</label>
                    <select
                      name="numero_serie"
                      value={formData.numero_serie}
                      onChange={handleNumeroSerieChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionner un numéro de série</option>
                      {commandes.map((commande) => (
                        <option key={commande.ID_commande} value={commande.numero_serie}>
                          {commande.numero_serie}
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
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bon de Livraison</label>
                    <input
                      type="text"
                      name="bon_de_livraison"
                      value={formData.bon_de_livraison}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">Ajouter</button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Annuler</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mise à jour */}
      {showUpdateModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mettre à jour le Matériel</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <h5 className='text-center'>Informations Générales</h5>
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
                    <label className="form-label">Numéro d' inventaire</label>
                    <input
                      type="text"
                      name="numero_inventaire"
                      value={formData.numero_inventaire}
                      onChange={handleChange}
                      className="form-control"

                    />
                  </div>
                  {/* Formulaire pour Détails de la Configuration */}
                  <h5 className='text-center'>Détails de la Configuration</h5>
                  <div className="mb-3">
                    <label className="form-label">Catégorie</label>
                    <select
                      name="ID_categorie"
                      value={formData.ID_categorie}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionner la catégorie</option>
                      {categories.map((categorie) => (
                        <option key={categorie.ID_categorie} value={categorie.ID_categorie}>
                          {categorie.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Configuration</label>
                    <input
                      type="text"
                      name="config"
                      value={formData.config}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">État</label>
                    <select
                      name="ID_etat"
                      value={formData.ID_etat}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionner l'état du Materiel</option>
                      {etats.map((etat) => (
                        <option key={etat.ID_etat} value={etat.ID_etat}>
                          {etat.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Formulaire pour Fournisseur et Documents */}
                  <h5 className='text-center'>Fournisseur et Documents</h5>
                  <div className="mb-3">
                    <label className="form-label">Fournisseur</label>
                    <select
                      name="ID_fournisseur"
                      value={formData.ID_fournisseur}
                      onChange={handleChange}
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
                    <label className="form-label">Numéro de Série</label>
                    <select
                      name="numero_serie"
                      value={formData.numero_serie}
                      onChange={handleNumeroSerieChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionner un numéro de série</option>
                      {commandes.map((commande) => (
                        <option key={commande.ID_commande} value={commande.numero_serie}>
                          {commande.numero_serie}
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
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bon de Livraison</label>
                    <input
                      type="text"
                      name="bon_de_livraison"
                      value={formData.bon_de_livraison}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Annuler</button>
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

export default Materiel;