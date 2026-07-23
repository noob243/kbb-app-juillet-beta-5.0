@echo off
title KBB App - Lancement Local
echo ======================================================
echo   KBB APP - SYSTEME DE GESTION JURIDIQUE (BETA 5.1)
echo ======================================================
echo.
echo [1/3] Verification de l'environnement...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe sur cette machine.
    echo Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b
)

echo [2/3] Verification des modules...
if not exist "node_modules\" (
    echo Installation des dependances en cours (patientez)...
    call npm install
)

echo [3/3] Demarrage du serveur de developpement...
echo.
echo ------------------------------------------------------
echo  L'APPLICATION SERA PRETE DANS QUELQUES SECONDES
echo  URL : http://localhost:3000
echo ------------------------------------------------------
echo.
npm run dev
pause
