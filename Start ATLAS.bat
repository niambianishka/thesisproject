@echo off
title ATLAS launcher
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo   Node.js was not found on this PC, so the local server cannot start.
    echo   Install it from https://nodejs.org/ and run this file again.
    echo.
    echo   You can still open index.html directly, but YouTube blocks the
    echo   lecture videos when pages are opened as local files.
    echo.
    pause
    exit /b 1
)

start "ATLAS server" /min cmd /c "node ""%~dp0atlas-server.js"""
ping -n 3 127.0.0.1 >nul
start "" "http://localhost:8080/index.html"

echo.
echo   ATLAS is starting at http://localhost:8080/index.html
echo   A minimised "ATLAS server" window keeps it running - close that
echo   window when you are finished.
echo.
ping -n 4 127.0.0.1 >nul
