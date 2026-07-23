# 1. Nettoyage du dépôt corrompu
if (Test-Path .git) {
    Remove-Item -Recurse -Force .git
}

# 2. Réinitialisation
git init
git remote add origin https://github.com/noob243/kbb-app-juillet-beta-5.0.git

# 3. Indexation et premier commit
git add .
git commit -m "Mise à jour de l'application - version beta 5.1 (Dépôt réparé)"

# 4. Renommer la branche en main (standard GitHub)
git branch -M main

# 5. Push forcé (nécessaire car on a réinitialisé l'historique local)
git push -u origin main --force