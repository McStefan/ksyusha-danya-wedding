const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// rec1894130241 = ДРЕСС-КОД section
// rec1894130251 = form/ПРИСУТСТВИЕ section  
// Find what elements are in rec1894130251 with their mobile positions

const recIds = ['rec1894130241', 'rec1894130251'];
recIds.forEach(function(recId) {
    const startIdx = html.indexOf('id="' + recId + '"');
    if (startIdx === -1) { console.log(recId + ' NOT FOUND'); return; }
    
    // Find section boundary
    const nextRecIdx = html.indexOf('<div id="rec', startIdx + 20);
    const section = html.substring(startIdx, nextRecIdx !== -1 ? nextRecIdx : startIdx + 50000);
    
    console.log('\n=== ' + recId + ' ===');
    
    // Find artboard height
    const abH = section.match(/data-artboard-height="(\d+)"/);
    const abH320 = section.match(/data-artboard-height-res-320="(\d+)"/);
    console.log('Height: desktop=' + (abH ? abH[1] : '?') + ' mobile=' + (abH320 ? abH320[1] : '?'));
    
    // Find all unique elem IDs and their mobile/desktop top
    const seen = {};
    const elemRegex = /data-elem-id="(\d+)"/g;
    let match;
    while ((match = elemRegex.exec(section)) !== null) {
        const id = match[1];
        if (seen[id]) continue;
        seen[id] = true;
        
        // Find this element's full block to get field values
        const elemIdx = match.index;
        const elemChunk = section.substring(elemIdx, elemIdx + 5000);
        
        const topVal = elemChunk.match(/data-field-top-value="(\d+)"/);
        const top320 = elemChunk.match(/data-field-top-res-320-value="(\d+)"/);
        
        // Find text content
        let text = '';
        const texts = [
            'По всем вопросам', 'Мы будем очень', 'организатору', 'Людмил',
            '8-913', 'ДЕТАЛИ', 'Планируете', 'заполните', 'Отправить',
            'ДРЕСС', 'благодарны', 'поддержите', 'ПРИСУТСТВ'
        ];
        texts.forEach(function(t) {
            if (elemChunk.indexOf(t) !== -1) text += t + ' ';
        });
        
        if (text || top320) {
            console.log('  ' + id + ' top=' + (topVal ? topVal[1] : '?') + ' m-top=' + (top320 ? top320[1] : '?') + (text ? ' [' + text.trim() + ']' : ''));
        }
    }
});
