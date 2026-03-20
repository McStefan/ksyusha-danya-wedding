const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find ПРИСУТСТВИЕ
let idx = html.indexOf('ПРИСУТСТВИЕ');
if (idx !== -1) {
    // Find nearest rec id
    let recIdx = html.lastIndexOf('id="rec', idx);
    let recEnd = html.indexOf('"', recIdx + 5);
    let recId = html.substring(recIdx, recEnd + 1);
    
    // Find nearest data-elem-id
    let elemIdx = html.lastIndexOf('data-elem-id="', idx);
    let elemEnd = html.indexOf('"', elemIdx + 15);
    let elemId = html.substring(elemIdx, elemEnd + 1);
    
    console.log('ПРИСУТСТВИЕ found at pos', idx);
    console.log('In record:', recId);
    console.log('Element:', elemId);
    console.log('Context:', html.substring(idx - 200, idx + 50).replace(/\n/g, ' '));
}

// Find "Планируете ли"
idx = html.indexOf('Планируете ли');
if (idx !== -1) {
    let recIdx = html.lastIndexOf('id="rec', idx);
    let recEnd = html.indexOf('"', recIdx + 5);
    console.log('\nПланируете ли - in record:', html.substring(recIdx, recEnd + 1));
}

// Find section order (all rec IDs)
const recRegex = /id="rec(\d+)"/g;
let match;
let recs = [];
while ((match = recRegex.exec(html)) !== null) {
    if (recs.indexOf(match[1]) === -1) recs.push(match[1]);
}
console.log('\nAll records in order:', recs.join(', '));
