var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Check rec1894130251 (SAVE the DATE)
console.log('rec1894130251 exists:', html.indexOf('rec1894130251') >= 0);

// Find all name references
var names = ['ДАНЯ', 'КСЮША', 'Даниил', 'Дарья', 'ДАНИИЛ', 'ДАРЬЯ', 'Даня', 'Ксюша'];
for (var name of names) {
  var idx = html.indexOf(name);
  if (idx >= 0) {
    var before = html.substring(Math.max(0, idx - 80), idx);
    var after = html.substring(idx, idx + 80);
    console.log('\nFound "' + name + '":');
    console.log('  ...' + before.substring(before.length - 40) + '[HERE]' + after.substring(name.length, name.length + 40));
  } else {
    console.log(name + ': NOT FOUND');
  }
}

// Check images in rec1894130161 (hero section)
var rec161 = html.indexOf('<div id="rec1894130161"');
var rec171 = html.indexOf('<div id="rec1894130171"');
var section = html.substring(rec161, rec171);

// Find all image filenames
var re = /src="([^"]+\.(png|webp|jpg)[^"]*)"/g;
var m;
console.log('\n--- Images in rec1894130161 ---');
while ((m = re.exec(section)) !== null) {
  console.log('  ' + m[1].split('/').pop());
}

// Check what text elements are in rec1894130161
var textRe = /class="tn-atom"[^>]*>([^<]+)</g;
console.log('\n--- Text in rec1894130161 ---');
while ((m = textRe.exec(section)) !== null) {
  if (m[1].trim().length > 0) console.log('  "' + m[1].trim().substring(0, 60) + '"');
}

// Check rec1894130171 for SAVE the DATE
var rec181 = html.indexOf('<div id="rec1894130181"');
var section171 = html.substring(rec171, rec181);
var re2 = /src="([^"]+\.(png|webp|jpg)[^"]*)"/g;
console.log('\n--- Images in rec1894130171 ---');
while ((m = re2.exec(section171)) !== null) {
  console.log('  ' + m[1].split('/').pop());
}
var textRe2 = /class="tn-atom"[^>]*>([^<]+)</g;
console.log('\n--- Text in rec1894130171 ---');
while ((m = textRe2.exec(section171)) !== null) {
  if (m[1].trim().length > 0) console.log('  "' + m[1].trim().substring(0, 60) + '"');
}
