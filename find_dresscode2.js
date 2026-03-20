var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Find all elements in rec1894130241 and extract their content
var ids = ['1735206152834','1735135983445','1735207070423','1735207090949','1735207111560',
  '1735207475067','1735204485182','1735204495564','1735136242479','1735136424284',
  '1735136370352','1735206216009','1735136386033','1735206222606','1735207448817',
  '1735136434070','1735204566665','1735207242685','1735207008209','1735136427075',
  '1735136420415','1735136411946','1735136659862','1735207287555','1735137098185',
  '1735206438966'];

for (var id of ids) {
  // Find the div element
  var divSearch = 'tn-elem__18941302411' + id;
  var idx = html.indexOf(divSearch);
  if (idx === -1) {
    // Try alternate pattern
    divSearch = 'data-elem-id="' + id + '"';
    idx = html.indexOf(divSearch);
    if (idx === -1) continue;
  }

  // Get a big chunk of HTML after this point
  var chunk = html.substring(idx, idx + 1000);

  // Find images
  var imgMatch = chunk.match(/src="([^"]+\.(png|jpg|webp|svg))"/);
  // Find text content in tn-atom
  var textMatch = chunk.match(/class="tn-atom"[^>]*>([^<]*(?:<[^>]+>[^<]*)*)/);

  var desc = '';
  if (imgMatch) desc = 'IMG: ' + imgMatch[1].split('/').pop();
  if (textMatch) {
    var text = textMatch[1].replace(/<[^>]+>/g, ' ').trim().substring(0, 60);
    if (text) desc += (desc ? ' | ' : '') + 'TEXT: "' + text + '"';
  }
  if (!desc) {
    // Check for shape
    if (chunk.indexOf('tn-atom__shape') >= 0) desc = 'SHAPE';
    else if (chunk.indexOf('background-image') >= 0) desc = 'BG-IMAGE';
    else desc = chunk.substring(0, 100);
  }

  // Get top position
  var cssSearch = 'data-elem-id="' + id + '"]';
  var cssIdx = html.indexOf(cssSearch);
  var ruleStart = html.indexOf('{', cssIdx);
  var ruleEnd = html.indexOf('}', ruleStart);
  var rule = html.substring(ruleStart, ruleEnd + 1);
  var topMatch = rule.match(/top:(-?\d+)px/);

  console.log(id, 'top:' + (topMatch ? topMatch[1] : '?'), '-', desc);
}
