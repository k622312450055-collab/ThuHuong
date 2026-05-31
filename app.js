document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     1. CANVAS ANIMATIONS: Petals + Butterflies
  ══════════════════════════════════════════ */
  const canvas = document.getElementById('animCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PETAL_COLORS = [
      'rgba(255,182,217,VAL)', // pink
      'rgba(255,214,232,VAL)', // light pink
      'rgba(255,255,255,VAL)', // white
      'rgba(255,240,246,VAL)', // pale pink
      'rgba(255,148,199,VAL)', // medium pink
    ];

    class Petal {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x   = Math.random() * W;
        this.y   = initial ? Math.random() * H * 2 - H : -60;
        this.r   = 6 + Math.random() * 10;          
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.vx  = (Math.random() - 0.5) * 0.8;     
        this.vy  = 0.6 + Math.random() * 1.2;        
        this.sway    = Math.random() * Math.PI * 2;
        this.swayAmp = 0.4 + Math.random() * 0.8;
        this.swaySpd = 0.015 + Math.random() * 0.015;
        const col = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        const alpha = 0.55 + Math.random() * 0.35;
        this.color = col.replace('VAL', alpha.toFixed(2));
        this.strokeColor = col.replace('VAL', (alpha * 0.5).toFixed(2));
        this.shape = Math.floor(Math.random() * 3);
      }
      update() {
        this.sway += this.swaySpd;
        this.x   += this.vx + Math.sin(this.sway) * this.swayAmp;
        this.y   += this.vy;
        this.rot += this.rotSpeed;
        if (this.y > H + 80 || this.x < -100 || this.x > W + 100) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle   = this.color;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth   = 0.8;

        if (this.shape === 0) {
          ctx.beginPath();
          ctx.ellipse(0, 0, this.r * 0.6, this.r, 0, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
        } else if (this.shape === 1) {
          ctx.beginPath();
          ctx.moveTo(0, -this.r);
          ctx.bezierCurveTo(this.r * 0.7, -this.r * 0.4, this.r * 0.7, this.r * 0.4, 0, this.r);
          ctx.bezierCurveTo(-this.r * 0.7, this.r * 0.4, -this.r * 0.7, -this.r * 0.4, 0, -this.r);
          ctx.fill(); ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, this.r * 0.5, this.r * 0.85, 0, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.35)';
          ctx.beginPath();
          ctx.ellipse(0, -this.r * 0.55, this.r * 0.18, this.r * 0.18, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    class Butterfly {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.scale   = 0.45 + Math.random() * 0.65;
        this.speed   = 0.55 + Math.random() * 0.55;
        this.flapT   = Math.random() * Math.PI * 2;
        this.flapSpd = 0.09 + Math.random() * 0.08;
        this.life    = 0;
        this.maxLife = 900 + Math.random() * 700;

        const goRight = Math.random() > 0.5;
        if (goRight) {
          this.x = initial ? Math.random() * W : -60;
          this.baseAngle = (Math.random() - 0.5) * 0.4; 
        } else {
          this.x = initial ? Math.random() * W : W + 60;
          this.baseAngle = Math.PI + (Math.random() - 0.5) * 0.4; 
        }
        this.y      = initial ? Math.random() * H : 60 + Math.random() * (H - 120);
        this.angle  = this.baseAngle;
        this.swayT   = Math.random() * Math.PI * 2;
        this.swayAmp = 0.22 + Math.random() * 0.18;   
        this.swaySpd = 0.018 + Math.random() * 0.014; 
        const hue = 315 + Math.floor(Math.random() * 50);
        const sat = 52 + Math.floor(Math.random() * 28);
        const lit = 68 + Math.floor(Math.random() * 18);
        this.colorWing = `hsla(${hue},${sat}%,${lit}%,0.72)`;
        this.colorEdge = `hsla(${hue},${sat+10}%,${lit-18}%,0.5)`;
        this.colorBody = `hsla(${hue+8},${sat}%,${lit-22}%,0.85)`;
      }
      update() {
        this.life++;
        if (this.life > this.maxLife) { this.reset(); return; }
        this.flapT += this.flapSpd;
        this.swayT += this.swaySpd;
        this.angle = this.baseAngle + Math.sin(this.swayT) * this.swayAmp;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x < -120 || this.x > W + 120 || this.y < -120 || this.y > H + 120) this.reset();
      }
      draw() {
        const s = this.scale;
        const flapOpen = Math.abs(Math.sin(this.flapT));
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);

        // LEFT wings 
        ctx.save();
        ctx.scale(flapOpen, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-22*s, -18*s, -36*s, -4*s, -28*s, 14*s);
        ctx.bezierCurveTo(-18*s,  26*s,  -4*s,  18*s,  0,    0);
        ctx.fillStyle = this.colorWing;
        ctx.fill();
        ctx.strokeStyle = this.colorEdge;
        ctx.lineWidth = 0.7 * s;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-18*s, 8*s, -26*s, 22*s, -14*s, 28*s);
        ctx.bezierCurveTo( -4*s, 32*s,   0,   20*s,   0,    0);
        ctx.fillStyle = this.colorWing;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // RIGHT wings 
        ctx.save();
        ctx.scale(flapOpen, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(22*s, -18*s, 36*s, -4*s, 28*s, 14*s);
        ctx.bezierCurveTo(18*s,  26*s,  4*s,  18*s,  0,    0);
        ctx.fillStyle = this.colorWing;
        ctx.fill();
        ctx.strokeStyle = this.colorEdge;
        ctx.lineWidth = 0.7 * s;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(18*s, 8*s, 26*s, 22*s, 14*s, 28*s);
        ctx.bezierCurveTo( 4*s, 32*s,  0,   20*s,  0,    0);
        ctx.fillStyle = this.colorWing;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Body 
        ctx.beginPath();
        ctx.ellipse(0, 6*s, 2*s, 10*s, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBody;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -4*s, 3*s, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBody;
        ctx.fill();
        ctx.strokeStyle = this.colorBody;
        ctx.lineWidth = 0.8 * s;
        ctx.beginPath();
        ctx.moveTo(0, -6*s);
        ctx.bezierCurveTo(-5*s, -14*s, -8*s, -18*s, -10*s, -21*s);
        ctx.moveTo(0, -6*s);
        ctx.bezierCurveTo( 5*s, -14*s,  8*s, -18*s,  10*s, -21*s);
        ctx.stroke();
        ctx.fillStyle = this.colorEdge;
        ctx.beginPath();
        ctx.arc(-10*s, -21*s, 2*s, 0, Math.PI * 2);
        ctx.arc( 10*s, -21*s, 2*s, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const PETAL_COUNT     = 55;
    const BUTTERFLY_COUNT = 8;
    const petals      = Array.from({ length: PETAL_COUNT },      () => new Petal());
    const butterflies = Array.from({ length: BUTTERFLY_COUNT }, () => new Butterfly());

    function animate() {
      ctx.clearRect(0, 0, W, H);
      butterflies.forEach(b => { b.update(); b.draw(); });
      petals.forEach(p      => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ══════════════════════════════════════════
     2. NAVBAR & MOBILE MENU
  ══════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mm-link').forEach(l => {
    l.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ══════════════════════════════════════════
     3. SCROLL REVEAL (Kết hợp Staggering)
  ══════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-card');
  const revealObs = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        
        // Tạo độ trễ lần lượt nếu phần tử nằm trong các danh sách
        if (parent && (parent.classList.contains('cards-grid') || parent.classList.contains('ach-grid') || parent.classList.contains('about-stats') || parent.classList.contains('info-strip'))) {
           const siblings = [...parent.children].filter(el => el.classList.contains('reveal') || el.classList.contains('reveal-card'));
           const idx = siblings.indexOf(entry.target);
           setTimeout(() => {
             entry.target.classList.add('active'); // Thêm class active
           }, idx * 100);
        } else {
           entry.target.classList.add('active');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObs.observe(el));

  /* ══════════════════════════════════════════
     4. TILT EFFECT 3D CHO CÁC THẺ (CARDS)
  ══════════════════════════════════════════ */
  const cards = document.querySelectorAll('.exp-card, .edu-card, .ach-card, .stat-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'none'; 
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease';
    });
  });

  /* ══════════════════════════════════════════
     5. CONTACT FORM & ACTIVE NAV LINK
  ══════════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const msg = document.getElementById('formSuccess');
        btn.textContent = 'Sending…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '✓ Sent!';
          btn.style.background = 'linear-gradient(135deg,#a8d8a8,#7bba7b)';
          msg.style.display = 'block';
          contactForm.reset();
        }, 1200);
      });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a, .mm-link');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinksAll.forEach(link => {
          link.style.fontWeight = link.getAttribute('href') === id ? '700' : '500';
          link.style.color = link.getAttribute('href') === id ? 'var(--pink-500)' : ''; // Đổi sang màu bạn muốn
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));

});
