/*
  Страница работы: work.html?w=<slug>.
  Плеер грузится только по клику на постер. Сначала пробуем свой файл в assets/video/ (нативный <video> со своими кнопками),
  если его нет — встроенный YouTube (youtube-nocookie) в нашей рамке.
  Блок кейса (отрасль, результат, цифры, шаги) появится, когда у работы в data/works.js будет поле story — пустых заглушек не показываем.
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
    document.title = t("wp.404") + " · IKAT PRO";
    $(".wp-info").hidden = true;
    body.innerHTML =
      '<section class="notfound"><span class="eyebrow">404</span><h1 class="case-title">' + t("wp.404") + "</h1>" +
      '<p style="margin-top:24px"><a class="btn btn-white" href="index.html#work">' + t("wp.all") + ' <span class="arr" aria-hidden="true">→</span></a></p></section>';
    return;
  }

  var client = tName(w.client);
  var kind = tKind(w.kind);
  document.title = client + ", " + kind.toLowerCase() + " · IKAT PRO";
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", client + ": " + kind.toLowerCase() + ", " + w.dur + ". IKAT PRO.");
  // Стрелка «назад» подписана «Работы», а не названием текущей работы.
  $(".wp-name").textContent = t("wp.works");
  $(".wp-kind").textContent = "";

  // Тип заявки и подсказка задачи для всех кнопок «Обсудить» на этой странице.
  var formKind = w.cat === "social" ? "Контент для соцсетей" : w.cat === "corporate" ? "Имиджевый фильм" : "Рекламный ролик";
  var formTask = t("wp.task") + " " + client;
  var topCta = $(".wp-cta");
  if (topCta) {
    topCta.setAttribute("data-form", formKind);
    topCta.setAttribute("data-task", formTask);
  }

  // ——— Титры: только то, что известно. Имена съёмочной группы добавляются полем credits в data/works.js. ———
  var credits = [
    [t("wp.client"), client],
    [t("wp.format"), kind],
    [t("wp.cat"), tCat(w.cat)],
    [t("wp.dur"), w.dur],
  ];
  var roles = { director: "wp.director", dop: "wp.dop", edit: "wp.edit", producer: "wp.producer" };
  Object.keys(roles).forEach(function (k) {
    if (w.credits && w.credits[k]) credits.push([t(roles[k]), w.credits[k]]);
  });
  $(".credits dl").innerHTML = credits
    .map(function (c) {
      return "<div><dt>" + c[0] + "</dt><dd>" + esc(c[1]) + "</dd></div>";
    })
    .join("");
  var infoBtn = $(".wp-info");
  var panel = $("#credits");
  // Без имён съёмочной группы панель повторяла бы строку под названием — прячем значок.
  if (credits.length <= 4) {
    infoBtn.hidden = true;
    panel.hidden = true;
  }
  infoBtn.addEventListener("click", function () {
    var open = !panel.classList.contains("open");
    panel.classList.toggle("open", open);
    infoBtn.setAttribute("aria-expanded", String(open));
    // Панель наверху страницы: подвозим её в экран, иначе нажатие выглядит несработавшим.
    if (open) window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Языковая версия ролика по умолчанию: узбекский сайт — UZ, остальные — RU.
  var ep = 0;
  w.videos.forEach(function (v, i) {
    if (v.lang && v.lang === (window.LANG === "uz" ? "uz" : "ru")) ep = i;
  });

  // «Следующая работа» — внутри категории, если человек пришёл из отфильтрованного списка.
  var filter = "all";
  try {
    filter = sessionStorage.getItem("ikat_filter") || "all";
  } catch (e) {}
  var pool = window.WORKS.filter(function (x) {
    return filter === "all" || filter !== w.cat ? true : x.cat === filter;
  });
  if (pool.indexOf(w) < 0 || pool.length < 2) pool = window.WORKS;
  var next = pool[(pool.indexOf(w) + 1) % pool.length];

  var frames = w.frames || [];
  var tg = "https://t.me/Ikat_pro_ad?start=" + encodeURIComponent(w.slug.replace(/-/g, "_"));
  var alt = window.LANG === "ru" ? w.alt : client + ", " + kind;

  body.innerHTML =
    '<section aria-label="' + t("wp.video") + '">' +
    '<div class="player">' +
    '<button type="button" class="player-poster" aria-label="' + t("wp.play") + ": " + esc(client) + '">' +
    '<img src="assets/img/' + w.videos[ep].id + '.jpg" alt="' + esc(alt) + '" width="1280" height="720" fetchpriority="high">' +
    '<span class="play-ico" aria-hidden="true"></span></button>' +
    "</div>" +
    (w.videos.length > 1
      ? '<div class="episodes" role="group" aria-label="' + t("wp.episodes") + '">' +
        w.videos
          .map(function (v, i) {
            return '<button type="button" class="chip" aria-pressed="' + (i === ep) + '" data-ep="' + i + '">' + esc(v.lang ? t("ver." + v.lang) : tLabel(v.label || t("wp.clip") + " " + (i + 1))) + " · " + v.dur + "</button>";
          })
          .join("") +
        "</div>"
      : "") +
    // Заявка — сразу под роликом: человек досмотрел и готов написать.
    '<div class="wp-under">' +
    '<div class="wp-title"><h1>' + esc(client) + '</h1><span class="cap">' + esc(kind) + " · " + w.dur + "</span>" +
    '<span class="wp-about">' + t("wp.about") + "</span></div>" +
    '<div class="wp-actions">' +
    '<button type="button" class="btn btn-white" data-form="' + formKind + '" data-task="' + esc(formTask) + '">' + t("wp.want") + ' <span class="arr" aria-hidden="true">→</span></button>' +
    '<a class="btn btn-line" href="' + tg + '" target="_blank" rel="noopener" data-tg="case">' + t("wp.tg") + "</a>" +
    '<a class="yt-link" href="https://www.youtube.com/watch?v=' + w.videos[ep].id + '" target="_blank" rel="noopener">' + t("wp.youtube") + "</a>" +
    "</div></div>" +
    "</section>" +
    (frames.length
      ? '<div class="frames" data-stagger>' +
        frames
          .map(function (f, i) {
            return '<figure class="frame rv" style="margin:0"><img src="' + f + '" alt="' + t("wp.frame") + " " + (i + 1) + ", " + esc(client) + '" width="800" height="450" loading="lazy"></figure>';
          })
          .join("") +
        "</div>"
      : "") +
    '<a class="next" href="work.html?w=' + next.slug + '">' +
    '<img src="' + (next.frame || next.cover || next.poster) + '" alt="" width="1280" height="720" loading="lazy">' +
    '<span class="next-cap"><span class="eyebrow">' + t("wp.next") + "</span><strong>" + esc(tName(next.client)) + " ↗</strong>" +
    '<span class="cap" style="display:block;margin-top:8px;font-size:12px">' + esc(tKind(next.kind)) + " · " + next.dur + "</span></span></a>";

  // «Назад» возвращает в то же место списка: фильтр и прокрутка сохраняются.
  Array.prototype.forEach.call(document.querySelectorAll(".wp-back"), function (a) {
    a.addEventListener("click", function (e) {
      var ref = document.referrer;
      var same = ref && ref.indexOf(location.origin) === 0 && !/work\.html/.test(ref) && /(index\.html|\/)([?#].*)?$/.test(ref);
      if (same && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });

  // ——— Плеер ———
  var player = $(".player");
  var ytLink = $(".yt-link");

  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    var m = Math.floor(s / 60);
    var r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function youtube() {
    var id = w.videos[ep].id;
    player.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1&autoplay=1" ' +
      'title="' + esc(client + ", " + kind) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  }

  // Свой mp4: assets/video/<slug>.mp4 для первого ролика, <slug>-ru.mp4 / <slug>-uz.mp4 для языковых версий.
  function play() {
    window.track("video_play", { slug: w.slug, episode: ep + 1 });
    var cur = w.videos[ep];
    if (!cur.lang && ep > 0) {
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
    v.src = "assets/video/" + w.slug + (cur.lang ? "-" + cur.lang : "") + ".mp4";
  }

  function nativePlayer(v) {
    player.innerHTML = "";
    v.setAttribute("aria-label", client + ", " + kind);
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
      '<button type="button" class="player-poster" aria-label="' + t("wp.play") + ": " + esc(client + (v.label ? ", " + v.label : "")) + '">' +
      '<img src="assets/img/' + v.id + '.jpg" alt="' + esc(alt) + '" width="1280" height="720">' +
      '<span class="play-ico" aria-hidden="true"></span></button>';
    $(".player-poster", player).addEventListener("click", play);
  }

  $(".player-poster", player).addEventListener("click", play);

  // Открылась форма заявки — ролик не должен играть под окном.
  document.addEventListener("ikat:form", function (e) {
    if (!e.detail.open) return;
    var v = $("video", player);
    if (v) v.pause();
    else if ($("iframe", player)) posterUi();
  });

  // Переключатель роликов серии и языковых версий.
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
