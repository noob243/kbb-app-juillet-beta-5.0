# 🚀 Déploiement KBB App - MongoDB Atlas

Ce document résume les étapes pour mettre en service le nouveau backend Node.js connecté à MongoDB Atlas.

## 1. Configuration de la base de données (MongoDB Atlas)
1. Créez un cluster sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Dans **Network Access**, autorisez votre adresse IP (ou `0.0.0.0/0` pour le déploiement cloud).
3. Dans **Database Access**, créez un utilisateur avec les droits `readWrite`.
4. Récupérez votre chaîne de connexion (SRV).

## 2. Variables d'environnement
Créez un fichier `backend/.env` avec le contenu suivant :
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kbb_db?retryWrites=true&w=majority
NODE_ENV=production
```

Pour le Frontend (Vite), assurez-vous que `.env` contient :
```env
VITE_API_URL=http://localhost:5000/api
```

## 3. Initialisation des données (Seeding)
Pour remplir la base de données avec les données de test initiales :
```bash
cd backend
npm install
npm run seed
```

## 4. Lancement de l'application
### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
# À la racine du projet
npm run dev
```

## 5. Déploiement Cloud (Production)
- **Backend** : Déployez le dossier `backend` sur Render, Railway ou Heroku. Configurez la variable `MONGODB_URI` dans l'interface de l'hébergeur.
- **Frontend** : Déployez sur Vercel ou Netlify. Configurez `VITE_API_URL` pour pointer vers l'URL de votre backend déployé.
