const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find "По всем вопросам" to get the actual element ID & position
const textIdx = html.indexOf('По всем вопросам');
const chunk1 = html.substring(textIdx - 500, textIdx + 200);
const idMatch1 = chunk1.match(/data-elem-id="(\d+)"/g);
console.log('=== По всем вопросам ===');
console.log('Nearby elem IDs:', idMatch1);

// Find phone number
const phoneIdx = html.indexOf('8-913-950-32-11');
const chunk2 = html.substring(phoneIdx - 500, phoneIdx + 200);
const idMatch2 = chunk2.match(/data-elem-id="(\d+)"/g);
console.log('\n=== 8-913-950-32-11 ===');
console.log('Nearby elem IDs:', idMatch2);

// Find "Мы будем очень благодарны"
const thankIdx = html.indexOf('Мы будем очень благодарны');
const chunk3 = html.substring(thankIdx - 500, thankIdx + 200);
const idMatch3 = chunk3.match(/data-elem-id="(\d+)"/g);
console.log('\n=== Мы будем очень благодарны ===');
console.log('Nearby elem IDs:', idMatch3);

// Find "Пожалуйста, заполните анкету"
const formIdx = html.indexOf('заполните анкету');
const chunk4 = html.substring(formIdx - 500, formIdx + 200);
const idMatch4 = chunk4.match(/data-elem-id="(\d+)"/g);
console.log('\n=== заполните анкету ===');
console.log('Nearby elem IDs:', idMatch4);

// Find "Планируете ли"
const planIdx = html.indexOf('Планируете ли');
const chunk5 = html.substring(planIdx - 500, planIdx + 200);
const idMatch5 = chunk5.match(/data-elem-id="(\d+)"/g);
console.log('\n=== Планируете ли ===');
console.log('Nearby elem IDs:', idMatch5);

// Find ДЕТАЛИ
const detIdx = html.indexOf('>ДЕТАЛИ<');
if (detIdx !== -1) {
    const chunk6 = html.substring(detIdx - 500, detIdx + 200);
    const idMatch6 = chunk6.match(/data-elem-id="(\d+)"/g);
    console.log('\n=== ДЕТАЛИ ===');
    console.log('Nearby elem IDs:', idMatch6);
}
