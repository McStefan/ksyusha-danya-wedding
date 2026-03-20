const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove any old mobile fix scripts if they exist
['if (window.innerWidth > 500) return;', 'var isMobile = window.innerWidth <= 500;'].forEach(function(marker) {
    let idx = html.indexOf(marker);
    if (idx !== -1) {
        let s = html.lastIndexOf('<script>', idx);
        let e = html.indexOf('</script>', idx) + '</script>'.length;
        html = html.substring(0, s) + html.substring(e);
        console.log('Removed old mobile script');
    }
});

// Add mobile-only fix script that runs AFTER the desktop circle script
// This script finds the already-created circles and photo, and repositions them
const mobileScript = `<script>
document.addEventListener("DOMContentLoaded", function() {
  if (window.innerWidth > 500) return;

  var ab = document.querySelector("#rec1894130241 .t396__artboard");
  if (!ab) return;

  // Wait a tick for the desktop script to create circles/photo
  setTimeout(function() {
    // Find dynamically injected elements (no data-elem-id, position:absolute)
    var circles = [];
    var photo = null;
    var children = ab.children;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el.getAttribute("data-elem-id")) continue;
      if (el.style.position !== "absolute") continue;
      if (el.querySelector("img")) {
        photo = el;
      } else if (el.firstChild && el.firstChild.style && el.firstChild.style.borderRadius === "50%") {
        circles.push(el);
      }
    }

    // Reposition circles: 35px, gap 8px, centered
    var cSize = 35, cGap = 8;
    var sw = window.innerWidth;
    var totalW = circles.length * cSize + (circles.length - 1) * cGap;
    var startL = Math.round((sw - totalW) / 2);
    var cTop = 160;
    for (var j = 0; j < circles.length; j++) {
      circles[j].style.left = (startL + j * (cSize + cGap)) + "px";
      circles[j].style.top = cTop + "px";
      circles[j].style.width = cSize + "px";
      circles[j].style.height = cSize + "px";
    }

    // Reposition photo
    var photoTop = cTop + cSize + 15;
    if (photo) {
      photo.style.left = "10px";
      photo.style.width = (sw - 20) + "px";
      photo.style.top = photoTop + "px";
    }

    // After photo loads, push text and phone below it
    var imgEl = photo ? photo.querySelector("img") : null;
    function adjustLayout() {
      var photoBottom = photoTop + (imgEl ? imgEl.offsetHeight : 250);
      var gap = 25;
      var nextY = photoBottom + gap;

      // Move "По всем вопросам" text below photo
      var textEl = ab.querySelector(".tn-elem[data-elem-id='1735207287555']");
      if (textEl) {
        textEl.style.top = nextY + "px";
        textEl.style.left = "10px";
        textEl.style.width = (sw - 20) + "px";
        nextY += textEl.offsetHeight + 15;
      }

      // Move phone button below text
      var phoneEl = ab.querySelector(".tn-elem[data-elem-id='1735207242685']");
      if (phoneEl) {
        phoneEl.style.top = nextY + "px";
        nextY += 70;
      }

      // Update section height
      var newH = nextY + 40;
      ab.style.height = newH + "px";
      var f = document.querySelector("#rec1894130241 .t396__filter");
      var c = document.querySelector("#rec1894130241 .t396__carrier");
      if (f) f.style.height = newH + "px";
      if (c) c.style.height = newH + "px";
    }

    if (imgEl) {
      if (imgEl.complete) {
        adjustLayout();
      } else {
        imgEl.onload = adjustLayout;
      }
    } else {
      adjustLayout();
    }
  }, 100);
});
<\/script>`;

html = html.replace('</body>', mobileScript + '\n</body>');
fs.writeFileSync('index.html', html);
console.log('DONE - mobile fix added (desktop untouched)');
