const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find the ДАНЯ И КСЮША injection script and make it responsive
const oldScript = 'el.style.cssText = "position:absolute;top:calc(50vh - 275px + 68px);left:calc(50% - 600px + 300px);width:600px;z-index:50;text-align:center;font-family:Cormorant Garamond,serif;font-size:55px;color:#ffffff;letter-spacing:6px;font-weight:300;"';

const newScript = `var isMob = window.innerWidth <= 500;
  el.style.cssText = "position:absolute;top:calc(50vh - 275px + 68px);left:" + (isMob ? "10px" : "calc(50% - 600px + 300px)") + ";width:" + (isMob ? (window.innerWidth - 20) + "px" : "600px") + ";z-index:50;text-align:center;font-family:Cormorant Garamond,serif;font-size:" + (isMob ? "32px" : "55px") + ";color:#ffffff;letter-spacing:4px;font-weight:300;"`;

if (html.indexOf(oldScript) !== -1) {
    html = html.replace(oldScript, newScript);
    fs.writeFileSync('index.html', html);
    console.log('DONE - names responsive on mobile');
} else {
    console.log('ERROR: script not found');
}
