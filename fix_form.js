const fs = require('fs');
let html = fs.readFileSync('C:/Users/Дмитрий/Desktop/Артур сайт/custom_site/index.html', 'utf8');

// Remove first broken script
var s1 = html.indexOf('<script>document.addEventListener("submit"');
if (s1 !== -1) {
  var s1e = html.indexOf('</script>', s1) + '</script>'.length;
  html = html.substring(0, s1) + html.substring(s1e);
  console.log('Removed script 1');
}

// Remove second script
var s2 = html.indexOf("var form = document.querySelector('#form1894130251')");
if (s2 !== -1) {
  var s2s = html.lastIndexOf('<script>', s2);
  var s2e = html.indexOf('</script>', s2) + '</script>'.length;
  html = html.substring(0, s2s) + html.substring(s2e);
  console.log('Removed script 2');
}

// Add clean form submission script
var script = `<script>
(function(){
  var done = false;
  document.addEventListener("click", function(e) {
    var btn = e.target;
    while (btn && btn !== document) {
      if (btn.type === "submit" || (btn.className && btn.className.indexOf("t-submit") !== -1)) break;
      btn = btn.parentNode;
    }
    if (!btn || btn === document || done) return;
    var form = document.querySelector("#form1894130251");
    if (!form || !form.contains(btn)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var nameEl = form.querySelector("input[type=text]");
    var radioEl = form.querySelector("input[type=radio]:checked");
    var name = nameEl ? nameEl.value : "";
    var radio = radioEl ? radioEl.value : "";
    var map = {
      "Обязательно приду": "С удовольствием буду",
      "Буду со второй половинкой": "Буду с парой",
      "Не смогу присутствовать": "К сожалению не могу"
    };
    var gRadio = map[radio] || radio;
    var url = "https://docs.google.com/forms/d/e/1FAIpQLSc3XVbYQdzdor3zjV0T448f0dqUjhkZkZE3uaTzEFkCevv_Gg/formResponse";
    var fd = new FormData();
    fd.append("entry.363423937", name);
    fd.append("entry.940953068", gRadio);
    btn.textContent = "Отправляем...";
    fetch(url, {method:"POST", mode:"no-cors", body:fd}).then(function(){
      done = true;
      form.innerHTML = '<div style="font-size:24px;color:#896e4f;text-align:center;padding:40px;font-family:Montserrat,sans-serif;">Спасибо! Мы с нетерпением ждём вас!</div>';
    });
  }, true);
})();
<\/script>`;

html = html.replace('</body>', script + '\n</body>');
fs.writeFileSync('C:/Users/Дмитрий/Desktop/Артур сайт/custom_site/index.html', html);
console.log('DONE');
