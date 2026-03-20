var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// ДЕТАЛИ elements that must stay visible:
// 1735207008209 top:481 - ДЕТАЛИ header image
// 1735207287555 top:550 - "По всем вопросам..." text
// 1735207242685 top:620 - "Людмиле | 8-913-950-32-11"
var keepIds = ['1735207008209', '1735207287555', '1735207242685'];

// ALL element IDs in rec1894130241
var allIds = ['1735206152834','1735135983445','1735207070423','1735207090949','1735207111560',
  '1735207475067','1735205096257','1735205096254','1735205211092','1735205211087',
  '1735205096251','1735205096248','1735204485182','1735204495564','1735136242479',
  '1735136424284','1735136370352','1735206216009','1735136386033','1735206222606',
  '1735207448817','1735136434070','1735204566665','1735207242685','1735207008209',
  '1735136427075','1735136420415','1735136411946','1735136659862','1735207287555',
  '1735137098185','1735206438966','1735205099999'];

// Build CSS to hide everything except ДЕТАЛИ
var hideIds = allIds.filter(function(id) { return !keepIds.includes(id); });
var hideSelectors = hideIds.map(function(id) {
  return '#rec1894130241 .tn-elem[data-elem-id="' + id + '"]';
});

// Remove old hide CSS
html = html.replace(/\n\/\* Hide dresscode elements inside artboard[^*]*\*\/\n[^}]*display: none !important;\n\}\n/, '\n');

// New CSS: hide all non-ДЕТАЛИ elements + shift ДЕТАЛИ to top + shrink artboard
var newCSS = `
/* Hide all dresscode decoratives, keep only ДЕТАЛИ */
${hideSelectors.join(',\n')} {
  display: none !important;
}
/* Move ДЕТАЛИ elements to top of artboard */
#rec1894130241 .tn-elem[data-elem-id="1735207008209"] { top: 20px !important; }
#rec1894130241 .tn-elem[data-elem-id="1735207287555"] { top: 80px !important; }
#rec1894130241 .tn-elem[data-elem-id="1735207242685"] { top: 160px !important; }
/* Shrink artboard to fit only ДЕТАЛИ */
#rec1894130241 .t396__artboard { height: 250px !important; }
#rec1894130241 .t396__carrier { height: 250px !important; }
#rec1894130241 .t396__filter { height: 250px !important; }
`;

// Insert into style block
var styleTag = '<style>';
var styleIdx = html.indexOf(styleTag);
html = html.substring(0, styleIdx + styleTag.length) + newCSS + html.substring(styleIdx + styleTag.length);

// Also remove the scale style height override for this artboard
html = html.replace(
  /1894130241 \.t396__carrier,#rec1894130241 \.t396__filter,#rec1894130241 \.t396__artboard \{height:\s*\d+px\s*!important;\}/,
  '1894130241 .t396__carrier,#rec1894130241 .t396__filter,#rec1894130241 .t396__artboard {height: 250px !important;}'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! Hidden all decoratives, ДЕТАЛИ moved to top, artboard shrunk.');
