const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const formCSS = `<style>
@media screen and (max-width:1199px) {
  #rec1894130251 .tn-elem[data-elem-id="1735208243933"] {
    left: 10px !important;
    width: calc(100% - 20px) !important;
  }
  #rec1894130251 .tn-elem[data-elem-id="1735208243933"] .t-input-group {
    width: 100% !important;
  }
  #rec1894130251 .tn-elem[data-elem-id="1735208243933"] input[type="text"] {
    width: 100% !important;
    box-sizing: border-box !important;
  }
  #rec1894130251 .tn-elem[data-elem-id="1735208243933"] .t-submit {
    width: 100% !important;
  }
}
</style>`;

html = html.replace('</head>', formCSS + '\n</head>');
fs.writeFileSync('index.html', html);
console.log('DONE - form mobile CSS added');
