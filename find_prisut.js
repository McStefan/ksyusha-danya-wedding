const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idx = 234367;
// Show context around "присутств"
console.log(html.substring(idx - 300, idx + 200));
