var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

var ids = [
  '1735207070423', '1735207090949', '1735207111560', // header images
  '1735205096248', '1735205096251', '1735205096254', // circles
  '1735205096257', '1735205211087', '1735205211092', '1735205099999',
];

for (var id of ids) {
  var search = 'data-elem-id="' + id + '"]';
  var pos = 0;
  var count = 0;
  while (true) {
    var idx = html.indexOf(search, pos);
    if (idx === -1) break;
    count++;
    var ruleStart = html.indexOf('{', idx);
    var ruleEnd = html.indexOf('}', ruleStart);
    var rule = html.substring(ruleStart, ruleEnd + 1);
    var topMatch = rule.match(/top:([^;]+)/);
    var leftMatch = rule.match(/left:([^;]+)/);
    console.log(id, 'occurrence', count, '- top:', topMatch ? topMatch[1] : 'none', '| left:', leftMatch ? leftMatch[1].substring(0,30) : 'none');
    pos = idx + 1;
  }
}

// Check scale style for these elements
var scaleIdx = html.indexOf('@media screen and (max-width:1199px)');
if (scaleIdx === -1) scaleIdx = html.indexOf('t396__elem tn-elem');
console.log('\n--- Looking for scale/important overrides ---');
for (var id of ids) {
  var re = new RegExp('1735207070423|1735207090949|1735207111560|1735205096248');
  // Find all occurrences
  var search2 = id;
  var p2 = 0;
  while(true) {
    var i2 = html.indexOf(search2, p2);
    if (i2 === -1) break;
    // Check context
    var ctx = html.substring(Math.max(0, i2-50), i2+200);
    if (ctx.indexOf('!important') >= 0) {
      console.log('IMPORTANT override found for', id, ':', ctx.substring(0, 100));
    }
    p2 = i2 + 1;
  }
}

// Also find where the standalone photo section is
var photoIdx = html.indexOf('rec_dresscode_photo');
console.log('\nPhoto section at char index:', photoIdx);
console.log('Context:', html.substring(photoIdx - 50, photoIdx + 200));
