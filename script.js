/* ═══════════════════════════════════════════════
   GUTROOTZ — DYNAMIC SCRIPT v2.0
   ═══════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── SCROLL PROGRESS BAR ─── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ─── PARTICLES ─── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dots = [];
    const COLORS = ['#1e6e46', '#b84a2e', '#3d8a96', '#c4863a', '#5aaa7a'];
    const COUNT = window.innerWidth < 768 ? 30 : 55;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function init() {
      resize();
      dots = [];
      for (let i = 0; i < COUNT; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.5 + .8,
          dx: (Math.random() - 0.5) * 0.35,
          dy: (Math.random() - 0.5) * 0.35,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      // Draw connecting lines between nearby dots
      dots.forEach((d, i) => {
        dots.forEach((d2, j) => {
          if (j <= i) return;
          const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = `rgba(30,110,70,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0 || d.x > w) d.dx *= -1;
        if (d.y < 0 || d.y > h) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.globalAlpha = d.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    init();
    draw();
    window.addEventListener('resize', () => { resize(); }, { passive: true });
  }

  /* ─── TYPING ANIMATION ─── */
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'Decides How You Think.',
      'Shapes Your Mood.',
      'Fuels Your Focus.',
      'Builds Your Brain.'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        typingEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 65);
      } else {
        typingEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35);
      }
    }
    setTimeout(type, 1000);
  }

  /* ─── NAVBAR ─── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ─── MOBILE MENU ─── */
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // Stagger siblings
          const siblings = e.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right');
          let delay = 0;
          siblings.forEach((s, idx) => {
            if (s === e.target) delay = idx * 80;
          });
          setTimeout(() => e.target.classList.add('visible'), Math.min(delay, 400));
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ─── ANIMATED COUNTERS ─── */
  const counters = document.querySelectorAll('.stat-num');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = +el.dataset.target;
      const duration = 2200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(target * ease);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* ─── ACTIVE NAV HIGHLIGHT ─── */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const highlight = () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(s => {
        const top = s.offsetTop;
        const h = s.offsetHeight;
        const id = s.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
      });
    };
    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
  }

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── NUTRITION TILE EXPAND ─── */
  document.querySelectorAll('.nutrition-tile-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const tile = btn.parentElement;
      tile.classList.toggle('open');
      btn.setAttribute('aria-expanded', tile.classList.contains('open'));
    });
  });

  /* ─── DIET PACKAGE TABS ─── */
  const pkgTabs = document.querySelectorAll('.pkg-tab');
  const pkgPanels = document.querySelectorAll('.pkg-panel');
  pkgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pkgTabs.forEach(t => t.classList.remove('active'));
      pkgPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.pkg);
      if (target) target.classList.add('active');
    });
  });

  /* ─── SHOP FILTER ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const shopCards = document.querySelectorAll('.shop-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      shopCards.forEach((card, i) => {
        const show = filter === 'all' || (card.dataset.tags || '').includes(filter);
        if (show) {
          card.classList.remove('hidden');
          card.style.animationDelay = (i * 0.04) + 's';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ═══════════════════════════════════════════════
     CART SYSTEM
  ═══════════════════════════════════════════════ */
  const cart = [];
  const toastEl    = document.getElementById('cartToast');
  const toastMsg   = document.getElementById('toastMsg');
  const toastClose = document.getElementById('toastClose');
  const cartFab    = document.getElementById('cartFab');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerItems = document.getElementById('drawerItems');
  const drawerFooter = document.getElementById('drawerFooter');
  const drawerTotal = document.getElementById('drawerTotal');
  // Both nav + fab counts
  const cartCounts = document.querySelectorAll('.cart-count-badge');

  function showToast(msg) {
    if (!toastEl) return;
    toastMsg.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }
  if (toastClose) toastClose.addEventListener('click', () => toastEl.classList.remove('show'));

  function openDrawer() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (cartFab) cartFab.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);

  // Nav cart button
  const navCartBtn = document.getElementById('navCartBtn');
  if (navCartBtn) navCartBtn.addEventListener('click', openDrawer);

  function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);

    // Update all count badges
    cartCounts.forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle('has-items', count > 0);
    });

    if (!drawerItems) return;
    if (cart.length === 0) {
      drawerItems.innerHTML = `
        <div class="empty-cart">
          <div style="font-size:3rem;margin-bottom:1rem">🛒</div>
          <p style="font-weight:600;margin-bottom:.5rem;color:var(--clr-text)">Your cart is empty</p>
          <p style="font-size:.85rem;margin-bottom:1rem">Add some herbal superfoods to get started</p>
          <a href="#shop" onclick="closeDrawer && closeDrawer()" style="color:var(--clr-green);font-weight:600;">Browse Products →</a>
        </div>`;
      if (drawerFooter) drawerFooter.style.display = 'none';
    } else {
      drawerItems.innerHTML = cart.map((item, idx) => `
        <div class="drawer-item">
          <div class="drawer-item-info">
            <h4>${item.name}</h4>
            <span class="drawer-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
          </div>
          <div class="drawer-item-qty">
            <button data-idx="${idx}" data-action="dec" title="Remove">−</button>
            <span>${item.qty}</span>
            <button data-idx="${idx}" data-action="inc" title="Add more">+</button>
          </div>
        </div>`).join('');
      if (drawerFooter) drawerFooter.style.display = '';
      if (drawerTotal) drawerTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

      drawerItems.querySelectorAll('button[data-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = +btn.dataset.idx;
          if (btn.dataset.action === 'inc') {
            cart[i].qty++;
          } else {
            cart[i].qty--;
            if (cart[i].qty <= 0) cart.splice(i, 1);
          }
          updateCartUI();
        });
      });
    }
  }

  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.dataset.product;
      const price = +btn.dataset.price;
      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      updateCartUI();
      showToast(`✓ ${name} added to cart!`);

      // Button feedback animation
      const orig = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.background = 'linear-gradient(135deg,#155534,#0f3d25)';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 1500);
    });
  });

  /* ─── CURSOR GLOW ─── */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ─── SCROLL-TO-TOP ─── */
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 3D CARD TILT ─── */
  document.querySelectorAll('.product-card, .shop-card, .pathway-card, .nt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-8px) perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── HERO PARALLAX ─── */
  const heroMesh = document.querySelector('.hero-mesh');
  if (heroMesh) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroMesh.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  /* ─── FLOATING CARDS MOUSE PARALLAX ─── */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      heroVisual.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    }, { passive: true });
  }

  /* ─── NAV CART OPEN FROM PRODUCT SECTION LINKS ─── */
  document.querySelectorAll('a[href="#shop"]').forEach(a => {
    a.addEventListener('click', () => {
      // subtle highlight animation on the shop section
      const shopSection = document.getElementById('shop');
      if (shopSection) {
        setTimeout(() => shopSection.classList.add('highlighted'), 500);
        setTimeout(() => shopSection.classList.remove('highlighted'), 1500);
      }
    });
  });

  /* ─── SMOOTH SECTION ENTRANCE DELAY ─── */
  // Add stagger delays based on DOM position within the grid
  document.querySelectorAll('.product-grid .product-card, .shop-grid .shop-card, .testimonial-grid .testimonial-card').forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.08 + 's';
  });

  /* ─── INITIAL LOAD ANIMATION ─── */
  document.documentElement.style.opacity = '0';
  window.addEventListener('load', () => {
    document.documentElement.style.transition = 'opacity .5s ease';
    document.documentElement.style.opacity = '1';
  });

})();

/* ═══════════════════════════════════════════════
   PRODUCT COMPARISON SYSTEM
   ═══════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ─── Product Data ─── */
  const PRODUCTS = {
    moringa: {
      name: 'Munagaku (Moringa) Powder',
      tagline: 'The Original Superfood for Gut & Brain',
      price: '₹599',
      weight: '200 g',
      form: 'Powder',
      keyCompound: 'Isothiocyanates · Tryptophan · Iron',
      bestFor: 'Gut + Brain',
      ratings: { brain: 80, gut: 95, stress: 55, immunity: 75 },
      benefits: ['Feeds & diversifies gut microbiome', 'Boosts serotonin precursors', 'Reduces neuroinflammation', 'Natural energy boost'],
      conditions: ['Depression', 'Brain Fog', "Alzheimer's", 'IBS'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg/300px-Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg',
      badge: '⭐ Best Seller',
      cartName: 'Moringa Powder', cartPrice: 599
    },
    dosa: {
      name: 'Munagaku Dosa Batter',
      tagline: 'Moringa-Fortified Breakfast, Ready in Minutes',
      price: '₹349',
      weight: '1 kg (~12 dosas)',
      form: 'Ready-to-Cook',
      keyCompound: 'Moringa · Fermented Rice · Urad Dal',
      bestFor: 'Gut + Kitchen',
      ratings: { brain: 55, gut: 88, stress: 35, immunity: 60 },
      benefits: ['Easiest Moringa delivery format', 'Fermented = natural probiotics', 'Rich in iron, calcium & folate'],
      conditions: ['Metabolic Syndrome', 'Fatigue', 'Gut Health'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Masala_dosa_01.jpg/300px-Masala_dosa_01.jpg',
      badge: '🥘 Ready-to-Cook',
      cartName: 'Munagaku Dosa Batter', cartPrice: 349
    },
    curry: {
      name: 'Curry Leaf Powder',
      tagline: 'Kari Patta — The Forgotten Brain Herb',
      price: '₹299',
      weight: '150 g',
      form: 'Powder',
      keyCompound: 'Mahanimbine · Carbazole alkaloids · Iron',
      bestFor: 'Memory + Blood Sugar',
      ratings: { brain: 85, gut: 70, stress: 40, immunity: 60 },
      benefits: ['Protects memory (AChE inhibitor)', 'Controls blood sugar naturally', 'Iron-rich for brain oxygen'],
      conditions: ["Alzheimer's", 'Type 2 Diabetes', 'Fatigue'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/CURRY_LEAVES_PASTE_AND_POWDER.jpg/300px-CURRY_LEAVES_PASTE_AND_POWDER.jpg',
      badge: '🌿 Traditional Remedy',
      cartName: 'Curry Leaf Powder', cartPrice: 299
    },
    lionsmane: {
      name: "Lion's Mane Mushroom Powder",
      tagline: 'Regrow Your Gut–Brain Connection',
      price: '₹799',
      weight: '150 g',
      form: 'Powder',
      keyCompound: 'Hericenones · Erinacines · Beta-glucans',
      bestFor: 'Brain + Neuroregeneration',
      ratings: { brain: 98, gut: 85, stress: 70, immunity: 80 },
      benefits: ['Stimulates NGF & BDNF', 'Heals gut lining (leaky gut)', 'Reduces anxiety & brain fog', 'Vagus nerve support'],
      conditions: ["Alzheimer's", 'Depression', 'Brain Fog'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Hericium_erinaceus%2CLion%27s_Mane%2C_Hedgehog_Mushroom.jpg/300px-Hericium_erinaceus%2CLion%27s_Mane%2C_Hedgehog_Mushroom.jpg',
      badge: '🧠 Cognitive Focus',
      cartName: "Lion's Mane Powder", cartPrice: 799
    },
    mushblend: {
      name: 'Mushroom Powder (5-Blend)',
      tagline: "Lion's Mane · Reishi · Chaga · Cordyceps · Turkey Tail",
      price: '₹899',
      weight: '150 g',
      form: 'Powder Blend',
      keyCompound: 'Beta-glucans · Polysaccharides · Triterpenoids',
      bestFor: 'Immunity + Full-Spectrum',
      ratings: { brain: 80, gut: 80, stress: 65, immunity: 98 },
      benefits: ['5 mushrooms = full-spectrum', 'Boosts gut-associated immune tissue', 'Neuroprotective beta-glucans'],
      conditions: ['Autoimmune', 'Chronic Fatigue', 'Brain Fog'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Ganoderma_lucidum_01.jpg',
      badge: '🍄 Immunity Blend',
      cartName: 'Mushroom 5-Blend', cartPrice: 899
    },
    coffee: {
      name: 'Mushroom Coffee',
      tagline: 'Coffee That Fuels Your Brain, Not Just Your Morning',
      price: '₹649',
      weight: '200 g (30 cups)',
      form: 'Beverage Blend',
      keyCompound: "Arabica Caffeine · Lion's Mane · Chaga",
      bestFor: 'Focus + Daily Ritual',
      ratings: { brain: 90, gut: 65, stress: 60, immunity: 70 },
      benefits: ["Lion's Mane focus + Chaga immunity", 'Smooth energy, no crash', 'Gut-friendly (no acid spikes)'],
      conditions: ['Brain Fog', 'Anxiety', 'ADHD', 'Fatigue'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Brewing_lion%E2%80%99s_mane_mushroom_tea.jpg/300px-Brewing_lion%E2%80%99s_mane_mushroom_tea.jpg',
      badge: '☕ Daily Ritual',
      cartName: 'Mushroom Coffee', cartPrice: 649
    },
    ashwa: {
      name: 'Ashwagandha Root Powder',
      tagline: 'Calm the Stress–Gut Spiral',
      price: '₹549',
      weight: '200 g',
      form: 'Powder',
      keyCompound: 'Withanolides · Sitoindosides · Alkaloids',
      bestFor: 'Stress + Sleep',
      ratings: { brain: 70, gut: 75, stress: 98, immunity: 60 },
      benefits: ['Lowers cortisol by up to 27% (RCT)', 'Restores gut permeability under stress', 'Improves sleep depth & duration'],
      conditions: ['Depression', 'Anxiety', 'Insomnia', 'IBS'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ashwagandha_Powder_and_Root_on_Spoons_-_50191697031.jpg/300px-Ashwagandha_Powder_and_Root_on_Spoons_-_50191697031.jpg',
      badge: '🌙 Stress & Sleep',
      cartName: 'Ashwagandha Powder', cartPrice: 549
    },
    turmeric: {
      name: 'Turmeric + Black Pepper Blend',
      tagline: 'Seal the Gut. Silence the Inflammation.',
      price: '₹449',
      weight: '200 g',
      form: 'Spice Blend',
      keyCompound: 'Curcumin · Piperine (2000% absorption boost)',
      bestFor: 'Gut + Anti-Inflammation',
      ratings: { brain: 75, gut: 90, stress: 50, immunity: 88 },
      benefits: ['Heals leaky gut lining', 'Inhibits NF-κB pathway', 'Crosses blood-brain barrier'],
      conditions: ["Alzheimer's", "Parkinson's", 'IBS / IBD'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kunyit_Bubuk.jpg/300px-Kunyit_Bubuk.jpg',
      badge: '🔥 Anti-Inflammatory',
      cartName: 'Turmeric Blend', cartPrice: 449
    },
    bundle: {
      name: 'Daily Essentials Bundle',
      tagline: 'Moringa + Lion\'s Mane + Curry Leaf + Mushroom Coffee',
      price: '₹1,799',
      weight: '30-day supply',
      form: 'Bundle (4 products)',
      keyCompound: 'Full-Spectrum Nootropic Stack',
      bestFor: 'Complete Daily Protocol',
      ratings: { brain: 95, gut: 95, stress: 80, immunity: 88 },
      benefits: ['30-day supply of 4 products', 'Usage guide & recipe booklet', 'Save ₹600 vs. buying separately', 'Free express shipping'],
      conditions: ['All conditions', 'Brain Fog', 'Gut Health', 'Stress'],
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg/300px-Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg',
      badge: '🌟 Best Value',
      cartName: 'Daily Essentials Bundle', cartPrice: 1799
    }
  };

  /* ─── State ─── */
  const MAX = 3;
  const selected = [];

  /* ─── DOM refs ─── */
  const compareBar     = document.getElementById('compareBar');
  const compareGoBtn   = document.getElementById('compareGoBtn');
  const compareClearBtn= document.getElementById('compareClearBtn');
  const compareHint    = document.getElementById('compareHint');
  const compareOverlay = document.getElementById('compareOverlay');
  const compareModal   = document.getElementById('compareModal');
  const compareModalBody = document.getElementById('compareModalBody');
  const compareModalClose = document.getElementById('compareModalClose');
  const slots = [
    document.getElementById('cslot0'),
    document.getElementById('cslot1'),
    document.getElementById('cslot2')
  ];

  /* ─── Update slot UI ─── */
  function updateBarUI() {
    const count = selected.length;
    compareBar.classList.toggle('visible', count > 0);
    compareBar.setAttribute('aria-hidden', count === 0);
    compareGoBtn.disabled = count < 2;
    compareHint.textContent =
      count === 0 ? 'Select up to 3 products to compare' :
      count === 1 ? '1 selected — pick at least 1 more' :
      count === MAX ? '3 selected — ready to compare!' :
      `${count} selected — add 1 more or compare now`;

    slots.forEach((slot, i) => {
      const pid = selected[i];
      if (pid) {
        const p = PRODUCTS[pid];
        slot.className = 'compare-slot filled';
        slot.innerHTML = `
          <div class="cslot-name">${p.name.split('(')[0].trim()}</div>
          <button class="cslot-remove" data-pid="${pid}" aria-label="Remove ${p.name}">✕</button>`;
        slot.querySelector('.cslot-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          removeProduct(pid);
        });
      } else {
        slot.className = 'compare-slot empty';
        slot.innerHTML = `<div class="cslot-placeholder">+ Add product</div>`;
      }
    });
  }

  /* ─── Toggle product selection ─── */
  function toggleProduct(pid) {
    const idx = selected.indexOf(pid);
    if (idx > -1) {
      removeProduct(pid);
    } else {
      if (selected.length >= MAX) {
        // Flash the bar
        compareBar.style.animation = 'none';
        setTimeout(() => compareBar.style.animation = '', 10);
        return;
      }
      selected.push(pid);
      document.querySelector(`.product-card[data-pid="${pid}"]`)?.classList.add('in-compare');
      document.querySelectorAll(`.compare-btn[data-pid="${pid}"]`).forEach(b => b.classList.add('selected'));
    }
    updateBarUI();
  }

  function removeProduct(pid) {
    const idx = selected.indexOf(pid);
    if (idx > -1) selected.splice(idx, 1);
    document.querySelector(`.product-card[data-pid="${pid}"]`)?.classList.remove('in-compare');
    document.querySelectorAll(`.compare-btn[data-pid="${pid}"]`).forEach(b => b.classList.remove('selected'));
    updateBarUI();
  }

  function clearAll() {
    selected.slice().forEach(pid => removeProduct(pid));
  }

  /* ─── Wire compare buttons ─── */
  document.querySelectorAll('.compare-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleProduct(btn.dataset.pid));
  });
  compareClearBtn?.addEventListener('click', clearAll);

  /* ─── Build rating bar HTML ─── */
  function ratingBar(val) {
    const cls = val >= 80 ? 'high' : val >= 55 ? 'med' : 'low';
    const label = val >= 80 ? 'High' : val >= 55 ? 'Medium' : 'Low';
    return `<div class="rating-bar-wrap">
      <div class="rating-bar-track">
        <div class="rating-bar-fill ${cls}" style="--bar-pct:${val}%" data-pct="${val}%"></div>
      </div>
      <span class="rating-label" style="color:${val>=80?'var(--clr-green)':val>=55?'var(--clr-amber)':'var(--clr-muted)'}">${label} (${val}/100)</span>
    </div>`;
  }

  /* ─── Render comparison table ─── */
  function renderModal() {
    const prods = selected.map(pid => PRODUCTS[pid]);
    const colCount = prods.length;
    const labelW = 160;

    // Find winners for ratings
    const ratingKeys = ['brain', 'gut', 'stress', 'immunity'];
    const winners = {};
    ratingKeys.forEach(k => {
      const maxVal = Math.max(...prods.map(p => p.ratings[k]));
      winners[k] = prods.findIndex(p => p.ratings[k] === maxVal);
    });
    const cheapestIdx = prods.reduce((best, p, i) =>
      parseInt(p.price.replace(/[₹,]/g,'')) < parseInt(prods[best].price.replace(/[₹,]/g,'')) ? i : best, 0);

    const rows = [
      { key: 'header', type: 'header' },
      { key: 'form',   label: 'Form', type: 'text', fn: p => p.form },
      { key: 'weight', label: 'Weight / Size', type: 'text', fn: p => p.weight },
      { key: 'compound',label: 'Key Compounds', type: 'text', fn: p => `<span style="font-size:.8rem;color:var(--clr-muted)">${p.keyCompound}</span>` },
      { key: 'brain',  label: '🧠 Brain Focus', type: 'rating', fn: (p,i) => ({ val: p.ratings.brain, winner: winners.brain === i }) },
      { key: 'gut',    label: '🌿 Gut Health',  type: 'rating', fn: (p,i) => ({ val: p.ratings.gut,   winner: winners.gut   === i }) },
      { key: 'stress', label: '🌙 Stress Relief',type:'rating', fn: (p,i) => ({ val: p.ratings.stress,winner: winners.stress=== i }) },
      { key: 'immunity',label:'🛡️ Immunity',    type: 'rating', fn: (p,i) => ({ val: p.ratings.immunity, winner: winners.immunity===i }) },
      { key: 'bestfor',label: 'Best For',       type: 'bestfor', fn: p => p.bestFor },
      { key: 'conditions', label: 'Helps With', type: 'conditions', fn: p => p.conditions },
      { key: 'benefits',label: 'Benefits',      type: 'list', fn: p => p.benefits },
      { key: 'price',  label: 'Price', type: 'price', fn: (p,i) => ({ price: p.price, cheap: cheapestIdx === i }) },
      { key: 'cta',    label: '', type: 'cta' },
    ];

    let html = `<table class="compare-table"><colgroup>
      <col style="width:${labelW}px">
      ${prods.map(() => `<col style="width:${Math.floor((100/colCount))}%">`).join('')}
    </colgroup><tbody>`;

    rows.forEach(row => {
      if (row.type === 'header') {
        html += `<tr><td class="compare-row-label" style="background:#fff;border:none"></td>
          ${prods.map(p => `
            <th class="compare-col-header">
              <img class="cth-img" src="${p.img}" alt="${p.name}" referrerpolicy="no-referrer" onerror="this.style.display='none'">
              <div class="cth-badge">${p.badge}</div>
              <div class="cth-name">${p.name}</div>
              <div class="cth-tagline">${p.tagline}</div>
              <div class="cth-price">${p.price}</div>
              <div class="cth-weight">${p.weight}</div>
            </th>`).join('')}
        </tr>`;
        return;
      }
      if (row.type === 'cta') {
        html += `<tr><td class="compare-row-label" style="background:#fff;border:none;border-top:2px solid var(--clr-green-l)"></td>
          ${prods.map(p => `
            <td class="compare-cell" style="background:var(--clr-green-l) !important;border-top:2px solid var(--clr-green-l)">
              <button class="cth-add-btn compare-modal-add-btn" data-name="${p.cartName}" data-price="${p.cartPrice}">
                🛒 Add to Cart
              </button>
            </td>`).join('')}
        </tr>`;
        return;
      }

      html += `<tr><td class="compare-row-label">${row.label}</td>`;
      prods.forEach((p, i) => {
        const result = row.fn(p, i);
        let cellContent = '';
        let extraClass = '';

        if (row.type === 'text') {
          cellContent = result;
        } else if (row.type === 'rating') {
          if (result.winner) extraClass = 'winner';
          cellContent = ratingBar(result.val) + (result.winner ? `<span class="winner-badge">Best</span>` : '');
        } else if (row.type === 'bestfor') {
          cellContent = `<span class="compare-bestfor">${result}</span>`;
        } else if (row.type === 'conditions') {
          cellContent = `<div class="compare-cond-list">${result.map(c => `<span class="compare-cond-pill">${c}</span>`).join('')}</div>`;
        } else if (row.type === 'list') {
          cellContent = `<ul style="text-align:left;padding-left:1rem;font-size:.82rem;color:var(--clr-muted)">${result.map(b => `<li style="margin-bottom:.3rem">${b}</li>`).join('')}</ul>`;
        } else if (row.type === 'price') {
          if (result.cheap) extraClass = 'winner';
          cellContent = `<span style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;color:var(--clr-green)">${result.price}</span>` +
            (result.cheap ? `<span class="winner-badge">Best Value</span>` : '');
        }
        html += `<td class="compare-cell ${extraClass}">${cellContent}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    compareModalBody.innerHTML = html;

    // Animate rating bars after render
    requestAnimationFrame(() => {
      compareModalBody.querySelectorAll('.rating-bar-fill').forEach(bar => {
        setTimeout(() => bar.classList.add('animate'), 100);
      });
    });

    // Wire modal Add to Cart buttons
    compareModalBody.querySelectorAll('.compare-modal-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = +btn.dataset.price;
        // Dispatch to main cart — reuse global cart array & updateCartUI if available
        const existingAddBtn = document.querySelector(`.add-cart-btn[data-product="${name}"]`);
        if (existingAddBtn) {
          existingAddBtn.click();
        }
        btn.textContent = '✓ Added!';
        btn.style.background = 'linear-gradient(135deg,#155534,#0f3d25)';
        setTimeout(() => { btn.innerHTML = '🛒 Add to Cart'; btn.style.background = ''; }, 1800);
      });
    });
  }

  /* ─── Open / Close modal ─── */
  function openModal() {
    renderModal();
    compareOverlay?.classList.add('open');
    compareModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    compareOverlay?.classList.remove('open');
    compareModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  compareGoBtn?.addEventListener('click', openModal);
  compareModalClose?.addEventListener('click', closeModal);
  compareOverlay?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

})();

/* ═══════════════════════════════════════════════
   ROUTINE BUILDER QUIZ
   ═══════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ─── Product data for recommendations ─── */
  const REC_DATA = {
    moringa:  { name: 'Munagaku (Moringa) Powder', price: '₹599', cartPrice: 599, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg/300px-Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg', scores: { brain:3, gut:5, stress:2, immunity:3, kitchen:4, energy:3 }, format: 'powder', level: ['beginner','building','committed'], why: { brain:"Moringa's tryptophan boosts serotonin, clearing mental fog naturally.", gut:'90+ nutrients feed and diversify your gut microbiome daily.', stress:'Prebiotic fibre stabilises blood sugar — keeping mood even.', immunity:'Anti-inflammatory isothiocyanates support whole-body defence.', kitchen:'The easiest superfood to stir into any meal or smoothie.', energy:'Iron and B-vitamins sustain steady energy without crashes.' } },
    dosa:     { name: 'Munagaku Dosa Batter', price: '₹349', cartPrice: 349, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Masala_dosa_01.jpg/300px-Masala_dosa_01.jpg', scores: { brain:2, gut:4, stress:1, immunity:2, kitchen:5, energy:3 }, format: 'readytocook', level: ['beginner','building'], why: { brain:'Moringa in every bite delivers serotonin precursors effortlessly.', gut:'Fermented batter = live probiotics + prebiotic Moringa fibre.', stress:'A nourishing breakfast sets a calm, energised tone for the day.', immunity:'Iron and folate strengthen immune cell production.', kitchen:'Zero extra effort — the healthiest thing you can pour and cook.', energy:'Iron-rich breakfast that lasts all morning without a crash.' } },
    curry:    { name: 'Curry Leaf Powder', price: '₹299', cartPrice: 299, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/CURRY_LEAVES_PASTE_AND_POWDER.jpg/300px-CURRY_LEAVES_PASTE_AND_POWDER.jpg', scores: { brain:5, gut:3, stress:1, immunity:2, kitchen:3, energy:3 }, format: 'powder', level: ['beginner','building','committed'], why: { brain:"Mahanimbine inhibits acetylcholinesterase — the same target as Alzheimer's drugs.", gut:'Alkaloids support healthy bile and gut motility.', stress:'Blood-sugar control reduces cortisol spikes after meals.', immunity:'Iron and antioxidants support immune cell vitality.', kitchen:'Sprinkle on dal, rice, or eggs for instant nootropic uplift.', energy:'Iron and B-vitamins are natural energy carriers in every cell.' } },
    lionsmane:{ name: "Lion's Mane Mushroom Powder", price: '₹799', cartPrice: 799, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Hericium_erinaceus%2CLion%27s_Mane%2C_Hedgehog_Mushroom.jpg/300px-Hericium_erinaceus%2CLion%27s_Mane%2C_Hedgehog_Mushroom.jpg', scores: { brain:5, gut:4, stress:3, immunity:3, kitchen:1, energy:3 }, format: 'powder', level: ['building','committed'], why: { brain:'Hericenones stimulate NGF — literally regrowing your brain connections.', gut:'Heals gut lining and reduces leaky gut at the source.', stress:'Beta-glucans modulate the stress-inflammation axis.', immunity:'Activates gut-associated lymphoid tissue (GALT) defence.', kitchen:'Add to morning coffee, soups, or smoothies for a cognitive edge.', energy:'BDNF upregulation enhances mental clarity and sustained drive.' } },
    mushblend:{ name: 'Mushroom Powder (5-Blend)', price: '₹899', cartPrice: 899, img: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Ganoderma_lucidum_01.jpg', scores: { brain:4, gut:4, stress:3, immunity:5, kitchen:1, energy:4 }, format: 'powder', level: ['building','committed'], why: { brain:"5 mushrooms including Lion's Mane provide broad neuroprotection.", gut:'Beta-glucans and polysaccharides are elite prebiotic fuel.', stress:'Reishi adaptogenic triterpenoids directly lower cortisol.', immunity:'The most complete immune support available in one product.', kitchen:'Add to soups, stews, or coffee for full-spectrum mushroom power.', energy:'Cordyceps increases ATP production for deep, sustained energy.' } },
    coffee:   { name: 'Mushroom Coffee', price: '₹649', cartPrice: 649, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Brewing_lion%E2%80%99s_mane_mushroom_tea.jpg/300px-Brewing_lion%E2%80%99s_mane_mushroom_tea.jpg', scores: { brain:4, gut:2, stress:3, immunity:3, kitchen:2, energy:5 }, format: 'beverage', level: ['beginner','building','committed'], why: { brain:"Lion's Mane + caffeine = clean, sustained cognitive performance.", gut:'Mushroom compounds buffer the acid effects of regular coffee.', stress:'Half the caffeine jitters — calmer energy, all morning.', immunity:"Chaga provides one of nature's richest antioxidant profiles.", kitchen:'Your daily ritual, upgraded with zero extra effort.', energy:'Smooth caffeine curve — no spike, no crash, all focus.' } },
    ashwa:    { name: 'Ashwagandha Root Powder', price: '₹549', cartPrice: 549, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ashwagandha_Powder_and_Root_on_Spoons_-_50191697031.jpg/300px-Ashwagandha_Powder_and_Root_on_Spoons_-_50191697031.jpg', scores: { brain:3, gut:3, stress:5, immunity:2, kitchen:1, energy:3 }, format: 'powder', level: ['beginner','building','committed'], why: { brain:'Cortisol reduction frees brain resources for focus and memory.', gut:'Restores gut permeability that chronic stress destroys.', stress:'Withanolides lower cortisol by up to 27% — proven in clinical trials.', immunity:'HPA axis regulation reduces inflammatory immune overreach.', kitchen:'Dissolves in warm milk or golden latte — an ancient evening ritual.', energy:'Adaptogenic HPA balance gives you steady, resilient energy.' } },
    turmeric: { name: 'Turmeric + Black Pepper Blend', price: '₹449', cartPrice: 449, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kunyit_Bubuk.jpg/300px-Kunyit_Bubuk.jpg', scores: { brain:3, gut:5, stress:2, immunity:4, kitchen:3, energy:2 }, format: 'powder', level: ['beginner','building','committed'], why: { brain:'Curcumin crosses the blood-brain barrier to fight neuroinflammation.', gut:'Heals leaky gut lining — the root cause of gut-brain miscommunication.', stress:'Anti-inflammatory effect reduces the physical toll of chronic stress.', immunity:'NF-κB inhibition is one of the most studied anti-inflammatory pathways.', kitchen:'Sprinkle into curries, rice, or warm milk — no flavour compromise.', energy:'Reducing systemic inflammation restores natural vitality.' } },
    bundle:   { name: 'Daily Essentials Bundle', price: '₹1,799', cartPrice: 1799, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg/300px-Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg', scores: { brain:5, gut:5, stress:4, immunity:4, kitchen:3, energy:4 }, format: 'bundle', level: ['committed'], why: { brain:'4 complementary products stack for full-spectrum cognitive support.', gut:'Moringa, Lion\'s Mane and Turmeric work synergistically on the gut.', stress:'Ashwagandha + Lion\'s Mane address stress from every angle.', immunity:'Mushrooms and Turmeric provide dual-layer immune protection.', kitchen:'30-day supply of 4 products with a full usage guide and recipes.', energy:'Complete protocol delivers sustained energy from every angle.' } }
  };

  /* ─── Scoring keys ─── */
  const CHALLENGE_TO_SCORE = { brain:'brain', gut:'gut', stress:'stress', immunity:'immunity', energy:'energy' };
  const FORMAT_SCORES = { powder: ['moringa','curry','lionsmane','mushblend','ashwa','turmeric'], readytocook:['dosa'], beverage:['coffee'], bundle:['bundle'] };

  /* ─── State ─── */
  let currentStep = 1;
  const TOTAL_STEPS = 4;
  const answers = { goal: null, challenge: null, format: null, level: null };
  let goingBack = false;

  /* ─── DOM ─── */
  const quizOverlay    = document.getElementById('quizOverlay');
  const quizModal      = document.getElementById('quizModal');
  const quizClose      = document.getElementById('quizClose');
  const quizBody       = document.getElementById('quizBody');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizStepLabel  = document.getElementById('quizStepLabel');
  const quizNextBtn    = document.getElementById('quizNextBtn');
  const quizBackBtn    = document.getElementById('quizBackBtn');
  const quizFooter     = document.getElementById('quizFooter');
  const quizDots       = document.querySelectorAll('.quiz-dot');
  const quizRecList    = document.getElementById('quizRecList');
  const quizResultsSub = document.getElementById('quizResultsSub');
  const quizRestartBtn = document.getElementById('quizRestartBtn');

  /* ─── Open / Close ─── */
  function openQuiz() {
    quizOverlay?.classList.add('open');
    quizModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetQuiz();
  }
  function closeQuiz() {
    quizOverlay?.classList.remove('open');
    quizModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('routineOpenBtn')?.addEventListener('click', openQuiz);
  quizClose?.addEventListener('click', closeQuiz);
  quizOverlay?.addEventListener('click', closeQuiz);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuiz(); });

  /* ─── Option selection ─── */
  quizBody?.addEventListener('click', e => {
    const opt = e.target.closest('.quiz-option');
    if (!opt) return;
    const group = opt.closest('.quiz-options');
    const key = group?.dataset.key;
    if (!key) return;
    group.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    answers[key] = opt.dataset.value;
    quizNextBtn.disabled = false;
  });

  /* ─── Navigation ─── */
  function goToStep(step, back = false) {
    const allSteps = quizBody.querySelectorAll('.quiz-step');
    const current = quizBody.querySelector('.quiz-step.active');
    const next = quizBody.querySelector(`.quiz-step[data-step="${step}"]`);
    if (!next) return;
    current?.classList.remove('active');
    next.classList.toggle('slide-back', back);
    next.classList.add('active');
    // Force reflow to re-trigger animation
    void next.offsetWidth;
    currentStep = step;
    updateUI();
  }

  function updateUI() {
    const isResults = currentStep > TOTAL_STEPS;
    const pct = isResults ? 100 : ((currentStep - 1) / TOTAL_STEPS) * 100;
    quizProgressFill.style.width = pct + '%';
    quizStepLabel.textContent = isResults ? 'Your Routine' : `Step ${currentStep} of ${TOTAL_STEPS}`;
    quizBackBtn.disabled = currentStep <= 1;
    quizDots.forEach((d, i) => d.classList.toggle('active', i === currentStep - 1));
    quizFooter.style.display = isResults ? 'none' : '';
    // Reset next btn state based on current answer
    const stepKeys = ['goal','challenge','format','level'];
    const key = stepKeys[currentStep - 1];
    quizNextBtn.disabled = key ? !answers[key] : false;
  }

  quizNextBtn?.addEventListener('click', () => {
    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1, false);
    } else {
      // Compute results
      showResults();
      goToStep(TOTAL_STEPS + 1, false);
    }
  });

  quizBackBtn?.addEventListener('click', () => {
    if (currentStep > 1) goToStep(currentStep - 1, true);
  });

  /* ─── Scoring & recommendation ─── */
  function computeRecommendations() {
    const scoreMap = {};
    Object.keys(REC_DATA).forEach(pid => { scoreMap[pid] = 0; });

    // Weight: goal = 3pts, challenge = 2pts
    const goalKey = answers.goal === 'kitchen' ? 'kitchen' : answers.goal;
    const challengeKey = CHALLENGE_TO_SCORE[answers.challenge] || answers.challenge;

    Object.entries(REC_DATA).forEach(([pid, p]) => {
      scoreMap[pid] += (p.scores[goalKey] || 0) * 3;
      scoreMap[pid] += (p.scores[challengeKey] || 0) * 2;
    });

    // Format bonus: strong preference, +8 points
    if (answers.format && FORMAT_SCORES[answers.format]) {
      FORMAT_SCORES[answers.format].forEach(pid => { scoreMap[pid] += 8; });
    }

    // Level filter: beginner → prefer lower-score products; committed → bundle boost
    if (answers.level === 'committed') {
      scoreMap['bundle'] += 10;
    } else if (answers.level === 'beginner') {
      // Keep top 1-2 affordable
      scoreMap['bundle'] -= 5;
      scoreMap['lionsmane'] -= 2;
      scoreMap['mushblend'] -= 2;
    }

    // Sort descending
    const sorted = Object.entries(scoreMap)
      .sort((a, b) => b[1] - a[1])
      .map(([pid]) => pid);

    // Return top 3, but ensure variety (no duplicates on format if possible)
    const result = [];
    const seenFormats = new Set();
    for (const pid of sorted) {
      if (result.length >= 3) break;
      const fmt = REC_DATA[pid].format;
      // Always include first; for subsequent ones, skip same format unless no choice
      if (result.length === 0 || !seenFormats.has(fmt) || result.length >= 2) {
        result.push(pid);
        seenFormats.add(fmt);
      }
    }
    // Make sure we always have up to 3
    for (const pid of sorted) {
      if (result.length >= 3) break;
      if (!result.includes(pid)) result.push(pid);
    }
    return result.slice(0, 3);
  }

  function showResults() {
    const recs = computeRecommendations();
    const goalLabels = { brain:'sharpen focus & memory', gut:'heal your gut', stress:'reduce stress & sleep better', immunity:'boost immunity', kitchen:'eat healthier naturally' };
    const goalLabel = goalLabels[answers.goal] || 'optimise your health';
    quizResultsSub.textContent = `Based on your answers, here's the personalised herbal routine we've built to help you ${goalLabel}.`;

    const rankLabels = ['#1 Best Match', '#2 Perfect Pairing', '#3 Complete the Stack'];
    quizRecList.innerHTML = recs.map((pid, i) => {
      const p = REC_DATA[pid];
      const whyKey = answers.challenge && REC_DATA[pid].scores[CHALLENGE_TO_SCORE[answers.challenge]] ? CHALLENGE_TO_SCORE[answers.challenge] : answers.goal;
      const why = p.why[whyKey] || p.why[answers.goal] || '';
      const isPrimary = i === 0;
      return `
        <div class="quiz-rec-card${isPrimary ? ' primary' : ''}">
          <img class="quiz-rec-img" src="${p.img}" alt="${p.name}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none'">
          <div class="quiz-rec-info">
            <div class="quiz-rec-rank${isPrimary ? ' primary-rank' : ''}">${rankLabels[i]}</div>
            <div class="quiz-rec-name">${p.name}</div>
            <div class="quiz-rec-why">${why}</div>
            <span class="quiz-rec-price">${p.price}</span>
          </div>
          <button class="quiz-rec-add" data-name="${p.name}" data-price="${p.cartPrice}" aria-label="Add ${p.name} to cart">🛒 Add</button>
        </div>`;
    }).join('');

    // Wire add to cart buttons
    quizRecList.querySelectorAll('.quiz-rec-add').forEach(btn => {
      btn.addEventListener('click', () => {
        // Try to use the main cart system's data
        btn.textContent = '✓ Added!';
        btn.style.background = 'linear-gradient(135deg,#155534,#0f3d25)';
        // Show toast if available
        const toastMsg = document.getElementById('toastMsg');
        const cartToast = document.getElementById('cartToast');
        if (toastMsg && cartToast) {
          toastMsg.textContent = `${btn.dataset.name} added to cart`;
          cartToast.classList.add('show');
          setTimeout(() => cartToast.classList.remove('show'), 3000);
        }
        setTimeout(() => { btn.textContent = '🛒 Add'; btn.style.background = ''; }, 2000);
      });
    });
  }

  /* ─── Restart ─── */
  function resetQuiz() {
    answers.goal = answers.challenge = answers.format = answers.level = null;
    currentStep = 1;
    quizBody.querySelectorAll('.quiz-step').forEach(s => {
      s.classList.remove('active','slide-back');
    });
    quizBody.querySelector('.quiz-step[data-step="1"]').classList.add('active');
    quizBody.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    quizNextBtn.disabled = true;
    updateUI();
    quizFooter.style.display = '';
  }

  quizRestartBtn?.addEventListener('click', resetQuiz);

})();
