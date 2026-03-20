const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('var tmp = document.createElement');
if (idx !== -1) {
    const start = html.lastIndexOf('<script>', idx);
    const end = html.indexOf('</script>', idx) + '</script>'.length;
    console.log(html.substring(start, end));
}
