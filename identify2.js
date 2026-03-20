const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Try finding element types differently - look for data-elem-type right after data-elem-id
const ids = ['1735207287555','1735207242685','1735136659862','1735207008209','1735207448817','1735207475067','1735136242479','1735206216009','1735136386033','1735136434070','1735136424284','1735136370352','1735135983445'];

ids.forEach(function(id) {
    const marker = 'data-elem-id="' + id + '"';
    const idx = html.indexOf(marker);
    if (idx === -1) return;
    
    // Get 500 chars before and 2000 after for context
    const before = html.substring(Math.max(0, idx - 200), idx);
    const after = html.substring(idx, idx + 2000);
    const combined = before + after;
    
    // Find elem type
    const typeMatch = combined.match(/data-elem-type="([^"]+)"/);
    
    // Find text in tn-atom
    const textMatches = after.match(/<div class="tn-atom"[^>]*>([\s\S]*?)<\/div>/);
    let text = '';
    if (textMatches) {
        text = textMatches[1].replace(/<[^>]+>/g, '|').trim().substring(0, 100);
    }
    
    // Check if it's shape, image, button, etc
    const hasShape = after.indexOf('tn-atom__sbs-anim-wrapper') !== -1;
    const hasImg = after.indexOf('<img') !== -1;
    const hasBtn = after.indexOf('t-btn') !== -1;
    
    let kind = typeMatch ? typeMatch[1] : (hasBtn ? 'button' : hasImg ? 'image' : hasShape ? 'shape' : '?');
    
    console.log(id + ' kind=' + kind + ' text="' + text + '"');
});
