const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find @media block for max-width:320px that contains rec1894130211
const regex320 = /@media screen and \(max-width:\s*320px\)\s*\{[^}]*rec1894130211[^}]*\}/g;
let match;
while ((match = regex320.exec(html)) !== null) {
    // Print relevant parts
    const block = match[0];
    if (block.indexOf('1736417625799') !== -1 || block.indexOf('1735199564963') !== -1) {
        console.log(block.substring(0, 500));
        console.log('---');
    }
}

// Try a simpler approach: just find all CSS for 1736417625799
console.log('\n=== All CSS for 1736417625799 ===');
let idx = 0;
while (true) {
    idx = html.indexOf('1736417625799', idx);
    if (idx === -1) break;
    // Is this in a style block?
    const nearStyleStart = html.lastIndexOf('<style', idx);
    const nearStyleEnd = html.lastIndexOf('</style>', idx);
    if (nearStyleStart > nearStyleEnd) {
        // We're inside a style block
        const context = html.substring(Math.max(0, idx - 100), idx + 150);
        console.log(context);
        console.log('---');
    }
    idx++;
}
