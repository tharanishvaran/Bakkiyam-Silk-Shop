@echo off
title Bakkiyam Silk Saree Shop Launcher
color 0B

:: Ensure script runs from the project directory
cd /d "%~dp0"

echo ========================================================
echo       Bakkiyam Silk Saree Shop - Launcher
echo ========================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not found in your PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check Backend dependencies
if not exist "backend\node_modules" (
    echo [INFO] Backend dependencies missing. Installing...
    cd /d "%~dp0backend"
    call npm install
    cd /d "%~dp0"
    echo.
)

:: 3. Check Frontend dependencies
if not exist "frontend\node_modules" (
    echo [INFO] Frontend dependencies missing. Installing...
    cd /d "%~dp0frontend"
    call npm install
    cd /d "%~dp0"
    echo.
)

:: 4. Start Backend Server
echo [1/2] Starting Backend Server (Port 5000)...
start "Bakkiyam Silk Saree - Backend (5000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

:: 5. Start Frontend Server
echo [2/2] Starting Frontend Dev Server (Port 5173)...
start "Bakkiyam Silk Saree - Frontend (5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo   Servers are launching:
echo     * Backend API:  http://localhost:5000
echo     * Frontend App: http://localhost:5173
echo ========================================================
echo.
echo Waiting 3 seconds to launch your browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo Done! Both backend and frontend servers are active in separate windows.
echo To stop them, simply close their respective command prompt windows.
echo.
pause
