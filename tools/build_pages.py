# Собирает пять HTML-страниц сайта IKAT PRO: общая шапка, подвал, нижнее меню и разметка каждой страницы.
# HTML-файлы в корне не правьте руками: при следующей сборке скрипт их перезапишет.
# Запуск из любой папки: python tools/build_pages.py
import os
import re
import time

# Корень сайта: папка на уровень выше tools/.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace("\\", "/") + "/"
# Версия в адресах стилей и скриптов: после каждой выкладки браузер и Cloudflare берут свежие файлы.
VER = time.strftime("%Y%m%d%H%M")
LOGO = open(ROOT + "assets/logo/ikat-pro-white.svg", encoding="utf-8").read()
paths = re.findall(r"<path[^>]*/>", LOGO)
LOGO_SVG = (
    '<svg class="logo-svg" viewBox="0 0 2049 578" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'
    + "".join(p.replace('fill="#FCFCFC"', 'fill="currentColor"') for p in paths)
    + "</svg>"
)


def head(title, desc, body_cls="", title_key="", desc_key=""):
    return f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="assets/logo/favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/inter-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/fonts.css?v={VER}">
<link rel="stylesheet" href="css/style.css?v={VER}">
</head>
<body{(' class="' + body_cls + '"') if body_cls else ''}{(' data-title="' + title_key + '"') if title_key else ''}{(' data-desc="' + desc_key + '"') if desc_key else ''}>
<a class="skip" href="#main" data-i18n="skip">К содержанию</a>
"""


def header(work_href, current="", solid=False, cta_cls=""):
    cur = lambda k: ' aria-current="page"' if k == current else ""
    return f"""
<header class="hdr">
  <nav class="nav cap" aria-label="Основное меню" data-i18n-attr="aria-label:nav.label">
    <a href="{work_href}" data-i18n="nav.work">Работы</a>
    <a href="team.html"{cur('team')} data-i18n="nav.team">Команда</a>
    <a href="about.html"{cur('studio')} data-i18n="nav.studio">Студия</a>
    <a href="contacts.html"{cur('contacts')} data-i18n="nav.contacts">Контакты</a>
  </nav>
  <a class="logo" href="index.html" aria-label="IKAT PRO, на главную" data-i18n-attr="aria-label:logo.label">{LOGO_SVG}</a>
  <div class="hdr-right">
    <div class="lang cap" role="group" aria-label="Язык сайта" data-i18n-attr="aria-label:lang.label">
      <button type="button" data-lang="ru" aria-pressed="true">RU</button>
      <button type="button" data-lang="uz" aria-pressed="false">UZ</button>
      <button type="button" data-lang="en" aria-pressed="false">EN</button>
    </div>
    <select class="lang-sel" aria-label="Язык сайта" data-i18n-attr="aria-label:lang.label"><option value="ru">RU</option><option value="uz">UZ</option><option value="en">EN</option></select>
    <button type="button" class="btn btn-white{(" " + cta_cls) if cta_cls else ""}" data-form=""><span><span data-i18n="cta.short">Обсудить</span><span class="ctx" data-i18n="cta.ctx"> проект</span></span><span class="arr" aria-hidden="true">→</span></button>
  </div>
</header>
"""


FOOTER = """
<footer class="ftr">
  <div class="ftr-top">
    <button type="button" class="ftr-big" data-form="">
      <span class="eyebrow" data-i18n="ftr.eyebrow">Ответим в течение рабочего дня</span>
      <span class="ftr-big-t" data-i18n-html="ftr.big">Обсудить<br>проект →</span>
    </button>
    <div class="ftr-info">
      <a class="ftr-phone" href="tel:+998773779911" data-tg="footer">+998 77 377 99 11</a>
      <a href="mailto:info@ikatpro.uz">info@ikatpro.uz</a>
      <a href="contacts.html#map" data-i18n="c.address">Ташкент, ул. Восита Вохидова, 96 · Пн–Пт 09:00–19:00</a>
    </div>
  </div>
  <div class="ftr-bot cap">
    <div class="ftr-soc">
      <a href="https://www.instagram.com/ikat.pro" target="_blank" rel="noopener">Instagram</a>
      <a href="https://youtube.com/@ikatpro" target="_blank" rel="noopener">YouTube</a>
      <a href="https://t.me/Ikat_pro_ad" target="_blank" rel="noopener" data-tg="footer">Telegram</a>
    </div>
    <span class="ftr-copy" data-i18n="ftr.copy">© 2018–2026 IKAT PRO · Ташкент</span>
  </div>
</footer>
"""


def dock(work_href, current="", home=False):
    cur = lambda k: ' aria-current="page"' if k == current else ""
    return f"""
<nav class="dock" aria-label="Меню" data-i18n-attr="aria-label:dock.label">
  <a href="{work_href}" data-i18n="nav.work">Работы</a>
  <a href="team.html"{cur('team')} data-i18n="nav.team">Команда</a>
  <a href="about.html"{cur('studio')} data-i18n="nav.studio">Студия</a>
  <a href="contacts.html"{cur('contacts')} data-i18n="nav.contacts">Контакты</a>
</nav>
"""


def scripts(extra=""):
    return f"""
<script src="data/works.js?v={VER}"></script>
<script src="data/letters.js?v={VER}"></script>
<script src="js/i18n.js?v={VER}"></script>
<script src="js/track.js?v={VER}"></script>
<script src="js/form.js?v={VER}"></script>
{extra}<script src="js/main.js?v={VER}"></script>
</body>
</html>
"""


# Контакты для демо: имена из нынешнего состава, почты и ссылки — условные (заменить на настоящие перед запуском).
CONTACTS = """
    <div class="contact-grid" data-stagger>
      <div class="contact rv">
        <span class="eyebrow" data-i18n="c.ads">Реклама и фильмы</span>
        <img class="contact-ava" src="assets/team/asadova.jpg" alt="" width="324" height="516" loading="lazy">
        <span class="contact-name" data-uz="Sabrin Asadova" data-en="Sabrin Asadova">Сабрин Асадова</span>
        <a href="tel:+998773779911" data-tg="contacts">+998 77 377 99 11</a>
        <a href="mailto:info@ikatpro.uz">info@ikatpro.uz</a>
      </div>
      <div class="contact rv">
        <span class="eyebrow" data-i18n="c.studio">Аренда студии</span>
        <img class="contact-ava" src="assets/team/makhmudova.jpg" alt="" width="324" height="516" loading="lazy">
        <span class="contact-name" data-uz="Sharofat Maxmudova" data-en="Sharofat Makhmudova">Шарофат Махмудова</span>
        <a href="mailto:studio@ikatpro.uz">studio@ikatpro.uz</a>
      </div>
      <div class="contact rv">
        <span class="eyebrow" data-i18n="c.smm">Соцсети и SMM</span>
        <img class="contact-ava" src="assets/team/nigmatullaev.jpg" alt="" width="324" height="516" loading="lazy">
        <span class="contact-name" data-uz="Izzatilla Nigmatullaev" data-en="Izzatilla Nigmatullaev">Иззатилла Нигматуллаев</span>
        <a href="mailto:smm@ikatpro.uz">smm@ikatpro.uz</a>
      </div>
    </div>"""

# ——— Главная ———
index = head(
    "IKAT PRO: видеопродакшн полного цикла в Ташкенте",
    "IKAT PRO: реклама, имиджевые фильмы и контент для соцсетей. Своя студия в Ташкенте, с 2018 года. Komatsu, Asakabank, Indorama, Mannol и другие.",
    "home",
    title_key="title.home",
    desc_key="desc.home",
) + header("#work", "home") + f"""
<main id="main" tabindex="-1">
  <section class="hero" aria-label="Работы IKAT PRO" data-i18n-attr="aria-label:hero.label" aria-roledescription="карусель">
    <div class="hero-slides"></div>
    <div class="hero-shade-t" aria-hidden="true"></div>
    <div class="hero-shade-b" aria-hidden="true"></div>
    <div class="hero-bot">
      <div class="badge cap" data-i18n="badge">Резидент Uzbekistan Creative Park · 2026</div>
      <h1>Видео, которое досматривают</h1>
      <div class="hero-row">
        <div class="nums" role="group" aria-label="Выбор работы" data-i18n-attr="aria-label:hero.pick"></div>
        <a class="hcap cap" href="work.html?w=komatsu">
          <span class="hcap-name">Komatsu</span>
          <span class="hcap-meta">Рекламный фильм · 1:57 · Смотреть ↗</span>
        </a>
      </div>
    </div>
  </section>

  <section class="clients" aria-label="Нас выбирают" data-i18n-attr="aria-label:clients">
    <span class="clients-label cap" data-i18n="clients">Нас выбирают</span>
    <div class="mq">
      <div class="mq-track">Komatsu, Asakabank, Indorama, Mannol, AION, Biolife, Saxovat, Merci, Eclair, Landor, Avangard, Open Budget, HPC</div>
    </div>
  </section>

  <section id="work" aria-labelledby="work-title">
    <div class="works-head cap">
      <h2 id="work-title" data-i18n="works.title">Работы</h2>
      <div class="filters" role="group" aria-label="Фильтр работ" data-i18n-attr="aria-label:works.filter">
        <button type="button" class="chip" data-filter="all" aria-pressed="true" data-i18n="f.all">Все</button>
        <button type="button" class="chip" data-filter="ads" aria-pressed="false" data-i18n="f.ads">Реклама</button>
        <button type="button" class="chip" data-filter="corporate" aria-pressed="false" data-i18n="f.corporate">Корпоративное</button>
        <button type="button" class="chip" data-filter="social" aria-pressed="false" data-i18n="f.social">Соцсети</button>
        <button type="button" class="chip" data-filter="backstage" aria-pressed="false" data-i18n="f.backstage">Бэкстейдж</button>
      </div>
    </div>
    <div class="mosaic" aria-live="polite"></div>
    <div class="works-more">
      <button type="button" class="btn btn-line" data-i18n="works.more">Все работы</button>
    </div>
  </section>

  <section class="dirs" aria-label="Направления" data-i18n-attr="aria-label:dirs.label" data-stagger>
    <div class="dir rv">
      <span class="eyebrow" data-i18n="dir1.eyebrow">01 · Брендам</span>
      <h2 class="h2" data-i18n="dir1.title">Реклама и имиджевые фильмы</h2>
      <p data-i18n="dir1.text">ТВ и digital-ролики, корпоративные фильмы, креативные концепции. Идею, съёмку, монтаж, цвет и звук делает одна команда на своей студии.</p>
      <button type="button" class="btn btn-white" data-form="Рекламный ролик"><span data-i18n="cta.full">Обсудить проект</span> <span class="arr" aria-hidden="true">→</span></button>
    </div>
    <div class="dir rv">
      <span class="eyebrow" data-i18n="dir2.eyebrow">02 · Соцсетям</span>
      <h2 class="h2" data-i18n="dir2.title">Контент и продвижение</h2>
      <p data-i18n="dir2.text">Reels и серии роликов, интеграции в шоу и подкасты, ведение соцсетей. Каждый месяц присылаем отчёт: просмотры, переходы, заявки.</p>
      <button type="button" class="btn btn-white" data-form="Контент для соцсетей"><span data-i18n="cta.full">Обсудить проект</span> <span class="arr" aria-hidden="true">→</span></button>
    </div>
    <div class="dir rv">
      <span class="eyebrow" data-i18n="dir3.eyebrow">03 · Аренда</span>
      <h2 class="h2" data-i18n="dir3.title">Аренда студии</h2>
      <p data-i18n="dir3.text">Студия 50 м² для подкастов, интервью и шоу. Аренда от 300 000 сум в час, техника и оператор по запросу.</p>
      <button type="button" class="btn btn-white" data-form="Аренда студии"><span data-i18n="dir3.btn">Арендовать студию</span> <span class="arr" aria-hidden="true">→</span></button>
    </div>
  </section>

  <section class="letters" aria-labelledby="letters-title">
    <div class="letters-head">
      <h2 class="h2 rv" id="letters-title" data-i18n="letters.title">Нас рекомендуют</h2>
      <p class="rv" data-i18n="letters.lead">12 рекомендательных писем от клиентов. Нажмите на письмо, чтобы прочитать его целиком.</p>
    </div>
    <div class="letters-grid" data-stagger></div>
    <div class="letters-foot">
      <div class="letters-more">
        <button type="button" class="btn btn-line" data-i18n="letters.more">Показать все письма</button>
      </div>
      <button type="button" class="btn btn-white" data-form=""><span data-i18n="cta.full">Обсудить проект</span><span class="arr" aria-hidden="true">→</span></button>
    </div>
  </section>

  <section id="contacts" class="contacts hc" aria-labelledby="contacts-title">
    <h2 class="h2 rv" id="contacts-title" data-i18n="hc.title">Контакты</h2>
    <div class="hc-row rv">
      <a href="tel:+998773779911" data-tg="contacts">+998 77 377 99 11</a>
      <a href="mailto:info@ikatpro.uz">info@ikatpro.uz</a>
      <a href="https://t.me/Ikat_pro_ad" target="_blank" rel="noopener" data-tg="contacts" data-i18n="c.tg">Telegram студии ↗</a>
    </div>
    <p class="hc-note rv"><span data-i18n="c.address">Ташкент, ул. Восита Вохидова, 96 · Пн–Пт 09:00–19:00</span> <a href="contacts.html" data-i18n="hc.all">Все контакты и карта →</a></p>
  </section>
</main>
""" + FOOTER + dock("#work", home=True) + scripts()

# ——— Работа ———
work = head("Работа · IKAT PRO", "Работа видеопродакшна IKAT PRO: ролик и титры.", "wp-page") + header("index.html#work", "", cta_cls="wp-cta") + """
<div class="wp-bar">
  <a class="wp-back" href="index.html#work" aria-label="К работам" data-i18n-attr="aria-label:wp.backTo"><span aria-hidden="true">←</span> <span><span class="wp-name">IKAT PRO</span> <span class="muted wp-kind"></span></span></a>
  <button type="button" class="icon-btn wp-info" aria-expanded="false" aria-controls="credits" aria-label="Титры" data-i18n-attr="aria-label:wp.credits">ⓘ</button>
</div>

<div class="credits" id="credits">
  <div class="credits-in">
    <dl></dl>
  </div>
</div>

<main id="main" tabindex="-1">
  <div class="wp-body"></div>
</main>
""" + FOOTER + dock("index.html#work") + scripts(f'<script src="js/work.js?v={VER}"></script>\n')

# ——— Команда ———
# Человек: файл фото, имя (ru, uz, en), должность (ru, uz, en).
GROUPS = [
    ("team.g1", "Руководство и продюсеры", [
        ("saidov", "Ульмас Саидов", "Ulmas Saidov", "Ulmas Saidov", "Генеральный директор · продюсер, режиссёр", "Boş direktor · prodyuser, rejissyor", "CEO · producer, director"),
        ("asadova", "Сабрин Асадова", "Sabrin Asadova", "Sabrin Asadova", "Продюсер · старший менеджер проектов", "Prodyuser · katta loyiha menejeri", "Producer · senior project manager"),
        ("nigmatullaev", "Иззатилла Нигматуллаев", "Izzatilla Nigmatullaev", "Izzatilla Nigmatullaev", "Медиапродюсер", "Media prodyuser", "Media producer"),
        ("makhmudova", "Шарофат Махмудова", "Sharofat Maxmudova", "Sharofat Makhmudova", "Проект-менеджер · редактор", "Loyiha menejeri · muharrir", "Project manager · editor"),
    ]),
    ("team.g2", "Режиссура, сценарий и съёмка", [
        ("tuydzhanova", "Зарина Туйджанова", "Zarina Tuydjanova", "Zarina Tuydjanova", "Режиссёр · сценарист", "Rejissyor · ssenariynavis", "Director · scriptwriter"),
        ("abdusamad", "Абдусамад", "Abdusamad", "Abdusamad", "Оператор", "Operator", "Camera operator"),
        ("azamatova", "Севинч Азаматова", "Sevinch Azamatova", "Sevinch Azamatova", "Журналист", "Jurnalist", "Journalist"),
    ]),
    ("team.g3", "Монтаж и дизайн", [
        ("egamnazarov", "Бехруз Эгамназаров", "Behruz Egamnazarov", "Behruz Egamnazarov", "Видеомонтажёр · колорист", "Videomontajçi · kolorist", "Video editor · colourist"),
        ("temirov", "Жавохир Темиров", "Javohir Temirov", "Javokhir Temirov", "Видеомонтажёр", "Videomontajçi", "Video editor"),
        ("ergashev", "Хаёт Эргашев", "Hayot Ergashev", "Hayot Ergashev", "Видеомонтажёр", "Videomontajçi", "Video editor"),
        ("bobojonov", "Санжар Бобожонов", "Sanjar Bobojonov", "Sanjar Bobojonov", "Графический дизайнер · логгер", "Grafik dizayner · logger", "Graphic designer · footage logger"),
    ]),
]
TEAM = [p for _, _, ps in GROUPS for p in ps]
# Кому писать по какому вопросу: ключ перевода и русская подпись.
LEADS = {
    "asadova": ("c.ads", "Реклама и фильмы", "Рекламный ролик"),
    "makhmudova": ("c.studio", "Аренда студии", "Аренда студии"),
    "nigmatullaev": ("c.smm", "Соцсети и SMM", "Контент для соцсетей"),
}


def has_photo(slug):
    return os.path.exists(ROOT + "assets/team/" + slug + ".jpg")


def ph(p, cls):
    # Фото ещё нет: тёмная плашка с первой буквой имени.
    return f'''<span class="{cls} person-ph" aria-hidden="true">{p[1][0]}</span>'''

Q = chr(34)


def person(p, first):
    lazy = "" if first else " loading=" + Q + "lazy" + Q
    return (
        f'''            <li class="person rv" data-name-uz="{p[2]}" data-name-en="{p[3]}" data-role-uz="{p[5]}" data-role-en="{p[6]}">'''
        + (f'''<img class="person-img" src="assets/team/{p[0]}.jpg" alt="" width="324" height="516"{lazy}>''' if has_photo(p[0]) else ph(p, "person-img"))
        +
        f'''<span class="person-name">{p[1]}</span><span class="person-role">{p[4]}</span>'''
        + (
            f'''<button type="button" class="person-lead" data-form="{LEADS[p[0]][2]}"><span data-i18n="{LEADS[p[0]][0]}">{LEADS[p[0]][1]}</span>: <span data-i18n="team.write">написать →</span></button>'''
            if p[0] in LEADS
            else ""
        )
        + "</li>"
    )


groups = "\n".join(
    f'''        <section class="team-group" aria-labelledby="tg{gi + 1}">
          <h2 class="eyebrow team-gt" id="tg{gi + 1}" data-i18n="{key}">{title}</h2>
          <ul class="team-list" data-stagger>
''' + "\n".join(person(p, gi == 0) for p in ps) + '''
          </ul>
        </section>'''
    for gi, (key, title, ps) in enumerate(GROUPS)
)
photos = "\n".join(
    (f'        <img src="assets/team/{p[0]}.jpg" alt="" width="324" height="516">' if has_photo(p[0]) else "        " + ph(p, "tp-ph"))
    for i, p in enumerate(TEAM)
)
team = head(
    "Команда · IKAT PRO",
    "Команда видеопродакшна IKAT PRO: режиссёры, продюсеры, оператор, монтажёры и дизайнер. 11 человек, своя студия в Ташкенте.",
    title_key="title.team",
    desc_key="desc.team",
) + header("index.html#work", "team") + f"""
<main id="main" tabindex="-1">
  <section class="team" aria-labelledby="team-title">
    <div class="team-in">
      <h1 class="eyebrow team-title" id="team-title" data-i18n="team.title">Команда · 11 человек</h1>
      <p class="team-hint" data-i18n="team.hint">Наведите на имя, чтобы увидеть портрет</p>
      <div class="team-grid">
        <div class="team-groups">
{groups}
        </div>
        <div class="team-photo" aria-hidden="true">
{photos}
        </div>
      </div>
    </div>
  </section>
</main>
""" + FOOTER + dock("index.html#work", "team") + scripts()

# ——— Студия (аренда зала) ———
about = head(
    "Студия · IKAT PRO",
    "Аренда студии 50 м² в Ташкенте для подкастов и интервью. От 300 000 сум в час, камеры Sony, свет Aputure. Ул. Восита Вохидова, 96.",
    title_key="title.about",
    desc_key="desc.about",
) + header("index.html#work", "studio") + """
<main id="main" tabindex="-1">
  <section class="about-hero st-hero">
    <div class="st-hero-l">
      <span class="eyebrow rv" data-i18n="st.eyebrow">Аренда студии · Ташкент</span>
      <h1 class="rv" data-i18n="st.h1">Студия для подкастов и интервью</h1>
      <p class="rv" data-i18n="st.lead">Интерьерный зал 50 м² в Ташкенте. Арендуйте только зал или закажите съёмку с нашей техникой и командой.</p>
      <div class="st-actions rv">
        <button type="button" class="btn btn-white" data-form="Аренда студии"><span data-i18n="st.book">Забронировать</span><span class="arr" aria-hidden="true">→</span></button>
        <a class="btn btn-line" href="contacts.html#map" data-i18n="st.howBtn">Как добраться</a>
      </div>
    </div>
    <dl class="st-kpi rv">
      <div><dt data-i18n="st.k1">50 м²</dt><dd data-i18n="st.k1L">зал 10 × 5 м</dd></div>
      <div><dt data-i18n="st.k2">до 4</dt><dd data-i18n="st.k2L">камер Sony, многокамерная запись</dd></div>
      <div><dt data-i18n="st.k3">до 4</dt><dd data-i18n="st.k3L">участников в кадре</dd></div>
      <div><dt data-i18n="st.k4">300 000</dt><dd data-i18n="st.k4L">сум в час, самый доступный тариф</dd></div>
    </dl>
  </section>

  <section class="st-rates" id="rates" aria-labelledby="rates-title">
    <div class="st-head">
    <h2 class="h2 rv" id="rates-title" data-i18n="st.tarT">Тарифы</h2>
    <p class="st-lead rv" data-i18n="st.tarP">Цена за час. Монтаж в тарифы не входит, оператора и монтажёра считаем отдельно.</p>
    </div>
    <div class="tars">
      <article class="tar rv">
        <div class="tar-head"><h3>STUDIO</h3></div>
        <p class="tar-price" data-i18n="st.t1p">300 000 сум / час</p>
        <p class="tar-desc" data-i18n="st.t1d">Своя команда и техника. Зал, мебель, фоны, гримёрка, базовый свет.</p>
        <p class="tar-pack" data-i18n="st.t1x">2 часа: 550 000 сум · 4 часа: 1 000 000 · 8 часов: 1 800 000</p>
        <button type="button" class="btn btn-line" data-form="Аренда студии" data-task="STUDIO: "><span data-i18n="st.book">Забронировать</span><span class="arr" aria-hidden="true">→</span></button>
      </article>
      <article class="tar rv tar-main">
        <div class="tar-head"><h3>CONTENT</h3><span class="tar-badge" data-i18n="st.pop">Основной пакет</span></div>
        <p class="tar-price" data-i18n="st.t2p">600 000 сум / час</p>
        <p class="tar-desc" data-i18n="st.t2d">Подкаст или интервью на двоих: 2 камеры Sony, 2 микрофона, свет, микшер и техник.</p>
        <p class="tar-pack" data-i18n="st.t2x">3 часа: 1 650 000 сум</p>
        <button type="button" class="btn btn-white" data-form="Аренда студии" data-task="CONTENT: "><span data-i18n="st.book">Забронировать</span><span class="arr" aria-hidden="true">→</span></button>
      </article>
      <article class="tar rv">
        <div class="tar-head"><h3>MULTICAM</h3></div>
        <p class="tar-price" data-i18n="st.t3p">850 000 сум / час</p>
        <p class="tar-desc" data-i18n="st.t3d">Шоу и подкасты на 3–4 участника: до 4 камер и микрофонов, видеомикшер.</p>
        <p class="tar-pack" data-i18n="st.t3x">3 часа: 2 350 000 сум</p>
        <button type="button" class="btn btn-line" data-form="Аренда студии" data-task="MULTICAM: "><span data-i18n="st.book">Забронировать</span><span class="arr" aria-hidden="true">→</span></button>
      </article>
      <article class="tar rv">
        <div class="tar-head"><h3>LIVE</h3></div>
        <p class="tar-price" data-i18n="st.t4p">от 1 000 000 сум / час</p>
        <p class="tar-desc" data-i18n="st.t4d">Прямые эфиры, вебинары и онлайн-шоу. Технику и команду подбираем под задачу.</p>
        <p class="tar-pack" data-i18n="st.t4x">Считаем индивидуально</p>
        <button type="button" class="btn btn-line" data-form="Аренда студии" data-task="LIVE: "><span data-i18n="st.book">Забронировать</span><span class="arr" aria-hidden="true">→</span></button>
      </article>
    </div>
    <p class="st-note rv" data-i18n="st.note">Свободные даты подскажет администратор.</p>
  </section>

  <section class="st-more" aria-labelledby="more-title">
    <h2 class="h2 rv" id="more-title" data-i18n="st.moreT">Площадка, техника и условия</h2>
    <div class="accs">
      <details class="acc rv">
        <summary><span class="acc-h"><span class="acc-t" data-i18n="st.space">Площадка</span><span class="acc-s" data-i18n="st.a1">Зал, фоны, гримёрка, парковка</span></span><span class="acc-i" aria-hidden="true"></span></summary>
        <dl class="st-facts">
      <div><dt data-i18n="st.f1L">Площадь</dt><dd data-i18n="st.f1">50 м², зал 10 × 5 м</dd></div>
      <div><dt data-i18n="st.f2L">Потолки</dt><dd data-i18n="st.f2">3 м</dd></div>
      <div><dt data-i18n="st.f3L">В кадре</dt><dd data-i18n="st.f3">до 4 участников</dd></div>
      <div><dt data-i18n="st.f4L">В студии</dt><dd data-i18n="st.f4">до 12 человек с командой</dd></div>
      <div><dt data-i18n="st.f5L">Фоны</dt><dd data-i18n="st.f5">4 тканевых фона</dd></div>
      <div><dt data-i18n="st.f6L">Гримёрка</dt><dd data-i18n="st.f6">место с зеркалом и светом</dd></div>
      <div><dt data-i18n="st.f7L">Комфорт</dt><dd data-i18n="st.f7">шумоизоляция, тихий кондиционер, Wi‑Fi, санузел</dd></div>
      <div><dt data-i18n="st.f8L">Парковка</dt><dd data-i18n="st.f8">около 2 машин</dd></div>
    </dl>
      </details>
      <details class="acc rv">
        <summary><span class="acc-h"><span class="acc-t" data-i18n="st.eqT">Техника</span><span class="acc-s" data-i18n="st.a2">Камеры, объективы, свет, звук</span></span><span class="acc-i" aria-hidden="true"></span></summary>
        <dl class="st-facts st-eq">
      <div><dt data-i18n="st.e1L">Камеры</dt><dd data-i18n="st.e1">до 4 Sony Alpha 7 IV, многокамерная запись</dd></div>
      <div><dt data-i18n="st.e2L">Объективы</dt><dd data-i18n="st.e2">24–70 мм и 70–200 мм</dd></div>
      <div><dt data-i18n="st.e3L">Микрофоны</dt><dd data-i18n="st.e3">до 4 студийных Shure и до 4 петличных DJI Mic 2</dd></div>
      <div><dt data-i18n="st.e4L">Свет</dt><dd data-i18n="st.e4">2 Aputure 300, Aputure 600, 4 световые палки Godox, софтбоксы</dd></div>
      <div><dt data-i18n="st.e5L">Звук</dt><dd data-i18n="st.e5">аудиомикшер, запись отдельной дорожкой</dd></div>
      <div><dt data-i18n="st.e6L">Эфиры</dt><dd data-i18n="st.e6">видеомикшер, трансляции ведёт наша команда</dd></div>
    </dl>
      </details>
      <details class="acc rv">
        <summary><span class="acc-h"><span class="acc-t" data-i18n="st.condT">Условия аренды</span><span class="acc-s" data-i18n="st.a3">Бронь, оплата, время, материалы</span></span><span class="acc-i" aria-hidden="true"></span></summary>
        <dl class="st-facts st-cond">
      <div><dt data-i18n="st.c1L">Минимум</dt><dd data-i18n="st.c1">1 час. Настройка техники входит во время брони.</dd></div>
      <div><dt data-i18n="st.c2L">Бронь</dt><dd data-i18n="st.c2">после предоплаты. Перенос или отмена без потерь, если предупредить за 24 часа.</dd></div>
      <div><dt data-i18n="st.c3L">Время</dt><dd data-i18n="st.c3">Пн–Пт, 09:00–19:00. Ночные съёмки по согласованию.</dd></div>
      <div><dt data-i18n="st.c4L">Материалы</dt><dd data-i18n="st.c4">на ваш накопитель или Google Drive. Храним до 3 месяцев.</dd></div>
      <div><dt data-i18n="st.c5L">Оплата</dt><dd data-i18n="st.c5">физлица и юрлица, для юрлиц оплата по счёту</dd></div>
      <div><dt data-i18n="st.c6L">Вход</dt><dd data-i18n="st.c6">студия в цокольном этаже, лифт не нужен</dd></div>
    </dl>
      </details>
    </div>
  </section>
</main>
""" + FOOTER + dock("index.html#work", "studio") + scripts()

# ——— Контакты ———
contacts = head(
    "Контакты · IKAT PRO",
    "Контакты IKAT PRO: телефон, почта, Telegram и карта. Студия в Ташкенте, ул. Восита Вохидова, 96. Пн–Пт 09:00–19:00.",
    "ct-page",
    title_key="title.contacts",
    desc_key="desc.contacts",
) + header("index.html#work", "contacts") + f"""
<main id="main" tabindex="-1">
  <section class="about-hero ct-hero">
    <div class="ct-hero-l">
      <span class="eyebrow rv" data-i18n="nav.contacts">Контакты</span>
      <h1 class="rv" data-i18n="ct.title">Напишите, позвоните или приезжайте</h1>
      <p class="rv" data-i18n="ct.lead">Отвечаем в течение рабочего дня. Студия открыта Пн–Пт, 09:00–19:00.</p>
    </div>
    <div class="ct-hero-r rv">
      <a class="ct-phone" href="tel:+998773779911" data-tg="contacts">+998 77 377 99 11</a>
      <a href="mailto:info@ikatpro.uz">info@ikatpro.uz</a>
      <a href="https://t.me/Ikat_pro_ad" target="_blank" rel="noopener" data-tg="contacts" data-i18n="c.tg">Telegram студии ↗</a>
    </div>
  </section>

  <section id="who" class="contacts" aria-labelledby="contacts-title">
    <h2 class="h2 rv" id="contacts-title" data-i18n="contacts.title">Кому написать</h2>{CONTACTS}
    <p class="ct-team rv"><a href="team.html" data-i18n="ct.team">Вся команда: 11 человек →</a></p>
  </section>

  <section id="map" class="ct-map" aria-labelledby="map-title">
    <div class="ct-map-txt rv">
      <h2 class="h2" id="map-title" data-i18n="ct.find">Как нас найти</h2>
      <p data-i18n="ct.visit">Приезжайте обсудить проект или посмотреть площадку. Напишите заранее, и мы вас встретим.</p>
      <dl class="ct-facts">
        <div><dt data-i18n="ct.addrL">Адрес</dt><dd id="addr" data-i18n="ct.addr">Ташкент, Яккасарайский район, ул. Восита Вохидова, 96</dd></div>
        <div><dt data-i18n="ct.hoursL">Часы работы</dt><dd data-i18n="ct.hours">Пн–Пт, 09:00–19:00</dd></div>
        <div><dt data-i18n="ct.metroL">Метро</dt><dd data-i18n="ct.metro">«Айбек», 1,2 км пешком</dd></div>
      </dl>
      <div class="ct-actions">
        <a class="btn btn-white" href="https://yandex.uz/maps/?rtext=~41.297020%2C69.263055&rtt=auto" target="_blank" rel="noopener"><span data-i18n="ct.route">Построить маршрут</span><span class="arr" aria-hidden="true">↗</span></a>
        <button type="button" class="btn btn-line" data-copy="#addr" data-i18n="ct.copy">Скопировать адрес</button>
      </div>
    </div>
    <div class="ct-map-box rv">
      <iframe src="https://yandex.uz/map-widget/v1/?ll=69.263055%2C41.297020&z=17&pt=69.263055%2C41.297020%2Cpm2rdm" title="Студия IKAT PRO на карте" data-i18n-attr="title:ct.mapTitle" loading="lazy" allowfullscreen></iframe>
      <button type="button" class="ct-map-cover"><span data-i18n="ct.mapCover">Нажмите, чтобы двигать карту</span></button>
    </div>
  </section>

</main>
""" + FOOTER + dock("index.html#work", "contacts") + scripts()

for name, html in [("index.html", index), ("work.html", work), ("team.html", team), ("about.html", about), ("contacts.html", contacts)]:
    open(ROOT + name, "w", encoding="utf-8", newline="\n").write(html)
print("ok")
