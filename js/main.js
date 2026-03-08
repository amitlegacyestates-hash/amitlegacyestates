/* ============================================================
   AMIT LEGACY ESTATES v2 — SHARED JS
   ============================================================ */

/* ── NAV ── */
(function initNav() {
  const nav  = document.querySelector('.nav');
  const ham  = document.querySelector('.nav__ham');
  const mob  = document.querySelector('.nav__mobile');
  if (!nav) return;

  function update() {
    if (window.scrollY > 60) nav.classList.replace('nav--transparent','nav--scrolled') || nav.classList.add('nav--scrolled');
    else { nav.classList.remove('nav--scrolled'); nav.classList.add('nav--transparent'); }
  }
  update();
  window.addEventListener('scroll', update, { passive: true });

  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // Active link
  const page = location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    const href = a.getAttribute('href').replace(/^\//, '').replace(/\/$/, '') || 'index.html';
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      const target = parseFloat(e.target.dataset.count);
      const suffix = e.target.dataset.suffix || '';
      const dec    = String(target).includes('.');
      const dur = 1600; const step = 16;
      let cur = 0;
      const timer = setInterval(() => {
        cur += target / (dur / step);
        if (cur >= target) { cur = target; clearInterval(timer); }
        e.target.textContent = (dec ? cur.toFixed(1) : Math.floor(cur)) + suffix;
      }, step);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

/* ── PARALLAX HERO ── */
(function initParallax() {
  const bg = document.querySelector('.hero__bg');
  if (!bg) return;
  let raf = false;
  window.addEventListener('scroll', () => {
    if (!raf) {
      requestAnimationFrame(() => {
        bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        raf = false;
      });
      raf = true;
    }
  }, { passive: true });
})();

/* ── TESTIMONIAL SLIDER ── */
(function initSlider() {
  const wrap  = document.querySelector('.testimonial-slider-wrap');
  if (!wrap) return;
  const track = wrap.querySelector('.testimonial-track');
  const slides= Array.from(track.querySelectorAll('.testimonial-slide'));
  const dots  = Array.from(wrap.querySelectorAll('.slider-dot'));
  const prevBtn = wrap.querySelector('.slider-prev');
  const nextBtn = wrap.querySelector('.slider-next');
  if (!slides.length) return;

  let current = 0;
  let perView = 1;
  let timer;

  function getPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768)  return 2;
    return 1;
  }

  function update(idx) {
    current = ((idx % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * (100 / perView)}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { update(current + 1); }
  function prev() { update(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 4200);
  }

  function resize() {
    perView = getPerView();
    slides.forEach(s => s.style.minWidth = `${100 / perView}%`);
    update(current);
  }

  resize();
  startAuto();
  window.addEventListener('resize', resize);

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { update(i); startAuto(); }));

  // Touch swipe
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAuto(); }
  }, { passive: true });
})();

/* ── PROJECT MODAL ── */
(function initModal() {
  const modal   = document.getElementById('projectModal');
  if (!modal) return;
  const overlay = modal.querySelector('.modal-overlay');
  const close   = modal.querySelector('.modal-close');

  window.openProjectModal = function(d) {
    modal.querySelector('.modal-title').textContent    = d.name;
    modal.querySelector('.modal-location').textContent = d.location;
    modal.querySelector('.modal-type').textContent     = d.type;
    modal.querySelector('.modal-price').textContent    = d.price;
    modal.querySelector('.modal-status-text').textContent = d.status;
    modal.querySelector('.modal-desc').textContent     = d.desc;
    const hl = modal.querySelector('.modal-highlights');
    hl.innerHTML = (d.highlights||[]).map(h=>`<li>✓ ${h}</li>`).join('');
    modal.querySelector('.modal-wa').href = `https://wa.me/917388808813?text=I%20am%20interested%20in%20${encodeURIComponent(d.name)}`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  if (overlay) overlay.addEventListener('click', closeModal);
  if (close)   close.addEventListener('click',   closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ── FILTER ── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        const show = f === 'all' || (c.dataset.category||'').includes(f);
        c.style.opacity = show ? '1' : '0';
        c.style.pointerEvents = show ? '' : 'none';
        setTimeout(() => { c.style.display = show ? '' : 'none'; }, show ? 0 : 300);
        if (show) setTimeout(() => { c.style.opacity = '1'; }, 10);
      });
    });
  });
})();

/* ── INQUIRY SELECTOR ── */
(function initInquiry() {
  document.querySelectorAll('.inq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.inq-selector').querySelectorAll('.inq-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

/* ── FORM SUBMIT — handled by form-email.js ── */
// Form submissions are processed by js/form-email.js which sends data to info@amitlegacyestates.com

/* ── LUCKNOW SLIDES SLIDER ── */
(function initLucknowSlider() {
  const wrap = document.getElementById('lknSlider');
  if (!wrap) return;
  const dots = Array.from(document.querySelectorAll('#lknDots1 .lucknow-dot'));
  let cur = 0;
  let perView = 1;
  function getPV() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }
  function update(i) {
    cur = i;
    wrap.style.transform = `translateX(-${cur * (100 / perView)}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === Math.floor(cur * perView / perView)));
  }
  function resize() {
    perView = getPV();
    const slides = wrap.querySelectorAll('.lucknow-slide');
    slides.forEach(s => s.style.minWidth = `${100 / perView}%`);
    update(0);
  }
  resize();
  window.addEventListener('resize', resize);
  dots.forEach((d, i) => d.addEventListener('click', () => update(i)));
  setInterval(() => {
    const slides = wrap.querySelectorAll('.lucknow-slide');
    const maxIdx = slides.length - perView;
    update(cur >= maxIdx ? 0 : cur + 1);
  }, 3500);
})();

/* ── COUNTDOWN TIMER ── */
(function initCountdown() {
  const days = document.getElementById('cdDays');
  const hours = document.getElementById('cdHours');
  const mins = document.getElementById('cdMins');
  const secs = document.getElementById('cdSecs');
  if (!days) return;
  // Set a fixed end date (7 days from first load, stored in localStorage is not available so use fixed)
  let target = new Date();
  target.setDate(target.getDate() + 7);
  target.setHours(23, 59, 59, 0);
  function update() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    days.textContent = String(d).padStart(2,'0');
    hours.textContent = String(h).padStart(2,'0');
    mins.textContent = String(m).padStart(2,'0');
    secs.textContent = String(s).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
})();

/* ── AMENITY ITEMS STAGGER REVEAL ── */
(function initAmenityReveal() {
  const items = document.querySelectorAll('.amenity-item');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => io.observe(el));
})();

/* ── PREMIUM CALC TABS ── */
(function initCalcTabs() {
  document.querySelectorAll('.calc-tab-wrap').forEach(wrap => {
    const tabs = wrap.querySelectorAll('.calc-tab');
    const section = wrap.closest('.calc-premium') || wrap.closest('section');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.panel;
        if (section) {
          section.querySelectorAll('.calc-panel').forEach(p => {
            p.classList.toggle('active', p.id === target);
          });
        }
      });
    });
  });
})();
