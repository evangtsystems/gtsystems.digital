/*
 * GTS · «Λύσεις» — Τροχιά (χωρίς βιβλιοθήκες)
 *
 *   <section class="go" data-gts-orbit data-img="img/"></section>
 *   <script src="orbit.js"></script>                          → αυτόματη τοποθέτηση
 *   ή:  const destroy = GTSOrbit.mount(element, { img: '/images/solutions/' })
 *
 * Χρονοδιάγραμμα scroll (κάθε λύση έχει το δικό της κομμάτι):
 *   1. η τροχιά γυρίζει και φέρνει μπροστά την κάρτα της λύσης
 *   2. η κάρτα βγαίνει από την τροχιά και «σκάει» μπροστά σου· το κείμενο ανεβαίνει λέξη-λέξη
 *   3. μένει λίγο για να διαβαστεί · 4. γυρίζει πίσω στην τροχιά (εκτός από την τελευταία)
 * Το φόντο παίρνει το χρώμα της φωτογραφίας που βλέπεις. Όλα «κολλάνε» στο scroll (scrubbed) με ομαλή επιβράδυνση.
 */
(function (root) {
  'use strict';

  var DEFAULTS = {
    img: 'img/',
    eyebrow: 'Λύσεις',
    title: 'Ψηφιακή παρουσία, λογισμικό, ταμειακά, υποστήριξη και δίκτυα.',
    cue: 'Scroll',
    cta: 'Δείτε τη λύση',
    credits: '',
    products: [
      // 1. Ψηφιακός μετασχηματισμός
      { title: 'Ιστοσελίδες & Web Apps', href: '/web-development', img: 'web-main', alt: 'Ιστοσελίδα σε laptop και κινητό',
        text: 'Ιστοσελίδες, portals και αυτοματισμοί που δουλεύουν για την επιχείρησή σας.',
        tags: ['Επαγγελματικές ιστοσελίδες', 'Web apps & portals', 'Αυτοματισμοί'], bg: '#123f45', glow: '#35b5c4' },
      { title: 'SEO & GEO', href: '/contact', img: 'seo-main', alt: 'Αναζήτηση στη Google και σε AI βοηθούς',
        text: 'Να σας βρίσκουν στη Google αλλά και στις απαντήσεις των ChatGPT, Gemini και Perplexity.',
        tags: ['SEO', 'GEO · AI αναζήτηση', 'Google Business Profile'], bg: '#163a1c', glow: '#4fc35f' },
      { title: 'Google Ads', href: '/contact', img: 'ads-main', alt: 'Διαφημίσεις στη Google',
        text: 'Καμπάνιες που φέρνουν πελάτες, με μετρήσιμο αποτέλεσμα για κάθε ευρώ.',
        tags: ['Search & Performance Max', 'Conversion tracking', 'Μηνιαία αναφορά'], bg: '#3d2c06', glow: '#f2b311' },
      // 2. Επιχειρησιακές λύσεις & υποδομές
      { title: 'Εμπορικό Λογισμικό', href: '/business-systems', img: 'erp-main', alt: 'Laptop με εφαρμογές ERP',
        text: 'Megasoft, ERP και αναφορές, στημένα στη δική σας ροή εργασίας.',
        tags: ['Εφαρμογές Megasoft', 'Ροές εργασίας ERP', 'Επιχειρησιακή πληροφόρηση'], bg: '#4a2410', glow: '#e0701f' },
      { title: 'Ταμειακά & POS', href: '/business-systems#cash-pos', img: 'pos-main', alt: 'Φορητά τερματικά POS',
        text: 'Ταμειακές, POS και φορολογικοί μηχανισμοί, με εγκατάσταση και εκπαίδευση.',
        tags: ['Ταμειακά συστήματα', 'Φορολογική συμμόρφωση', 'Λιανική και εστίαση'], bg: '#4d1a14', glow: '#d9573a' },
      { title: 'Τεχνική Υποστήριξη', href: '/contact', img: 'support-main', alt: 'Τηλεφωνία και απομακρυσμένη υποστήριξη',
        text: 'Συμβόλαια, service εξοπλισμού και απομακρυσμένη βοήθεια όταν τη χρειάζεστε.',
        tags: ['Συμβόλαια υποστήριξης', 'Service εξοπλισμού', 'Απομακρυσμένη βοήθεια'], bg: '#003a5e', glow: '#0a9bf5' },
      { title: 'Δίκτυα & Υποδομές', href: '/contact', img: 'net-main', alt: 'Καλώδια οπτικών ινών σε data center',
        text: 'Καλωδιώσεις, Wi-Fi και τηλεφωνικά κέντρα για επαγγελματικούς χώρους.',
        tags: ['Μελέτες Wi-Fi', 'Δομημένη καλωδίωση', 'Τηλεπικοινωνίες'], bg: '#0d1f5c', glow: '#3d6cff' }
    ],
    // διακοσμητικές κάρτες ανάμεσα στις λύσεις: οι κύριες φωτογραφίες μετατοπισμένες κατά 3,
    // ώστε δίπλα σε κάθε λύση να μην είναι η ίδια φωτογραφία
    extras: [
      { img: 'erp-main', alt: '' }, { img: 'pos-main', alt: '' }, { img: 'support-main', alt: '' }, { img: 'net-main', alt: '' },
      { img: 'web-main', alt: '' }, { img: 'seo-main', alt: '' }, { img: 'ads-main', alt: '' }
    ]
  };

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var sm = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var outCubic = function (t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };
  var outBack = function (t) { t = clamp(t, 0, 1); var c = 1.25; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  var inCubic = function (t) { t = clamp(t, 0, 1); return t * t * t; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mixA(a, b, t) { return [0, 1, 2].map(function (i) { return Math.round(lerp(a[i], b[i], t)); }); }
  function mix(a, b, t) { return 'rgb(' + mixA(a, b, t).join(',') + ')'; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function txt(tag, cls, t) { var e = el(tag, cls); e.textContent = t; return e; }
  function pic(base, name, alt, lazy) {
    var p = el('picture'), s = el('source'), i = el('img');
    s.type = 'image/webp'; s.srcset = base + name + '.webp';
    i.src = base + name + '.jpg'; i.alt = alt || ''; i.decoding = 'async'; if (lazy) i.loading = 'lazy';
    p.append(s, i); return p;
  }

  function mount(section, options) {
    var o = Object.assign({}, DEFAULTS, options || {});
    if (section.dataset.img && !(options && options.img)) o.img = section.dataset.img;
    var P = o.products, n = P.length;
    section.classList.add('go'); section.innerHTML = '';
    section.setAttribute('aria-labelledby', 'go-title');

    var track = el('div', 'go-track'); track.style.setProperty('--go-count', n);
    var stage = el('div', 'go-stage');
    var bg = el('div', 'go-bg'), grain = el('div', 'go-grain'), floor = el('div', 'go-floor');
    var ambs = P.map(function (p) { var a = el('div', 'go-amb'); a.style.backgroundImage = 'url("' + o.img + p.img + '.jpg")'; return a; });
    var scene = el('div', 'go-scene');

    // κάρτες: λύση, διακοσμητική, λύση, διακοσμητική…
    var cards = [];
    P.forEach(function (p, i) {
      var c = el('figure', 'go-card'); c.append(pic(o.img, p.img, p.alt));
      c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-label', p.title);
      c.addEventListener('click', function () { goTo(i); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); } });
      cards.push({ el: c, slot: i * 2, product: i });
      var x = o.extras[i % o.extras.length];
      var d = el('figure', 'go-card is-sat'); d.setAttribute('aria-hidden', 'true'); d.append(pic(o.img, x.img, x.alt));
      cards.push({ el: d, slot: i * 2 + 1, product: -1 });
    });
    cards.forEach(function (c) { scene.append(c.el); });
    var slots = cards.length, step = 360 / slots;

    var intro = el('div', 'go-intro'), ii = el('div', 'go-intro-in');
    var h2 = txt('h2', 'go-h2', o.title); h2.id = 'go-title';
    var cue = el('div', 'go-cue'); cue.append(txt('span', '', o.cue), el('i'));
    ii.append(txt('p', 'go-eyebrow', o.eyebrow), h2, cue); intro.append(ii);

    var copy = el('div', 'go-copy'), cw = el('div', 'go-wrap');
    var panels = P.map(function (p, i) {
      var pn = el('article', 'go-panel'); pn.setAttribute('aria-hidden', 'true');
      var th = el('figure', 'go-thumb'); th.append(pic(o.img, p.img, p.alt, true)); pn.append(th);
      var idx = el('div', 'go-mask'), idxIn = txt('span', 'go-idx', pad(i + 1)); idx.append(idxIn);
      var h3 = el('h3'), words = [];
      p.title.split(' ').forEach(function (w) { var m = el('span', 'go-word'), s = txt('span', '', w); m.append(s); h3.append(m); words.push(s); });
      var pm = el('div', 'go-mask'), pp = txt('p', '', p.text); pm.append(pp);
      var ul = el('ul', 'go-chips'), chips = (p.tags || []).map(function (t) { var li = txt('li', '', t); ul.append(li); return li; });
      var a = el('a', 'go-cta'); a.href = p.href || '#'; a.append(document.createTextNode(o.cta)); a.append(txt('b', '', '↗'));
      a.setAttribute('aria-label', o.cta + ': ' + p.title);
      pn.append(idx, h3, pm, ul, a); cw.append(pn);
      return { el: pn, idx: idxIn, words: words, p: pp, chips: chips, cta: a };
    });
    copy.append(cw);

    var nav = el('nav', 'go-nav'); nav.setAttribute('aria-label', o.eyebrow);
    var navBtns = P.map(function (p, i) {
      var b = el('button'); b.type = 'button'; b.setAttribute('aria-label', p.title);
      b.append(txt('span', '', pad(i + 1)), el('i'));
      b.addEventListener('click', function () { goTo(i); }); nav.append(b); return b;
    });
    var bar = el('div', 'go-bar'), barI = el('i'); bar.append(barI);

    stage.append(bg); ambs.forEach(function (a) { stage.append(a); }); stage.append(grain, floor, scene, intro, copy, nav, bar);
    track.append(stage); section.append(track);
    if (o.credits) { var cr = el('p', 'go-wrap go-credits'); cr.textContent = o.credits; section.append(cr); }

    var cols = P.map(function (p) { return { bg: hex(p.bg), glow: hex(p.glow) }; });
    var BASE = hex('#0e100d');

    // ---- χρονοδιάγραμμα ----
    var INTRO = 0.07, L = (1 - INTRO) / n;
    function timeline(T) {
      var s = { introOut: sm(T / INTRO), ring: -1, pop: 0, k: 0 };
      if (T < INTRO) return s;
      var f = (T - INTRO) / L, k = Math.min(n - 1, Math.floor(f)), u = f - k;
      if (k === n - 1 && f >= n) u = 1;
      s.k = k;
      s.ring = (k - 1) + sm(u / 0.26);
      if (u < 0.26) s.pop = 0;
      else if (u < 0.48) s.pop = (u - 0.26) / 0.22;          // βγαίνει από την τροχιά
      else if (u < 0.8 || k === n - 1) s.pop = 1;           // μένει
      else s.pop = 1 - (u - 0.8) / 0.2;                      // επιστρέφει
      s.popIn = u < 0.8 || k === n - 1;
      return s;
    }

    // ---- γεωμετρία ανάλογα με την οθόνη ----
    var G = {};
    function measure() {
      var w = stage.clientWidth || innerWidth, h = stage.clientHeight || innerHeight, mob = w < 860;
      var cardW = mob ? Math.min(w * 0.86, 520) : Math.min(w * 0.42, 660);
      section.style.setProperty('--go-w', cardW + 'px');
      G = { w: w, h: h, mob: mob, cardW: cardW,
        ringCx: w * 0.5, ringCxPop: mob ? w * 0.5 : w * 0.66, ringCy: h * (mob ? 0.33 : 0.5), ringCyIntro: h * (mob ? 0.62 : 0.7),
        R: mob ? w * 0.62 : Math.min(w * 0.36, 560), tilt: mob ? 70 : 130,
        ringS: mob ? 0.4 : 0.31,
        popX: mob ? w * 0.5 : w * 0.64, popY: h * (mob ? 0.3 : 0.47), popS: 1 };
    }

    // ---- απόδοση ----
    var Tt = 0, Tc = 0, raf = 0, visible = false, mx = 0, my = 0, cmx = 0, cmy = 0, t0 = performance.now(), lastActive = -1;
    function frame(now) {
      Tc += (Tt - Tc) * 0.085;
      if (Math.abs(Tt - Tc) < 0.00005) Tc = Tt;
      cmx += (mx - cmx) * 0.06; cmy += (my - cmy) * 0.06;
      var s = timeline(Tc);
      var idle = Math.sin((now - t0) / 2600) * 0.12 * (1 - s.introOut);   // ήπια κίνηση πριν ξεκινήσει το scroll
      var ringPos = s.ring + idle;
      var popE = s.popIn ? outBack(s.pop) : inCubic(s.pop);
      var cx = lerp(G.ringCx, G.ringCxPop, s.introOut);
      var cy = lerp(G.ringCyIntro, G.ringCy, sm(s.introOut));
      var Rr = G.R * lerp(1.25, 1, s.introOut);                         // στην αρχή η τροχιά είναι πιο ανοιχτή, κάτω από τον τίτλο

      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        var a = ((c.slot - ringPos * 2) * step) % 360; if (a > 180) a -= 360; if (a < -180) a += 360;
        var rad = a * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
        var x = cx + sin * Rr, z = (cos - 1) * Rr * 0.9, y = cy - (1 - cos) * G.tilt;
        var ry = -a * 0.32, sc = G.ringS, op = 0.25 + 0.75 * (cos + 1) / 2, zi = Math.round(500 + cos * 400);
        var isHero = c.product === s.k && s.introOut > 0.99;
        if (isHero && popE > 0) {                                        // η κάρτα «σκάει» μπροστά
          var e = popE;
          x = lerp(x, G.popX, e); y = lerp(y, G.popY, e); z = lerp(z, 60, Math.min(1, e));
          ry = lerp(ry, -6 + cmx * 4, Math.min(1, e)); sc = lerp(sc, G.popS, e); op = 1; zi = 2000;
        } else if (s.pop > 0) {
          op *= 1 - 0.75 * Math.min(1, s.pop); sc *= 1 - 0.12 * Math.min(1, s.pop);
        }
        c.el.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
        c.el.style.opacity = op.toFixed(3);
        c.el.style.zIndex = zi;
      }

      // χρώμα φόντου: της λύσης που βλέπεις, εντονότερο όταν «σκάει»
      var ringFrac = ringPos - Math.floor(ringPos), kA = clamp(Math.floor(ringPos), 0, n - 1), kB = clamp(kA + 1, 0, n - 1);
      var near = s.introOut < 1 ? 0 : 1;
      var w = (0.45 + 0.55 * Math.min(1, s.pop)) * s.introOut;
      var bgA = cols[s.ring < 0 ? 0 : kA], bgB = cols[s.ring < 0 ? 0 : kB], t = s.ring < 0 ? 0 : ringFrac;
      var bgCol = mixA(bgA.bg, bgB.bg, t);
      section.style.setProperty('--go-bg', mix(BASE, bgCol, w));
      section.style.setProperty('--go-glow', mix(bgA.glow, bgB.glow, t));
      section.style.setProperty('--glow-x', (lerp(50, G.mob ? 50 : 64, s.introOut)) + '%');
      for (var q = 0; q < n; q++) ambs[q].style.opacity = (q === s.k ? 0.42 * Math.min(1, s.pop) * near : 0).toFixed(3);
      floor.style.setProperty('--floor-x', (-ringPos * 140).toFixed(1) + 'px');
      section.style.setProperty('--po-x', (50 + cmx * 6) + '%');
      section.style.setProperty('--po-y', (45 + cmy * 4) + '%');

      // εισαγωγή
      intro.style.opacity = (1 - s.introOut).toFixed(3);
      intro.style.transform = 'translateY(' + (-s.introOut * 60).toFixed(1) + 'px) scale(' + (1 - s.introOut * 0.06).toFixed(3) + ')';

      // κείμενο: λέξη-λέξη από μάσκα, μετά η περιγραφή, τα tags, το κουμπί
      var rev = s.introOut > 0.99 ? (s.popIn ? outCubic(s.pop) : s.pop) : 0;
      for (var j = 0; j < n; j++) {
        var pn = panels[j], on = j === s.k && rev > 0.001;
        pn.el.classList.toggle('is-on', on);
        pn.el.classList.toggle('is-live', on && rev > 0.6);
        pn.el.setAttribute('aria-hidden', on && rev > 0.6 ? 'false' : 'true');
        if (!on) continue;
        var r = s.popIn ? rev : rev;
        pn.idx.style.transform = 'translateY(' + ((1 - sm(r * 1.4)) * 105).toFixed(1) + '%)';
        pn.words.forEach(function (wd, wi) { var e2 = sm(r * 1.5 - wi * 0.12); wd.style.transform = 'translateY(' + ((1 - e2) * 110).toFixed(1) + '%)'; });
        var ep = sm(r * 1.5 - 0.35); pn.p.style.transform = 'translateY(' + ((1 - ep) * 100).toFixed(1) + '%)';
        pn.chips.forEach(function (ch, ci) { var ec = sm(r * 1.6 - 0.5 - ci * 0.08); ch.style.opacity = ec.toFixed(3); ch.style.transform = 'translateY(' + ((1 - ec) * 14).toFixed(1) + 'px)'; });
        var ea = sm(r * 1.6 - 0.75); pn.cta.style.opacity = ea.toFixed(3); pn.cta.style.transform = 'translateY(' + ((1 - ea) * 14).toFixed(1) + 'px)';
      }
      var active = s.introOut > 0.99 ? s.k : -1;
      if (active !== lastActive) { lastActive = active; navBtns.forEach(function (b, bi) { b.setAttribute('aria-current', bi === active ? 'true' : 'false'); }); }
      barI.style.setProperty('--p', Tc.toFixed(4));

      var moving = Tc !== Tt || Math.abs(mx - cmx) > 0.001 || Math.abs(my - cmy) > 0.001 || s.introOut < 1;
      raf = visible && moving ? requestAnimationFrame(frame) : 0;
    }
    function progress() {
      var r = track.getBoundingClientRect(), span = r.height - innerHeight;
      return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    }
    function kick() { if (!raf && !section.classList.contains('go--static')) raf = requestAnimationFrame(frame); }
    function onScroll() { Tt = progress(); kick(); }
    function onResize() { measure(); onScroll(); }
    function onMove(e) { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; if (visible) kick(); }
    function goTo(i) {
      var r = track.getBoundingClientRect(), span = r.height - innerHeight;
      var T = INTRO + (i + 0.62) * L;                                        // μέση της «στάσης» της λύσης
      scrollTo({ top: scrollY + r.top + span * T, behavior: mq.matches ? 'auto' : 'smooth' });
    }
    function decodeAll() {
      section.querySelectorAll('.go-card img').forEach(function (im) { if (im.decode) im.decode().then(function () { requestAnimationFrame(kick); }).catch(function () {}); });
    }

    var mq = matchMedia('(prefers-reduced-motion: reduce)');
    var no3d = !(window.CSS && CSS.supports && CSS.supports('transform-style', 'preserve-3d'));
    var io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) onScroll(); }, { rootMargin: '150px 0px' });
    function apply() {
      var stat = mq.matches || no3d;
      section.classList.toggle('go--static', stat);
      if (stat) { panels.forEach(function (p) { p.el.setAttribute('aria-hidden', 'false'); }); return; }
      measure(); Tt = Tc = progress(); visible = true; frame(performance.now());
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    addEventListener('pointermove', onMove, { passive: true });
    if (mq.addEventListener) mq.addEventListener('change', apply);
    io.observe(track);
    apply(); decodeAll();

    return function destroy() {
      cancelAnimationFrame(raf); io.disconnect();
      removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); removeEventListener('pointermove', onMove);
      if (mq.removeEventListener) mq.removeEventListener('change', apply);
      section.innerHTML = '';
    };
  }

  root.GTSOrbit = { mount: mount, defaults: DEFAULTS };
  if (typeof document !== 'undefined') {
    var auto = function () { document.querySelectorAll('[data-gts-orbit]').forEach(function (s) { if (!s.__go) s.__go = mount(s); }); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
  }
})(typeof window !== 'undefined' ? window : this);
