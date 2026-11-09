/*
  Страница работы: work.html?w=<slug>.
  Плеер грузится только по клику на постер. Сначала пробуем свой файл assets/video/<slug>.mp4 (нативный <video> со своими кнопками),
  если его нет — встроенный YouTube (youtube-nocookie) в нашей рамке.
*/
(function () {
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var slug = new URLSearchParams(location.search).get("w") || "komatsu";
  var w = window.workBySlug(slug);
  var body = $(".wp-body");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  if (!w) {
    document.title = "Работа не найдена — IKAT PRO";
    $(".wp-tools .icon-btn").hidden = true;
    body.innerHTML =
      '<section class="notfound"><span class="eyebrow">404</span><h1 class="case-title">Такой работы нет</h1>' +
      '<p style="margin-top:24px"><a class="btn btn-white" href="index.html#work">Все работы <span class="arr" aria-hidden="true">→</span></a></p></section>';
    return;
  }

  document.title = w.client + " — " + w.kind + " — IKAT PRO";
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", w.client + ": " + w.kind.toLowerCase() + ", " + w.dur + ". Видеопродакшн IKAT PRO, Ташкент.");
  $(".wp-name").textContent = w.client;
  $(".wp-kind").textContent = "· " + w.kind;

  // ——— Титры ———
  var credits = [
    ["Клиент", w.client],
    ["Режиссёр", "[имя]"],
    ["Оператор", "[имя]"],
    ["Монтаж и цвет", "[имя]"],
    ["Продюсер", "[имя]"],
    ["Хронометраж", w.dur],
  ];
  $(".credits dl").innerHTML = credits
    .map(function (c) {
      var ph = c[1].charAt(0) === "[";
      return "<div><dt>" + c[0] + '</dt><dd class="' + (ph ? "ph" : "") + '">' + esc(c[1]) + "</dd></div>";
    })
    .join("");
  var infoBtn = $(".wp-tools .icon-btn");
  var panel = $("#credits");
  infoBtn.addEventListener("click", function () {
    var open = !panel.classList.contains("open");
    panel.classList.toggle("open", open);
    infoBtn.setAttribute("aria-expanded", String(open));
  });

  // ——— Разметка страницы ———
  var idx = window.WORKS.indexOf(w);
  var next = window.WORKS[(idx + 1) % window.WORKS.length];
  var frames = w.frames || [];
  var tg = "https://t.me/Ikat_pro_ad?start=" + encodeURIComponent(w.slug.replace(/-/g, "_"));

  body.innerHTML =
    '<section aria-label="Ролик">' +
    '<div class="player">' +
    '<button type="button" class="player-poster" aria-label="Смотреть ролик: ' + esc(w.client) + '">' +
    '<img src="' + w.poster + '" alt="' + esc(w.alt) + '" width="1280" height="720" fetchpriority="high">' +
    '<span class="play-ico" aria-hidden="true"></span></button>' +
    "</div>" +
    (w.videos.length > 1
      ? '<div class="episodes" role="group" aria-label="Ролики проекта">' +
        w.videos
          .map(function (v, i) {
            return '<button type="button" class="chip" aria-pressed="' + (i === 0) + '" data-ep="' + i + '">' + esc(v.label || "Ролик " + (i + 1)) + " · " + v.dur + "</button>";
          })
          .join("") +
        "</div>"
      : "") +
    '<div class="wp-under"><span>' + esc(w.client) + " · " + esc(w.kind) + " · " + w.dur + "</span>" +
    '<a class="yt-link" href="https://www.youtube.com/watch?v=' + w.videos[0].id + '" target="_blank" rel="noopener">Смотреть на YouTube ↗</a></div>' +
    "</section>" +
    '<article class="case">' +
    '<span class="eyebrow rv">[Отрасль] · ' + esc(window.CATS[w.cat] || "") + "</span>" +
    '<h1 class="case-title rv">' + esc(w.client) + ': <span class="ph">[заголовок-результат]</span></h1>' +
    '<div class="stats" data-stagger>' +
    '<div class="stat rv"><span class="stat-v ph">[0,0 млн]</span><span class="stat-l">[что посчитали: просмотры, охват]</span></div>' +
    '<div class="stat rv"><span class="stat-v ph">[00 %]</span><span class="stat-l">[второй результат: досмотры, заявки]</span></div>' +
    "</div>" +
    '<ol class="steps" data-stagger>' +
    step("01", "Задача", "[что хотел клиент и для кого ролик]") +
    step("02", "Идея", "[главная мысль и как её показали]") +
    step("03", "Съёмка", "[где снимали, сколько смен, техника]") +
    step("04", "Результат", "[что получил клиент]") +
    "</ol>" +
    '<div class="frames" data-stagger>' +
    [0, 1]
      .map(function (i) {
        return frames[i]
          ? '<figure class="frame rv" style="margin:0"><img src="' + frames[i] + '" alt="Кадр ' + (i + 1) + " из ролика " + esc(w.client) + '" width="800" height="450" loading="lazy"></figure>'
          : '<div class="frame frame-ph rv">[кадр ' + (i + 1) + "]</div>";
      })
      .join("") +
    "</div>" +
    '<section class="cta" aria-label="Заказать похожий ролик">' +
    '<h2 class="h2 rv">Нужен похожий ролик?</h2>' +
    '<div class="cta-actions rv">' +
    '<a class="btn btn-white" href="' + tg + '" target="_blank" rel="noopener" data-tg="case">Написать в Telegram ↗</a>' +
    '<button type="button" class="btn btn-line" data-form="' + (w.cat === "social" ? "Контент для соцсетей" : "Рекламный ролик") + '">Обсудить проект <span class="arr" aria-hidden="true">→</span></button>' +
    "</div></section>" +
    '<a class="next" href="work.html?w=' + next.slug + '">' +
    '<img src="' + (next.frame || next.poster) + '" alt="" width="1280" height="720" loading="lazy">' +
    '<span class="next-cap"><span class="eyebrow">Следующая работа</span><strong>' + esc(next.client) + " ↗</strong>" +
    '<span class="cap" style="display:block;margin-top:8px;font-size:12px">' + esc(next.kind) + " · " + next.dur + "</span></span></a>" +
    "</article>";

  function step(n, t, p) {
    return '<li class="step rv"><span class="step-n">' + n + "</span><h3>" + t + '</h3><p class="ph">' + p + "</p></li>";
  }

  // ——— Плеер ———
  var player = $(".player");
  var ytLink = $(".yt-link");
  var ep = 0;

  function fmt(t) {
    if (!isFinite(t)) return "0:00";
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function youtube() {
    var id = w.videos[ep].id;
    player.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1&autoplay=1" ' +
      'title="' + esc(w.client + " — " + w.kind) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  }

  // Свой mp4 есть только для первого ролика проекта: assets/video/<slug>.mp4.
  function play() {
    window.track("video_play", { slug: w.slug, episode: ep + 1 });
    if (ep > 0) {
      youtube();
      return;
    }
    var v = document.createElement("video");
    v.playsInline = true;
    v.preload = "auto";
    var decided = false;
    v.addEventListener("error", function () {
      if (decided) return;
      decided = true;
      youtube();
    });
    v.addEventListener("loadedmetadata", function () {
      if (decided) return;
      decided = true;
      nativePlayer(v);
    });
    v.src = "assets/video/" + w.slug + ".mp4";
  }

  function nativePlayer(v) {
    player.innerHTML = "";
    v.setAttribute("aria-label", w.client + " — " + w.kind);
    player.appendChild(v);
    var bar = document.createElement("div");
    bar.className = "vc";
    bar.innerHTML =
      '<button type="button" class="vc-play" aria-label="Пауза">❚❚</button>' +
      '<span class="vc-time">0:00</span>' +
      '<input type="range" class="vc-seek" min="0" max="1000" value="0" aria-label="Перемотка">' +
      '<span class="vc-dur">' + fmt(v.duration) + "</span>" +
      '<button type="button" class="vc-mute" aria-label="Выключить звук">🔊</button>' +
      '<button type="button" class="vc-fs" aria-label="Во весь экран">⛶</button>';
    player.appendChild(bar);
    var bPlay = $(".vc-play", bar);
    var seek = $(".vc-seek", bar);
    var bMute = $(".vc-mute", bar);
    var idle;

    function sync() {
      bPlay.textContent = v.paused ? "▶" : "❚❚";
      bPlay.setAttribute("aria-label", v.paused ? "Смотреть" : "Пауза");
    }
    function toggle() {
      if (v.paused) v.play();
      else v.pause();
    }
    function wake() {
      player.classList.remove("idle");
      clearTimeout(idle);
      idle = setTimeout(function () {
        if (!v.paused) player.classList.add("idle");
      }, 2500);
    }

    bPlay.addEventListener("click", toggle);
    v.addEventListener("click", toggle);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("timeupdate", function () {
      $(".vc-time", bar).textContent = fmt(v.currentTime);
      seek.value = v.duration ? Math.round((v.currentTime / v.duration) * 1000) : 0;
    });
    seek.addEventListener("input", function () {
      if (v.duration) v.currentTime = (seek.value / 1000) * v.duration;
    });
    bMute.addEventListener("click", function () {
      v.muted = !v.muted;
      bMute.textContent = v.muted ? "🔇" : "🔊";
      bMute.setAttribute("aria-label", v.muted ? "Включить звук" : "Выключить звук");
    });
    $(".vc-fs", bar).addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (player.requestFullscreen) player.requestFullscreen();
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    });
    player.addEventListener("mousemove", wake);
    player.addEventListener("keydown", function (e) {
      if (e.key === " " && e.target === v) {
        e.preventDefault();
        toggle();
      }
    });
    v.play().catch(function () {});
    sync();
    wake();
    bPlay.focus();
  }

  function posterUi() {
    var v = w.videos[ep];
    player.innerHTML =
      '<button type="button" class="player-poster" aria-label="Смотреть ролик: ' + esc(w.client + (v.label ? ", " + v.label : "")) + '">' +
      '<img src="assets/img/' + v.id + '.jpg" alt="' + esc(w.alt) + '" width="1280" height="720">' +
      '<span class="play-ico" aria-hidden="true"></span></button>';
    $(".player-poster", player).addEventListener("click", play);
  }

  $(".player-poster", player).addEventListener("click", play);

  // Переключатель роликов серии.
  Array.prototype.forEach.call(document.querySelectorAll("[data-ep]"), function (b) {
    b.addEventListener("click", function () {
      ep = +b.getAttribute("data-ep");
      Array.prototype.forEach.call(document.querySelectorAll("[data-ep]"), function (x) {
        x.setAttribute("aria-pressed", String(x === b));
      });
      ytLink.href = "https://www.youtube.com/watch?v=" + w.videos[ep].id;
      posterUi();
      play();
    });
  });
})();
