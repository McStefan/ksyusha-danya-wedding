const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Get all text content in rec1894130211
const recStart = html.indexOf('id="rec1894130211"');
const recEnd = html.indexOf('<div id="rec', recStart + 20);
const section = html.substring(recStart, recEnd);

// Find all tn-atom text content
const atomRegex = /<div class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
let match;
let count = 0;
while ((match = atomRegex.exec(section)) !== null && count < 20) {
    let text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 3) {
        // Find nearest data-elem-id
        const before = section.substring(Math.max(0, match.index - 500), match.index);
        const idMatch = before.match(/data-elem-id="(\d+)"/g);
        const lastId = idMatch ? idMatch[idMatch.length - 1].match(/\d+/)[0] : '?';
        console.log(lastId + ': "' + text.substring(0, 80) + '"');
        count++;
    }
}
