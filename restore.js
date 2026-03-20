const fs = require('fs');

const broken = fs.readFileSync('index_backup_broken.html', 'utf8');
const siteCopy = fs.readFileSync('../site_copy/index.html', 'utf8');

console.log('Broken file size:', broken.length);

// =================================================
// Step 1: Merge orphan content into proper HTML structure
// =================================================
const doctypePos = broken.indexOf('<!DOCTYPE');
let orphanContent = broken.substring(0, doctypePos).trimEnd();
let htmlDoc = broken.substring(doctypePos);
const bodyTagEnd = htmlDoc.indexOf('>', htmlDoc.indexOf('<body')) + 1;
let result = htmlDoc.substring(0, bodyTagEnd) + '\n' + orphanContent + '\n' + htmlDoc.substring(bodyTagEnd);
console.log('Merged size:', result.length);

// =================================================
// Step 2: Remove rec_dresscode_photo
// =================================================
const dressRegex = /\s*<!-- Dresscode photo section -->\s*<div id="rec_dresscode_photo"[^>]*>\s*<img[^>]*>\s*<\/div>\s*/;
if (dressRegex.test(result)) {
  result = result.replace(dressRegex, '\n');
  console.log('Removed rec_dresscode_photo');
}

// =================================================
// Step 3: Fix circles - find DOM elements (not CSS references)
//
// DOM elements have pattern: tn-elem__1894130241CIRCLENUM in class name
// CSS refs have pattern: .tn-elem[data-elem-id="CIRCLENUM"]
//
// For DOM, find by: class="...tn-elem__1894130241<id>..."
// Then replace the inner tn-atom div
// =================================================

const circleIds = ['1735205096248', '1735205096251', '1735205211087', '1735205211092', '1735205096257', '1735205096254'];

circleIds.forEach(cid => {
  // Find DOM element by unique class pattern
  const classPattern = 'tn-elem__1894130241' + cid;

  // In result
  const rClassIdx = result.indexOf(classPattern);
  if (rClassIdx < 0) { console.log('Circle ' + cid + ': DOM NOT FOUND in result'); return; }

  // In site_copy
  const scClassIdx = siteCopy.indexOf(classPattern);
  if (scClassIdx < 0) { console.log('Circle ' + cid + ': DOM NOT FOUND in site_copy'); return; }

  // Find the tn-atom div inside this element (search forward from class position)
  function findAtom(html, startPos) {
    // Search for <div class="tn-atom within the next 2000 chars
    const searchEnd = Math.min(html.length, startPos + 2000);
    const chunk = html.substring(startPos, searchEnd);
    const atomIdx = chunk.indexOf('<div class="tn-atom');
    if (atomIdx < 0) return null;
    const absAtomStart = startPos + atomIdx;
    // Find the closing </div> for this tn-atom
    const absAtomEnd = html.indexOf('</div>', absAtomStart) + 6;
    return { start: absAtomStart, end: absAtomEnd, content: html.substring(absAtomStart, absAtomEnd) };
  }

  const rAtom = findAtom(result, rClassIdx);
  const scAtom = findAtom(siteCopy, scClassIdx);

  if (rAtom && scAtom) {
    result = result.substring(0, rAtom.start) + scAtom.content + result.substring(rAtom.end);
    console.log('Circle ' + cid + ': replaced tn-atom');
    console.log('  Was: ' + rAtom.content.substring(0, 60) + '...');
    console.log('  Now: ' + scAtom.content.substring(0, 60) + '...');
  } else {
    console.log('Circle ' + cid + ': atom search failed, result=' + !!rAtom + ', copy=' + !!scAtom);
  }
});

// =================================================
// Step 4: Remove 7th circle (1735205099999)
// Find its DOM element by class pattern
// =================================================
const c7Class = 'tn-elem__18941302411735205099999';
const c7ClassIdx = result.indexOf(c7Class);
if (c7ClassIdx > -1) {
  // Go back to find the <div that starts this element
  let divStart = result.lastIndexOf('<div', c7ClassIdx);

  // Find the end: outer div contains one tn-atom div
  // Structure: <div class="...tn-elem...">   <div class="tn-atom...">...</div>   </div>
  // So we need to find 2 </div> after the tn-atom
  let atomIdx = result.indexOf('<div class="tn-atom', c7ClassIdx);
  if (atomIdx > -1) {
    let firstClose = result.indexOf('</div>', atomIdx) + 6; // closes tn-atom
    let secondClose = result.indexOf('</div>', firstClose) + 6; // closes tn-elem
    // Trim trailing space
    while (result[secondClose] === ' ') secondClose++;
    result = result.substring(0, divStart) + result.substring(secondClose);
    console.log('Removed 7th circle DOM');
  } else {
    // No tn-atom, just remove the div
    let closeDiv = result.indexOf('</div>', c7ClassIdx) + 6;
    result = result.substring(0, divStart) + result.substring(closeDiv);
    console.log('Removed 7th circle DOM (no atom)');
  }
} else {
  console.log('7th circle DOM not found');
}

// =================================================
// Step 5: Replace circle CSS in rec1894130241 style block
// =================================================
const rec241Pos = result.indexOf('<div id="rec1894130241"');
const styleStart = result.indexOf('<style>', rec241Pos) + 7;
const styleEnd = result.indexOf('</style>', rec241Pos);
let style = result.substring(styleStart, styleEnd);

const scRec241 = siteCopy.indexOf('<div id="rec1894130241"');
const scStyleStart = siteCopy.indexOf('<style>', scRec241) + 7;
const scStyleEnd = siteCopy.indexOf('</style>', scRec241);
const scStyle = siteCopy.substring(scStyleStart, scStyleEnd);

// Remove all circle CSS (including 7th) - both direct and @media rules
const allIds = [...circleIds, '1735205099999'];

// Remove direct rules
allIds.forEach(cid => {
  const pat = new RegExp('#rec1894130241[^}]*\\[data-elem-id="' + cid + '"\\][^}]*\\{[^}]*\\}', 'g');
  style = style.replace(pat, '');
});

// Process @media blocks
function processMediaBlocks(css, idsToRemove) {
  let output = '';
  let pos = 0;
  while (pos < css.length) {
    let mIdx = css.indexOf('@media', pos);
    if (mIdx < 0) { output += css.substring(pos); break; }
    output += css.substring(pos, mIdx);
    let braceStart = css.indexOf('{', mIdx);
    if (braceStart < 0) { output += css.substring(mIdx); break; }
    let d = 1, p = braceStart + 1;
    while (d > 0 && p < css.length) {
      if (css[p] === '{') d++;
      if (css[p] === '}') d--;
      p++;
    }
    let mediaBlock = css.substring(mIdx, p);
    if (!idsToRemove.some(id => mediaBlock.includes(id))) {
      output += mediaBlock;
    } else {
      let header = css.substring(mIdx, braceStart + 1);
      let body = css.substring(braceStart + 1, p - 1);
      idsToRemove.forEach(id => {
        const innerPat = new RegExp('#rec1894130241[^}]*\\[data-elem-id="' + id + '"\\][^}]*\\{[^}]*\\}', 'g');
        body = body.replace(innerPat, '');
      });
      if (body.trim()) output += header + body + '}';
    }
    pos = p;
  }
  return output;
}

style = processMediaBlocks(style, allIds);

// Add circle CSS from site_copy
circleIds.forEach(cid => {
  const pat = new RegExp('#rec1894130241[^}]*\\[data-elem-id="' + cid + '"\\][^}]*\\{[^}]*\\}', 'g');
  const rules = scStyle.match(pat) || [];
  rules.forEach(r => { style += r; });
});

// Add @media rules from site_copy for circles
let mPos = 0;
while (mPos < scStyle.length) {
  let mIdx = scStyle.indexOf('@media', mPos);
  if (mIdx < 0) break;
  let braceStart = scStyle.indexOf('{', mIdx);
  if (braceStart < 0) break;
  let d = 1, p = braceStart + 1;
  while (d > 0 && p < scStyle.length) {
    if (scStyle[p] === '{') d++;
    if (scStyle[p] === '}') d--;
    p++;
  }
  let block = scStyle.substring(mIdx, p);
  if (circleIds.some(id => block.includes(id))) {
    style += block;
  }
  mPos = p;
}

result = result.substring(0, styleStart) + style + result.substring(styleEnd);
console.log('Replaced circle CSS');

// =================================================
// Write
// =================================================
fs.writeFileSync('index.html', result);
console.log('\nFinal size:', result.length);

// =================================================
// VERIFICATION
// =================================================
console.log('\n=== VERIFICATION ===');
console.log('HTML: DOCTYPE=' + result.includes('<!DOCTYPE') +
  ', head=' + result.includes('<head') + ', body=' + result.includes('<body'));

const recPat = /<div id="rec(\d+)"/g;
let m, recs = [], seen = new Set();
while ((m = recPat.exec(result)) !== null) {
  if (!seen.has(m[1])) { seen.add(m[1]); recs.push(m[1]); }
}
const expected = ['1894130161','1894130171','1894130181','1894130191','1894130201','1894130211','1894130221','1894130241','1894130251','1894130261'];
console.log('Sections (' + recs.length + '): ' + recs.map(r => 'rec' + r).join(' -> '));
console.log('Order:', JSON.stringify(recs) === JSON.stringify(expected) ? 'CORRECT' : 'WRONG');

console.log('og:title:', result.includes('og:title') ? 'YES' : 'NO');
console.log('dresscode_photo:', result.includes('rec_dresscode_photo') ? 'EXISTS' : 'REMOVED');

circleIds.forEach(cid => {
  // Find DOM occurrence
  const classP = 'tn-elem__1894130241' + cid;
  const cIdx = result.indexOf(classP);
  if (cIdx < 0) { console.log('Circle ' + cid + ': DOM NOT FOUND'); return; }
  const chunk = result.substring(cIdx, cIdx + 1000);
  console.log('Circle ' + cid + ': t-bgimg=' + chunk.includes('t-bgimg') + ', data-original=' + chunk.includes('data-original'));
});

console.log('7th circle:', result.includes('1735205099999') ? 'EXISTS' : 'REMOVED');
console.log('Great Vibes:', result.includes('Great Vibes') ? 'YES' : 'NO');
console.log('Google Form:', result.includes('forms.gle') || result.includes('google.com/forms') ? 'YES' : 'NO');
console.log('Yandex map:', result.includes('api-maps') || result.includes('yandex') ? 'YES' : 'NO');
console.log('Людмиле:', result.includes('Людмиле') ? 'YES' : 'NO');

// Duplicates
recs.forEach(r => {
  const c = (result.match(new RegExp('<div id="rec' + r + '"', 'g')) || []).length;
  if (c > 1) console.log('WARN: rec' + r + ' duplicated ' + c + 'x');
});
