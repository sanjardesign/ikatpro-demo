/*
  Список работ IKAT PRO. Подключается обычным <script>, поэтому сайт работает и при открытии с диска.

  Поля:
    slug    — адрес страницы: work.html?w=<slug>; по нему же ищутся файлы видео в assets/video/
              (<slug>.mp4 — полный ролик, <slug>-teaser.mp4 — беззвучный тизер, <slug>-v.mp4 — вертикальный)
    client  — клиент, kind — формат, dur — хронометраж
    cat     — фильтр на главной: ads (реклама), corporate (корпоративное), social (соцсети), backstage (бэкстейдж)
    videos  — ролики YouTube (id, подпись, хронометраж); если роликов несколько, на странице работы есть переключатель.
              lang: "ru" | "uz" — языковая версия: по умолчанию играет версия на языке сайта (EN — русская)
    poster  — обложка (постер YouTube, скачан в assets/img/)
    frame   — чистый кадр без титров из макета (первый экран и мозаика)
    cover   — обложка без надписей превью, вырезанная из постера (assets/covers/), если нет frame
    frames  — два кадра для кейса; пока не заданы, на их месте плейсхолдеры
    alt     — описание кадра для экранных дикторов
*/
window.WORKS = [
  {
    slug: "komatsu",
    client: "Komatsu",
    kind: "Рекламный фильм",
    dur: "1:57",
    cat: "ads",
    videos: [{ id: "3QfFKFkhYDc", dur: "1:57" }],
    poster: "assets/img/3QfFKFkhYDc.jpg",
    frame: "assets/img/frame-komatsu-samurai.jpg",
    frames: ["assets/img/frame-komatsu-samurai.jpg", "assets/img/frame-komatsu-truck.jpg"],
    alt: "Самурай в туманном лесу, кадр из фильма для Komatsu",
  },
  {
    slug: "showreel",
    client: "Шоурил",
    kind: "Лучшие кадры",
    dur: "0:57",
    cat: "ads",
    videos: [{ id: "N4OELxf76SY", dur: "0:57" }],
    poster: "assets/img/N4OELxf76SY.jpg",
    frame: "assets/img/frame-showreel-hair.jpg",
    frames: ["assets/img/frame-showreel-hair.jpg", "assets/img/frame-showreel-ice.jpg"],
    alt: "Девушка с развевающимися волосами, кадр из шоурила",
  },
  {
    slug: "aion",
    client: "AION",
    kind: "Проморолик",
    dur: "2:02",
    cat: "ads",
    videos: [{ id: "KjN6q7L1m8Y", dur: "2:02" }],
    poster: "assets/img/KjN6q7L1m8Y.jpg",
    frame: "assets/img/frame-aion.jpg",
    alt: "Команда AION в переговорной",
  },
  {
    slug: "mannol",
    client: "Mannol",
    kind: "Рекламный ролик",
    dur: "0:16",
    cat: "ads",
    videos: [{ id: "wxu-byAe4IM", dur: "0:16" }],
    poster: "assets/img/wxu-byAe4IM.jpg",
    frame: "assets/img/frame-mannol.jpg",
    alt: "Болельщики в футболках Mannol",
  },
  {
    slug: "indorama-oltin",
    client: "Indorama Oltin",
    kind: "Рекламные ролики",
    dur: "0:16",
    cat: "ads",
    videos: [
      { id: "fAl8UrWx2lg", label: "№ 1", dur: "0:16" },
      { id: "G-lREqwuLYI", label: "№ 2", dur: "0:16" },
    ],
    poster: "assets/img/G-lREqwuLYI.jpg",
    frame: "assets/img/frame-indorama.jpg",
    alt: "Фермер машет из кабины трактора",
  },
  {
    slug: "merci",
    client: "Merci",
    kind: "Рекламный ролик",
    dur: "0:29",
    cat: "ads",
    videos: [{ id: "aAwEPK8LUUc", dur: "0:29" }],
    poster: "assets/img/aAwEPK8LUUc.jpg",
    frame: "assets/img/frame-merci.jpg",
    alt: "Девушка у белой занавески",
    light: true,
  },
  {
    slug: "saxovat-backstage",
    client: "Saxovat",
    kind: "Бэкстейдж",
    dur: "1:00",
    cat: "backstage",
    videos: [{ id: "5VrV21jLNM4", dur: "1:00" }],
    poster: "assets/img/5VrV21jLNM4.jpg",
    frame: "assets/img/frame-saxovat-bts.jpg",
    alt: "Режиссёр на съёмочной площадке Saxovat",
  },
  {
    slug: "saxovat",
    client: "Saxovat",
    kind: "Серия роликов, № 2–3",
    dur: "0:16",
    cat: "social",
    // Номера как в названиях роликов на канале студии: «Saxovat № 2» и «Saxovat № 3».
    videos: [
      { id: "RSguq3X2KqI", label: "№ 2", dur: "0:16" },
      { id: "VjDtSwXtJs4", label: "№ 3", dur: "0:16" },
    ],
    poster: "assets/img/RSguq3X2KqI.jpg",
    cover: "assets/covers/RSguq3X2KqI.jpg",
    alt: "Ведущий в зелёной рубашке у полки с продукцией Saxovat",
  },
  {
    slug: "asakabank",
    client: "Asakabank",
    kind: "Рекламный ролик",
    dur: "0:30",
    cat: "ads",
    videos: [{ id: "5vn7Du1LWmc", dur: "0:30" }],
    poster: "assets/img/5vn7Du1LWmc.jpg",
    alt: "Смартфон с приложением Asakabank на красном фоне",
  },
  {
    slug: "landor",
    client: "Landor",
    kind: "Рекламный ролик",
    dur: "0:30",
    cat: "ads",
    videos: [{ id: "5W2cNBVgJtk", dur: "0:30" }],
    poster: "assets/img/5W2cNBVgJtk.jpg",
    cover: "assets/covers/5W2cNBVgJtk.jpg",
    alt: "Мужчина с пультом в светлой гостиной",
  },
  {
    slug: "avangard",
    client: "Avangard",
    kind: "Рекламный ролик",
    dur: "0:31",
    cat: "ads",
    videos: [{ id: "A9B2lKN9deE", dur: "0:31" }],
    poster: "assets/img/A9B2lKN9deE.jpg",
    cover: "assets/covers/A9B2lKN9deE.jpg",
    alt: "Девушка у стола с цветами",
  },
  {
    slug: "ankalife",
    client: "Анкалайф",
    kind: "Серия роликов, № 1–3",
    dur: "0:25–0:34",
    cat: "social",
    videos: [
      { id: "oXNCK3B0uC0", label: "№ 1", dur: "0:25" },
      { id: "8_UUNuViqtg", label: "№ 2", dur: "0:34" },
      { id: "rScRLRfR_OQ", label: "№ 3", dur: "0:30" },
    ],
    poster: "assets/img/rScRLRfR_OQ.jpg",
    alt: "Врач и семьи с детьми на белом фоне",
  },
  {
    slug: "open-budjet",
    client: "Open Budget",
    kind: "Ролик",
    dur: "1:08",
    cat: "corporate",
    // Две языковые версии одного ролика: на странице работы сразу играет версия на языке сайта.
    videos: [
      { id: "lwlU5npKf6E", lang: "ru", dur: "1:08" },
      { id: "vPj9xmrb0F0", lang: "uz", dur: "1:08" },
    ],
    poster: "assets/img/lwlU5npKf6E.jpg",
    cover: "assets/covers/lwlU5npKf6E.jpg",
    alt: "Пожилая женщина с кувшином, ролик Open Budget",
  },

  {
    slug: "hpc",
    client: "HPC: ЖК в Коканде",
    kind: "Имиджевый ролик",
    dur: "2:40",
    cat: "corporate",
    videos: [{ id: "2WI3jyinXi8", dur: "2:40" }],
    poster: "assets/img/2WI3jyinXi8.jpg",
    alt: "Визуализация жилого комплекса с высоты",
  },
  {
    slug: "aion-backstage",
    client: "AION",
    kind: "Бэкстейдж",
    dur: "1:06",
    cat: "backstage",
    videos: [{ id: "kU4gRYrKP-w", dur: "1:06" }],
    poster: "assets/img/kU4gRYrKP-w.jpg",
    cover: "assets/covers/kU4gRYrKP-w.jpg",
    alt: "Оператор со стабилизатором на съёмке AION",
  },
  {
    slug: "open-budjet-backstage",
    client: "Open Budget",
    kind: "Бэкстейдж",
    dur: "2:34",
    cat: "backstage",
    videos: [{ id: "ms_ZSMufZZA", dur: "2:34" }],
    poster: "assets/img/ms_ZSMufZZA.jpg",
    cover: "assets/covers/ms_ZSMufZZA.jpg",
    alt: "Съёмочная группа на снегу при минус 23",
  },
  {
    slug: "crafers-backstage",
    client: "Crafers",
    kind: "Бэкстейдж",
    dur: "0:50",
    cat: "backstage",
    videos: [{ id: "D-JqrXoXZ44", dur: "0:50" }],
    poster: "assets/img/D-JqrXoXZ44.jpg",
    alt: "Дети и взрослый играют в шахматы на съёмке Crafers",
  },
  {
    slug: "eclair-backstage",
    client: "Eclair",
    kind: "Бэкстейдж",
    dur: "0:59",
    cat: "backstage",
    videos: [{ id: "P1Elge2uDvI", dur: "0:59" }],
    poster: "assets/img/P1Elge2uDvI.jpg",
    cover: "assets/covers/P1Elge2uDvI.jpg",
    alt: "Съёмка на кухне Eclair",
  },
  {
    slug: "biolife-backstage",
    client: "Biolife",
    kind: "Бэкстейдж",
    dur: "1:10",
    cat: "backstage",
    videos: [{ id: "uAcbnyU7tfM", dur: "1:10" }],
    poster: "assets/img/uAcbnyU7tfM.jpg",
    alt: "Актёр смеётся на съёмочной площадке Biolife",
  },
];

// Семь работ первого экрана — в порядке макета.
window.HERO = ["komatsu", "showreel", "aion", "mannol", "indorama-oltin", "merci", "saxovat-backstage"];

// Шесть работ мозаики на главной (фильтр «Все»): ряд из 3, ряд из 2, одна широкая.
window.FEATURED = ["komatsu", "aion", "mannol", "indorama-oltin", "merci", "showreel"];

window.CATS = { ads: "Реклама", corporate: "Корпоративное", social: "Соцсети", backstage: "Бэкстейдж" };

// Старые адреса языковых версий ведут на общую страницу работы.
window.ALIASES = { "open-budjet-ru": "open-budjet", "open-budjet-uz": "open-budjet", "open-budget": "open-budjet" };

window.workBySlug = function (slug) {
  slug = window.ALIASES[slug] || slug;
  for (var i = 0; i < window.WORKS.length; i++) if (window.WORKS[i].slug === slug) return window.WORKS[i];
  return null;
};

// Клиенты для бегущей строки на главной. Логотипы — с ikatpro.uz, перекрашены в белый (assets/clients/).
// noPlate: цветной логотип и так хорошо виден на чёрном — без светлой плашки при наведении.
// square: знак почти квадратный — показываем чуть крупнее, чтобы по весу совпадал со словесными логотипами.
window.CLIENTS = [
  { name: "Komatsu", logo: null },
  { name: "Asakabank", logo: "assets/clients/asakabank.png" },
  { name: "Indorama", logo: "assets/clients/indorama.png" },
  { name: "Mannol", logo: "assets/clients/mannol.png", noPlate: true },
  { name: "AION", logo: "assets/clients/aion.png", square: true },
  { name: "Biolife", logo: "assets/clients/biolife.png" },
  { name: "Saxovat", logo: "assets/clients/saxovat.png", square: true },
  { name: "N'Medov", logo: "assets/clients/nmedov.png", square: true },
  { name: "SCC", logo: "assets/clients/scc.png", square: true },
  { name: "Merci", logo: null },
  { name: "Eclair", logo: null },
  { name: "Landor", logo: null },
  { name: "Avangard", logo: null },
  { name: "Open Budget", logo: null },
  { name: "HPC", logo: null },
];
