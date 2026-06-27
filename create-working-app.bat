@echo off
echo Creating a working React app setup...
cd /d "d:\College\Project\CampusCare\frontend\react

echo Creating a working HTML file with React CDN...
echo ^<!DOCTYPE html^> > index-working.html
echo ^<html lang="en"^> >> index-working.html
echo ^<head^> >> index-working.html
echo   ^<meta charset="UTF-8"^> >> index-working.html
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> index-working.html
echo   ^<title^>CampusCare - Working Version^</title^> >> index-working.html
echo   ^<script src="https://unpkg.com/react@18/umd/react.development.js"^>^</script^> >> index-working.html
echo   ^<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"^>^</script^> >> index-working.html
echo   ^<script src="https://unpkg.com/@babel/standalone/babel.min.js"^>^</script^> >> index-working.html
echo   ^<script src="https://cdn.tailwindcss.com"^>^</script^> >> index-working.html
echo ^</head^> >> index-working.html
echo ^<body^> >> index-working.html
echo   ^<div id="root"^>^</div^> >> index-working.html
echo   ^<script type="text/babel"^> >> index-working.html
echo     const App = ^(^) =^> ^{ >> index-working.html
echo       return ^(^ >> index-working.html
echo         ^<div className="min-h-screen bg-gray-50 flex items-center justify-center"^> >> index-working.html
echo           ^<div className="text-center"^> >> index-working.html
echo             ^<h1 className="text-4xl font-bold text-blue-600 mb-4"^>CampusCare^</h1^> >> index-working.html
echo             ^<p className="text-gray-600 mb-4"^>Your Campus Community Platform^</p^> >> index-working.html
echo             ^<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"^> >> index-working.html
echo               ^<p className="font-bold"^>Frontend Working!^</p^> >> index-working.html
echo               ^<p^>React app is running successfully.^</p^> >> index-working.html
echo             ^</div^> >> index-working.html
echo           ^</div^> >> index-working.html
echo         ^</div^> >> index-working.html
echo       ^)^; >> index-working.html
echo     ^}^; >> index-working.html
echo     ReactDOM.render^(^<App /^>, document.getElementById^('root')^)^; >> index-working.html
echo   ^</script^> >> index-working.html
echo ^</body^> >> index-working.html
echo ^</html^> >> index-working.html

echo.
echo Starting simple HTTP server for working version...
python -m http.server 3002

pause
