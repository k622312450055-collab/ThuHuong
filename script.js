/* =============================================
   SCRIPT.JS – ANIMATIONS, CANVAS, INTERACTIONS
   ============================================= */

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  mobileMenu.classList.remove('open');
}

/* ---- SMOOTH ACTIVE NAV ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--pink-500)' : '';
  });
});

/* ---- REVEAL ON SCROLL ---- */
const reveals = document.querySelectorAll('.activity-card, .skill-category, .achievement-item, .timeline-item, .contact-card, .about-grid, .teaching-card, .career-card');
reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0) * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el, i) => {
  el.dataset.delay = i % 4;
  revealObserver.observe(el);
});

/* ---- SKILL BARS ANIMATION ---- */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(fill => {
        const pct = fill.dataset.pct;
        fill.style.width = pct + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

/* ================================================================
   CANVAS – BUTTERFLIES & FALLING PETALS
   ================================================================ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* ---- BUTTERFLY CLASS ---- */
class Butterfly {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -60;
    this.size = 18 + Math.random() * 22;
    this.speed = 0.25 + Math.random() * 0.35;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.012;
    this.waveAmp = 40 + Math.random() * 60;
    this.waveFreq = 0.008 + Math.random() * 0.012;
    this.wingPhase = Math.random() * Math.PI * 2;
    this.wingSpeed = 0.06 + Math.random() * 0.06;
    this.opacity = 0.12 + Math.random() * 0.22;
    this.hue = 320 + Math.random() * 40; // pink range
    this.startX = this.x;
    this.t = 0;
    this.driftX = (Math.random() - 0.5) * 0.4;
  }

  update() {
    this.t += 1;
    this.wingPhase += this.wingSpeed;
    this.angle += this.angleSpeed;
    this.x = this.startX + Math.sin(this.t * this.waveFreq) * this.waveAmp + this.driftX * this.t;
    this.y += this.speed;
    if (this.y > canvas.height + 80) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const wingFlap = Math.sin(this.wingPhase);
    const s = this.size;

    // Draw butterfly wings using bezier curves
    const drawWing = (mirror) => {
      ctx.save();
      if (mirror) ctx.scale(-1, 1);

      // Upper wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        s * wingFlap * 1.2, -s * 0.8,
        s * 1.5 * wingFlap, -s * 0.4,
        s * 0.8 * wingFlap, s * 0.3
      );
      ctx.bezierCurveTo(
        s * 0.4 * wingFlap, s * 0.6,
        0, s * 0.3,
        0, 0
      );

      const grad = ctx.createRadialGradient(s * 0.5 * wingFlap, -s * 0.3, 0, s * 0.5 * wingFlap, -s * 0.3, s * 1.2);
      grad.addColorStop(0, `hsla(${this.hue}, 80%, 75%, 0.9)`);
      grad.addColorStop(0.5, `hsla(${this.hue + 15}, 70%, 82%, 0.7)`);
      grad.addColorStop(1, `hsla(${this.hue}, 60%, 90%, 0.2)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Lower wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        s * 0.9 * wingFlap, s * 0.4,
        s * 0.9 * wingFlap, s * 0.9,
        s * 0.2 * wingFlap, s * 0.9
      );
      ctx.bezierCurveTo(
        -s * 0.1, s * 0.8,
        0, s * 0.5,
        0, 0
      );
      const grad2 = ctx.createRadialGradient(s * 0.4 * wingFlap, s * 0.6, 0, s * 0.4 * wingFlap, s * 0.6, s * 0.9);
      grad2.addColorStop(0, `hsla(${this.hue + 20}, 75%, 78%, 0.85)`);
      grad2.addColorStop(1, `hsla(${this.hue}, 65%, 88%, 0.15)`);
      ctx.fillStyle = grad2;
      ctx.fill();

      ctx.restore();
    };

    drawWing(false);
    drawWing(true);

    // Body
    ctx.beginPath();
    ctx.ellipse(0, s * 0.3, 1.5, s * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue - 20}, 60%, 40%, 0.7)`;
    ctx.fill();

    // Antennae
    ctx.strokeStyle = `hsla(${this.hue - 20}, 60%, 40%, 0.5)`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.1);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.8, -s * 0.5, -s * 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.1);
    ctx.quadraticCurveTo(s * 0.3, -s * 0.8, s * 0.5, -s * 0.9);
    ctx.stroke();

    ctx.restore();
  }
}

/* ---- PETAL CLASS ---- */
class Petal {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height * -1 : -40;
    this.size = 7 + Math.random() * 12;
    this.speedY = 0.6 + Math.random() * 1.2;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.04;
    this.swayAmp = 30 + Math.random() * 50;
    this.swayFreq = 0.005 + Math.random() * 0.01;
    this.t = Math.random() * 1000;
    this.isWhite = Math.random() > 0.5; // 50% white, 50% pink
    this.opacity = 0.35 + Math.random() * 0.45;
    this.shape = Math.floor(Math.random() * 3); // 0=round, 1=oval, 2=heart-ish
  }

  update() {
    this.t += 1;
    this.rotation += this.rotationSpeed;
    this.x += this.speedX + Math.sin(this.t * this.swayFreq) * 1.5;
    this.y += this.speedY;
    if (this.y > canvas.height + 50 || this.x < -60 || this.x > canvas.width + 60) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const s = this.size;

    if (this.isWhite) {
      ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
    } else {
      const pinkShade = 75 + Math.random() * 15;
      ctx.fillStyle = `hsla(340, 80%, ${pinkShade}%, 0.9)`;
    }

    ctx.beginPath();

    if (this.shape === 0) {
      // Elliptical petal
      ctx.ellipse(0, 0, s * 0.5, s, Math.PI * 0.1, 0, Math.PI * 2);
    } else if (this.shape === 1) {
      // Rounded diamond petal
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.6, -s * 0.4, s * 0.6, s * 0.4, 0, s);
      ctx.bezierCurveTo(-s * 0.6, s * 0.4, -s * 0.6, -s * 0.4, 0, -s);
    } else {
      // Heart-shaped petal
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.3, -s, -s, 0, -s * 0.5);
      ctx.bezierCurveTo(s, -s, s, -s * 0.3, 0, s * 0.3);
    }

    ctx.fill();

    // Subtle veins on pink petals
    if (!this.isWhite && s > 10) {
      ctx.strokeStyle = `rgba(200, 80, 120, 0.2)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(0, s * 0.8);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/* ---- INITIALIZE PARTICLES ---- */
const NUM_BUTTERFLIES = 7;
const NUM_PETALS = 40;

const butterflies = Array.from({ length: NUM_BUTTERFLIES }, () => new Butterfly());
const petals = Array.from({ length: NUM_PETALS }, () => new Petal());

/* ---- ANIMATION LOOP ---- */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw petals first (behind butterflies)
  petals.forEach(p => { p.update(); p.draw(); });

  // Draw butterflies
  butterflies.forEach(b => { b.update(); b.draw(); });

  requestAnimationFrame(animate);
}
animate();

/* ---- HERO PHOTO FALLBACK ---- */
const heroPhoto = document.getElementById('heroPhoto');
const heroInitials = document.getElementById('heroInitials');
if (heroPhoto && heroPhoto.complete && heroPhoto.naturalHeight === 0) {
  heroPhoto.style.display = 'none';
  heroInitials.style.display = 'flex';
}

/* ---- CURSOR SPARKLE on CLICK ---- */
document.addEventListener('click', (e) => {
  for (let i = 0; i < 6; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 8px;
      height: 8px;
      background: hsl(${330 + Math.random() * 40}, 80%, 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: sparkle-out 0.6s ease forwards;
    `;
    document.body.appendChild(sparkle);

    const angle = (i / 6) * Math.PI * 2;
    const dist = 30 + Math.random() * 30;
    sparkle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    sparkle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    setTimeout(() => sparkle.remove(), 650);
  }
});

// Inject sparkle keyframes
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes sparkle-out {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); }
  }
`;
document.head.appendChild(styleEl);

/* ---- TILT EFFECT ON CARDS ---- */
document.querySelectorAll('.activity-card, .skill-category, .contact-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all var(--transition)';
  });
});

/* ---- TYPING EFFECT ON HERO ROLE ---- */
const roleEl = document.querySelector('.hero-role');
if (roleEl) {
  const originalHTML = roleEl.innerHTML;
  roleEl.style.minHeight = roleEl.offsetHeight + 'px';
  // Just fade in after delay for elegance
  roleEl.style.opacity = '0';
  roleEl.style.transition = 'opacity 1s ease 0.5s';
  setTimeout(() => { roleEl.style.opacity = '1'; }, 300);
}
// Thêm hiệu ứng hoa tu-líp nở theo dòng cuộn
window.addEventListener('scroll', () => {
    // 1. Lấy độ cao đã cuộn hiện tại của trang
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 2. Lấy tổng độ cao có thể cuộn của cả trang
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // 3. Tính phần trăm đã cuộn (từ 0 đến 1)
    let scrollPercentage = 0;
    if (totalHeight > 0) {
        scrollPercentage = scrollTop / totalHeight;
    }

    // 4. Định nghĩa góc nở tối đa (ví dụ 50 độ)
    const maxBloomAngle = 50;

    // 5. Tính toán góc xoay dựa trên phần trăm (0% -> -10 độ, 100% -> -60 độ)
    const leftRotation = -10 - (scrollPercentage * maxBloomAngle);
    const rightRotation = 10 + (scrollPercentage * maxBloomAngle);

    // 6. Áp dụng góc xoay vào các cánh hoa
    const leftPetal = document.querySelector('.left-petal');
    const rightPetal = document.querySelector('.right-petal');

    if (leftPetal && rightPetal) {
        leftPetal.style.transform = `rotate(${leftRotation}deg)`;
        rightPetal.style.transform = `rotate(${rightRotation}deg)`;
    }
});
