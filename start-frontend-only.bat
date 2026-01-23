@echo off
echo Starting Frontend Only...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Current directory: %CD%
echo.

echo Installing dependencies...
npm install

echo.
echo Checking Vite installation...
npx vite --version

echo.
echo Starting Vite development server...
npx vite --port 3000 --host 0.0.0.0 --open

pause
