const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all text content and which rec they belong to
const texts = ['ДРЕСС-КОД', 'ДЕТАЛИ', 'По всем вопросам', 'благодарны', 'организатору', '8-913-950-32-11', 'ПРИСУТСТВ', 'Планируете', 'заполните анкету', 'Отправить', 'Обязательно приду', 'Искренне'];

texts.forEach(function(t) {
    let idx = html.indexOf(t);
    if (idx === -1) { console.log(t + ': NOT FOUND'); return; }
    
    // Find which rec
    let recIdx = html.lastIndexOf('id="rec', idx);
    let recMatch = html.substring(recIdx, recIdx + 25).match(/rec(\d+)/);
    let rec = recMatch ? recMatch[1] : '?';
    
    console.log('"' + t + '" => rec' + rec);
});
