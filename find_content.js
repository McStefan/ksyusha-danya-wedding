var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Find all tn-atom content within rec1894130241
var recStart = html.indexOf('<div id="rec1894130241"');
var recEnd = html.indexOf('<div id="rec', recStart + 30);
var section = html.substring(recStart, recEnd);

// Find all tn-atom elements and their content
var atomRe = /data-elem-id="(\d+)"[\s\S]*?class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
var match;
while ((match = atomRe.exec(section)) !== null) {
  var id = match[1];
  var content = match[2].replace(/<[^>]+>/g, '|').trim().substring(0, 80);
  // Find image
  var imgRe2 = /data-elem-id="(\d+)"[\s\S]*?<img[^>]*src="([^"]+)"/;
  console.log(id, '-', content || '(no text)');
}

// Also find images
console.log('\n--- IMAGES ---');
var imgRe = /<img[^>]*?class="tn-atom__img[^"]*"[^>]*?src="([^"]+)"[^>]*?>/g;
while ((match = imgRe.exec(section)) !== null) {
  // Find parent elem id
  var before = section.substring(Math.max(0, section.lastIndexOf('data-elem-id', match.index)), match.index);
  var idMatch = before.match(/data-elem-id="(\d+)"/);
  console.log(idMatch ? idMatch[1] : '?', '- IMG:', match[1].split('/').pop());
}

// Find background images
console.log('\n--- BG IMAGES ---');
var bgRe = /data-elem-id="(\d+)"[\s\S]*?background-image:\s*url\(([^)]+)\)/g;
while ((match = bgRe.exec(section)) !== null) {
  console.log(match[1], '- BG:', match[2].split('/').pop());
}
