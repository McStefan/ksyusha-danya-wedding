const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Form is element 1735208243933 in rec1894130251
// Find its mobile CSS
let idx = 0;
console.log('=== CSS for form 1735208243933 ===');
while (true) {
    idx = html.indexOf('1735208243933', idx);
    if (idx === -1) break;
    const nearStyleStart = html.lastIndexOf('<style', idx);
    const nearStyleEnd = html.lastIndexOf('</style>', idx);
    if (nearStyleStart > nearStyleEnd) {
        const context = html.substring(Math.max(0, idx - 150), idx + 250);
        if (context.indexOf('max-width') !== -1 || context.indexOf('top:') !== -1) {
            console.log(context);
            console.log('---');
        }
    }
    idx++;
}

// Also check the form element's width/left on mobile
console.log('\n=== CSS for rec1894130251 artboard ===');
idx = 0;
while (true) {
    idx = html.indexOf('rec1894130251', idx);
    if (idx === -1) break;
    const nearStyleStart = html.lastIndexOf('<style', idx);
    const nearStyleEnd = html.lastIndexOf('</style>', idx);
    if (nearStyleStart > nearStyleEnd) {
        const context = html.substring(Math.max(0, idx - 50), idx + 200);
        if (context.indexOf('artboard') !== -1) {
            console.log(context);
            console.log('---');
        }
    }
    idx++;
}
