@echo off
title Mujeres Event - Setup
cd /d "%~dp0"

echo ============================================
echo   Mujeres Event - Setup
echo ============================================
echo.

:: ── Verify tools ─────────────────────────────
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [MISSING] Git - https://git-scm.com
    pause
    exit /b 1
)
echo [OK] Git

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [MISSING] Node.js - https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js

bun --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [MISSING] Bun - https://bun.sh
    pause
    exit /b 1
)
echo [OK] Bun
echo.

:: ── Clone or update ──────────────────────────
if exist "package.json" (
    echo Updating repo...
    git pull
) else if exist "church-checkin-Mujeres\package.json" (
    echo Repo already cloned, updating...
    cd church-checkin-Mujeres
    git pull
) else (
    echo Cloning repo...
    git clone https://github.com/Claudios12/church-checkin-Mujeres
    if %errorlevel% neq 0 (
        echo ERROR: git clone failed.
        pause
        exit /b 1
    )
    cd church-checkin-Mujeres
)

:: ── .env ─────────────────────────────────────
if not exist ".env" copy ".env.example" ".env" >nul

:: ── Install & build ───────────────────────────
call bun install
if %errorlevel% neq 0 ( echo ERROR: bun install failed. & pause & exit /b 1 )

call bunx nuxt prepare
if %errorlevel% neq 0 ( echo ERROR: nuxt prepare failed. & pause & exit /b 1 )

call bun run build
if %errorlevel% neq 0 ( echo ERROR: Build failed. & pause & exit /b 1 )

:: ── Desktop shortcut ──────────────────────────
set "REPO_DIR=%CD%"
set "SHORTCUT=%USERPROFILE%\Desktop\Mujeres MM.lnk"
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%REPO_DIR%\START.bat'; $s.WorkingDirectory = '%REPO_DIR%'; $s.Description = 'Mujeres M&M Check-in'; $s.Save()"
if exist "%SHORTCUT%" (
    echo [OK] Acceso directo creado en el escritorio
) else (
    echo [WARN] No se pudo crear el acceso directo
)

echo.
echo ============================================
echo   Listo! Usa el acceso directo en el
echo   escritorio o ejecuta START.bat
echo ============================================
pause
