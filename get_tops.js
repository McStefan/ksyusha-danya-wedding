const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// These elements have responsive CSS in Tilda's style blocks
// Let me find the CSS rule for each element at 320px resolution
['1736417625799', '1735199564963', '1735136659862'].forEach(function(id) {
    // Find in CSS: @media with max-width containing this element
    const cssPattern = '#rec1894130211 .tn-elem[data-elem-id="' + id + '"]';
    let idx = html.indexOf(cssPattern);
    while (idx !== -1) {
        const chunk = html.substring(idx, idx + 500);
        const topMatch = chunk.match(/top:(\d+)px/);
        // Check if this is inside a media query for 320
        const before = html.substring(Math.max(0, idx - 500), idx);
        const is320 = before.lastIndexOf('max-width:320px') > before.lastIndexOf('}');
        const is480 = before.lastIndexOf('max-width:480px') > before.lastIndexOf('}');
        const is640 = before.lastIndexOf('max-width:640px') > before.lastIndexOf('}');
        
        let res = 'desktop';
        if (is320) res = '320';
        else if (is480) res = '480';
        else if (is640) res = '640';
        
        if (topMatch) {
            console.log(id + ' @ ' + res + ': top=' + topMatch[1] + 'px');
        }
        
        idx = html.indexOf(cssPattern, idx + 1);
    }
});
