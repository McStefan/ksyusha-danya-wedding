var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// =============================================
// 1. FIX CIRCLES - remove textures, set solid colors
// =============================================
var circleColors = {
  '1735205096248': '#212121',
  '1735205096251': '#5D4636',
  '1735205096254': '#856A57',
  '1735205096257': '#D8CCB4',
  '1735205211087': '#E1D3C6',
  '1735205211092': '#AEBEA4',
};

for (var cid in circleColors) {
  var domClass = 'tn-elem__1894130241' + cid;
  var idx = html.indexOf(domClass);
  if (idx === -1) { console.log('CIRCLE ' + cid + ' DOM NOT FOUND'); continue; }

  // Get big chunk to cover the whole element
  var endMarker = '</div></div></div>';
  var chunkEnd = html.indexOf(endMarker, idx);
  if (chunkEnd === -1) chunkEnd = idx + 1000;
  else chunkEnd += endMarker.length;

  var chunk = html.substring(idx, chunkEnd);

  // Remove ALL data-original attributes
  chunk = chunk.replace(/\s*data-original="[^"]*"/g, '');

  // Remove t-bgimg and loaded classes
  chunk = chunk.replace(/\s*t-bgimg\s*/g, ' ');
  chunk = chunk.replace(/\s*loaded\s*/g, ' ');

  // Find the tn-atom div and set its style
  var atomMatch = chunk.match(/<div class="tn-atom"([^>]*)>/);
  if (!atomMatch) {
    atomMatch = chunk.match(/<div class="[^"]*tn-atom[^"]*"([^>]*)>/);
  }

  if (atomMatch) {
    var oldAtomTag = atomMatch[0];
    // Build new style
    var styleMatch = oldAtomTag.match(/style="([^"]*)"/);
    var newStyle;
    if (styleMatch) {
      newStyle = styleMatch[1]
        .replace(/background-image:\s*url\([^)]*\)\s*;?/g, '')
        .replace(/background-color:[^;]*;?/g, '');
      newStyle = 'background-color:' + circleColors[cid] + ';' + newStyle;
      var newAtomTag = oldAtomTag.replace(styleMatch[0], 'style="' + newStyle + '"');
    } else {
      var newAtomTag = oldAtomTag.replace('>', ' style="background-color:' + circleColors[cid] + ';">');
    }
    chunk = chunk.replace(oldAtomTag, newAtomTag);
    console.log('Circle ' + cid + ': color=' + circleColors[cid]);
  } else {
    console.log('Circle ' + cid + ': tn-atom NOT FOUND');
  }

  html = html.substring(0, idx) + chunk + html.substring(chunkEnd);
}

// =============================================
// 2. FIX 7th circle color
// =============================================
var c7class = 'tn-elem__18941302411735205099999';
var c7idx = html.indexOf(c7class);
if (c7idx >= 0) {
  var c7end = html.indexOf('</div></div></div>', c7idx) + 18;
  var c7chunk = html.substring(c7idx, c7end);
  c7chunk = c7chunk.replace(/\s*data-original="[^"]*"/g, '');
  c7chunk = c7chunk.replace(/\s*t-bgimg\s*/g, ' ');
  c7chunk = c7chunk.replace(/\s*loaded\s*/g, ' ');
  c7chunk = c7chunk.replace(/background-color:[^;]*;?/, 'background-color:#5E6845;');
  if (c7chunk.indexOf('background-color') === -1) {
    var atomM = c7chunk.match(/style="([^"]*)"/);
    if (atomM) {
      c7chunk = c7chunk.replace(atomM[0], 'style="background-color:#5E6845;' + atomM[1] + '"');
    }
  }
  html = html.substring(0, c7idx) + c7chunk + html.substring(c7end);
  console.log('7th circle color set');
}

// =============================================
// 3. FIX ДЕТАЛИ TEXT - Алёне -> Людмиле, phone number
// =============================================
// Fix organizer name
html = html.replace(/организатору Алёне/g, 'организатору');
html = html.replace(/организатору Алене/g, 'организатору');

// Fix Людмиле button content (elem 1735207242685)
// Find the button element and replace its text
var buttonClass = 'tn-elem__18941302411735207242685';
var btnIdx = html.indexOf(buttonClass);
if (btnIdx >= 0) {
  var btnEnd = html.indexOf('</div></div></div>', btnIdx) + 18;
  var btnChunk = html.substring(btnIdx, btnEnd);

  // Find tn-atom content and replace
  var atomStart = btnChunk.indexOf('class="tn-atom"');
  if (atomStart === -1) atomStart = btnChunk.indexOf('tn-atom');
  if (atomStart >= 0) {
    var tagEnd = btnChunk.indexOf('>', atomStart);
    var contentEnd = btnChunk.indexOf('</div>', tagEnd);
    var oldContent = btnChunk.substring(tagEnd + 1, contentEnd);
    var newContent = '<strong>Людмиле</strong><br>8-913-950-32-11';
    btnChunk = btnChunk.replace(oldContent, newContent);
    html = html.substring(0, btnIdx) + btnChunk + html.substring(btnEnd);
    console.log('Людмиле button text fixed');
  }
}

// Also fix the phone in the original button format if it has href
html = html.replace(/\+7 \(916\) 647-42-19/g, '8-913-950-32-11');
html = html.replace(/tel:\+79166474219/g, 'tel:89139503211');

// =============================================
// 4. Make sure photo section is AFTER artboard (between rec1894130241 and rec1894130251)
// =============================================
// Remove any existing photo sections
html = html.replace(/\n*<!-- Dresscode photo section -->\n*<div id="rec_dresscode_photo"[^>]*>\n*[^<]*<img[^>]*>\n*<\/div>\n*/g, '\n');

// Add clean photo section
var photoSection = '\n<!-- Dresscode photo section -->\n' +
  '<div id="rec_dresscode_photo" style="text-align:center;background-color:#fffffa;padding:10px 0 30px 0;">\n' +
  '  <img src="images/dresscode.png" alt="" style="max-width:1100px;width:85%;height:auto;display:inline-block;">\n' +
  '</div>\n';

var nextRec = '<div id="rec1894130251"';
var nextIdx = html.indexOf(nextRec);
if (nextIdx >= 0) {
  html = html.substring(0, nextIdx) + photoSection + html.substring(nextIdx);
  console.log('Photo section placed after artboard');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nDONE! Circles=solid colors, Людмиле=fixed, photo=after artboard');
