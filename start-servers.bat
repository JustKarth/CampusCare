@echo off
echo Starting CampusCare servers...
echo.

echo Adding Node.js to PATH...
set PATH=%PATH%;C:\Program Files\nodejs

echo Checking Node.js version...
node --version
npm --version

echo.
echo Starting Backend Server...
cd /d "d:\College\Project\CampusCare\backend"
start "Backend Server" cmd /k "npm run dev"

echo.
echo Starting Frontend Server...
cd /d "d:\College\Project\CampusCare\frontend\react"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Servers should be starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
