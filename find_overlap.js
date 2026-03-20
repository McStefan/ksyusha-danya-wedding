const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Look for large text elements in rec1894130241 and rec1894130251
// Find text content of specific elements
const elems = ['1735207756097', '1735207882466', '1735136659862', '1735207287555', '1735136424284', '1735136370352', '1735207008209'];

elems.forEach(function(elemId) {
    const marker = 'data-elem-id="' + elemId + '"';
    let idx = html.indexOf(marker);
    if (idx === -1) return;
    
    // Get surrounding text (2000 chars)
    const chunk = html.substring(idx, idx + 2000);
    
    // Find tn-atom content
    const atomMatch = chunk.match(/tn-atom[^>]*>([\s\S]*?)<\/div/);
    let text = atomMatch ? atomMatch[1].replace(/<[^>]+>/g, ' ').trim().substring(0, 100) : '';
    
    // Find record
    const recIdx = html.lastIndexOf('id="rec', idx);
    const recMatch = html.substring(recIdx, recIdx + 30).match(/rec(\d+)/);
    const rec = recMatch ? recMatch[1] : '?';
    
    // Find all top values for this element  
    const tops = [];
    const topRegex = /top:\s*(\d+)px/g;
    let tm;
    while ((tm = topRegex.exec(chunk)) !== null) {
        tops.push(tm[1]);
    }
    
    console.log('elem=' + elemId + ' rec=' + rec + ' tops=' + tops.join(',') + ' text="' + text + '"');
});

// Also look for "Подтвердите" or similar
['Подтвердите', 'Присутств', 'присутств', 'ВАШЕ', 'ваше'].forEach(function(w) {
    let i = html.indexOf(w);
    if (i !== -1) console.log('Found "' + w + '" at pos ' + i);
});
