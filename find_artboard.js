const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find artboard heights for rec1894130241 and rec1894130251
['rec1894130241', 'rec1894130251'].forEach(function(recId) {
    const recIdx = html.indexOf('id="' + recId + '"');
    const nextRec = html.indexOf('<div id="rec', recIdx + 10);
    const chunk = html.substring(recIdx, nextRec !== -1 ? nextRec : recIdx + 20000);
    
    // Find artboard height
    const abMatch = chunk.match(/t396__artboard[\s\S]*?height:\s*(\d+)px/);
    console.log(recId + ' artboard height: ' + (abMatch ? abMatch[1] : '?'));
    
    // Find all resolution-specific heights
    const resMatches = chunk.match(/data-artboard-height[^=]*="[^"]*"/g);
    if (resMatches) {
        resMatches.forEach(function(m) { console.log('  ' + m); });
    }
    
    // Find mobile artboard settings
    const mobileH = chunk.match(/data-artboard-height_mobile="(\d+)"/);
    if (mobileH) console.log('  mobile height: ' + mobileH[1]);
    
    const heightAttr = chunk.match(/data-artboard-height="(\d+)"/);
    if (heightAttr) console.log('  base height: ' + heightAttr[1]);
});
