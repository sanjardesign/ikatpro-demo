/*
  Рекомендательные и благодарственные письма клиентов. Сканы лежат в assets/letters/ (<slug>.jpg — письмо, <slug>-s.jpg — превью).
  quote.ru — дословная фраза из письма (у Анкалайф письмо на узбекском, цитата дана в переводе).
  quote.uz и quote.en — перевод для других языков сайта; сам документ открывается в оригинале.
*/
window.LETTERS = [
  {
    slug: "iko",
    company: "IKO Machinery · Komatsu",
    person: { ru: "Т. Ш. Турсунов", uz: "T. Sh. Tursunov", en: "T. Sh. Tursunov" },
    role: { ru: "Генеральный директор", uz: "Boş direktor", en: "CEO" },
    quote: {
      ru: "Все поставленные задачи были реализованы в полном объёме и с высоким уровнем качества.",
      uz: "Qöyilgan barça vazifalar töliq hajmda va yuqori sifatda bajarildi.",
      en: "Every task was delivered in full and to a high standard.",
    },
  },
  {
    slug: "asr",
    company: {
      ru: "Агентство стратегических реформ при Президенте Республики Узбекистан",
      uz: "Özbekiston Respublikasi Prezidenti huzuridagi Strategik islohotlar agentligi",
      en: "Agency for Strategic Reforms under the President of Uzbekistan",
    },
    person: { ru: "А. Умарова", uz: "A. Umarova", en: "A. Umarova" },
    role: { ru: "Руководитель Delivery Unit", uz: "Delivery Unit rahbari", en: "Head of the Delivery Unit" },
    quote: {
      ru: "Особо отмечаем оперативность, профессионализм и ответственность сотрудников IKAT PRO на всех этапах работы.",
      uz: "IKAT PRO xodimlarining işning barça bosqiçlaridagi tezkorligi, professionalligi va masʼuliyatini alohida taʼkidlaymiz.",
      en: "We especially note the speed, professionalism and responsibility of the IKAT PRO team at every stage of the work.",
    },
  },
  {
    slug: "aion",
    company: "AION Beverages",
    person: { ru: "Виктория Ким", uz: "Viktoriya Kim", en: "Viktoriya Kim" },
    role: { ru: "Начальник отдела управления персоналом", uz: "Xodimlarni boşqariş bölimi boşliği", en: "Head of HR" },
    quote: {
      ru: "С первых секунд оно приковывает внимание и отлично передаёт дух и ценности нашей организации.",
      uz: "Video birinçi soniyalardanoq eʼtiborni tortadi va taşkilotimiz ruhi hamda qadriyatlarini aniq yetkazadi.",
      en: "From the first seconds the video holds your attention and captures the spirit and values of our organisation.",
    },
  },
  {
    slug: "uzcarlsberg",
    company: "UzCarlsberg",
    person: { ru: "Отдел по персоналу и администрации", uz: "Xodimlar va maʼmuriyat bölimi", en: "People and Administration team" },
    role: { ru: "", uz: "", en: "" },
    quote: {
      ru: "Все проекты выполняются в согласованные сроки, зачастую с опережением графика, при сохранении высокого уровня качества.",
      uz: "Barça loyihalar kelişilgan muddatda, köpinça jadvaldan oldin va yuqori sifat saqlangan holda bajariladi.",
      en: "Every project is delivered on the agreed schedule, often ahead of it, with quality kept high.",
    },
  },
  {
    slug: "caritas",
    company: "Caritas Switzerland",
    person: { ru: "Мехрибон Махмудова", uz: "Mehribon Maxmudova", en: "Mehribon Makhmudova" },
    role: { ru: "Специалист по коммуникациям и PR", uz: "Kommunikatsiya va PR mutaxassisi", en: "Communications and PR specialist" },
    quote: {
      ru: "С уверенностью рекомендуем компанию IKAT как надёжного и компетентного партнёра в сфере видеопроизводства.",
      uz: "IKAT kompaniyasini videoişlab çiqariş sohasida işonçli va malakali hamkor sifatida işonç bilan tavsiya qilamiz.",
      en: "We confidently recommend IKAT as a reliable and competent partner in video production.",
    },
  },
  {
    slug: "golden-house",
    company: "Golden House Property Group",
    person: { ru: "З. М. Шаджалилова", uz: "Z. M. Shadjalilova", en: "Z. M. Shadjalilova" },
    role: { ru: "Руководитель управления маркетинга и рекламы", uz: "Marketing va reklama boşqarmasi rahbari", en: "Head of Marketing and Advertising" },
    quote: {
      ru: "Компания зарекомендовала себя как ответственный партнёр, способный качественно реализовывать задачи в установленные сроки.",
      uz: "Kompaniya özini vazifalarni belgilangan muddatda sifatli bajaradigan masʼuliyatli hamkor sifatida körsatdi.",
      en: "The company has proved to be a responsible partner that delivers quality work on schedule.",
    },
  },
  {
    slug: "murad-buildings",
    company: "Murad Buildings",
    person: { ru: "О. Б. Нурмухамедов", uz: "O. B. Nurmuhamedov", en: "O. B. Nurmukhamedov" },
    role: { ru: "Генеральный директор", uz: "Boş direktor", en: "CEO" },
    quote: {
      ru: "Все обязательства были выполнены в полном объёме, качественно и в установленные сроки.",
      uz: "Barça majburiyatlar töliq hajmda, sifatli va belgilangan muddatda bajarildi.",
      en: "All obligations were met in full, to a high standard and on time.",
    },
  },
  {
    slug: "techage",
    company: "Techage",
    person: { ru: "А. С. Аветисов", uz: "A. S. Avetisov", en: "A. S. Avetisov" },
    role: { ru: "Директор", uz: "Direktor", en: "Director" },
    quote: {
      ru: "Команда не ограничилась формальным выполнением ТЗ: они внимательно разобрались в контексте компании, уловили нужный тон.",
      uz: "Jamoa texnik topşiriqni rasman bajariş bilan çeklanmadi: kompaniya kontekstini diqqat bilan örgandi va kerakli ohangni topdi.",
      en: "The team went beyond the brief: they took the time to understand our company and found the right tone.",
    },
  },
  {
    slug: "kontur",
    company: "Kontur Develop",
    person: { ru: "Р. П. Юсупов", uz: "R. P. Yusupov", en: "R. P. Yusupov" },
    role: { ru: "Директор", uz: "Direktor", en: "Director" },
    quote: {
      ru: "Команда предложила сильную концепцию, выстроила съёмки без хаоса и задержек, быстро отрабатывала комментарии.",
      uz: "Jamoa kuçli konsepsiya taklif qildi, suratga olişni tartibsizlik va keçikişlarsiz taşkil etdi, izohlarga tez javob berdi.",
      en: "The team proposed a strong concept, ran the shoot without chaos or delays and turned feedback around fast.",
    },
  },
  {
    slug: "union-spektr-stroy",
    company: "Union Spektr Stroy",
    person: { ru: "А. И. Дадабаев", uz: "A. I. Dadabayev", en: "A. I. Dadabaev" },
    role: { ru: "Директор", uz: "Direktor", en: "Director" },
    quote: {
      ru: "Претензий по объёму, качеству и срокам выполнения работ не имеем.",
      uz: "Işlar hajmi, sifati va muddatlari böyiça eʼtirozimiz yöq.",
      en: "We have no complaints about the scope, quality or timing of the work.",
    },
  },
  {
    slug: "microyol",
    company: "Microyol",
    person: { ru: "Д. В. Шевараков", uz: "D. V. Shevarakov", en: "D. V. Shevarakov" },
    role: { ru: "Генеральный директор", uz: "Boş direktor", en: "CEO" },
    quote: {
      ru: "По итогам работ результат полностью соответствовал техническому заданию и нашим ожиданиям.",
      uz: "Işlar yakunida natija texnik topşiriqqa va kutganimizga töliq mos keldi.",
      en: "The result fully matched the brief and our expectations.",
    },
  },
  {
    slug: "ankalife",
    company: { ru: "Анкалайф", uz: "Ankalayf", en: "Ankalife" },
    person: { ru: "Жихангир Чакижи", uz: "Jihangir Chakiji", en: "Jihangir Chakiji" },
    role: { ru: "Директор", uz: "Direktor", en: "Director" },
    quote: {
      ru: "Если нам понадобятся услуги видеопродакшна, мы не раздумывая обратимся в IkatPro и без сомнений порекомендуем другим.",
      uz: "Agar bizga Video Production böyiça xizmatlar kerak bölsa, öylab ötirmasdan IkatPro kompaniyasiga murojaat qilamiz va boşqalarga ham şubhasiz tavsiya qilamiz.",
      en: "If we need video production again, we will turn to IkatPro without a second thought and recommend them to others.",
    },
    translated: "ru",
  },
];
