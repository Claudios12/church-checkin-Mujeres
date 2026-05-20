@echo off
title Mujeres M&M - Update
cd /d "%~dp0"

echo ============================================
echo   Mujeres M&M - Update
echo ============================================
echo.

git pull
if %errorlevel% neq 0 (
    echo ERROR: git pull failed. Check your internet connection.
    pause
    exit /b 1
)
echo [OK] Repo updated
echo.

call bun install
if %errorlevel% neq 0 ( echo ERROR: bun install failed. & pause & exit /b 1 )

call bun run build
if %errorlevel% neq 0 ( echo ERROR: Build failed. & pause & exit /b 1 )

echo.
echo ============================================
echo   Listo! Ejecuta START.bat para iniciar.
echo ============================================
pause
