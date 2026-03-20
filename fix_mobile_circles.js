const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove old circle injection script
const marker1 = 'var tmp = document.createElement("div")';
let idx1 = html.indexOf(marker1);
if (idx1 !== -1) {
    let scriptStart = html.lastIndexOf('<script>', idx1);
    let scriptEnd = html.indexOf('</script>', idx1) + '</script>'.length;
    html = html.substring(0, scriptStart) + html.substring(scriptEnd);
    console.log('Removed old circle injection script');
}

// Remove old mobile circle fix script
const marker2 = 'if (window.innerWidth > 500) return;';
let idx2 = html.indexOf(marker2);
if (idx2 !== -1) {
    let scriptStart = html.lastIndexOf('<script>', idx2);
    let scriptEnd = html.indexOf('</script>', idx2) + '</script>'.length;
    html = html.substring(0, scriptStart) + html.substring(scriptEnd);
    console.log('Removed old mobile circle fix script');
}

// New combined script: circles + photo, responsive
const newScript = `<script>
document.addEventListener("DOMContentLoaded", function() {
  var ab = document.querySelector("#rec1894130241 .t396__artboard");
  if (!ab) return;
  var isMobile = window.innerWidth <= 500;
  var colors = ["#212121","#5D4636","#856A57","#D8CCB4","#E1D3C6","#AEBEA4","#5E6845"];
  var cSize = isMobile ? 35 : 55;
  var cGap = isMobile ? 8 : 18;
  var abWidth = isMobile ? window.innerWidth : 1200;
  var totalW = colors.length * cSize + (colors.length - 1) * cGap;
  var startL = Math.round((abWidth - totalW) / 2);
  var cTop = 310;
  for (var i = 0; i < colors.length; i++) {
    var d = document.createElement("div");
    var leftVal = isMobile ? (startL + i * (cSize + cGap)) + "px" : "calc(50% - 600px + " + (354 + i * 73) + "px)";
    if (isMobile) leftVal = (startL + i * (cSize + cGap)) + "px";
    d.style.cssText = "position:absolute;top:" + cTop + "px;left:" + leftVal + ";width:" + cSize + "px;height:" + cSize + "px;z-index:50;";
    var inner = document.createElement("div");
    inner.style.cssText = "width:100%;height:100%;border-radius:50%;background-color:" + colors[i] + ";";
    d.appendChild(inner);
    ab.appendChild(d);
  }
  var photoTop = cTop + cSize + 15;
  var pw = document.createElement("div");
  if (isMobile) {
    pw.style.cssText = "position:absolute;top:" + photoTop + "px;left:10px;width:" + (window.innerWidth - 20) + "px;z-index:50;";
  } else {
    pw.style.cssText = "position:absolute;top:390px;left:calc(50% - 600px + 300px);width:600px;z-index:50;";
  }
  var img = document.createElement("img");
  img.src = "images/dresscode_photo.png";
  img.style.cssText = "width:100%;height:auto;";
  pw.appendChild(img);
  ab.appendChild(pw);
  img.onload = function() {
    var h = (isMobile ? photoTop : 390) + img.offsetHeight + 40;
    if (h > 650) {
      ab.style.height = h + "px";
      var f = document.querySelector("#rec1894130241 .t396__filter");
      var c = document.querySelector("#rec1894130241 .t396__carrier");
      if (f) f.style.height = h + "px";
      if (c) c.style.height = h + "px";
    }
  };
});
<\/script>`;

html = html.replace('</body>', newScript + '\n</body>');
fs.writeFileSync('index.html', html);
console.log('DONE - responsive circles + photo script injected');
