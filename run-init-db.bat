@echo off
echo Running database initialization...
cd /d "d:\College\Project\CampusCare\backend"

echo Current directory: %CD%
echo.

echo Using full path to Node.js...
"C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\npm.cmd" run init-db

echo.
echo Database initialization completed.
pause
