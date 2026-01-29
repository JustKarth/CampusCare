@echo off
echo Testing direct Vite startup...
set PATH=%PATH%;C:\Program Files\nodejs

cd /d "d:\College\Project\CampusCare\frontend\react"

echo Current directory: %CD%
echo Node version:
node --version
echo NPM version:
npm --version

echo.
echo Installing dependencies...
npm install

echo.
echo Starting Vite directly...
npx vite --port 3000 --host 0.0.0.0

pause
