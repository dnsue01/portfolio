window.onscroll = function() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0 ) {
        document.getElementById('navbar').classList.add('scrolled');
    } else {
        document.getElementById('navbar').classList.remove('scrolled');
    }
}

// AOS
AOS.init({
    duration: 800,
});

/* LEGO Builder Preloader */
function runLegoPreloader() {
    const preloader    = document.getElementById("preloader");
    const grid         = document.getElementById("lego-grid");
    const progressFill = document.getElementById("lego-progress-fill");
    if (!preloader || !grid) return;

    const COLORS = [
        '#E3000B', '#FFD700', '#006CB7', '#00A650',
        '#FF6B00', '#C4281C', '#FFC700', '#00852B',
        '#3498db', '#e91e63', '#9c27b0', '#FF5722'
    ];
    const COLS  = 6;
    const ROWS  = 4;
    const TOTAL = COLS * ROWS; // 24 bricks
    const DELAY = 30; // ms between each brick

    // Build bricks DOM
    for (let i = 0; i < TOTAL; i++) {
        const brick = document.createElement('div');
        brick.className = 'lego-brick';
        brick.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        grid.appendChild(brick);
    }

    const bricks = grid.querySelectorAll('.lego-brick');

    // Place bricks one by one with bounce
    bricks.forEach((brick, i) => {
        setTimeout(() => {
            brick.classList.add('placed');
            if (progressFill) {
                progressFill.style.width = ((i + 1) / TOTAL * 100) + '%';
            }
        }, i * DELAY);
    });

    // Fade out after all bricks + short pause
    const totalDuration = TOTAL * DELAY + 200;
    setTimeout(() => {
        window.scrollTo(0, 0);
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloading');
        setTimeout(() => { preloader.style.display = 'none'; }, 420);
    }, totalDuration);
}

/* Custom ScrollSpy — includes #companies which lives inside #work */
function initCustomScrollSpy() {
    // Collect all sections + the companies div (nested inside #work)
    const sections  = document.querySelectorAll("section[id], #companies");
    const navLinks  = document.querySelectorAll("#navbar .nav-link");

    function updateActiveLink() {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 180) {
                current = section.getAttribute("id");
            }
        });

        // Hard lock for bottom of page → testimonials
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10) {
            current = "blog";
        }

        navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
}

/* Typewriter / Text Rotation Effect */
class TxtRotate {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  }
  tick() {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    let that = this;
    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function() {
      that.tick();
    }, delta);
  }
}

function initTypewriter(lang = 'en') {
  let elements = document.getElementsByClassName('txt-rotate');
  for (let i=0; i<elements.length; i++) {
    const rotateAttr = lang === 'es' ? 'data-rotate-es' : 'data-rotate';
    let toRotate = elements[i].getAttribute(rotateAttr) || elements[i].getAttribute('data-rotate');
    let period = elements[i].getAttribute('data-period');
    if (toRotate) {
      if (elements[i].typewriter) {
        elements[i].typewriter.toRotate = JSON.parse(toRotate);
        elements[i].typewriter.loopNum = 0;
        elements[i].typewriter.txt = '';
        elements[i].typewriter.isDeleting = false;
      } else {
        elements[i].typewriter = new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
  }
}

/* Draggable Stickers System */
const activeStickers = [];

function initDraggableStickers() {
  const stickersLayer = document.querySelector(".stickers-layer");
  if (!stickersLayer) return;

  const stickersData = [
    { type: 'text', content: '💻 Full Stack', class: 'yellow-sticker', top: '8%', left: '3%' },
    { type: 'text', content: '⚛️ React', class: 'cyan-sticker', top: '16%', left: '82%' },
    { type: 'text', content: '🅰️ Angular', class: 'pink-sticker', top: '23%', left: '5%' },
    { type: 'text', content: '📜 TypeScript', class: 'yellow-sticker', top: '30%', left: '80%' },
    { type: 'text', content: '🚀 Node.js', class: 'cyan-sticker', top: '40%', left: '4%' },
    { type: 'text', content: '🐘 PHP & MySQL', class: 'pink-sticker', top: '48%', left: '84%' },
    { type: 'text', content: '☕ Java & Android', class: 'yellow-sticker', top: '56%', left: '6%' },
    { type: 'text', content: '🎨 CSS3 & SASS', class: 'pink-sticker', top: '64%', left: '85%' },
    { type: 'text', content: '⚙️ C# / .NET', class: 'cyan-sticker', top: '72%', left: '4%' },
    { type: 'text', content: '📊 Grafana & Prometheus', class: 'yellow-sticker', top: '80%', left: '82%' },
    { type: 'text', content: '🖥️ Windows Server', class: 'pink-sticker', top: '87%', left: '8%' },
    { type: 'text', content: '💾 Git & GitHub', class: 'cyan-sticker', top: '93%', left: '80%' }
  ];

  stickersData.forEach((data, index) => {
    const sticker = document.createElement("div");
    sticker.className = `draggable-sticker ${data.class || ''}`;
    
    if (data.type === 'text') {
      sticker.textContent = data.content;
    } else if (data.type === 'image') {
      const img = document.createElement("img");
      img.src = data.content;
      img.alt = "sticker";
      img.style.pointerEvents = "none";
      sticker.appendChild(img);
    }

    // Random rotation between -12 and 12 degrees
    const rot = Math.floor(Math.random() * 24 - 12);
    sticker.style.setProperty('--sticker-rot', `${rot}deg`);

    // Absolute position
    sticker.style.top = data.top;
    sticker.style.left = data.left;

    stickersLayer.appendChild(sticker);
    
    activeStickers.push({
      element: sticker,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.4, // Slow drift
      vy: (Math.random() - 0.5) * 0.4,
      isDragging: false,
      width: 0,
      height: 0
    });

    makeDraggable(sticker);
  });

  setTimeout(() => {
    recalcAndClampStickers();
    requestAnimationFrame(updateStickersPhysics);
  }, 200);

  window.addEventListener("resize", recalcAndClampStickers);
  window.addEventListener("load", recalcAndClampStickers);
}

function getStickersBoundaryHeight() {
  const layer = document.querySelector(".stickers-layer");
  if (layer) {
    return Math.max(layer.offsetHeight, window.innerHeight);
  }
  return Math.max(document.body.offsetHeight, window.innerHeight);
}

function recalcAndClampStickers() {
  const wWidth = document.documentElement.clientWidth;
  const wHeight = getStickersBoundaryHeight();

  activeStickers.forEach(s => {
    s.width = s.element.offsetWidth;
    s.height = s.element.offsetHeight;
    
    let currentX = s.x || s.element.offsetLeft;
    let currentY = s.y || s.element.offsetTop;

    // Clamp coordinates to keep them inside the bounds
    s.x = Math.max(0, Math.min(wWidth - s.width, currentX));
    s.y = Math.max(0, Math.min(wHeight - s.height, currentY));

    if (!s.isDragging) {
      s.element.style.left = `${s.x}px`;
      s.element.style.top = `${s.y}px`;
    }
  });
}

function updateStickersPhysics() {
  const wWidth = document.documentElement.clientWidth;
  const wHeight = getStickersBoundaryHeight();

  activeStickers.forEach(s => {
    if (s.isDragging) {
      s.x = s.element.offsetLeft;
      s.y = s.element.offsetTop;
      return;
    }

    const speed = Math.hypot(s.vx, s.vy);
    const targetSpeed = 0.3; // Gentle cruising speed
    if (speed > targetSpeed) {
      const friction = 0.985; // Decelerate slowly
      s.vx *= friction;
      s.vy *= friction;
    } else if (speed < 0.1) {
      s.vx = (Math.random() - 0.5) * 0.4;
      s.vy = (Math.random() - 0.5) * 0.4;
    }

    s.x += s.vx;
    s.y += s.vy;

    // Bounce horizontally
    if (s.x <= 0) {
      s.x = 0;
      s.vx = Math.abs(s.vx);
    } else if (s.x >= wWidth - s.width) {
      s.x = wWidth - s.width;
      s.vx = -Math.abs(s.vx);
    }

    // Bounce vertically
    if (s.y <= 0) {
      s.y = 0;
      s.vy = Math.abs(s.vy);
    } else if (s.y >= wHeight - s.height) {
      s.y = wHeight - s.height;
      s.vy = -Math.abs(s.vy);
    }

    s.element.style.left = `${s.x}px`;
    s.element.style.top = `${s.y}px`;
  });

  requestAnimationFrame(updateStickersPhysics);
}

function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let dragVx = 0;
  let dragVy = 0;
  let lastMoveTime = 0;
  const stickerState = activeStickers.find(s => s.element === element);

  element.addEventListener("mousedown", dragStart);
  element.addEventListener("touchstart", dragStart, { passive: false });

  function dragStart(e) {
    if (stickerState) {
      stickerState.isDragging = true;
    }

    if (e.type === "touchstart") {
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
    } else {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
    }

    dragVx = 0;
    dragVy = 0;
    lastMoveTime = Date.now();

    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("touchmove", dragMove, { passive: false });
  }

  function dragMove(e) {
    let clientX, clientY;
    if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      e.preventDefault();
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const vx_instant = clientX - pos3;
    const vy_instant = clientY - pos4;

    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;

    lastMoveTime = Date.now();

    // Inertia calculation
    dragVx = dragVx * 0.7 + vx_instant * 0.3;
    dragVy = dragVy * 0.7 + vy_instant * 0.3;

    // Cap velocity
    const maxVel = 15;
    dragVx = Math.max(-maxVel, Math.min(maxVel, dragVx));
    dragVy = Math.max(-maxVel, Math.min(maxVel, dragVy));

    const wWidth = document.documentElement.clientWidth;
    const wHeight = getStickersBoundaryHeight();
    const sWidth = (stickerState && stickerState.width) || element.offsetWidth;
    const sHeight = (stickerState && stickerState.height) || element.offsetHeight;

    let newTop = element.offsetTop - pos2;
    let newLeft = element.offsetLeft - pos1;

    // Clamp inside boundaries
    newLeft = Math.max(0, Math.min(wWidth - sWidth, newLeft));
    newTop = Math.max(0, Math.min(wHeight - sHeight, newTop));

    element.style.top = `${newTop}px`;
    element.style.left = `${newLeft}px`;
  }

  function dragEnd() {
    if (stickerState) {
      stickerState.isDragging = false;
      stickerState.width = element.offsetWidth;
      stickerState.height = element.offsetHeight;

      const timeDiff = Date.now() - lastMoveTime;
      if (timeDiff > 80) {
        stickerState.vx = (Math.random() - 0.5) * 0.4;
        stickerState.vy = (Math.random() - 0.5) * 0.4;
      } else {
        stickerState.vx = dragVx;
        stickerState.vy = dragVy;

        const speed = Math.hypot(dragVx, dragVy);
        if (speed < 0.15) {
          stickerState.vx = (Math.random() - 0.5) * 0.4;
          stickerState.vy = (Math.random() - 0.5) * 0.4;
        }
      }
    }
    document.removeEventListener("mouseup", dragEnd);
    document.removeEventListener("touchend", dragEnd);
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("touchmove", dragMove);
  }
}

/* Language Selection & Translation System */
function initLanguageSelector() {
  const langSelector = document.querySelector('.lang-selector');
  if (!langSelector) return;

  const buttons = langSelector.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('portfolio-lang') || 'en';

  function applyLanguage(lang) {
    // Update html lang attribute for accessibility
    document.documentElement.setAttribute('lang', lang);

    // Translate text attributes (skip txt-rotate - handled separately)
    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.classList.contains('txt-rotate')) return;
      const translation = el.getAttribute(`data-${lang}`);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Translate HTML attributes
    document.querySelectorAll('[data-en-html]').forEach(el => {
      const translation = el.getAttribute(`data-${lang}-html`);
      if (translation) {
        el.innerHTML = translation;
      }
    });

    // Re-initialize/Update typewriter rotating text
    initTypewriter(lang);

    // Toggle active classes on buttons
    buttons.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Persist language selection
    localStorage.setItem('portfolio-lang', lang);
  }

  // Initial language application
  applyLanguage(currentLang);

  // Click bindings
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang !== localStorage.getItem('portfolio-lang')) {
        applyLanguage(selectedLang);
      }
    });
  });
}

/* Run initializations */
document.addEventListener("DOMContentLoaded", () => {
    runLegoPreloader();
    initCustomScrollSpy();
    initLanguageSelector();
    initDraggableStickers();
});