/* Identity — page logic: ink intro, hero, clients, manifesto, the eight-arm services, the work ring
   and its camouflage, the content tunnel, process, AR/EN. */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const pad = (n) => String(n).padStart(2, '0');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  gsap.registerPlugin(ScrollTrigger);
  // phones: the address bar showing/hiding must not re-measure every pinned scene
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------------- content ---------------- */

  const T = {
    ar: {
      'intro.tag': 'ميديا · تسويق · هويّات',
      'nav.about': 'من نحن', 'nav.services': 'الخدمات', 'nav.work': 'أعمالنا', 'nav.contact': 'تواصل', 'nav.cta': 'ابدأ مشروعك',
      'hero.eyebrow': 'وكالة ميديا وتسويق',
      'hero.l1': 'نصنع', 'hero.l2': 'الهويّات.',
      'hero.lead': 'الهوية القوية لا تُرى… بل تُحَسّ.',
      'hero.small': 'من الفكرة إلى الحملة، نبني براندات تشبه أصحابها وتصل لجمهورها.',
      s1: 'الهوية البصرية', s2: 'السوشال ميديا', s3: 'التصوير والفيديو', s4: 'الإعلانات الممولة',
      'man.label': 'الفكرة',
      'man.text': 'نحن لا نصمّم شعارات فقط. نحن نصنع شخصيةً كاملة — صوتًا ولونًا وحضورًا — تتلوّن مع كل منصة وتبقى نفسها في كل مكان. مثل الأخطبوط: ثمانية أذرع، وهوية واحدة.',
      'man.sign': 'أذرع · هوية واحدة',
      'clients.label': 'براندات ساعدناها تكبر',
      'sv.label': 'الخدمات', 'sv.t1': 'ثمانية أذرع.', 'sv.t2': 'هوية واحدة.',
      'tn.label': 'من الكواليس', 'tn.t': 'قطعة محتوى كل شهر',
      'tn.sub': 'بوستات، ستوريز، ريلز، تصوير وحملات — وكلها بنفس الهوية.',
      'pr.label': 'طريقتنا', 'pr.t1': 'من نقطة حبر…', 'pr.t2': 'إلى هوية كاملة.',
      'pr.s1': 'حبر', 'pr.s1d': 'نسمع ونفهم: جلسة اكتشاف، دراسة السوق والمنافسين، ومين جمهورك فعلًا.',
      'pr.s2': 'شكل', 'pr.s2d': 'نرسم ونجرّب: الهوية البصرية، صوت البراند، وخطة المحتوى والحملة.',
      'pr.s3': 'هوية', 'pr.s3d': 'نطلق ونكبر: نشر، إعلانات، وقياس كل شهر لنحسّن اللي بيشتغل.',
      'st.1': 'براند بنينا هويته', 'st.2': 'مشاهدة لحملاتنا', 'st.3': 'خدمات تحت سقف واحد', 'st.4': 'سنين خبرة',
      'work.label': 'أعمال مختارة', 'work.hint': 'مرّر — الأخطبوط يتلوّن بألوان كل عميل', 'work.camo': 'تمويه',
      'contact.label': 'تواصل', 'contact.l1': 'خلّينا نصنع', 'contact.l2': 'هويّتك.',
      'contact.cta': 'احكي معنا على واتساب', 'contact.note': 'نرد خلال يوم عمل واحد.',
      'foot.brand': 'آيدينتيتي', 'foot.note': 'نموذج مقترح — المشاريع والأرقام للتوضيح فقط',
      'cursor.view': 'عرض', lang: 'EN',
    },
    en: {
      'intro.tag': 'Media · Marketing · Identities',
      'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work', 'nav.contact': 'Contact', 'nav.cta': 'Start a project',
      'hero.eyebrow': 'Media & marketing agency',
      'hero.l1': 'We shape', 'hero.l2': 'identities.',
      'hero.lead': 'A strong identity isn’t seen — it’s felt.',
      'hero.small': 'From the first idea to the campaign, we build brands that look like their owners and reach their people.',
      s1: 'Brand identity', s2: 'Social media', s3: 'Photo & video', s4: 'Paid ads',
      'man.label': 'The idea',
      'man.text': 'We don’t just design logos. We build a whole character — a voice, a colour, a presence — that adapts to every platform and stays itself everywhere. Like the octopus: eight arms, one identity.',
      'man.sign': 'arms · one identity',
      'clients.label': 'Brands we helped grow',
      'sv.label': 'Services', 'sv.t1': 'Eight arms.', 'sv.t2': 'One identity.',
      'tn.label': 'Behind the scenes', 'tn.t': 'pieces of content every month',
      'tn.sub': 'Posts, stories, reels, shoots and campaigns — all in one identity.',
      'pr.label': 'How we work', 'pr.t1': 'From a drop of ink…', 'pr.t2': 'to a whole identity.',
      'pr.s1': 'Ink', 'pr.s1d': 'We listen: a discovery session, market and competitor research, and who your audience really is.',
      'pr.s2': 'Shape', 'pr.s2d': 'We draw and test: the visual identity, the brand voice, and the content and campaign plan.',
      'pr.s3': 'Identity', 'pr.s3d': 'We launch and grow: publishing, ads, and a monthly read of what works to do more of it.',
      'st.1': 'brands built', 'st.2': 'views on our campaigns', 'st.3': 'services under one roof', 'st.4': 'years of experience',
      'work.label': 'Selected work', 'work.hint': 'Scroll — the octopus takes on each client’s colours', 'work.camo': 'Camouflage',
      'contact.label': 'Contact', 'contact.l1': 'Let’s shape', 'contact.l2': 'your identity.',
      'contact.cta': 'Talk to us on WhatsApp', 'contact.note': 'We reply within one working day.',
      'foot.brand': 'Identity', 'foot.note': 'Proposal prototype — projects and numbers are illustrative',
      'cursor.view': 'View', lang: 'ع',
    },
  };

  // Placeholder projects for the proposal: each one carries its own brand palette.
  const PROJECTS = [
    { name: { ar: 'قهوة', en: 'QAHWA' }, cat: { ar: 'مقهى · هوية وتغليف', en: 'Coffee house · Identity & packaging' }, year: 2025, bg: '#3b2416', ink: '#f3e6d0', accent: '#d9a35f', mark: 'cup', tag: { ar: 'صباحك يبدأ هون', en: 'Your morning starts here' } },
    { name: { ar: 'نور', en: 'NOOR' }, cat: { ar: 'عيادة أسنان · سوشال ميديا', en: 'Dental clinic · Social media' }, year: 2025, bg: '#e3eeeb', ink: '#0f3b3a', accent: '#1f9e8f', mark: 'moon', tag: { ar: 'ابتسامتك أولًا', en: 'Your smile first' } },
    { name: { ar: 'رَم', en: 'RUM' }, cat: { ar: 'سياحة صحراوية · حملة إعلانية', en: 'Desert trails · Ad campaign' }, year: 2024, bg: '#c4572e', ink: '#fbe9d7', accent: '#2a1410', mark: 'dunes', tag: { ar: 'الصحراء بتناديك', en: 'The desert is calling' } },
    { name: { ar: 'زيتون', en: 'ZAYTOON' }, cat: { ar: 'مطعم · تصوير ومحتوى', en: 'Restaurant · Photo & content' }, year: 2025, bg: '#39452b', ink: '#eef0dc', accent: '#c9d46b', mark: 'olive', tag: { ar: 'طعم البيت', en: 'Taste of home' } },
    { name: { ar: 'سَحَر', en: 'SAHAR' }, cat: { ar: 'عطور · فيلم إطلاق', en: 'Perfumes · Launch film' }, year: 2026, bg: '#15121b', ink: '#eadcc4', accent: '#c9a45c', mark: 'star', tag: { ar: 'عطر الليل', en: 'Scent of the night' } },
    { name: { ar: 'أطلس', en: 'ATLAS' }, cat: { ar: 'نادي رياضي · إعادة هوية', en: 'Fitness club · Rebrand' }, year: 2026, bg: '#d6f03c', ink: '#121212', accent: '#121212', mark: 'peak', tag: { ar: 'ولا عذر اليوم', en: 'No excuses today' } },
    { name: { ar: 'موج', en: 'MAWJ' }, cat: { ar: 'منتجع بحري · صناعة محتوى', en: 'Sea resort · Content' }, year: 2024, bg: '#0e3a5b', ink: '#eaf4fa', accent: '#6ec1e4', mark: 'waves', tag: { ar: 'البحر أقرب', en: 'The sea is closer' } },
    { name: { ar: 'لولو', en: 'LULU' }, cat: { ar: 'متجر أطفال · سوشال وإعلانات', en: 'Kids store · Social & ads' }, year: 2025, bg: '#f7cdd7', ink: '#4a1d3a', accent: '#e2557a', mark: 'bubbles', tag: { ar: 'فرحة صغيرة', en: 'A little joy' } },
  ];

  const S = 'fill="none" stroke="currentColor" stroke-linecap="round"';
  const MARKS = {
    cup: `<path d="M22 46h50v8c0 14-11 26-25 26S22 68 22 54z"/><path d="M72 50h4a9 9 0 0 1 0 18h-5" ${S} stroke-width="5"/><path d="M36 20c-6 6 6 10 0 18M48 15c-6 7 6 12 0 23M60 20c-6 6 6 10 0 18" ${S} stroke-width="4"/><rect x="16" y="84" width="62" height="5" rx="2.5"/>`,
    moon: `<path d="M64 14A40 40 0 1 0 64 86A46 46 0 0 1 64 14z"/><circle cx="72" cy="34" r="6"/><circle cx="82" cy="54" r="3"/>`,
    dunes: `<circle cx="66" cy="32" r="12"/><path d="M6 72c14-14 30-14 44 0s30 14 44 0v20H6z"/><path d="M8 60c18-16 34-16 50 0" ${S} stroke-width="4"/>`,
    olive: `<path d="M18 84C38 64 56 42 80 16" ${S} stroke-width="4"/><ellipse cx="38" cy="54" rx="15" ry="5.5" transform="rotate(-62 38 54)"/><ellipse cx="62" cy="50" rx="15" ry="5.5" transform="rotate(28 62 50)"/><ellipse cx="56" cy="26" rx="13" ry="5" transform="rotate(-70 56 26)"/><ellipse cx="80" cy="34" rx="12" ry="4.5" transform="rotate(20 80 34)"/><circle cx="44" cy="72" r="7"/><circle cx="68" cy="66" r="6"/>`,
    star: `<rect x="24" y="24" width="52" height="52"/><rect x="24" y="24" width="52" height="52" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="11" style="fill:var(--cbg)"/>`,
    peak: `<path d="M6 86L40 22l16 30 10-16 28 50z"/><path d="M40 22l9 17-9 6-9-6z" style="fill:var(--cbg)"/>`,
    waves: `<circle cx="72" cy="22" r="9"/><path d="M8 46c10-10 20-10 30 0s20 10 30 0 20-10 30 0M8 62c10-10 20-10 30 0s20 10 30 0 20-10 30 0M8 78c10-10 20-10 30 0s20 10 30 0 20-10 30 0" ${S} stroke-width="6"/>`,
    bubbles: `<circle cx="40" cy="58" r="24"/><circle cx="70" cy="36" r="13"/><circle cx="74" cy="72" r="8"/><circle cx="30" cy="24" r="6"/><circle cx="32" cy="50" r="6" style="fill:var(--cbg)"/>`,
  };

  const SERVICES = [
    { ar: ['الهوية البصرية', 'شعار، ألوان، خطوط، ودليل استخدام يخلّي البراند يحكي نفس اللغة بكل مكان.', ['شعار', 'دليل الهوية', 'تغليف']],
      en: ['Visual identity', 'Logo, colours, type and a brand book, so the brand speaks one language everywhere.', ['Logo', 'Brand book', 'Packaging']] },
    { ar: ['استراتيجية البراند', 'مين إنت، لمين بتحكي، وشو بيميّزك — قبل أي تصميم.', ['تموضع', 'صوت البراند', 'تسمية']],
      en: ['Brand strategy', 'Who you are, who you talk to and what sets you apart — before any design.', ['Positioning', 'Brand voice', 'Naming']] },
    { ar: ['إدارة السوشال ميديا', 'خطة شهرية، نشر منتظم، رد على الجمهور، وتقارير واضحة.', ['تقويم محتوى', 'إدارة المجتمع', 'تقارير']],
      en: ['Social media', 'A monthly plan, steady publishing, community replies and clear reports.', ['Content calendar', 'Community', 'Reports']] },
    { ar: ['صناعة المحتوى', 'أفكار وكتابة وتصميم بيوقّف السكرول.', ['كتابة', 'تصميم', 'ريلز']],
      en: ['Content creation', 'Ideas, copy and design that stop the scroll.', ['Copy', 'Design', 'Reels']] },
    { ar: ['التصوير', 'منتجات، أكل، أماكن وناس — بإضاءة وستايل البراند.', ['منتجات', 'أكل', 'لايف ستايل']],
      en: ['Photography', 'Products, food, places and people — lit and styled like the brand.', ['Product', 'Food', 'Lifestyle']] },
    { ar: ['إنتاج الفيديو', 'من الفكرة والسكريبت للتصوير والمونتاج والموشن.', ['إعلانات', 'أفلام إطلاق', 'موشن']],
      en: ['Video production', 'From idea and script to shoot, edit and motion.', ['Ads', 'Launch films', 'Motion']] },
    { ar: ['الإعلانات الممولة', 'حملات على ميتا وتيك توك وجوجل، باستهداف دقيق وقياس لكل نتيجة.', ['ميتا', 'تيك توك', 'جوجل']],
      en: ['Paid ads', 'Campaigns on Meta, TikTok and Google, sharply targeted, every result measured.', ['Meta', 'TikTok', 'Google']] },
    { ar: ['المواقع والتجربة الرقمية', 'مواقع وصفحات هبوط سريعة وجميلة وبتبيع.', ['مواقع', 'صفحات هبوط', 'UX']],
      en: ['Web & digital', 'Fast, beautiful websites and landing pages that sell.', ['Websites', 'Landing pages', 'UX']] },
  ];

  const STAR = '<svg class="mq-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0l2 10 10 2-10 2-2 10-2-10-10-2 10-2z"/></svg>';

  const BRAND = { bg: '#150c1d', ink: '#ecdfc6', accent: '#9aa86a', body: '#2c1736', line: '#ecdfc6' };

  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const css = (c) => `rgb(${c.map(Math.round).join(' ')})`;
  const BR = Object.fromEntries(Object.entries(BRAND).map(([k, v]) => [k, rgb(v)]));
  // the parchment palette of the logo, for the light section after the tunnel
  const LT = { bg: rgb('#e9dcc3'), ink: rgb('#2c1736'), accent: rgb('#5c6b3c') };
  // on the ring the octopus wears the client: body in its accent, engraving in its background
  PROJECTS.forEach((p) => (p.rgb = { bg: rgb(p.bg), ink: rgb(p.ink), accent: rgb(p.accent), body: rgb(p.accent), line: rgb(p.bg) }));

  let lang = store.get('identity-lang') === 'en' ? 'en' : 'ar';
  const t = (k) => T[lang][k] ?? k;
  const rtl = () => lang === 'ar';

  /* ---------------- smooth scroll ---------------- */

  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(target, { duration: 1.6 }) : target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    })
  );

  /* ---------------- octopuses ---------------- */

  const heroOcto = new Octopus($('#heroOcto'), { cx: 0.5, cy: 0.51, size: 0.36, len: 0.8, tilt: 0.14, seed: 11 });
  const ringOcto = new Octopus($('#ringOcto'), {
    cx: 0.5, cy: 0.3, size: 0.3, len: 1.25, reach: 0.6, tilt: 0, seed: 5, sway: 2, bend: 0.012,
    fan: [Math.PI * 0.9, Math.PI * 0.1],
  });
  // services: the octopus in negative — parchment body, plum engraving
  const svOcto = new Octopus($('#svOcto'), { cx: 0.5, cy: 0.36, size: 0.2, len: 1.25, reach: 1.3, tilt: 0, seed: 23 });
  svOcto.setColors('#e4d0b0', '#2c1736');

  /* ---------------- camouflage ---------------- */

  const rootStyle = document.documentElement.style;
  const camo = { f: 0, enter: 0, exit: 0, light: 0, contact: 0 };
  function paintCamo() {
    const n = PROJECTS.length;
    const f = clamp(camo.f, 0, n - 1), i0 = Math.floor(f), i1 = Math.min(n - 1, i0 + 1), fr = f - i0;
    const A = PROJECTS[i0].rgb, B = PROJECTS[i1].rgb;
    const w = camo.enter * (1 - camo.exit);
    const light = camo.light * (1 - camo.contact);
    const pick = (k) => mixc(mixc(BR[k], mixc(A[k], B[k], fr), w), LT[k], light);
    rootStyle.setProperty('--bg', css(pick('bg')));
    rootStyle.setProperty('--ink', css(pick('ink')));
    rootStyle.setProperty('--accent', css(pick('accent')));
    // the ring octopus is fully camouflaged even when the page is still half brand
    ringOcto.setColors(mixc(A.body, B.body, fr), mixc(A.line, B.line, fr));
  }

  /* ---------------- work ring ---------------- */

  const stage = $('.ring-stage');
  const track = $('.names-track');
  const cards = PROJECTS.map((p, i) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.cursor = 'view';
    el.style.cssText = `--cbg:${p.bg};--cink:${p.ink};--cacc:${p.accent}`;
    el.innerHTML = `
      <div class="face front">
        <div class="card-top"><span>${String(i + 1).padStart(2, '0')}</span><span>${p.year}</span></div>
        <div class="card-mark"><svg viewBox="0 0 100 100" aria-hidden="true">${MARKS[p.mark]}</svg></div>
        <div class="card-name"><b></b><span></span></div>
        <div class="card-sw"><i style="background:${p.bg}"></i><i style="background:${p.ink}"></i><i style="background:${p.accent}"></i></div>
      </div>
      <div class="face back"><img src="assets/logo.png" alt=""></div>`;
    el.addEventListener('click', () => goToCard(i));
    stage.appendChild(el);
    return el;
  });

  let W = 0, R = 0, active = -1, ringST = null;
  function measureRing() {
    W = stage.clientWidth;
    R = (W / 2 / Math.tan(Math.PI / cards.length)) * 1.2;
    // push the ring back so the front card sits at its natural size
    stage.style.transform = `translateZ(${-R}px) rotateX(-7deg)`;
  }

  function renderRing(p) {
    const n = cards.length, raw = p * (n - 1);
    const i0 = Math.min(n - 2, Math.floor(raw));
    // each card holds at the front for a moment before the next one turns in
    const f = i0 + smooth(clamp((raw - i0 - 0.14) / 0.72));
    const s = rtl() ? -1 : 1, step = 360 / n;
    cards.forEach((el, i) => {
      const a = (i - f) * step * s;
      const c = Math.cos((a * Math.PI) / 180);
      const pop = Math.pow(Math.max(0, c), 10) * W * 0.12;
      el.style.transform = `rotateY(${a}deg) translateZ(${R + pop}px)`;
      el.style.setProperty('--shade', ((1 - Math.abs(c)) * 0.62 + (c < 0 ? 0.28 : 0)).toFixed(3));
    });
    track.style.transform = `translateY(calc(var(--nh) * ${-f}))`;
    const cur = Math.round(f);
    if (cur !== active) {
      active = cur;
      $('.work-count .cur').textContent = String(cur + 1).padStart(2, '0');
      $('.work-cat').textContent = `${PROJECTS[cur].cat[lang]} — ${PROJECTS[cur].year}`;
    }
    camo.f = f;
    paintCamo();
  }

  function goToCard(i) {
    if (!ringST || i === active) return;
    const y = ringST.start + (ringST.end - ringST.start) * (i / (cards.length - 1));
    lenis ? lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
  }

  function fillRingText() {
    $('.work-count .total').textContent = String(cards.length).padStart(2, '0');
    track.innerHTML = PROJECTS.map((p) => `<div>${p.name[lang]}</div>`).join('');
    cards.forEach((el, i) => {
      const p = PROJECTS[i];
      $('.card-name b', el).textContent = p.name[lang];
      $('.card-name span', el).textContent = p.cat[lang];
      $('.face.front', el).setAttribute('aria-label', `${p.name[lang]} — ${p.cat[lang]}`);
    });
    active = -1;
  }

  /* ---------------- clients strip ---------------- */

  function fillClients() {
    const one = PROJECTS.map((p) =>
      `<span class="client"><svg viewBox="0 0 100 100" aria-hidden="true">${MARKS[p.mark]}</svg><b>${p.name[lang]}</b></span>${STAR}`
    ).join('');
    // two identical groups: the track slides by exactly one of them, so the loop never jumps
    $('.marquee-track').innerHTML = `<div class="mq-group">${one}</div><div class="mq-group" aria-hidden="true">${one}</div>`;
  }

  /* ---------------- services: eight arms ---------------- */

  const svStage = $('.services-stage'), svList = $('.sv-list');
  const SV_FAN = [Math.PI * 1.08, -Math.PI * 0.08]; // the arms' fan, so each service sits at the tip of one arm
  let svActive = -1, svST = null;

  function fillServices() {
    svList.innerHTML = SERVICES.map((sv, i) =>
      `<li class="sv-item"><button type="button" data-i="${i}"><span class="n">${pad(i + 1)}</span><span class="t">${sv[lang][0]}</span></button></li>`
    ).join('');
    $$('button', svList).forEach((b) => b.addEventListener('click', () => goToService(+b.dataset.i)));
    placeServices();
    const keep = Math.max(0, svActive);
    svActive = -1;
    setService(keep, true);
  }

  function placeServices() {
    const w = svStage.clientWidth, h = svStage.clientHeight;
    const ox = w * 0.5, oy = h * 0.36, rx = w * 0.38, ry = Math.min(h * 0.42, w * 0.5);
    $$('.sv-item', svList).forEach((li, i) => {
      const k = rtl() ? 1 - i / 7 : i / 7; // 01 starts on the reading side
      const a = SV_FAN[0] + (SV_FAN[1] - SV_FAN[0]) * k;
      const r = i % 2 ? 0.76 : 1; // two rings, so neighbours never sit on each other
      li.style.left = `${ox + Math.cos(a) * rx * r}px`;
      li.style.top = `${oy + Math.sin(a) * ry * r}px`;
    });
  }

  function setService(i, quiet) {
    if (i === svActive) return;
    svActive = i;
    const [name, desc, tags] = SERVICES[i][lang];
    $$('.sv-item', svList).forEach((li, j) => li.classList.toggle('is-active', j === i));
    $('.sv-detail .cur').textContent = pad(i + 1);
    $('.sv-name').textContent = name;
    $('.sv-desc').textContent = desc;
    $('.sv-tags').innerHTML = tags.map((x) => `<li>${x}</li>`).join('');
    svOcto.follow($$('.sv-item button', svList)[i]); // the matching arm reaches for it
    if (!reduce && !quiet) {
      gsap.fromTo('.sv-detail > *', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out', overwrite: true });
    }
  }

  function goToService(i) {
    if (!svST) return;
    const y = svST.start + (svST.end - svST.start) * ((i + 0.5) / SERVICES.length);
    lenis ? lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
  }

  /* ---------------- content tunnel ---------------- */

  const world = $('.tunnel-world'), light = $('.tunnel-light'), glow = $('.tunnel-glow');
  const tn = { tiles: [], depth: 0, P: 800, count: 0 };
  const TILE_TYPES = ['post', 'story', 'poster', 'reel', 'palette', 'post', 'story', 'seal'];

  function tileInner(p, type) {
    const mark = `<svg viewBox="0 0 100 100" aria-hidden="true">${MARKS[p.mark]}</svg>`;
    const name = p.name[lang], tag = p.tag[lang];
    switch (type) {
      case 'post':
        return `<div class="tp-head"><i class="tp-av"></i><b>@${p.name.en.toLowerCase()}</b></div><div class="tp-img">${mark}</div><div class="tp-foot"><i></i><i></i><i></i><span>${tag}</span></div>`;
      case 'story':
        return `<div class="ts-bars"><i></i><i></i><i></i></div><div class="ts-mark">${mark}</div><p class="ts-tag">${tag}</p><span class="ts-name">${name}</span>`;
      case 'poster':
        return `<span class="tq-year">${p.year}</span><b class="tq-name">${name}</b><p class="tq-tag">${tag}</p>`;
      case 'reel':
        return `<div class="tr-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></div><span class="tr-time">0:15</span><b class="tr-name">${name}</b>`;
      case 'palette':
        return `<i style="background:${p.bg}"></i><i style="background:${p.ink}"></i><i style="background:${p.accent}"></i><span>${name}</span>`;
      default:
        return `<img src="assets/logo.png" alt="">`;
    }
  }

  function buildTunnel() {
    tn.count = innerWidth < 900 ? 30 : 44;
    let html = '';
    for (let k = 0; k < tn.count; k++) {
      const p = PROJECTS[(k * 3) % PROJECTS.length], type = TILE_TYPES[k % TILE_TYPES.length];
      html += `<div class="tile tile-${type}" style="--cbg:${p.bg};--cink:${p.ink};--cacc:${p.accent}">${tileInner(p, type)}</div>`;
    }
    world.innerHTML = html;
    tn.tiles = $$('.tile', world);
    layoutTunnel();
  }

  function layoutTunnel() {
    const small = innerWidth < 900;
    const rx = innerWidth * (small ? 0.4 : 0.35), ry = innerHeight * (small ? 0.34 : 0.33);
    const gap = small ? 170 : 150;
    tn.P = small ? 620 : 820;
    $('.tunnel-view').style.perspective = tn.P + 'px';
    tn.tiles.forEach((el, k) => {
      const th = k * 2.39996 + 0.6; // golden angle: a spiral, never two tiles in line
      const z = -(k * gap + 300);
      el._z = z;
      el.style.transform =
        `translate3d(${Math.cos(th) * rx}px, ${Math.sin(th) * ry}px, ${z}px) ` +
        `rotateY(${-Math.cos(th) * 20}deg) rotateX(${Math.sin(th) * 20}deg) translate(-50%, -50%)`;
    });
    tn.depth = tn.count * gap + 300;
  }

  function renderTunnel(p) {
    // fly forward: every tile has passed the camera by ~82% of the scroll
    const fly = clamp(p / 0.82);
    const cam = (smooth(fly) * 0.15 + fly * 0.85) * (tn.depth + tn.P * 0.4);
    world.style.transform = `translateZ(${cam}px)`;
    const far = 2600, near = tn.P * 0.8;
    for (const el of tn.tiles) {
      const z = el._z + cam;
      const o = clamp((z + far) / 1000) * clamp((near - z) / 260);
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.002 ? 'visible' : 'hidden';
    }
    // the light at the end of the tunnel opens up and swallows the screen
    const end = smooth(clamp((p - 0.74) / 0.24));
    light.style.clipPath = `circle(${(1 + p * 2.4 + end * 90).toFixed(2)}% at 50% 50%)`;
    light.style.setProperty('--logo', clamp((p - 0.84) / 0.12).toFixed(3));
    glow.style.opacity = ((0.55 + p * 0.45) * (1 - end)).toFixed(3);
    const out = clamp((p - 0.5) / 0.2);
    const copy = $('.tunnel-copy');
    copy.style.opacity = 1 - out;
    copy.style.transform = `scale(${1 + out * 0.2})`;
    $('.tn-count').textContent = Math.round(300 * smooth(clamp(p / 0.45)));
    camo.light = smooth(clamp((p - 0.86) / 0.12));
    paintCamo();
  }

  /* ---------------- manifesto ---------------- */

  let manTween = null;
  function buildManifesto() {
    const el = $('.manifesto-text');
    el.innerHTML = t('man.text').split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    manTween?.scrollTrigger?.kill();
    manTween?.kill();
    if (reduce) return gsap.set($$('.w', el), { opacity: 1 });
    manTween = gsap.to($$('.w', el), {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: true },
    });
  }

  /* ---------------- language ---------------- */

  function applyLang() {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = rtl() ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $('#langBtn').textContent = t('lang');
    $('#langBtn').setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    buildManifesto();
    fillRingText();
    fillClients();
    fillServices();
    buildTunnel();
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    store.set('identity-lang', lang);
    applyLang();
    ScrollTrigger.refresh();
    if (ringST) renderRing(ringST.progress);
    if (tnST) renderTunnel(tnST.progress);
  });

  /* ---------------- scroll scenes ---------------- */

  let tnST = null;
  function scenes() {
    svST = ScrollTrigger.create({
      trigger: '#services',
      start: 'top top',
      end: () => '+=' + innerHeight * 3.2,
      pin: true,
      onUpdate: (st) => setService(Math.min(SERVICES.length - 1, Math.floor(st.progress * SERVICES.length))),
      onRefresh: () => placeServices(),
    });

    measureRing();
    ringST = ScrollTrigger.create({
      trigger: '#work',
      start: 'top top',
      end: () => '+=' + innerHeight * (cards.length - 1) * 0.7,
      pin: true,
      onUpdate: (st) => renderRing(st.progress),
      onRefresh: (st) => { measureRing(); renderRing(st.progress); },
    });
    // the page starts taking the first client's colours as the ring arrives…
    ScrollTrigger.create({
      trigger: '#work', start: 'top 75%', end: 'top top',
      onUpdate: (st) => { camo.enter = st.progress; paintCamo(); },
      onRefresh: (st) => { camo.enter = st.progress; paintCamo(); },
    });
    // …and gives them back to the brand as the tunnel comes in
    ScrollTrigger.create({
      trigger: '#tunnel', start: 'top 95%', end: 'top 30%',
      onUpdate: (st) => { camo.exit = st.progress; paintCamo(); },
      onRefresh: (st) => { camo.exit = st.progress; paintCamo(); },
    });

    tnST = ScrollTrigger.create({
      trigger: '#tunnel',
      start: 'top top',
      end: () => '+=' + innerHeight * 3,
      pin: true,
      onUpdate: (st) => renderTunnel(st.progress),
      onRefresh: (st) => { layoutTunnel(); renderTunnel(st.progress); },
    });
    // the parchment of the light section turns back into ink before the contact
    ScrollTrigger.create({
      trigger: '#contact', start: 'top 85%', end: 'top 35%',
      onUpdate: (st) => { camo.contact = st.progress; paintCamo(); },
      onRefresh: (st) => { camo.contact = st.progress; paintCamo(); },
    });

    // process: the ink line draws itself, the steps rise, the numbers count up
    gsap.fromTo('.ink-path path', { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: '.steps-wrap', start: 'top 85%', end: 'bottom 55%', scrub: true },
    });
    $$('.stats [data-count]').forEach((el) => {
      const n = +el.dataset.count, v = { v: 0 };
      ScrollTrigger.create({
        trigger: '.stats', start: 'top 85%', once: true,
        onEnter: () => gsap.to(v, { v: n, duration: reduce ? 0 : 1.8, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(v.v)) }),
      });
    });

    if (!reduce) {
      const hero = { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-word', { yPercent: -35, ease: 'none', scrollTrigger: hero });
      gsap.to('.hero-stage', { y: -90, ease: 'none', scrollTrigger: hero });
      gsap.to('.hero-copy', { y: -160, autoAlpha: 0.2, ease: 'none', scrollTrigger: hero });
      gsap.from('.step', {
        y: 50, autoAlpha: 0, duration: 1.1, stagger: 0.15, ease: 'expo.out',
        scrollTrigger: { trigger: '.steps', start: 'top 80%' },
      });
      gsap.from('.services-title', {
        y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '#services', start: 'top 70%' },
      });
      gsap.from('.contact-title .line > *', {
        yPercent: 110, duration: 1.2, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
      });
      gsap.from('.foot-word', {
        yPercent: 40, ease: 'none',
        scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    }

    const nav = $('#nav');
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (st) => nav.classList.toggle('is-hidden', st.direction === 1 && st.scroll() > 240),
    });
  }

  /* ---------------- intro ---------------- */

  function intro() {
    if (reduce) {
      $('#intro').remove();
      return;
    }
    heroOcto.grow = 0;
    document.documentElement.classList.add('is-loading');
    lenis?.stop();
    gsap.set('.hero-title .line > *', { yPercent: 110 });
    gsap.set(['.nav > *', '.eyebrow', '.hero-aside', '.hero-services li'], { autoAlpha: 0, y: 18 });
    gsap.set('.disc', { scale: 0.35, autoAlpha: 0 });
    gsap.set('.disc-word', { clipPath: 'inset(0 0 0 100%)' });
    gsap.set('.hero-word', { autoAlpha: 0, yPercent: 18 });

    const count = { v: 0 }, num = $('.intro-count .num');
    gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        document.documentElement.classList.remove('is-loading');
        lenis?.start();
      },
    })
      .to(count, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => (num.textContent = Math.round(count.v)) })
      .to('.ink-drop', { attr: { cy: 50 }, duration: 0.5, ease: 'power2.in' }, 0.75)
      .to('.ink-drop', { attr: { r: 90 }, duration: 1.15, ease: 'power3.inOut' }, 1.22)
      .to('#inkDisp', { attr: { scale: 12 }, duration: 0.7, ease: 'power1.in' }, 1.22)
      .to('.ink-spatter', { attr: { r: 1.7 }, duration: 0.35, ease: 'power2.out', stagger: 0.05 }, 1.24)
      .to('.intro-meta', { autoAlpha: 0, duration: 0.3, ease: 'none' }, 1.55)
      .add(() => $('#intro').remove(), 2.36)
      .to('.disc', { scale: 1, autoAlpha: 1, duration: 1.4 }, 2.2)
      .to(heroOcto, { grow: 1, duration: 2.6, ease: 'power2.out' }, 2.35)
      .to('.disc-word', { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power2.inOut' }, 2.9)
      .to('.hero-word', { autoAlpha: 1, yPercent: 0, duration: 1.8 }, 2.5)
      .to('.hero-title .line > *', { yPercent: 0, duration: 1.3, stagger: 0.1 }, 2.6)
      .to(['.nav > *', '.eyebrow', '.hero-aside', '.hero-services li'], { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06 }, 2.95);
  }

  /* ---------------- cursor ---------------- */

  function cursor() {
    if (reduce || !matchMedia('(pointer: fine)').matches) return;
    const el = $('.cursor'), label = $('.cursor-label');
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    gsap.ticker.add(() => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
    });
    document.addEventListener('pointerover', (e) => {
      const big = e.target.closest('[data-cursor]');
      el.classList.toggle('is-big', !!big);
      el.classList.toggle('is-link', !big && !!e.target.closest('a, button'));
      label.textContent = big ? t('cursor.' + big.dataset.cursor) : '';
    });
  }

  applyLang();
  scenes();
  renderRing(0);
  renderTunnel(0);
  cursor();
  intro();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  // the intro is the opening of the page: a reload always starts from the top
  ScrollTrigger.clearScrollMemory('manual');
  scrollTo(0, 0);
  addEventListener('beforeunload', () => scrollTo(0, 0));
})();
