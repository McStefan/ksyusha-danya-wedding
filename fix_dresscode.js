const fs = require('fs');
let html = fs.readFileSync('C:/Users/Дмитрий/Desktop/Артур сайт/custom_site/index.html', 'utf8');

// Remove previously injected script
const scriptMarker = "document.addEventListener('DOMContentLoaded', function()";
let scriptStart = html.indexOf(scriptMarker);
if (scriptStart !== -1) {
  scriptStart = html.lastIndexOf('<script>', scriptStart);
  const scriptEnd = html.indexOf('</script>', scriptStart) + '</script>'.length;
  html = html.substring(0, scriptStart) + html.substring(scriptEnd);
  console.log('Old script removed');
}

const colors = ['#212121','#5D4636','#856A57','#D8CCB4','#E1D3C6','#AEBEA4','#5E6845'];
const circleIds = ['1735205096248','1735205096251','1735205096254','1735205096257','1735205211092','1735205211087'];

// CSS to hide old circles
let hideCss = '';
circleIds.forEach(function(id) {
  hideCss += '#rec1894130241 .tn-elem[data-elem-id="' + id + '"] { display:none !important; }\n';
});

// Circle parameters
const circleSize = 55;
const gap = 18;
const totalWidth = colors.length * circleSize + (colors.length - 1) * gap;
const startLeft = Math.round((1200 - totalWidth) / 2);
const circleTop = 310;

// Build circle divs HTML
let circleHTML = '';
colors.forEach(function(color, i) {
  const left = startLeft + i * (circleSize + gap);
  circleHTML += '<div style="position:absolute;top:' + circleTop + 'px;left:calc(50% - 600px + ' + left + 'px);width:' + circleSize + 'px;height:' + circleSize + 'px;z-index:50;"><div style="width:100%;height:100%;border-radius:50%;background-color:' + color + ';"></div></div>';
});

const photoTop = circleTop + circleSize + 25;

const injection = '<style>\n' + hideCss + '</style>\n' +
'<script>\n' +
'document.addEventListener("DOMContentLoaded", function() {\n' +
'  var ab = document.querySelector("#rec1894130241 .t396__artboard");\n' +
'  if (!ab) return;\n' +
'  var tmp = document.createElement("div");\n' +
'  tmp.innerHTML = \'' + circleHTML.replace(/'/g, "\\'") + '\';\n' +
'  while (tmp.firstChild) ab.appendChild(tmp.firstChild);\n' +
'  var pw = document.createElement("div");\n' +
'  pw.style.cssText = "position:absolute;top:' + photoTop + 'px;left:calc(50% - 600px + 300px);width:600px;z-index:50;";\n' +
'  var img = document.createElement("img");\n' +
'  img.src = "images/dresscode_photo.png";\n' +
'  img.style.cssText = "width:100%;height:auto;";\n' +
'  pw.appendChild(img);\n' +
'  ab.appendChild(pw);\n' +
'  img.onload = function() {\n' +
'    var h = ' + photoTop + ' + img.offsetHeight + 40;\n' +
'    if (h > 650) {\n' +
'      ab.style.height = h + "px";\n' +
'      var f = document.querySelector("#rec1894130241 .t396__filter");\n' +
'      var c = document.querySelector("#rec1894130241 .t396__carrier");\n' +
'      if (f) f.style.height = h + "px";\n' +
'      if (c) c.style.height = h + "px";\n' +
'    }\n' +
'  };\n' +
'});\n' +
'<\/script>';

html = html.replace('</body>', injection + '\n</body>');
fs.writeFileSync('C:/Users/Дмитрий/Desktop/Артур сайт/custom_site/index.html', html);
console.log('DONE - circles + photo injected');
