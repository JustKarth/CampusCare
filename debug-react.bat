@echo off
echo Testing React Frontend Setup...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Current directory: %CD%
echo.

echo Testing Node.js...
node -e "console.log('Node.js version:', process.version)"
node -e "console.log('Current working directory:', process.cwd())"

echo.
echo Testing if modules can be loaded...
node -e "try { require('vite'); console.log('Vite: OK'); } catch(e) { console.log('Vite: ERROR -', e.message); }"
node -e "try { require('./package.json'); console.log('Package.json: OK'); } catch(e) { console.log('Package.json: ERROR -', e.message); }"

echo.
echo Starting Vite with explicit error output...
node node_modules\vite\bin\vite.js --port 3001 --host 0.0.0.0 --debug

pause
