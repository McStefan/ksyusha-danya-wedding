const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find rec1894130241 section (ДЕТАЛИ / dresscode area with circles, Людмиле, phone)
// and rec1894130251 (form section)
// Let's find all elements in rec1894130241 and rec1894130251

function findElements(recId) {
    const recMarker = 'id="' + recId + '"';
    const recIdx = html.indexOf(recMarker);
    if (recIdx === -1) { console.log(recId + ' not found'); return; }
    
    console.log('\n=== ' + recId + ' ===');
    
    // Find all data-elem-id in this record
    let searchStart = recIdx;
    const nextRec = html.indexOf('<div id="rec', recIdx + 10);
    const searchEnd = nextRec !== -1 ? nextRec : recIdx + 50000;
    
    const chunk = html.substring(searchStart, searchEnd);
    const regex = /data-elem-id="(\d+)"/g;
    let match;
    while ((match = regex.exec(chunk)) !== null) {
        const elemId = match[1];
        // Find field-title or content near this element
        const elemPos = match.index;
        const elemChunk = chunk.substring(elemPos, elemPos + 1500);
        
        // Look for text content
        let text = '';
        const titleMatch = elemChunk.match(/field-title[^>]*>([^<]+)/);
        if (titleMatch) text = titleMatch[1].trim();
        
        const atomMatch = elemChunk.match(/tn-atom[^>]*>([^<]{1,80})/);
        if (!text && atomMatch) text = atomMatch[1].trim();
        
        const btnMatch = elemChunk.match(/button-text[^>]*>([^<]{1,80})/);
        if (!text && btnMatch) text = btnMatch[1].trim();
        
        // Look for top position
        const topMatch = elemChunk.match(/top:\s*(\d+)px/);
        const top = topMatch ? topMatch[1] : '?';
        
        console.log('  elem=' + elemId + ' top=' + top + ' text="' + text + '"');
    }
}

findElements('rec1894130241');
findElements('rec1894130251');
