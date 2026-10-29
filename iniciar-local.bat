@echo off
setlocal
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js 22 o superior y vuelve a abrir este archivo.
  pause
  exit /b 1
)
if not exist node_modules\.bin\vite.cmd (
  call npm.cmd ci
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias. Revisa tu conexion.
    pause
    exit /b 1
  )
)
call npm.cmd start
if errorlevel 1 pause
