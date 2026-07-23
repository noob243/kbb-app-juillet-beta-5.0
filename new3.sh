#!/bin/bash

# 1. Réparation radicale si le dépôt est corrompu
if [ -d ".git" ]; then
    # Si on détecte une corruption d'objet, on réinitialise le cache Git
    # sans supprimer tes fichiers de code.
    echo "Vérification de l'intégrité du dépôt..."
    git fsck --full || {
        echo "Dépôt corrompu détecté. Réinitialisation sécurisée..."
        rm -rf .git
        git init
    }
fi

# 1b. Actions liées à Firestore (Optionnel)
# Cette section est pour des actions qui pourraient être nécessaires AVANT de pousser le code
# ou qui seraient déclenchées par le déploiement du code poussé.
#
# Firestore gère la synchronisation des DONNÉES en temps réel. Git synchronise le CODE.
# Les données Firestore ne sont PAS stockées dans Git.
echo "Préparation des actions liées à Firestore..."
#
# Exemple 1: Déploiement des index Firestore (si vous utilisez un fichier firestore.indexes.json)
# firebase deploy --only firestore:indexes
#
# Exemple 2: Exécution d'un script de "seeding" ou de transformation de données Firestore
# node scripts/seedFirestore.js
#
# Exemple 3: Déploiement de fonctions Cloud qui interagissent avec Firestore
# firebase deploy --only functions

# 2. Indexer tous les fichiers modifiés
git add .

# 3. Créer un commit
git commit -m "Mise à jour de l'application - version beta 5.1 (Fix corruption)" || echo "Aucun nouveau changement"

# 4. Configurer le dépôt distant (origin)
REMOTE_URL="https://github.com/noob243/kbb-app-juillet-beta-5.0.git"
git remote set-url origin "$REMOTE_URL" 2>/dev/null || git remote add origin "$REMOTE_URL"

# 5. Identifier le nom de la branche actuelle
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "master")

# 6. Pousser les modifications
git push -u origin "$CURRENT_BRANCH" --force