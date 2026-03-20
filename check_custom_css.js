const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all custom style blocks (ones we injected)
const headEnd = html.indexOf('</head>');
const head = html.substring(0, headEnd);

// Find injected style blocks (after Tilda's styles)
const styles = head.match(/<style>[\s\S]*?<\/style>/g);
if (styles) {
    styles.forEach(function(s, i) {
        if (s.indexOf('!important') !== -1) {
            console.log('Custom style block ' + i + ' (' + s.length + ' chars):');
            console.log(s.substring(0, 500));
            console.log('---');
        }
    });
}
