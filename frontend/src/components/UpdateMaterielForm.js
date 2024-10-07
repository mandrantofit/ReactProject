// UpdateMaterielForm.js
import React from 'react';

const UpdateMaterielForm = ({
  formData,
  handleCodeChange,
  handleChange,
  handleNumeroSerieChange,
  handleUpdate,
  possibilties,
  categories,
  etats,
  fournisseurs,
  commandes,
  handleCancel
}) => {
  return (
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
            {possibilties.map((possibilite) => (
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
        <button type="submit" className="btn btn-primary">Mettre à jour</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Annuler</button>
      </form>
    </div>
  );
};

export default UpdateMaterielForm;
