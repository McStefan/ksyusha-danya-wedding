var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');
var ids = ['1735205096248','1735205096251','1735205096254','1735205096257','1735205211087','1735205211092'];

for (var id of ids) {
  // Check CSS exists
  var cssSearch = 'data-elem-id="' + id + '"';
  var cssIdx = html.indexOf(cssSearch);
  console.log(id + ' CSS: ' + (cssIdx >= 0 ? 'YES at ' + cssIdx : 'NO'));

  // Check DOM element exists
  var domSearch1 = 'tn-elem__18941302411' + id;
  var domSearch2 = 'data-elem-id="' + id + '"';
  var domIdx1 = html.indexOf(domSearch1);

  // Search for DOM in the rec section
  var recStart = html.indexOf('<div id="rec1894130241"');
  var recEnd = html.indexOf('<div id="rec', recStart + 30);
  var section = html.substring(recStart, recEnd);
  var domIdx2 = section.indexOf(domSearch2);
  console.log(id + ' DOM by class: ' + (domIdx1 >= 0 ? 'YES' : 'NO') + ' | DOM by data-attr in section: ' + (domIdx2 >= 0 ? 'YES at ' + domIdx2 : 'NO'));

  if (domIdx2 >= 0) {
    var atomIdx = section.indexOf('tn-atom', domIdx2);
    if (atomIdx >= 0) {
      var atomChunk = section.substring(atomIdx, atomIdx + 300);
      console.log('  Atom: ' + atomChunk.substring(0, 150));
    }
  }
  console.log('---');
}
