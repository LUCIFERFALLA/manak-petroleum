/* ============================================================
   MANAK PETROLEUM — Motion & Interactions
   ============================================================ */

(function(){
  'use strict';

  /* ---------- LOADER ---------- */
  const loader = document.querySelector('.loader');
  if(loader){
    let dismissed = false;
    const hideLoader = (delay) => {
      if(dismissed) return;
      dismissed = true;
      setTimeout(() => loader.classList.add('is-hidden'), delay);
      setTimeout(() => { if(loader.parentNode) loader.remove(); }, delay + 350);
    };
    // Fast cap (~400ms total) — the M reveal plays then clears.
    if(document.readyState === 'complete') hideLoader(150);
    else window.addEventListener('load', () => hideLoader(200));
    if(document.readyState !== 'loading') setTimeout(() => hideLoader(0), 350);
    else document.addEventListener('DOMContentLoaded', () => setTimeout(() => hideLoader(0), 350));
    setTimeout(() => hideLoader(0), 600); // hard cap
  }

  /* ---------- STICKY NAV STATE ---------- */
  const nav = document.querySelector('.nav');
  if(nav){
    const onScroll = () => {
      if(window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* ---------- MOBILE DRAWER ---------- */
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.drawer');
  if(burger && drawer){
    const close = () => { burger.classList.remove('is-open'); drawer.classList.remove('is-open'); document.body.style.overflow=''; };
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      drawer.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if(e.key==='Escape') close(); });
  }

  /* ---------- NAV: Escape closes a focus-opened dropdown ---------- */
  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Escape') return;
    const a = document.activeElement;
    if(a && a.closest && a.closest('.nav-item')) a.blur();
  });

  /* ---------- SCROLL REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal, .reveal-up, .reveal-mask');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, idx) => {
        if(e.isIntersecting){
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));

    // Stagger children
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      Array.from(parent.children).forEach((child, i) => {
        child.style.setProperty('--i', i);
      });
    });
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- NUMBER COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const dur = 1600;
      const start = performance.now();
      const initial = 0;
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = initial + (target - initial) * eased;
        el.textContent = decimals
          ? val.toFixed(decimals)
          : Math.round(val).toLocaleString('en-IN');
        if(t < 1) requestAnimationFrame(tick);
        else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('en-IN');
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){ animate(e.target); cio.unobserve(e.target); }
      });
    }, { threshold:0.4 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- MARQUEE: duplicate items INSIDE the track (single row, seamless) ---------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    if(track.dataset.doubled) return;
    track.dataset.doubled = '1';
    track.innerHTML += track.innerHTML; // one track, doubled content → -50% loops seamlessly
  });

  /* ---------- HERO HEADLINE: word-by-word rise ---------- */
  (function(){
    const title = document.querySelector('.hero-title');
    if(!title || title.dataset.split) return;
    title.dataset.split = '1';
    let wi = 0;
    const wrapWords = (node, container) => {
      const words = node.textContent.split(/(\s+)/);
      words.forEach(part => {
        if(part.trim() === ''){ container.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = 'w'; s.style.setProperty('--wi', wi++); s.textContent = part;
        container.appendChild(s);
      });
    };
    Array.from(title.childNodes).forEach(child => {
      if(child.nodeType === 3){ // text node
        const frag = document.createDocumentFragment();
        wrapWords(child, frag);
        title.replaceChild(frag, child);
      } else if(child.nodeType === 1){ // element (e.g. <em class="accent">)
        const inner = document.createDocumentFragment();
        wrapWords(child, inner);
        child.textContent = '';
        child.appendChild(inner);
      }
    });
  })();

  /* ---------- VIDEO: play only when on-screen (performance) ---------- */
  /* Prevents every looping video on the page decoding at once — the main cause
     of the sluggish feel. Only the video(s) currently in view actually play. */
  const videos = document.querySelectorAll('video');
  if(videos.length){
    videos.forEach(v => { v.muted = true; v.setAttribute('playsinline',''); });
    if('IntersectionObserver' in window){
      const vio = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          const v = e.target;
          if(e.isIntersecting){
            if(v.preload === 'none') v.preload = 'auto';
            const p = v.play();
            if(p && p.catch) p.catch(()=>{});
          } else {
            v.pause();
          }
        });
      }, { threshold:0.25 });
      videos.forEach(v => vio.observe(v));
    }
  }

  /* ---------- PRODUCT CATALOG FILTER (if present) ---------- */
  const filters = document.querySelectorAll('.cat-filters input[type="checkbox"]');
  const products = document.querySelectorAll('.product-card');
  if(filters.length && products.length){
    const applyFilter = () => {
      const active = {};
      filters.forEach(f => {
        if(f.checked){
          const g = f.dataset.group;
          active[g] = active[g] || [];
          active[g].push(f.dataset.value);
        }
      });
      products.forEach(p => {
        let show = true;
        Object.keys(active).forEach(g => {
          const val = p.dataset[g] || '';
          const matched = active[g].some(v => val.split(',').includes(v));
          if(!matched) show = false;
        });
        p.style.display = show ? '' : 'none';
      });
    };
    filters.forEach(f => f.addEventListener('change', applyFilter));

    /* deep-link from mega-menu: #engine, #zigma, #emtex-gear ... */
    const applyHash = () => {
      const h = (location.hash || '').replace('#','');
      if(!h) return;
      const tokens = h.split('-');
      let any = false;
      tokens.forEach(tok => {
        const box = document.querySelector('.cat-filters input[data-value="'+tok+'"]');
        if(box && !box.checked){ box.checked = true; any = true; }
      });
      if(any) applyFilter();
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
  }

  /* ---------- ACTIVE NAV HIGHLIGHT ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-item[data-nav]').forEach(item => {
    if(item.getAttribute('data-nav').toLowerCase() === here) item.classList.add('is-current');
  });

})();
