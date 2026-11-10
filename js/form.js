/*
  Форма «Обсудить проект» — модальное окно на всех страницах.
  Открывается любой кнопкой с атрибутом data-form (значение — тип, выбранный заранее, например data-form="Аренда студии").
  data-task на кнопке подставляет текст в поле «Задача» (например, «Хочу ролик как Komatsu»).
  Сервера нет: в демо заявка проверяется, показывается «Спасибо», а объект заявки пишется в консоль.
*/
(function () {
  // Значения типов остаются русскими (они уходят в заявку), подписи на кнопках переводятся.
  var KINDS = ["Рекламный ролик", "Имиджевый фильм", "Контент для соцсетей", "Аренда студии", "Другое"];
  var kind = KINDS[0];
  var opener = null;

  var modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML =
    '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="form-title" tabindex="-1">' +
    '<button type="button" class="modal-x" aria-label="' + t("close") + '">×</button>' +
    '<div class="modal-scroll">' +
    '<form class="form" novalidate>' +
    "<div>" +
    '<h2 class="form-title" id="form-title">' + t("form.title") + "</h2>" +
    '<p class="form-lead">' + t("form.lead") + "</p>" +
    "</div>" +
    '<fieldset class="kinds"><legend class="sr-only">' + t("form.kind") + "</legend>" +
    KINDS.map(function (k, i) {
      return '<button type="button" class="chip" aria-pressed="false" data-kind="' + k + '">' + t("kind." + i) + "</button>";
    }).join("") +
    "</fieldset>" +
    field("name", t("form.name"), "text", "organization") +
    field("contact", t("form.contact"), "text", "tel") +
    field("task", t("form.task"), "text", "off") +
    '<div class="form-actions">' +
    '<button type="submit" class="btn btn-white">' + t("form.send") + "</button>" +
    '<a class="btn btn-line" href="https://t.me/Ikat_pro_ad?start=site" target="_blank" rel="noopener" data-tg="form">' + t("form.tg") + "</a>" +
    "</div>" +
    "</form>" +
    '<div class="thanks" hidden aria-live="polite">' +
    '<span class="thanks-mark" aria-hidden="true">✓</span>' +
    '<h2 class="form-title">' + t("form.thanks") + "</h2>" +
    '<p class="thanks-who"></p>' +
    '<p class="thanks-to"></p>' +
    '<button type="button" class="btn btn-line" data-close>' + t("close") + "</button>" +
    "</div>" +
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
  var msgs = { name: t("err.name"), contact: t("err.contact"), task: t("err.task") };

  function setKind(k) {
    kind = KINDS.indexOf(k) >= 0 ? k : kind;
    chips.forEach(function (c) {
      c.setAttribute("aria-pressed", String(c.dataset.kind === kind));
    });
  }

  function focusables() {
    return Array.prototype.filter.call(box.querySelectorAll("button, a[href], input"), function (el) {
      return !el.closest("[hidden]") && el.offsetParent !== null;
    });
  }

  function open(k, from) {
    opener = from || document.activeElement;
    if (k) setKind(k);
    // После «Спасибо» форма снова чистая.
    if (!thanks.hidden) reset();
    var task = from && from.getAttribute && from.getAttribute("data-task");
    if (task && !form.task.value) form.task.value = task;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    // Страница под окном замирает: карусель встаёт на паузу, плеер останавливается.
    document.dispatchEvent(new CustomEvent("ikat:form", { detail: { open: true } }));
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
    document.dispatchEvent(new CustomEvent("ikat:form", { detail: { open: false } }));
    if (opener && opener.focus) opener.focus();
  }

  function reset() {
    form.reset();
    form.querySelectorAll(".field").forEach(function (f) {
      setErr(f, false);
    });
    thanks.hidden = true;
    thanks.classList.remove("show");
    form.hidden = false;
    form.classList.remove("out");
  }

  function isBad(f) {
    var v = f.querySelector("input").value.trim();
    if (v.length < 2) return true;
    if (f.dataset.field !== "contact") return false;
    var digits = v.replace(/\D/g, "");
    var okPhone = digits.length >= 7;
    var okTg = /^@?[A-Za-z][\w.]{3,}$/.test(v.replace(/\s/g, ""));
    var okMail = /^\S+@\S+\.\S{2,}$/.test(v);
    return !(okPhone || okTg || okMail);
  }

  function setErr(f, bad) {
    var inp = f.querySelector("input");
    f.classList.toggle("err", bad);
    inp.setAttribute("aria-invalid", String(bad));
    f.querySelector(".field-err").textContent = bad ? msgs[f.dataset.field] : "";
  }

  function validate() {
    var ok = true;
    form.querySelectorAll(".field").forEach(function (f) {
      var bad = isBad(f);
      setErr(f, bad);
      if (bad && ok) {
        f.querySelector("input").focus();
        ok = false;
      }
    });
    return ok;
  }

  // Ошибка гаснет, как только поле исправили.
  form.addEventListener("input", function (e) {
    var f = e.target.closest(".field");
    if (f && f.classList.contains("err") && !isBad(f)) setErr(f, false);
  });

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
      lang: window.LANG,
      sent_at: new Date().toISOString(),
    };
    // TODO: отправить lead на реальный адрес (CRM, Telegram-бот или почта), когда появится бэкенд.
    console.log("[lead]", lead);
    window.track("lead_form_submit", { type: kind });

    // Кто ответит и куда: человек видит, что заявка дошла.
    thanks.querySelector(".thanks-who").textContent = t(kind === "Аренда студии" ? "who.studio" : "who.prod");
    thanks.querySelector(".thanks-to").textContent = t("form.thanksTo") + ": " + lead.contact;

    // Кнопка показывает, что заявка уходит, и не даёт нажать дважды.
    var send = form.querySelector('button[type="submit"]');
    send.disabled = true;
    send.textContent = t("form.sending");

    // Плавная замена формы на «Спасибо». Форма убирается из вёрстки и из обхода клавиатурой.
    form.classList.add("out");
    setTimeout(function () {
      send.disabled = false;
      send.textContent = t("form.send");
      form.hidden = true;
      thanks.hidden = false;
      modal.querySelector(".modal-scroll").scrollTop = 0;
      requestAnimationFrame(function () {
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
