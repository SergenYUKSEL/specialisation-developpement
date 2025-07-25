# Projet Gestion de Produits - Fullstack

Ce projet contient deux dossiers principaux :

- `backend` : Backend Node.js avec Express
- `frontend` : Frontend Vanilla JavaScript

---

## Installation et lancement

### Backend

1. Aller dans le dossier backend :

```bash
cd backend
```

2. Créer un fichier `.env` à la racine du dossier backend avec le contenu suivant :

```
JWT_SECRET=
JWT_EXPIRES_IN=7d
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
CSRF_SECRET=
```

Remplissez les valeurs selon votre configuration.

3. Installer les dépendances :

```bash
npm install
```

4. Créer la base de données et insérer les données de test :

- Un fichier `instructions_sql.txt` est disponible dans le dossier `backend` pour vous guider.
- Exécutez les commandes SQL contenues dans ce fichier dans votre gestionnaire de base de données.

5. Lancer le serveur backend :

```bash
npm run dev
```

Le serveur écoute par défaut sur le port configuré (souvent 3000).

---

### Frontend

1. Aller dans le dossier frontend :

```bash
cd frontend
```

2. Installer les dépendances :

```bash
npm install
```

5. Lancer le frontend :

```bash
npm run dev
```

---

## Notes

- Le backend utilise JWT pour l'authentification et CSRF pour la sécurité.
- Le backend expose une API REST accessible depuis le frontend.
- Le frontend utilise VITE (Vanilla JS) et communique avec le backend via fetch API.
- La base de données doit être configurée et accessible avec les paramètres dans `.env`.

---

## Fichiers importants

- `backend/instructions_sql.txt` : Contient les instructions SQL pour créer la base de données et insérer les données de test.
- `backend/.env` : Fichier de configuration des variables d'environnement.
- `frontend/index.html` : Point d'entrée du frontend.
