@echo off
title Importar Lista
cd /d "%~dp0"

echo ============================================
echo   Importar lista de asistentes
echo ============================================
echo.

set "DEFAULT_XLSX=%USERPROFILE%\Downloads\LISTADO CRISTIAN.xlsx"

if "%~1"=="" (
    set "XLSX_PATH=%DEFAULT_XLSX%"
) else (
    set "XLSX_PATH=%~1"
)

echo Archivo: %XLSX_PATH%
echo.

node scripts\import-roster.cjs "%XLSX_PATH%"
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Importacion fallida.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Lista importada! Reinicia la app si
echo   ya esta corriendo (Ctrl+C en START.bat
echo   y vuelve a ejecutarlo).
echo ============================================
pause
