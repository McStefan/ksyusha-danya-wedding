const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all script blocks related to rec1894130211
const scripts = html.match(/<script>[^<]*rec1894130211[^<]*<\/script>/g);
if (scripts) {
    scripts.forEach(function(s, i) {
        console.log('Script ' + i + ':', s.substring(0, 300));
    });
} else {
    console.log('No inline scripts with rec1894130211');
}

// Check for торжества CSS
const torCSS = html.indexOf('1736417625799');
if (torCSS !== -1) {
    console.log('\nContext around 1736417625799:');
    console.log(html.substring(torCSS - 200, torCSS + 200));
}
