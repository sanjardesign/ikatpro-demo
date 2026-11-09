/*
  Форма «Обсудить проект» — модальное окно на всех страницах.
  Открывается любой кнопкой с атрибутом data-form (значение — тип, выбранный заранее, например data-form="Рекламный ролик").
  Сервера нет: в демо заявка проверяется, показывается «Спасибо», а объект заявки пишется в консоль.
*/
(function () {
  var KINDS = ["Рекламный ролик", "Имиджевый фильм", "Контент для соцсетей", "Аренда студии", "Другое"];
  var kind = KINDS[0];
  var opener = null;

  var modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML =
    '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="form-title" tabindex="-1">' +
    '<button type="button" class="modal-x" aria-label="Закрыть">×</button>' +
    '<form class="form" novalidate>' +
    "<div>" +
    '<h2 class="form-title" id="form-title">Обсудить проект</h2>' +
    '<p class="form-lead">Три поля — и продюсер ответит в течение рабочего дня.</p>' +
    "</div>" +
    '<fieldset class="kinds"><legend class="sr-only">Тип проекта</legend>' +
    KINDS.map(function (k) {
      return '<button type="button" class="chip" aria-pressed="false" data-kind="' + k + '">' + k + "</button>";
    }).join("") +
    "</fieldset>" +
    field("name", "Имя и компания", "text", "organization") +
    field("contact", "Телефон или Telegram", "text", "tel") +
    field("task", "Задача в двух словах", "text", "off") +
    '<div class="form-actions">' +
    '<button type="submit" class="btn btn-white">Отправить</button>' +
    '<a class="btn btn-line" href="https://t.me/Ikat_pro_ad?start=site" target="_blank" rel="noopener" data-tg="form">Или в Telegram ↗</a>' +
    "</div>" +
    '<a class="form-brief" href="#" title="[страница брифа позже]">Подробный бриф · 3 мин <span class="ph">[страница брифа позже]</span></a>' +
    "</form>" +
    '<div class="thanks out" hidden aria-live="polite">' +
    '<span class="thanks-mark" aria-hidden="true">✓</span>' +
    '<h2 class="form-title">Спасибо!</h2>' +
    "<p>Продюсер ответит в течение рабочего дня.</p>" +
    '<button type="button" class="btn btn-line" data-close>Закрыть</button>' +
    "</div>" +
    "</div>";
  document.body.appendChild(modal);

  function field(name, label, type, ac) {
    return (
      '<label class="field" data-field="' + name + '">' + label +
      '<input class="inp" name="' + name + '" type="' + type + '" autocomplete="' + ac + '" required>' +
      '<span class="field-err" aria-live="polite"></span></label>'
    );
  }

  var box = modal.querySelector(".modal-box");
  var form = modal.querySelector(".form");
  var thanks = modal.querySelector(".thanks");
  var chips = modal.querySelectorAll(".chip");

  function setKind(k) {
    kind = KINDS.indexOf(k) >= 0 ? k : kind;
    chips.forEach(function (c) {
      c.setAttribute("aria-pressed", String(c.dataset.kind === kind));
    });
  }

  function focusables() {
    return Array.prototype.filter.call(
      box.querySelectorAll("button, a[href], input"),
      function (el) {
        return !el.closest("[hidden]") && el.offsetParent !== null;
      }
    );
  }

  function open(k, from) {
    opener = from || document.activeElement;
    if (k) setKind(k);
    // После «Спасибо» форма снова чистая.
    if (!thanks.hidden) reset();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    setTimeout(function () {
      var first = modal.querySelector('.chip[aria-pressed="true"]') || focusables()[0];
      if (first) first.focus();
    }, 50);
    window.track("lead_form_open", { type: kind, page: location.pathname });
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    if (opener && opener.focus) opener.focus();
  }

  function reset() {
    form.reset();
    form.querySelectorAll(".field").forEach(function (f) {
      f.classList.remove("err");
      f.querySelector(".field-err").textContent = "";
    });
    thanks.hidden = true;
    thanks.classList.add("out");
    thanks.classList.remove("show");
    form.hidden = false;
    form.classList.remove("out");
  }

  function validate() {
    var ok = true;
    var msgs = {
      name: "Напишите, как к вам обращаться",
      contact: "Нужен телефон или ник в Telegram",
      task: "Пара слов о задаче",
    };
    form.querySelectorAll(".field").forEach(function (f) {
      var inp = f.querySelector("input");
      var v = inp.value.trim();
      var bad = v.length < 2;
      if (f.dataset.field === "contact" && !bad) {
        bad = !/^@?[\w.]{4,}$/.test(v.replace(/[\s()+-]/g, "")) && !/\d{7,}/.test(v.replace(/\D/g, ""));
      }
      f.classList.toggle("err", bad);
      inp.setAttribute("aria-invalid", String(bad));
      f.querySelector(".field-err").textContent = bad ? msgs[f.dataset.field] : "";
      if (bad && ok) {
        inp.focus();
        ok = false;
      }
    });
    return ok;
  }

  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      setKind(c.dataset.kind);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var data = new FormData(form);
    var lead = {
      type: kind,
      name: data.get("name").trim(),
      contact: data.get("contact").trim(),
      task: data.get("task").trim(),
      utm: window.IKAT_UTM || {},
      headline_variant: window.IKAT_HEADLINE || null,
      page: location.pathname + location.search,
      sent_at: new Date().toISOString(),
    };
    // TODO: отправить lead на реальный адрес (CRM, Telegram-бот или почта), когда появится бэкенд.
    console.log("[lead]", lead);
    window.track("lead_form_submit", { type: kind });

    // Плавная замена формы на «Спасибо».
    form.classList.add("out");
    setTimeout(function () {
      form.hidden = true;
      thanks.hidden = false;
      requestAnimationFrame(function () {
        thanks.classList.remove("out");
        thanks.classList.add("show");
        thanks.querySelector("[data-close]").focus();
      });
    }, 300);
  });

  modal.querySelector(".modal-x").addEventListener("click", close);
  thanks.querySelector("[data-close]").addEventListener("click", close);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") {
      close();
      return;
    }
    // Фокус не уходит из окна.
    if (e.key === "Tab") {
      var els = focusables();
      var first = els[0];
      var last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-form]");
    if (!btn) return;
    e.preventDefault();
    open(btn.getAttribute("data-form"), btn);
  });

  setKind(kind);
  window.openLeadForm = open;
})();
