const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find CSS for 1735199564963
let idx = 0;
while (true) {
    idx = html.indexOf('1735199564963', idx);
    if (idx === -1) break;
    const nearStyleStart = html.lastIndexOf('<style', idx);
    const nearStyleEnd = html.lastIndexOf('</style>', idx);
    if (nearStyleStart > nearStyleEnd) {
        const context = html.substring(Math.max(0, idx - 100), idx + 200);
        console.log(context);
        console.log('---');
    }
    idx++;
}
