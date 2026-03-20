const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find "торжества" text precisely
const idx = html.indexOf('>торжества<');
if (idx !== -1) {
    // Search backwards for data-elem-id
    const before = html.substring(Math.max(0, idx - 2000), idx);
    const ids = before.match(/data-elem-id="(\d+)"/g);
    if (ids) {
        const lastId = ids[ids.length - 1].match(/\d+/)[0];
        console.log('торжества element ID:', lastId);
        
        // Now find this element's mobile CSS
        const cssIdx = html.indexOf('data-elem-id="' + lastId + '"');
        const chunk = html.substring(cssIdx, cssIdx + 2000);
        const mTop = chunk.match(/data-field-top-res-320-value="(\d+)"/);
        console.log('mobile top:', mTop ? mTop[1] : 'not found');
    }
}

// Same for "Наша свадьба"
const idx2 = html.indexOf('Наша свадьба будет');
if (idx2 !== -1) {
    const before2 = html.substring(Math.max(0, idx2 - 2000), idx2);
    const ids2 = before2.match(/data-elem-id="(\d+)"/g);
    if (ids2) {
        const lastId2 = ids2[ids2.length - 1].match(/\d+/)[0];
        console.log('\nНаша свадьба element ID:', lastId2);
        const cssIdx2 = html.indexOf('data-elem-id="' + lastId2 + '"');
        const chunk2 = html.substring(cssIdx2, cssIdx2 + 2000);
        const mTop2 = chunk2.match(/data-field-top-res-320-value="(\d+)"/);
        console.log('mobile top:', mTop2 ? mTop2[1] : 'not found');
    }
}

// And "Мы будем очень благодарны"
const idx3 = html.indexOf('Мы будем очень благодарны');
if (idx3 !== -1) {
    const before3 = html.substring(Math.max(0, idx3 - 2000), idx3);
    const ids3 = before3.match(/data-elem-id="(\d+)"/g);
    if (ids3) {
        const lastId3 = ids3[ids3.length - 1].match(/\d+/)[0];
        console.log('\nМы будем element ID:', lastId3);
        const cssIdx3 = html.indexOf('data-elem-id="' + lastId3 + '"');
        const chunk3 = html.substring(cssIdx3, cssIdx3 + 2000);
        const mTop3 = chunk3.match(/data-field-top-res-320-value="(\d+)"/);
        console.log('mobile top:', mTop3 ? mTop3[1] : 'not found');
    }
}
