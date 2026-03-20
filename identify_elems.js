const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Get text/type for key elements in rec1894130241
const elems = [
    '1735135983445', '1735207070423', '1735207090949', '1735207111560', 
    '1735207475067', '1735136242479', '1735136424284', '1735136370352',
    '1735206216009', '1735136386033', '1735206222606', '1735207448817',
    '1735136434070', '1735204566665', '1735207242685', '1735207008209',
    '1735136427075', '1735136411946', '1735136659862', '1735207287555',
    '1735137098185', '1735204485182', '1735204495564'
];

elems.forEach(function(id) {
    const marker = 'data-elem-id="' + id + '"';
    const idx = html.indexOf(marker);
    if (idx === -1) return;
    
    const chunk = html.substring(idx, idx + 3000);
    
    // Determine element type
    let type = 'unknown';
    if (chunk.indexOf('tn-atom__img') !== -1) type = 'image';
    else if (chunk.indexOf('t-btn') !== -1 || chunk.indexOf('button') !== -1) type = 'button';
    else if (chunk.indexOf('tn-atom__line') !== -1) type = 'line';
    else if (chunk.indexOf('t-img') !== -1) type = 'image';
    
    // Get text
    const atomMatch = chunk.match(/tn-atom[^>]*>([\s\S]*?)<\/div/);
    let text = atomMatch ? atomMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 80) : '';
    
    // Get image src
    const imgMatch = chunk.match(/data-original="([^"]+)"/);
    const img = imgMatch ? imgMatch[1] : '';
    
    // Get element type from data-elem-type
    const typeMatch = chunk.match(/data-elem-type="(\w+)"/);
    const elemType = typeMatch ? typeMatch[1] : '';
    
    console.log(id + ' type=' + elemType + ' text="' + text + '"' + (img ? ' img=' + img : ''));
});
