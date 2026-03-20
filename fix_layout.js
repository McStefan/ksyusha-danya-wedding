var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');

// 1. Hide "палитру" text and circles inside the artboard via CSS
// Add CSS to hide these elements inside artboard
var hideCSS = `
/* Hide dresscode elements inside artboard - they are now in standalone section */
#rec1894130241 .tn-elem[data-elem-id="1735136659862"],
#rec1894130241 .tn-elem[data-elem-id="1735205096248"],
#rec1894130241 .tn-elem[data-elem-id="1735205096251"],
#rec1894130241 .tn-elem[data-elem-id="1735205096254"],
#rec1894130241 .tn-elem[data-elem-id="1735205096257"],
#rec1894130241 .tn-elem[data-elem-id="1735205211087"],
#rec1894130241 .tn-elem[data-elem-id="1735205211092"],
#rec1894130241 .tn-elem[data-elem-id="1735205099999"] {
  display: none !important;
}
`;

// Insert hide CSS into the custom style block
var styleTag = '<style>';
var styleIdx = html.indexOf(styleTag);
if (styleIdx >= 0) {
  html = html.substring(0, styleIdx + styleTag.length) + hideCSS + html.substring(styleIdx + styleTag.length);
}

// 2. Create standalone dresscode section with title, text, circles, photo
// Place it BEFORE rec1894130241
var dresscodeSection = `
<!-- ДРЕСС-КОД standalone section -->
<div id="dresscode_section" style="background-color:#fffffa;text-align:center;padding:40px 0 20px 0;">
  <div style="font-family:'Cormorant SC',serif;font-size:48px;color:#896e4f;letter-spacing:8px;margin-bottom:20px;">ДРЕСС-КОД</div>
  <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:#896e4f;line-height:1.6;margin-bottom:30px;padding:0 20px;">
    Мы будем очень благодарны, если вы <strong>поддержите<br>цветовую палитру</strong> нашей свадьбы:
  </div>
  <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:30px;padding:0 20px;">
    <div style="width:90px;height:90px;border-radius:50%;background-color:#212121;"></div>
    <div style="width:90px;height:90px;border-radius:50%;background-color:#5D4636;"></div>
    <div style="width:90px;height:90px;border-radius:50%;background-color:#856A57;"></div>
    <div style="width:90px;height:90px;border-radius:50%;background-color:#D8CCB4;"></div>
    <div style="width:90px;height:90px;border-radius:50%;background-color:#E1D3C6;"></div>
    <div style="width:90px;height:90px;border-radius:50%;background-color:#AEBEA4;"></div>
    <div style="width:90px;height:90px;border-radius:50%;background-color:#5E6845;"></div>
  </div>
  <img src="images/dresscode.png" alt="Дресс-код" style="max-width:1000px;width:90%;height:auto;display:inline-block;">
</div>
`;

// Remove old standalone photo section
html = html.replace(/\n<!-- Dresscode photo section -->\n<div id="rec_dresscode_photo"[^>]*>\n[^<]*<img[^>]*>\n<\/div>\n/, '\n');

// Insert new section before rec1894130241
var recMarker = '<div id="rec1894130241"';
var recIdx = html.indexOf(recMarker);
if (recIdx >= 0) {
  html = html.substring(0, recIdx) + dresscodeSection + '\n' + html.substring(recIdx);
  console.log('Inserted standalone dresscode section before rec1894130241');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
