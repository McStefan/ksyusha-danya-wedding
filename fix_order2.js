var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Fix ALL CSS rules for header and circles (both desktop and responsive)
var headerIds = ['1735207070423', '1735207090949', '1735207111560'];
var circleIds = ['1735205096248', '1735205096251', '1735205096254', '1735205096257', '1735205211087', '1735205211092', '1735205099999'];

// Strategy: For each element, find ALL CSS rules with top: and swap
// Headers should have LOWER top values than circles in ALL breakpoints

for (var id of headerIds.concat(circleIds)) {
  var search = 'data-elem-id="' + id + '"]';
  var pos = 0;
  while (true) {
    var idx = html.indexOf(search, pos);
    if (idx === -1) break;
    var ruleStart = html.indexOf('{', idx);
    var ruleEnd = html.indexOf('}', ruleStart);
    var rule = html.substring(ruleStart, ruleEnd + 1);
    var topMatch = rule.match(/top:(-?\d+)px/);
    if (topMatch) {
      var currentTop = parseInt(topMatch[1]);
      var newTop;

      if (headerIds.includes(id)) {
        // Headers: move UP by 300 from current position
        newTop = currentTop - 300;
        if (newTop < -50) newTop = -50 + headerIds.indexOf(id) * 30;
      } else {
        // Circles: move DOWN by 100 from current position
        newTop = currentTop + 80;
      }

      if (currentTop !== newTop) {
        var oldRule = rule;
        var newRule = rule.replace(topMatch[0], 'top:' + newTop + 'px');
        html = html.replace(oldRule, newRule);
        console.log(id, ':', currentTop, '->', newTop, '(rule near char', idx, ')');
      }
    }
    pos = idx + 1;
  }
}

// Fix photo size - make it bigger
html = html.replace(
  'max-width:700px;width:90%;height:auto;display:inline-block;',
  'max-width:1000px;width:90%;height:auto;display:inline-block;'
);
console.log('Photo max-width increased to 1000px');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
