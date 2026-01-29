@echo off
echo Testing with CMD instead of PowerShell...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Using CMD to run Node.js...
cmd /c "node --version"

echo.
echo Using CMD to run npm...
cmd /c "npm --version"

echo.
echo Using CMD to run Vite...
cmd /c "node node_modules\vite\bin\vite.js --port 3001 --host 0.0.0.0"

pause
