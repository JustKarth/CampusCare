@echo off
echo Testing Node.js with output redirection...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Testing Node.js version...
node --version > node_version.txt 2>&1
type node_version.txt

echo.
echo Testing npm version...
npm --version > npm_version.txt 2>&1
type npm_version.txt

echo.
echo Testing Vite directly...
node node_modules\vite\bin\vite.js --version > vite_version.txt 2>&1
type vite_version.txt

echo.
echo Starting Vite with output capture...
node node_modules\vite\bin\vite.js --port 3001 --host 0.0.0.0 > vite_output.txt 2>&1

echo Server started. Check vite_output.txt for details...
type vite_output.txt

pause
