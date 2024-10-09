# Étape 1 : Construire l'application
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Créer l'image finale
FROM node:18-alpine

# Installer PM2
RUN npm install -g pm2

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers construits de l'étape précédente vers le répertoire de l'application
COPY --from=build /app/build /app/build

# Exposer le port 3000
EXPOSE 3000

# Commande pour démarrer l'application avec PM2
CMD ["pm2", "start", "ecosystem.config.js"]
