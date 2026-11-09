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

  // ——— Языки: RU основной, UZ и EN пока без перевода ———
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (!b) return;
    var l = b.getAttribute("data-lang");
    if (l !== "ru") toast(l.toUpperCase() + ": [перевод позже]");
  });

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

  // ——— Главная ———
  var hero = $(".hero");
  if (hero && window.WORKS) initHero();

  function initHero() {
    // A/B-тест заголовка: вариант выбирается один раз и запоминается.
    var heads = [
      "Видео, которое\nдосматривают",
      "Реклама и фильмы\nдля брендов Узбекистана",
      "От идеи\nдо готового ролика",
    ];
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
          '<img src="' + (w.frame || w.poster) + '" alt="' + esc(w.alt) + '" width="1280" height="720"' +
          (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ">" +
          "</div>"
        );
      })
      .join("");
    nums.innerHTML = works
      .map(function (w, i) {
        return (
          '<button type="button" class="num" aria-pressed="false" aria-label="' + (i + 1) + ": " + esc(w.client) + '">' +
          '<span class="num-k">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="bar"><span class="prog"></span></span></button>'
        );
      })
      .join("");

    var slides = $$(".hero-slide", stage);
    var btns = $$(".num", nums);
    var cur = -1;
    var timer = null;
    var DUR = 6000;

    function setCaption(w) {
      cap.href = "work.html?w=" + w.slug;
      $(".hcap-name", cap).textContent = w.client;
      $(".hcap-meta", cap).textContent = w.kind + " · " + w.dur + " · Смотреть ↗";
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
      if (reduced) return;
      timer = setTimeout(function () {
        go((cur + 1) % works.length);
      }, DUR);
    }

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
    var clients = ["Komatsu", "Asakabank", "Indorama", "Mannol", "AION", "Biolife", "Saxovat", "Merci", "Eclair", "Landor", "Avangard", "Open Budjet", "HPC"];
    var group = clients
      .map(function (c) {
        return "<span>" + c + '</span><span class="star" aria-hidden="true">✦</span>';
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
    var filter = "all";
    var expanded = false;
    var more = $(".works-more");

    function tile(w, big) {
      return (
        '<a class="tile rv" href="work.html?w=' + w.slug + '" data-slug="' + w.slug + '">' +
        '<img src="' + (w.frame || w.poster) + '" alt="' + esc(w.alt) + '" width="1280" height="720" loading="lazy" decoding="async">' +
        '<span class="tile-pv cap" aria-hidden="true">▶ Превью</span>' +
        '<span class="tile-cap cap">' + esc(w.client) + "<span>" + esc(w.kind) + (big ? " · " + w.dur : "") + "</span></span>" +
        "</a>"
      );
    }

    // Ряды по схеме макета: 3 → 2 → 1, и так по кругу.
    function render() {
      var list;
      if (filter === "all") {
        list = expanded ? window.WORKS : window.FEATURED.map(window.workBySlug);
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
          row.map(function (w) {
            return tile(w, n === 1);
          }).join("") +
          "</div>";
        i += n;
        p++;
      }
      mosaic.innerHTML = html || '<p class="works-empty">[работ в этой категории пока нет]</p>';
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
        render();
      });
    });

    $(".works-more button").addEventListener("click", function () {
      expanded = true;
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

  // ——— Команда ———
  var team = $(".team");
  if (team) {
    var bgs = $$(".team-bg img", team);
    var people = $$(".person", team);
    function pick(i) {
      bgs.forEach(function (b, k) {
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
