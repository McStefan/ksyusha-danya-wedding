var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');
var original = fs.readFileSync('../site_copy/index.html', 'utf8');

// ============================================================
// STEP 1: Remove ALL my custom CSS for rec1894130241
// ============================================================
// Remove everything between <style> and the first non-rec1894130241 rule
// Find and remove CSS blocks I added

// Remove "Hide all dresscode decoratives" block
html = html.replace(/\n\/\* Hide all dresscode decoratives, keep only ДЕТАЛИ \*\/[\s\S]*?height: 250px !important;\s*\}\n/g, '\n');

// Remove "Hide dresscode elements inside artboard" block
html = html.replace(/\n\/\* Hide dresscode elements inside artboard[^*]*\*\/[\s\S]*?display: none !important;\s*\}\n/g, '\n');

// Remove ДЕТАЛИ position overrides
html = html.replace(/#rec1894130241 \.tn-elem\[data-elem-id="1735207008209"\]\s*\{[^}]*\}\n?/g, '');
html = html.replace(/#rec1894130241 \.tn-elem\[data-elem-id="1735207287555"\]\s*\{[^}]*\}\n?/g, '');
html = html.replace(/#rec1894130241 \.tn-elem\[data-elem-id="1735207242685"\]\s*\{[^}]*\}\n?/g, '');

// Remove artboard height overrides I added
html = html.replace(/#rec1894130241 \.t396__artboard \{ height: 250px !important; \}\n?/g, '');
html = html.replace(/#rec1894130241 \.t396__carrier \{ height: 250px !important; \}\n?/g, '');
html = html.replace(/#rec1894130241 \.t396__filter \{ height: 250px !important; \}\n?/g, '');

// ============================================================
// STEP 2: Remove standalone dresscode_section
// ============================================================
html = html.replace(/\n<!-- ДРЕСС-КОД standalone section -->[\s\S]*?<\/div>\n<\/div>\n/g, '\n');

// ============================================================
// STEP 3: Restore ALL original CSS positions from site_copy
// ============================================================
var allIds = ['1735206152834','1735135983445','1735207070423','1735207090949','1735207111560',
  '1735207475067','1735205096257','1735205096254','1735205211092','1735205211087',
  '1735205096251','1735205096248','1735204485182','1735204495564','1735136242479',
  '1735136424284','1735136370352','1735206216009','1735136386033','1735206222606',
  '1735207448817','1735136434070','1735204566665','1735207242685','1735207008209',
  '1735136427075','1735136420415','1735136411946','1735136659862','1735207287555',
  '1735137098185','1735206438966'];

for (var id of allIds) {
  var search = 'data-elem-id="' + id + '"]';

  // Find ALL CSS rules for this ID in BOTH files and copy original values
  var origPos = 0;
  var custPos = 0;

  while (true) {
    var origIdx = original.indexOf(search, origPos);
    var custIdx = html.indexOf(search, custPos);
    if (origIdx === -1 || custIdx === -1) break;

    // Get original rule
    var origRuleStart = original.indexOf('{', origIdx);
    var origRuleEnd = original.indexOf('}', origRuleStart);
    var origRule = original.substring(origRuleStart, origRuleEnd + 1);

    // Get current rule
    var custRuleStart = html.indexOf('{', custIdx);
    var custRuleEnd = html.indexOf('}', custRuleStart);
    var custRule = html.substring(custRuleStart, custRuleEnd + 1);

    // Replace current with original
    if (custRule !== origRule) {
      html = html.substring(0, custRuleStart) + origRule + html.substring(custRuleEnd + 1);
      // Don't log every change, too noisy
    }

    origPos = origIdx + 1;
    custPos = custIdx + 1;
  }
}
console.log('Restored all original CSS positions');

// ============================================================
// STEP 4: Restore scale style height
// ============================================================
html = html.replace(
  /1894130241 \.t396__carrier,#rec1894130241 \.t396__filter,#rec1894130241 \.t396__artboard \{height:\s*250px\s*!important;\}/,
  '1894130241 .t396__carrier,#rec1894130241 .t396__filter,#rec1894130241 .t396__artboard {height: 780px !important;}'
);
// Also try other values that might have been set
html = html.replace(
  /1894130241 \.t396__carrier,#rec1894130241 \.t396__filter,#rec1894130241 \.t396__artboard \{height:\s*\d+px\s*!important;\}/,
  '1894130241 .t396__carrier,#rec1894130241 .t396__filter,#rec1894130241 .t396__artboard {height: 780px !important;}'
);

// ============================================================
// STEP 5: Re-apply circle color changes (from original textures to solid colors)
// ============================================================
var circleColors = {
  '1735205096248': '#212121',
  '1735205096251': '#5D4636',
  '1735205096254': '#856A57',
  '1735205096257': '#D8CCB4',
  '1735205211087': '#E1D3C6',
  '1735205211092': '#AEBEA4',
};

for (var cid in circleColors) {
  // Find the atom div inside this element and ensure it has solid background
  var elemClass = 'tn-elem__18941302411' + cid;
  var elemIdx = html.indexOf(elemClass);
  if (elemIdx === -1) continue;

  // Find the tn-atom div inside
  var atomIdx = html.indexOf('tn-atom', elemIdx);
  if (atomIdx === -1) continue;
  var atomTag = html.substring(atomIdx - 5, html.indexOf('>', atomIdx) + 1);

  // Remove data-original attribute (prevents lazy-load of texture)
  var dataOrigMatch = atomTag.match(/data-original="[^"]*"/);
  if (dataOrigMatch) {
    html = html.replace(atomTag, atomTag.replace(dataOrigMatch[0], ''));
  }

  // Remove t-bgimg class
  var elemChunk = html.substring(elemIdx, elemIdx + 500);
  if (elemChunk.indexOf('t-bgimg') >= 0) {
    html = html.substring(0, elemIdx) + elemChunk.replace(/t-bgimg\s*(loaded)?/g, '') + html.substring(elemIdx + 500);
  }

  // Set background-color inline on the atom div
  var atomSearch = 'tn-elem__18941302411' + cid;
  var aIdx = html.indexOf(atomSearch);
  var atomDiv = html.indexOf('tn-atom', aIdx);
  var styleAttr = html.indexOf('style="', atomDiv);
  if (styleAttr > 0 && styleAttr < atomDiv + 200) {
    var styleEnd = html.indexOf('"', styleAttr + 7);
    var currentStyle = html.substring(styleAttr + 7, styleEnd);
    // Remove old background-image, add background-color
    var newStyle = currentStyle.replace(/background-image:[^;]*;?/g, '');
    newStyle = newStyle.replace(/background-color:[^;]*;?/g, '');
    newStyle = 'background-color:' + circleColors[cid] + ';' + newStyle;
    html = html.substring(0, styleAttr + 7) + newStyle + html.substring(styleEnd);
  }
}
console.log('Re-applied circle colors');

// ============================================================
// STEP 6: Ensure standalone photo section exists between recs
// ============================================================
// Remove old one if exists
html = html.replace(/\n<!-- Dresscode photo section -->\n<div id="rec_dresscode_photo"[^>]*>\n[^<]*<img[^>]*>\n<\/div>\n/g, '\n');

// Add new one
var photoSection = '\n<!-- Dresscode photo section -->\n' +
  '<div id="rec_dresscode_photo" style="text-align:center;background-color:#fffffa;padding:10px 0 30px 0;">\n' +
  '  <img src="images/dresscode.png" alt="Дресс-код" style="max-width:1100px;width:85%;height:auto;display:inline-block;">\n' +
  '</div>\n';

var nextRec = '<div id="rec1894130251"';
var nextIdx = html.indexOf(nextRec);
if (nextIdx >= 0) {
  html = html.substring(0, nextIdx) + photoSection + html.substring(nextIdx);
  console.log('Added photo section');
}

// ============================================================
// STEP 7: Make sure 7th circle element exists
// ============================================================
if (html.indexOf('1735205099999') === -1) {
  console.log('WARNING: 7th circle element missing, need to re-add');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! Restored original artboard layout + circle colors + photo section.');
