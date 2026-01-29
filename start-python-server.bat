@echo off
echo Creating simple HTTP server for React app...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Current directory: %CD%
echo.

echo Starting Python HTTP server on port 3001...
python -m http.server 3001

pause
