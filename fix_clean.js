var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// STEP 1: Restore ALL elements to their ORIGINAL positions
var originalTops = {
  '1735206152834': -129, '1735135983445': -2, '1735207070423': 347,
  '1735207090949': 387, '1735207111560': 426, '1735207475067': 608,
  '1735204485182': 31, '1735204495564': -30, '1735136242479': 62,
  '1735136424284': 262, '1735136370352': 185, '1735206216009': 162,
  '1735136386033': 357, '1735206222606': 517, '1735207448817': 645,
  '1735136434070': 235, '1735204566665': -26, '1735207242685': 1070,
  '1735207008209': 481, '1735136427075': 421, '1735136420415': 300,
  '1735136411946': 124, '1735207287555': 1000, '1735137098185': 416,
  '1735206438966': -176,
};

// Actually, restore to true originals for ALL except the ones I intentionally moved
// Людмиле button was originally at 620 (I changed it to 1070 earlier for height reasons)
// организатору text was at 550 (I changed it to 1000)
// Let me restore to TRUE originals
originalTops['1735207242685'] = 620;
originalTops['1735207287555'] = 550;

for (var id in originalTops) {
  var targetTop = originalTops[id];
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
      if (topMatch && parseInt(topMatch[1]) !== targetTop) {
        html = html.replace(rule, rule.replace(topMatch[0], 'top:' + targetTop + 'px'));
        console.log(id, ':', topMatch[1], '->', targetTop);
      }
      break;
    }
    pos = idx + 1;
  }
}

// STEP 2: Restore artboard height to original 650px
var heightValues = ['1100', '1500', '1400', '1150', '1080', '900'];
for (var h of heightValues) {
  var patterns = ['height:' + h + 'px', 'height: ' + h + 'px'];
  for (var p of patterns) {
    var pIdx = 0;
    while (true) {
      var idx = html.indexOf(p, pIdx);
      if (idx === -1) break;
      var context = html.substring(Math.max(0, idx - 150), idx + p.length + 10);
      if (context.indexOf('1894130241') >= 0 &&
          (context.indexOf('artboard') >= 0 || context.indexOf('carrier') >= 0 || context.indexOf('filter') >= 0)) {
        html = html.substring(0, idx) + 'height:650px' + html.substring(idx + p.length);
        console.log('Height restored: ' + p + ' -> height:650px');
      }
      pIdx = idx + 1;
    }
  }
}

// Also restore the scale style !important height
html = html.replace(
  /1894130241 \.t396__carrier,#rec1894130241 \.t396__filter,#rec1894130241 \.t396__artboard \{height:\s*\d+px\s*!important;\}/,
  '1894130241 .t396__carrier,#rec1894130241 .t396__filter,#rec1894130241 .t396__artboard {height: 780px !important;}'
);

// Restore overflow to visible (original)
html = html.replace('.t-rec#rec1894130241 { overflow: hidden; }', '.t-rec#rec1894130241 { overflow: visible; }');
html = html.replace('#rec1894130241 .t396__artboard {height:650px;background-color:#fffffa;overflow:hidden;}',
                     '#rec1894130241 .t396__artboard {height:650px;background-color:#fffffa;overflow:visible;}');

// Remove the overflow rules I added at top of custom style
html = html.replace('#rec1894130241 { overflow: hidden !important; position: relative; }\n', '');
html = html.replace('#rec1894130241 .t396__artboard { overflow: hidden !important; position: relative; }\n', '');

// STEP 3: Remove the dresscode photo element from INSIDE rec1894130241
var photoElemStart = html.indexOf('<div class="t396__elem tn-elem tn-elem__18941302411735205088888"');
if (photoElemStart >= 0) {
  // Find the end of this element
  var photoSearch = html.substring(photoElemStart, photoElemStart + 2000);
  var depth = 0;
  var photoEnd = photoElemStart;
  for (var i = 0; i < photoSearch.length; i++) {
    if (photoSearch.substring(i, i + 4) === '<div') depth++;
    if (photoSearch.substring(i, i + 6) === '</div>') {
      depth--;
      if (depth === 0) {
        photoEnd = photoElemStart + i + 6;
        break;
      }
    }
  }
  html = html.substring(0, photoElemStart) + html.substring(photoEnd);
  console.log('Removed photo element from artboard');
}

// Also remove CSS for the photo element
html = html.replace(/#rec1894130241 \.tn-elem\[data-elem-id="1735205088888"\][^}]*\}/g, '');
console.log('Removed photo CSS');

// STEP 4: Insert a standalone photo section BETWEEN rec1894130241 and rec1894130251
var photoSection = '\n<!-- Dresscode photo section -->\n' +
  '<div id="rec_dresscode_photo" style="text-align:center;background-color:#fffffa;padding:20px 0 40px 0;">\n' +
  '  <img src="images/dresscode.png" alt="Дресс-код" style="max-width:700px;width:90%;height:auto;display:inline-block;">\n' +
  '</div>\n';

var nextRecMarker = '<div id="rec1894130251"';
var nextRecIdx = html.indexOf(nextRecMarker);
if (nextRecIdx >= 0) {
  html = html.substring(0, nextRecIdx) + photoSection + html.substring(nextRecIdx);
  console.log('Inserted standalone photo section before rec1894130251');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nDone! Photo is now in its own section, artboard restored to original.');
