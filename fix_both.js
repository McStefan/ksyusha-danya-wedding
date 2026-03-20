const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// FIX 1: Change торжества gap from 280px to 240px (less gap)
html = html.replace('top: 280px !important;', 'top: 240px !important;');
console.log('Fixed торжества gap: 280 -> 240');

// FIX 2: Fix photo - the thankEl detection isn't working because offsetTop/offsetHeight
// aren't available on mobile properly. Let's use a hardcoded safe value.
// On mobile, "Мы будем очень благодарны" text is at top ~155px, takes ~80px.
// Circles are at 160px, 35px tall. Text is below circles.
// So photo should start at about 310px (after both circles and text)

// Replace the dynamic thankEl detection with simpler logic
const oldCode = `var thankEl = ab.querySelector(".tn-elem[data-elem-id='1735136659862']");
    var photoTop = cTop + cSize + 15;
    if (thankEl) {
      var thankBottom = thankEl.offsetTop + thankEl.offsetHeight;
      if (thankBottom > photoTop) photoTop = thankBottom + 10;
    }`;
const newCode = `var photoTop = 310;`;

if (html.indexOf(oldCode) !== -1) {
    html = html.replace(oldCode, newCode);
    console.log('Fixed photo position to 310px (below circles and text)');
} else {
    console.log('WARNING: old photoTop code not found, trying alternate');
    // Maybe the code got minified
    html = html.replace(/var photoTop = cTop \+ cSize \+ 15;/, 'var photoTop = 310;');
}

fs.writeFileSync('index.html', html);
console.log('DONE');
