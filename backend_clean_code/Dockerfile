# Étape 1 : Construction
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Étape 2 : Production
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer PM2
RUN npm install -g pm2

# Copier les fichiers de l'étape de construction
COPY --from=build /app /app

# Exposer le port sur lequel l'application écoute
EXPOSE 8000

# Définir la commande pour démarrer l'application avec PM2
CMD ["pm2", "start", "ecosystem.config.js"]
