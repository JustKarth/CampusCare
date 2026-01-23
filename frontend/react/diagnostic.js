console.log('=== Node.js Diagnostic Test ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Current directory:', process.cwd());

try {
  const fs = require('fs');
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  console.log('Package.json loaded successfully');
  console.log('Project name:', packageJson.name);
  console.log('Scripts:', Object.keys(packageJson.scripts));
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

try {
  const vite = require('vite');
  console.log('Vite module loaded successfully');
} catch (error) {
  console.error('Error loading vite:', error.message);
}

console.log('=== Diagnostic Complete ===');
