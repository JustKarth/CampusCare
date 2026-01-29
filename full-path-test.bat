@echo off
echo Testing Windows-specific Node.js execution...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Using full path to Node.js...
"C:\Program Files\nodejs\node.exe" --version

echo.
echo Using full path to Vite...
"C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\vite\bin\vite.js" --port 3001 --host 0.0.0.0

pause
