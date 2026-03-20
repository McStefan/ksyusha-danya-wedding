const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check for mobile CSS for rec1894130211 (торжества section)
const idx1 = html.indexOf('1736417625799');
console.log('торжества element ref found:', idx1 !== -1);

const idx2 = html.indexOf('1735199564963');
console.log('Наша свадьба element ref found:', idx2 !== -1);

// Check for the mobile reorder script for rec1894130211
const idx3 = html.indexOf('rec1894130211');
console.log('rec1894130211 refs count:', (html.match(/rec1894130211/g) || []).length);

// Find mobile CSS in head
const headEnd = html.indexOf('</head>');
const headSection = html.substring(0, headEnd);
const mobileCSS = headSection.match(/@media screen and \(max-width:1199px\)[\s\S]*?\}/g);
if (mobileCSS) {
    mobileCSS.forEach(function(m, i) {
        console.log('\nMobile CSS block ' + i + ':', m.substring(0, 300));
    });
}

// Find the reorder script
const reorderIdx = html.indexOf('text.style.top = "250px"');
console.log('\nReorder script (250px) found:', reorderIdx !== -1);

const reorderIdx2 = html.indexOf('text.style.top = "740px"');
console.log('Reorder script (740px) found:', reorderIdx2 !== -1);
