var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Find the rec1894130241 section
var recStart = html.indexOf('id="rec1894130241"');
var recEnd = html.indexOf('id="rec', recStart + 20);
var section = html.substring(recStart, recEnd);

// Find all tn-elem elements in this section and their data-elem-ids
var re = /data-elem-id="(\d+)"/g;
var match;
var elemIds = [];
while ((match = re.exec(section)) !== null) {
  if (!elemIds.includes(match[1])) elemIds.push(match[1]);
}
console.log('All unique elem IDs in rec1894130241:', elemIds.length);

// For each elem, find what type it is (image, text, shape, etc)
for (var id of elemIds) {
  var elemIdx = section.indexOf('tn-elem__18941302411' + id.substring(10));
  // Find the element content
  var searchStr = 'data-elem-id="' + id + '"';
  var idx = section.indexOf(searchStr);
  if (idx === -1) continue;

  // Get surrounding HTML to determine type
  var context = section.substring(idx, Math.min(idx + 500, section.length));
  var type = 'unknown';
  if (context.indexOf('tn-atom__img') >= 0) type = 'IMAGE';
  else if (context.indexOf('tn-atom__shape') >= 0) type = 'SHAPE';
  else if (context.indexOf('<strong>') >= 0 || context.indexOf('tn-atom') >= 0) {
    var textMatch = context.match(/>([^<]{1,50})</);
    type = 'TEXT: ' + (textMatch ? textMatch[1].substring(0, 40) : '?');
  }

  // Find image src if image
  if (type === 'IMAGE') {
    var srcMatch = context.match(/src="([^"]+)"/);
    if (srcMatch) type += ' src=' + srcMatch[1].substring(srcMatch[1].lastIndexOf('/') + 1);
  }

  // Find CSS top position
  var cssSearch = 'data-elem-id="' + id + '"]';
  var cssIdx = html.indexOf(cssSearch);
  var ruleStart = html.indexOf('{', cssIdx);
  var ruleEnd = html.indexOf('}', ruleStart);
  var rule = html.substring(ruleStart, ruleEnd + 1);
  var topMatch = rule.match(/top:(-?\d+)px/);
  var top = topMatch ? topMatch[1] : '?';

  console.log('ID:', id, '| top:', top, '| type:', type);
}
