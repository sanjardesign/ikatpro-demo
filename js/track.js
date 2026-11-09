/*
  Аналитика — заготовка. Пока track() только пишет в консоль.
  Позже сюда вставляются GA4 (gtag('event', event, params)) и Яндекс Метрика (ym(ID, 'reachGoal', event, params)).
*/
(function () {
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  // UTM из адреса запоминаем на время визита, чтобы приложить к заявке с любой страницы.
  function readUtm() {
    var saved = {};
    try {
      saved = JSON.parse(sessionStorage.getItem("ikat_utm") || "{}");
    } catch (e) {}
    var params = new URLSearchParams(location.search);
    var found = false;
    UTM_KEYS.forEach(function (k) {
      if (params.get(k)) {
        saved[k] = params.get(k);
        found = true;
      }
    });
    if (found) {
      try {
        sessionStorage.setItem("ikat_utm", JSON.stringify(saved));
      } catch (e) {}
    }
    return saved;
  }

  window.IKAT_UTM = readUtm();

  window.track = function (event, params) {
    console.log("[track]", event, params || {});
  };
})();
