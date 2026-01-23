@echo off
echo Testing if we can create a simple server...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Creating a simple Node.js HTTP server...
(
echo const http = require('http');
echo const fs = require('fs');
echo const path = require('path');
echo.
echo const server = http.createServer((req, res) =^> {
echo   let filePath = '.' + req.url;
echo   if (filePath === './') filePath = './index.html';
echo.
echo   const extname = String(path.extname(filePath)).toLowerCase();
echo   const mimeTypes = {
echo     '.html': 'text/html',
echo     '.js': 'text/javascript',
echo     '.css': 'text/css',
echo     '.json': 'application/json',
echo     '.png': 'image/png',
echo     '.jpg': 'image/jpg',
echo     '.gif': 'image/gif',
echo     '.svg': 'image/svg+xml',
echo     '.wav': 'audio/wav',
echo     '.mp4': 'video/mp4',
echo     '.woff': 'application/font-woff',
echo     '.ttf': 'application/font-ttf',
echo     '.eot': 'application/vnd.ms-fontobject',
echo     '.otf': 'application/font-otf',
echo     '.wasm': 'application/wasm'
echo   };
echo.
echo   const contentType = mimeTypes[extname] || 'application/octet-stream';
echo.
echo   fs.readFile(filePath, (error, content) =^> {
echo     if (error) {
echo       if(error.code == 'ENOENT') {
echo         fs.readFile('./index.html', (error, content) =^> {
echo           res.writeHead(200, { 'Content-Type': 'text/html' });
echo           res.end(content, 'utf-8');
echo         });
echo       } else {
echo         res.writeHead(500);
echo         res.end('Server Error: ' + error.code);
echo       }
echo     } else {
echo       res.writeHead(200, { 'Content-Type': contentType });
echo       res.end(content, 'utf-8');
echo     }
echo   });
echo });
echo.
echo server.listen(3001, '0.0.0.0', () =^> {
echo   console.log('Server running at http://localhost:3001/');
echo   console.log('Press Ctrl+C to stop');
echo });
) > simple-server.js

echo Starting simple server...
node simple-server.js

pause
