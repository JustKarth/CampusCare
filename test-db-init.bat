@echo off
echo Testing database initialization with output capture...
cd /d "d:\College\Project\CampusCare\backend

echo Starting database init...
"C:\Program Files\nodejs\node.exe" scripts\init-database.js > db_init_output.txt 2>&1

echo.
echo Database initialization output:
type db_init_output.txt

pause
