const express = require('express');
const cors = require('cors');
const app = express();
const materielRoutes = require('./routes/materiel');
const affectationRoutes = require('./routes/affectation');
const userRoutes = require('./routes/user');
const categorieRoutes = require('./routes/categorie');
const etatRoutes = require('./routes/etat');
const fournisseurRoutes = require('./routes/fournisseur');
const stockUserRoutes = require('./routes/stockUser');
const consomableRoutes = require('./routes/consomable');
const affectationConsomableRoutes = require('./routes/affectationConsomable');  

app.use(cors());
app.use(express.json());
app.use('/materiel', materielRoutes);
app.use('/affectation', affectationRoutes);
app.use('/login', userRoutes);
app.use('/getCategorie', categorieRoutes);
app.use('/getEtat', etatRoutes);
app.use('/getFournisseur', fournisseurRoutes);
app.use('/getUser', stockUserRoutes);
app.use('/consomables', consomableRoutes);
app.use('/affectationconsomables', affectationConsomableRoutes);

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
