@echo off
setlocal
title KBB App - Lancement Local

echo ======================================================
echo   KBB APP - SYSTEME DE GESTION JURIDIQUE (BETA 5.1)
echo ======================================================
echo.

:: 1. Vérification de Node.js
echo [1/3] Verification de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe.
    echo Veuillez l'installer sur https://nodejs.org/
    goto :error
)

:: 2. Vérification de npm
echo [2/3] Verification de npm...
call npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] npm n'est pas reconnu comme commande interne.
    goto :error
)

:: 3. Installation si node_modules absent
if not exist "node_modules\" (
    echo [INFO] node_modules absent. Installation des dependances...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] L'installation des dependances a echoue.
        goto :error
    )
)

:: 4. Lancement
echo [3/3] Demarrage du serveur...
echo.
echo ------------------------------------------------------
echo  URL : http://localhost:3000
echo  Appuyez sur CTRL+C pour arreter le serveur.
echo ------------------------------------------------------
echo.
call npm run dev
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible de lancer le serveur de developpement.
    goto :error
)

goto :end

:error
echo.
echo Le processus s'est arrete avec une erreur.
pause

:end
endlocal
