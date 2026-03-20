const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// торжества element 1736417625799 - find mobile position
['1736417625799', '1735199564963', '1735200598911', '1735136659862'].forEach(function(id) {
    const marker = 'data-elem-id="' + id + '"';
    const idx = html.indexOf(marker);
    if (idx === -1) { console.log(id + ' NOT FOUND'); return; }
    const chunk = html.substring(idx, idx + 3000);
    
    const top320 = chunk.match(/data-field-top-res-320-value="(\d+)"/);
    const topDef = chunk.match(/data-field-top-value="(\d+)"/);
    const left320 = chunk.match(/data-field-left-res-320-value="(-?\d+)"/);
    
    // Find text
    let text = '';
    const nearbyTexts = ['торжества', 'Наша свадьба', 'благодарны', 'поддержите'];
    const bigChunk = html.substring(idx, idx + 5000);
    nearbyTexts.forEach(function(t) { if (bigChunk.indexOf(t) !== -1) text += t + ' '; });
    
    console.log(id + ' top=' + (topDef ? topDef[1] : '?') + ' m-top=' + (top320 ? top320[1] : '?') + ' m-left=' + (left320 ? left320[1] : '?') + ' [' + text.trim() + ']');
});
