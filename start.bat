@echo off
cd /d "%~dp0"
title Charmaine's 18th Debut Invitation - Local Server

where node >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ========================================================
    echo Starting local web server with Node.js...
    echo ========================================================
    node server.js
) else (
    echo Node.js not detected in PATH.
    echo Opening index.html directly in your default browser...
    start "" "index.html"
)
pause

