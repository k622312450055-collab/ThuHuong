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
/* --- HOA MẪU ĐƠN STYLE FRAMER --- */
#peony-fixed-container {
  position: fixed;
  bottom: 20px;
  left: 20px; /* Nằm ở góc trái, đối xứng với tu-líp */
  width: 150px; 
  height: 250px;
  z-index: 998;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.peony-plant {
  position: relative;
  width: 100%;
  height: 200px;
}

/* Thân cây */
.peony-stem {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleY(0); /* Ẩn lúc đầu */
  transform-origin: bottom center;
  width: 8px;
  height: 120px;
  background: linear-gradient(to top, #2e7d32, #66bb6a);
  border-radius: 4px;
}

/* Khối nụ/hoa */
.peony-flower {
  position: absolute;
  bottom: 110px; /* Đỉnh thân cây */
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translateX(-50%) scale(0); /* Ẩn lúc đầu */
  transform-origin: center bottom;
  z-index: 5;
}

/* Định dạng chung cánh hoa (Cánh cong, mềm mại) */
.peony-petal {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: auto;
  /* Hình dáng cánh hoa tự nhiên hơi bất đối xứng */
  border-radius: 40% 60% 60% 40% / 50% 50% 50% 50%; 
  box-shadow: inset 5px 5px 15px rgba(255,255,255,0.4), 2px 5px 10px rgba(0,0,0,0.1);
  transition: transform 0.1s linear;
  transform-origin: center center;
}

/* Màu cánh ngoài cùng: Đỏ hồng - Hồng phấn */
.peony-petal.outer {
  width: 110px; height: 110px;
  background: linear-gradient(135deg, rgba(255, 106, 136, 0.9), rgba(255, 153, 172, 0.8));
  backdrop-filter: blur(2px);
}
/* Màu cánh giữa: Hồng đậm - Vàng cam (Tạo ánh sáng rực rỡ) */
.peony-petal.middle {
  width: 85px; height: 85px;
  background: linear-gradient(135deg, rgba(250, 112, 154, 0.95), rgba(254, 225, 64, 0.85));
}
/* Màu lõi hoa: Đỏ san hô */
.peony-petal.center {
  width: 55px; height: 55px;
  background: linear-gradient(135deg, rgba(248, 80, 50, 1), rgba(231, 56, 39, 0.9));
}
