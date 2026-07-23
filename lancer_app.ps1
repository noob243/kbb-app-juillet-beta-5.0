Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  KBB APP - SYSTEME DE GESTION JURIDIQUE (BETA 5.1)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node
try {
    $nodeVer = node -v
    Write-Host "[1/3] Node.js détecté : $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Node.js n'est pas installé. Téléchargez-le sur https://nodejs.org/" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

# 2. Check node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[2/3] Installation des dépendances..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[2/3] Dépendances déjà installées." -ForegroundColor Green
}

# 3. Start App
Write-Host "[3/3] Démarrage du serveur..." -ForegroundColor Green
Write-Host ""
Write-Host "------------------------------------------------------"
Write-Host " URL : http://localhost:3000" -ForegroundColor Cyan
Write-Host "------------------------------------------------------"
Write-Host ""

npm run dev
