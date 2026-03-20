var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// Swap positions: ДРЕСС-КОД header should be ABOVE circles
// Current: circles at 171, header at 347/387/426
// Target: header at ~20/60/99, circles at ~300

var moves = {
  // ДРЕСС-КОД header images (noroot.png) - move UP
  '1735207070423': { from: 347, to: 20 },
  '1735207090949': { from: 387, to: 60 },
  '1735207111560': { from: 426, to: 99 },
  // Color circles - move DOWN
  '1735205096248': { from: 171, to: 280 },
  '1735205096251': { from: 171, to: 280 },
  '1735205096254': { from: 171, to: 280 },
  '1735205096257': { from: 171, to: 280 },
  '1735205211087': { from: 171, to: 280 },
  '1735205211092': { from: 171, to: 280 },
  '1735205099999': { from: 171, to: 280 },
};

for (var id in moves) {
  var m = moves[id];
  var search = 'data-elem-id="' + id + '"]';
  var pos = 0;
  while (true) {
    var idx = html.indexOf(search, pos);
    if (idx === -1) break;
    var ruleStart = html.indexOf('{', idx);
    var ruleEnd = html.indexOf('}', ruleStart);
    var rule = html.substring(ruleStart, ruleEnd + 1);
    if (rule.indexOf('left:calc(50% - 600px') >= 0) {
      var topMatch = rule.match(/top:(-?\d+)px/);
      if (topMatch) {
        var oldRule = rule;
        var newRule = rule.replace(topMatch[0], 'top:' + m.to + 'px');
        html = html.replace(oldRule, newRule);
        console.log(id, ':', topMatch[1], '->', m.to);
      }
      break;
    }
    pos = idx + 1;
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! Header moved up, circles moved down.');
