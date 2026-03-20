const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// For rec1894130241, find elements with their mobile (320) positions
const recIdx = html.indexOf('id="rec1894130241"');
const nextRec = html.indexOf('<div id="rec', recIdx + 10);
const chunk = html.substring(recIdx, nextRec);

// Find all tn-elem blocks with their data-elem-id and resolution-320 positions
const elemRegex = /data-elem-id="(\d+)"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;

// Simpler: find data-elem-id and look for data-field-top-res-320 nearby
const parts = chunk.split('data-elem-id="');
parts.forEach(function(part, i) {
    if (i === 0) return;
    const elemId = part.substring(0, part.indexOf('"'));
    
    // Find mobile top
    const mTopMatch = part.match(/data-field-top-res-320-value="(\d+)"/);
    const topMatch = part.match(/data-field-top-value="(\d+)"/);
    
    // Find text content
    const textMatch = part.match(/tn-atom[^>]*>([^<]{1,60})/);
    const text = textMatch ? textMatch[1].trim() : '';
    
    const mTop = mTopMatch ? mTopMatch[1] : '-';
    const dTop = topMatch ? topMatch[1] : '-';
    
    if (text || mTop !== '-') {
        console.log('elem=' + elemId + ' desktop-top=' + dTop + ' mobile-top=' + mTop + ' text="' + text + '"');
    }
});
