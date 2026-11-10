/*
  Общее для всех страниц: появление блоков при прокрутке, переключатель языка, учёт кликов по Telegram и телефону.
  Главная: карусель первого экрана, A/B-заголовок, бегущая строка, мозаика работ с фильтрами.
  Команда: смена фона при наведении на имя.
*/
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  document.documentElement.classList.add("js");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ——— Подсказка внизу экрана ———
  var toastEl;
  var toastTimer;
  function toast(text) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2200);
  }


  // ——— Учёт кликов ———
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("t.me/") >= 0) window.track("telegram_click", { place: a.getAttribute("data-tg") || "other" });
    if (href.indexOf("tel:") === 0) window.track("phone_click", { place: a.getAttribute("data-tg") || "other" });
  });

  // ——— Появление при прокрутке: один раз, в сетках с задержкой по элементам ———
  var io =
    !reduced && "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                en.target.classList.add("in");
                io.unobserve(en.target);
              }
            });
          },
          { rootMargin: "0px 0px -8% 0px" }
        )
      : null;

  function reveal(root) {
    $$("[data-stagger]", root).forEach(function (g) {
      $$(".rv", g).forEach(function (el, i) {
        el.style.setProperty("--d", Math.min(i, 8) * 70 + "ms");
      });
    });
    $$(".rv:not(.in)", root).forEach(function (el) {
      if (io) io.observe(el);
      else el.classList.add("in");
    });
  }
  window.ikatReveal = reveal;

  // Описание кадра для экранных дикторов: по-русски своё, на других языках — клиент и формат.
  function altOf(w) {
    return window.LANG === "ru" ? w.alt : tName(w.client) + ", " + tKind(w.kind);
  }

  // ——— Шапка: закреплена, после прокрутки получает подложку ———
  var hdr = $(".hdr");
  if (hdr) {
    var onScroll = function () {
      hdr.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ——— Главная ———
  var hero = $(".hero");
  if (hero && window.WORKS) initHero();

  function initHero() {
    // A/B-тест заголовка: вариант выбирается один раз и запоминается.
    var heads = [t("head1"), t("head2"), t("head3")];
    var v = null;
    try {
      v = localStorage.getItem("ikat_headline");
    } catch (e) {}
    if (v === null || !heads[+v]) {
      v = String(Math.floor(Math.random() * heads.length));
      try {
        localStorage.setItem("ikat_headline", v);
      } catch (e) {}
    }
    window.IKAT_HEADLINE = "v" + (+v + 1);
    window.track("headline_variant", { variant: window.IKAT_HEADLINE, text: heads[+v].replace("\n", " ") });

    var h1 = $(".hero h1");
    h1.innerHTML = heads[+v]
      .split("\n")
      .map(function (l, i) {
        return '<span class="line"><span style="transition-delay:' + (150 + i * 120) + 'ms">' + esc(l) + "</span></span>";
      })
      .join("");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        h1.classList.add("lines-in");
      });
    });

    // Слайды
    var works = window.HERO.map(window.workBySlug).filter(Boolean);
    var stage = $(".hero-slides");
    var nums = $(".nums");
    var cap = $(".hcap");
    stage.innerHTML = works
      .map(function (w, i) {
        return (
          '<div class="hero-slide" data-i="' + i + '">' +
          '<img src="' + (w.frame || w.cover || w.poster) + '" alt="' + esc(altOf(w)) + '" width="1280" height="720"' +
          (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ">" +
          "</div>"
        );
      })
      .join("");
    nums.innerHTML = works
      .map(function (w, i) {
        return (
          '<button type="button" class="num" aria-pressed="false" aria-label="' + (i + 1) + ": " + esc(tName(w.client)) + '">' +
          '<span class="num-k">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="bar"><span class="prog"></span></span></button>'
        );
      })
      .join("");

    // Явная пауза: автосмену можно остановить и запустить снова.
    nums.insertAdjacentHTML(
      "beforeend",
      '<button type="button" class="num-pause" aria-pressed="false" aria-label="' + t("hero.pause") + '"><span aria-hidden="true"></span></button>'
    );

    var slides = $$(".hero-slide", stage);
    var btns = $$(".num", nums);
    var cur = -1;
    var timer = null;
    var DUR = 6000;
    var paused = false;

    function setCaption(w) {
      cap.href = "work.html?w=" + w.slug;
      $(".hcap-name", cap).textContent = tName(w.client);
      $(".hcap-meta", cap).textContent = tKind(w.kind) + " · " + w.dur + " · " + t("watch") + " ↗";
    }

    // Беззвучный тизер, если файл лежит в assets/video/<slug>-teaser.mp4.
    function tryTeaser(slide, w) {
      if (reduced || slide.dataset.tried) return;
      slide.dataset.tried = "1";
      var vid = document.createElement("video");
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.setAttribute("playsinline", "");
      vid.setAttribute("aria-hidden", "true");
      vid.preload = "auto";
      vid.style.opacity = "0";
      vid.style.transition = "opacity .6s";
      vid.addEventListener("canplay", function () {
        slide.appendChild(vid);
        vid.play().catch(function () {});
        vid.style.opacity = "1";
      });
      vid.addEventListener("error", function () {}, { once: true });
      vid.src = "assets/video/" + w.slug + "-teaser.mp4";
    }

    function go(i, user) {
      if (i === cur) return;
      var prev = slides[cur];
      cur = i;
      var s = slides[i];
      // Наезд перезапускается: сначала масштаб 1, потом плавно к 1.05.
      s.classList.remove("zoom");
      void s.offsetWidth;
      s.classList.add("on");
      if (!reduced) requestAnimationFrame(function () {
        s.classList.add("zoom");
      });
      if (prev) {
        prev.classList.remove("on");
        setTimeout(function () {
          if (!prev.classList.contains("on")) prev.classList.remove("zoom");
        }, 800);
      }
      btns.forEach(function (b, k) {
        b.setAttribute("aria-pressed", String(k === i));
        var p = $(".prog", b);
        p.classList.remove("run");
        if (k === i) {
          void p.offsetWidth;
          p.classList.add("run");
        }
      });
      // Подпись меняется с коротким затуханием.
      if (user !== "init") {
        cap.classList.add("fade");
        setTimeout(function () {
          setCaption(works[i]);
          cap.classList.remove("fade");
        }, 250);
      } else setCaption(works[i]);
      tryTeaser(s, works[i]);
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      if (reduced || paused) return;
      timer = setTimeout(function () {
        go((cur + 1) % works.length);
      }, DUR);
    }

    // Пауза: курсор или фокус на подписи и цифрах, открыта форма заявки. Полоса прогресса замирает и потом идёт заново.
    var holds = {};
    function hold(key, on) {
      holds[key] = on;
      var now = Object.keys(holds).some(function (k) {
        return holds[k];
      });
      if (now === paused) return;
      paused = now;
      nums.classList.toggle("paused", paused);
      if (paused) clearTimeout(timer);
      else if (cur >= 0) {
        var p = $(".prog", btns[cur]);
        p.classList.remove("run");
        void p.offsetWidth;
        p.classList.add("run");
        schedule();
      }
    }
    var pauseBtn = $(".num-pause", nums);
    if (reduced) pauseBtn.hidden = true;
    pauseBtn.addEventListener("click", function () {
      var on = pauseBtn.getAttribute("aria-pressed") !== "true";
      pauseBtn.setAttribute("aria-pressed", String(on));
      pauseBtn.setAttribute("aria-label", t(on ? "hero.play" : "hero.pause"));
      hold("user", on);
    });

    var bot = $(".hero-row");
    bot.addEventListener("mouseenter", function () {
      hold("hover", true);
    });
    bot.addEventListener("mouseleave", function () {
      hold("hover", false);
    });
    bot.addEventListener("focusin", function () {
      hold("focus", true);
    });
    bot.addEventListener("focusout", function () {
      hold("focus", false);
    });
    document.addEventListener("ikat:form", function (e) {
      hold("form", e.detail.open);
    });

    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        go(i, true);
      });
      // Стрелки переключают работы, когда фокус на цифрах.
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + works.length) % works.length;
        btns[n].focus();
        go(n, true);
      });
    });

    // Вкладка в фоне — карусель стоит.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearTimeout(timer);
      else if (cur >= 0) {
        var p = $(".prog", btns[cur]);
        p.classList.remove("run");
        void p.offsetWidth;
        p.classList.add("run");
        schedule();
      }
    });

    go(0, "init");
  }

  // ——— Бегущая строка клиентов ———
  var mq = $(".mq-track");
  if (mq) {
    // Разделитель — капля из логотипа IKAT PRO.
    var drop =
      '<svg class="drop" viewBox="0 0 90 140" aria-hidden="true" focusable="false"><path transform="translate(0 -92.7)" d="M44.8842 231.914C38.1457 206.103 0.384598 199.492 0.00317654 166.053C-0.378245 128.418 33.6958 131.978 44.8842 93.4527C56.0725 132.105 90.1458 128.418 89.7644 166.053C89.383 199.619 51.6226 206.103 44.8842 231.914Z"/></svg>';
    // Логотип клиента, если файл есть (window.CLIENTS в data/works.js), иначе название текстом.
    // При наведении белый логотип сменяется цветным на светлой плашке (цветные версии — в assets/clients/color/).
    var group = (window.CLIENTS || [])
      .map(function (c) {
        var item = c.logo
          ? '<span class="client-logo' + (c.square ? " sq" : "") + (c.noPlate ? " np" : "") + '"><img class="cl-w" src="' + c.logo + '" alt="' + esc(c.name) + '" height="40" decoding="async">' +
            '<img class="cl-c" src="' + c.logo.replace("assets/clients/", "assets/clients/color/") + '" alt="" aria-hidden="true" height="40" loading="lazy" decoding="async"></span>'
          : '<span class="client-name">' + esc(c.name) + "</span>";
        return item + drop;
      })
      .join("");
    // Два одинаковых трека подряд: сдвиг на −50% даёт бесконечную ленту без стыка.
    mq.innerHTML =
      '<div class="mq-group">' + group + "</div>" +
      '<div class="mq-group" aria-hidden="true">' + group + "</div>";
  }

  // ——— Мозаика работ ———
  var mosaic = $(".mosaic");
  if (mosaic && window.WORKS) initMosaic();

  function initMosaic() {
    // Фильтр и раскрытый список запоминаются на время визита: возврат со страницы работы попадает в то же место.
    var filter = "all";
    var expanded = false;
    try {
      filter = sessionStorage.getItem("ikat_filter") || "all";
      expanded = sessionStorage.getItem("ikat_expanded") === "1";
    } catch (e) {}
    if (filter !== "all" && !window.CATS[filter]) filter = "all";
    var more = $(".works-more");
    function remember() {
      try {
        sessionStorage.setItem("ikat_filter", filter);
        sessionStorage.setItem("ikat_expanded", expanded ? "1" : "0");
      } catch (e) {}
    }
    $$(".filters .chip").forEach(function (x) {
      x.setAttribute("aria-pressed", String(x.getAttribute("data-filter") === filter));
    });

    function tile(w, big, n) {
      return (
        '<a class="tile rv" href="work.html?w=' + w.slug + '" data-slug="' + w.slug + '">' +
        '<img src="' + (w.frame || w.cover || w.poster) + '" alt="' + esc(altOf(w)) + '" width="1280" height="720" loading="lazy" decoding="async">' +
        // Подпись как у продакшн-студий: номер и категория сверху, крупный клиент и формат снизу.
        '<span class="tile-top cap" aria-hidden="true"><span class="tile-n">' +
        String(n).padStart(2, "0") +
        '</span><span class="tile-tag">' + esc(tCat(w.cat)) + "</span></span>" +
        '<span class="tile-cap"><strong class="tile-client">' + esc(tName(w.client)) + "</strong>" +
        '<span class="tile-meta cap">' + esc(tKind(w.kind)) + " · " + w.dur + "</span></span>" +
        '<span class="tile-pv cap" aria-hidden="true">' + t("preview") + "</span>" +
        "</a>"
      );
    }

    // Ряды по схеме макета: 3 → 2 → 1, и так по кругу.
    function render() {
      var list;
      if (filter === "all") {
        // Первые шесть работ остаются на местах: остальные дописываются в конец, плитки не прыгают под пальцем.
        var top = window.FEATURED.map(window.workBySlug);
        list = expanded
          ? top.concat(window.WORKS.filter(function (w) {
              return top.indexOf(w) < 0;
            }))
          : top;
      } else {
        list = window.WORKS.filter(function (w) {
          return w.cat === filter;
        });
      }
      var html = "";
      var pattern = [3, 2, 1];
      var p = 0;
      var i = 0;
      while (i < list.length) {
        var n = Math.min(pattern[p % 3], list.length - i);
        var row = list.slice(i, i + n);
        html +=
          '<div class="mosaic-row r' + n + '" data-stagger>' +
          row.map(function (w, k) {
            return tile(w, n === 1, i + k + 1);
          }).join("") +
          "</div>";
        i += n;
        p++;
      }
      mosaic.innerHTML = html || '<p class="works-empty">' + t("works.empty") + "</p>";
      more.hidden = filter !== "all" || expanded;
      reveal(mosaic);
      bindPreviews();
    }

    $$(".filters .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        filter = c.getAttribute("data-filter");
        $$(".filters .chip").forEach(function (x) {
          x.setAttribute("aria-pressed", String(x === c));
        });
        window.track("filter_click", { filter: filter });
        remember();
        render();
      });
    });

    $(".works-more button").addEventListener("click", function () {
      expanded = true;
      remember();
      render();
    });

    // Превью при наведении: беззвучный mp4, если он лежит в assets/video/<slug>-teaser.mp4.
    function bindPreviews() {
      if (reduced || !window.matchMedia("(hover: hover)").matches) return;
      $$(".tile", mosaic).forEach(function (t) {
        var vid = null;
        var failed = false;
        t.addEventListener("mouseenter", function () {
          if (failed) return;
          if (!vid) {
            vid = document.createElement("video");
            vid.muted = true;
            vid.loop = true;
            vid.playsInline = true;
            vid.preload = "none";
            vid.setAttribute("aria-hidden", "true");
            vid.addEventListener("error", function () {
              failed = true;
              vid.remove();
            });
            vid.addEventListener("playing", function () {
              t.classList.add("playing");
            });
            vid.src = "assets/video/" + t.dataset.slug + "-teaser.mp4";
            t.insertBefore(vid, t.children[1]);
          }
          vid.play().catch(function () {});
        });
        t.addEventListener("mouseleave", function () {
          if (vid && !failed) {
            vid.pause();
            t.classList.remove("playing");
          }
        });
      });
    }

    render();
  }

  // ——— Рекомендательные письма ———
  var lettersBox = $(".letters-grid");
  if (lettersBox && window.LETTERS) initLetters();

  function initLetters() {
    var all = false;
    var moreBtn = $(".letters-more button");

    function card(l, i) {
      var company = tObj(l.company);
      var role = tObj(l.role);
      var who = tObj(l.person) + (role ? ", " + role.charAt(0).toLowerCase() + role.slice(1) : "");
      var note = l.translated && l.translated !== "uz" && window.LANG !== "uz" && t("letters.tr") ? " (" + t("letters.tr") + ")" : "";
      return (
        '<button type="button" class="letter rv" data-i="' + i + '" aria-label="' + t("letters.open") + ": " + esc(company) + '">' +
        '<span class="letter-doc"><img src="assets/letters/' + l.slug + '-s.jpg" alt="" width="254" height="360" loading="lazy" decoding="async"></span>' +
        '<span class="letter-txt"><strong class="letter-co">' + esc(company) + "</strong>" +
        '<span class="letter-q">«' + esc(tObj(l.quote)) + "»" + esc(note) + "</span>" +
        '<span class="letter-who">' + esc(who) + "</span></span></button>"
      );
    }

    function render() {
      var list = all ? window.LETTERS : window.LETTERS.slice(0, 6);
      lettersBox.innerHTML = list.map(card).join("");
      $(".letters-more").hidden = all;
      reveal(lettersBox);
    }

    moreBtn.addEventListener("click", function () {
      all = true;
      render();
      var seventh = $$(".letter", lettersBox)[6];
      if (seventh) seventh.focus();
    });

    // Письмо целиком — в окне поверх страницы. Esc и клик по фону закрывают, фокус возвращается на карточку.
    var box = document.createElement("div");
    box.className = "lbox";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML =
      '<div class="lbox-in" role="dialog" aria-modal="true" aria-label="' + t("letters.title") + '">' +
      '<button type="button" class="modal-x lbox-x" aria-label="' + t("close") + '">×</button>' +
      '<div class="lbox-scroll"><img alt="" width="1191" height="1684"></div></div>';
    document.body.appendChild(box);
    var bigImg = $("img", box);
    var from = null;

    function openLetter(i, el) {
      var l = window.LETTERS[i];
      from = el;
      bigImg.src = "assets/letters/" + l.slug + ".jpg";
      bigImg.alt = tObj(l.company) + ": " + t("letters.title").toLowerCase();
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      $(".lbox-scroll", box).scrollTop = 0;
      $(".lbox-x", box).focus();
      window.track("letter_open", { company: tObj(l.company) });
    }
    function closeLetter() {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      if (from) from.focus();
    }
    lettersBox.addEventListener("click", function (e) {
      var b = e.target.closest(".letter");
      if (b) openLetter(+b.getAttribute("data-i"), b);
    });
    $(".lbox-x", box).addEventListener("click", closeLetter);
    box.addEventListener("click", function (e) {
      if (e.target === box) closeLetter();
    });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") closeLetter();
      // В окне одна кнопка: Tab остаётся на ней.
      if (e.key === "Tab") {
        e.preventDefault();
        $(".lbox-x", box).focus();
      }
    });

    render();
  }

  // ——— Нижнее меню на телефоне и планшете: прячется при прокрутке вниз, чтобы не закрывать текст ———
  var dock = $(".dock");
  if (dock) {
    var lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        var nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 80;
        if (Math.abs(y - lastY) < 12) return;
        dock.classList.toggle("away", y > lastY && y > 200 && !nearEnd);
        lastY = y;
      },
      { passive: true }
    );
    dock.addEventListener("focusin", function () {
      dock.classList.remove("away");
    });
  }

  // ——— Команда ———
  var team = $(".team");
  if (team) {
    var bgs = $$(".team-bg img", team);
    var photos = $$(".team-photo img", team);
    var people = $$(".person", team);
    // Имена и должности на узбекском и английском лежат в data-атрибутах кнопок.
    if (window.LANG !== "ru") {
      people.forEach(function (p) {
        $(".person-name", p).textContent = p.getAttribute("data-name-" + window.LANG);
        $(".person-role", p).textContent = p.getAttribute("data-role-" + window.LANG);
      });
    }
    function pick(i) {
      bgs.forEach(function (b, k) {
        b.classList.toggle("on", k === i);
      });
      photos.forEach(function (b, k) {
        b.classList.toggle("on", k === i);
      });
      people.forEach(function (p, k) {
        p.classList.toggle("on", k === i);
        p.setAttribute("aria-pressed", String(k === i));
      });
    }
    people.forEach(function (p, i) {
      p.addEventListener("mouseenter", function () {
        pick(i);
      });
      p.addEventListener("focus", function () {
        pick(i);
      });
      p.addEventListener("click", function () {
        pick(i);
      });
    });
    pick(0);
  }

  reveal(document);
})();
