const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// === FIX 1: Add mobile CSS for торжества gap ===
const mobileCSS = `<style>
@media screen and (max-width:1199px) {
  #rec1894130211 .tn-elem[data-elem-id="1735199564963"] {
    top: 280px !important;
  }
}
</style>`;

// Insert before </head>
html = html.replace('</head>', mobileCSS + '\n</head>');
console.log('Added торжества gap CSS');

// === FIX 2: Update mobile circle script - push photo below "благодарны" text ===
// Find the mobile script and update the photoTop calculation
const oldPhotoTop = 'var photoTop = cTop + cSize + 15;';
const newPhotoTop = `var thankEl = ab.querySelector(".tn-elem[data-elem-id='1735136659862']");
    var photoTop = cTop + cSize + 15;
    if (thankEl) {
      var thankBottom = thankEl.offsetTop + thankEl.offsetHeight;
      if (thankBottom > photoTop) photoTop = thankBottom + 10;
    }`;

if (html.indexOf(oldPhotoTop) !== -1) {
    html = html.replace(oldPhotoTop, newPhotoTop);
    console.log('Updated photo positioning to go below благодарны text');
} else {
    console.log('WARNING: photoTop line not found');
}

fs.writeFileSync('index.html', html);
console.log('DONE');
