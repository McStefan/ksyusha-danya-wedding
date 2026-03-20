var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// 1. Verify circle colors are applied
var circleColors = {
  '1735205096248': '#212121',
  '1735205096251': '#5D4636',
  '1735205096254': '#856A57',
  '1735205096257': '#D8CCB4',
  '1735205211087': '#E1D3C6',
  '1735205211092': '#AEBEA4',
};

for (var cid in circleColors) {
  var elemSearch = 'tn-elem__18941302411' + cid;
  var idx = html.indexOf(elemSearch);
  if (idx === -1) { console.log('Circle ' + cid + ' NOT FOUND in DOM'); continue; }

  // Check 300 chars around the atom div
  var chunk = html.substring(idx, idx + 600);

  // Remove data-original if present (prevents texture loading)
  var dataOrig = chunk.match(/data-original="[^"]*"/);
  if (dataOrig) {
    html = html.substring(0, idx) + chunk.replace(dataOrig[0], '') + html.substring(idx + 600);
    chunk = html.substring(idx, idx + 600);
    console.log(cid + ': removed data-original');
  }

  // Remove t-bgimg class
  if (chunk.indexOf('t-bgimg') >= 0) {
    html = html.substring(0, idx) + chunk.replace(/t-bgimg\s*loaded?\s*/g, '') + html.substring(idx + 600);
    chunk = html.substring(idx, idx + 600);
    console.log(cid + ': removed t-bgimg');
  }

  // Find tn-atom style and set background-color
  var atomStyleIdx = chunk.indexOf('style="', chunk.indexOf('tn-atom'));
  if (atomStyleIdx >= 0) {
    var absIdx = idx + atomStyleIdx + 7;
    var styleEnd = html.indexOf('"', absIdx);
    var style = html.substring(absIdx, styleEnd);
    // Remove existing bg properties
    style = style.replace(/background-image:[^;]*;?/g, '');
    style = style.replace(/background-color:[^;]*;?/g, '');
    style = 'background-color:' + circleColors[cid] + ';' + style;
    html = html.substring(0, absIdx) + style + html.substring(styleEnd);
    console.log(cid + ': set color ' + circleColors[cid]);
  }
}

// 2. Check if 7th circle (1735205099999) exists in DOM
if (html.indexOf('1735205099999') === -1) {
  // Need to add it. Clone from last circle (1735205211092)
  // Find the 6th circle element in DOM
  var lastCircleClass = 'tn-elem__18941302411735205211092';
  var lcIdx = html.indexOf(lastCircleClass);
  if (lcIdx >= 0) {
    // Go back to find the div start
    var divStart = html.lastIndexOf('<div ', lcIdx);
    // Find the end of this element (it has nested divs)
    var searchChunk = html.substring(divStart, divStart + 1000);
    var depth = 0;
    var divEnd = divStart;
    for (var i = 0; i < searchChunk.length; i++) {
      if (searchChunk.substring(i, i + 4) === '<div') depth++;
      if (searchChunk.substring(i, i + 6) === '</div>') {
        depth--;
        if (depth === 0) {
          divEnd = divStart + i + 6;
          break;
        }
      }
    }
    var circleHtml = html.substring(divStart, divEnd);
    // Clone and modify
    var newCircle = circleHtml
      .replace(/1735205211092/g, '1735205099999')
      .replace(/background-color:[^;]*;/, 'background-color:#5E6845;');

    // Insert after the 6th circle
    html = html.substring(0, divEnd) + newCircle + html.substring(divEnd);
    console.log('Added 7th circle element');

    // Add CSS for 7th circle (copy from 6th, adjust left position)
    // 6th circle left: calc(50% - 600px + 745px), move to +838px
    var css6th = 'data-elem-id="1735205211092"]';
    var cssIdx = html.indexOf(css6th);
    var ruleStart = html.indexOf('{', cssIdx);
    var ruleEnd = html.indexOf('}', ruleStart);
    var rule6 = html.substring(cssIdx - 50, ruleEnd + 1);
    var newCssRule = rule6.replace(/1735205211092/g, '1735205099999').replace(/745px\)/, '838px)');

    // Insert CSS rule after the 6th circle's rule
    html = html.substring(0, ruleEnd + 1) + '\n' + newCssRule + html.substring(ruleEnd + 1);
    console.log('Added 7th circle CSS');
  }
}

// 3. Add photo section between rec1894130241 and rec1894130251
var photoSection = '\n<!-- Dresscode photo section -->\n' +
  '<div id="rec_dresscode_photo" style="text-align:center;background-color:#fffffa;padding:10px 0 30px 0;">\n' +
  '  <img src="images/dresscode.png" alt="Дресс-код" style="max-width:1100px;width:85%;height:auto;display:inline-block;">\n' +
  '</div>\n';

var nextRec = '<div id="rec1894130251"';
var nextIdx = html.indexOf(nextRec);
if (nextIdx >= 0) {
  html = html.substring(0, nextIdx) + photoSection + html.substring(nextIdx);
  console.log('Added photo section before rec1894130251');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nDone! Original artboard + solid color circles + photo section.');
