/* Identity — the octopus, drawn in code on a canvas.
   Eight arms sway, curl at the tips and reach toward the pointer. Colours are set
   from outside (setColors) so the page can "camouflage" it into a client's palette.
   Usage: const o = new Octopus(canvas, { cx, cy, size, fan, len, reach, tilt }); o.grow = 0..1
   o.follow(el) makes it reach for an element instead of the pointer (null to let go). */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const N = 46; // segments per arm
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const mix = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));

  function toRgb(c) {
    if (Array.isArray(c)) return c;
    const h = c.replace('#', '');
    const n = parseInt(h.length === 3 ? h.replace(/./g, (x) => x + x) : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // Seeded random: every load (and every instance with the same seed) gets the same octopus.
  function rng(seed) {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  // Mantle (the head), in body units; the arms meet at (0, 0).
  const MANTLE = new Path2D(
    'M-.12 .03 C-.2 -.05 -.235 -.2 -.205 -.33 C-.17 -.48 -.07 -.56 .03 -.56 ' +
    'C.15 -.56 .235 -.46 .225 -.32 C.215 -.18 .175 -.05 .12 .03 C.07 .085 -.07 .085 -.12 .03Z'
  );

  class Octopus {
    constructor(canvas, opts = {}) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign(
        { cx: 0.5, cy: 0.5, size: 0.4, fan: [Math.PI * 1.08, -Math.PI * 0.08], len: 1, reach: 1, tilt: 0.14, sway: 1, bend: 0, seed: 11 },
        opts
      );
      this.motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.grow = 1;
      this.t = 1.7;
      this.blink = 0;
      this.nextBlink = 2.5;
      this.visible = true;
      this.ptr = { x: 0, y: 0, k: 0, set: false };
      this.aim = { x: 0, y: 0, k: 0 };
      this.lock = null;
      this.setColors('#2c1736', '#ecdfc6');
      this.build();
      this.resize();
      new ResizeObserver(() => this.resize()).observe(canvas);
      new IntersectionObserver(([e]) => (this.visible = e.isIntersecting), { rootMargin: '120px' }).observe(canvas);
      addEventListener('pointermove', (e) => this.point(e), { passive: true });
      document.addEventListener('pointerleave', () => (this.aim.k = 0));
      this.prev = performance.now();
      this.tick = this.tick.bind(this);
      requestAnimationFrame(this.tick);
    }

    setColors(body, line) {
      this.body = toRgb(body);
      this.line = toRgb(line);
      this.bodyLight = mix(this.body, this.line, 0.16);
      this.bodyDark = mix(this.body, [0, 0, 0], 0.35);
    }

    build() {
      const r = rng(this.o.seed);
      const [a0, a1] = this.o.fan;
      this.arms = Array.from({ length: 8 }, (_, i) => {
        const f = i / 7;
        const outer = Math.abs(f - 0.5) * 2; // 0 = middle arm, 1 = outermost
        return {
          dir: lerp(a0, a1, f) + (r() - 0.5) * 0.14,
          len: this.o.len * (0.95 + outer * 0.4 + r() * 0.18),
          w: 0.082 + (1 - outer) * 0.016,
          curl: (f < 0.5 ? 1 : -1) * (1.7 + r() * 1.1), // arms curl outward
          phase: r() * TAU,
          speed: 1.1 + r() * 0.7,
          order: Math.abs(f - 0.5),
        };
      }).sort((a, b) => b.order - a.order); // outer arms are drawn first (behind)
      this.spots = Array.from({ length: 30 }, () => [lerp(-0.16, 0.18, r()), lerp(-0.5, -0.06, r()), 0.006 + r() * 0.012]);
    }

    resize() {
      // layout size, not the projected one: the canvas may sit inside a 3D stage
      this.w = this.c.clientWidth;
      this.h = this.c.clientHeight;
      this.dpr = Math.min(devicePixelRatio || 1, 2);
      this.c.width = Math.max(1, Math.round(this.w * this.dpr));
      this.c.height = Math.max(1, Math.round(this.h * this.dpr));
    }

    follow(el) {
      this.lock = el;
      if (!el) this.aim.k = 0;
    }

    point(e) {
      if (this.lock) return;
      const b = this.c.getBoundingClientRect();
      if (!b.width) return;
      this.aim.x = (e.clientX - b.left) * (this.w / b.width);
      this.aim.y = (e.clientY - b.top) * (this.h / b.height);
      const m = 0.2;
      const near =
        e.clientX > b.left - b.width * m && e.clientX < b.right + b.width * m &&
        e.clientY > b.top - b.height * m && e.clientY < b.bottom + b.height * m;
      this.aim.k = near && e.pointerType !== 'touch' ? 1 : 0;
      if (!this.ptr.set) Object.assign(this.ptr, { x: this.aim.x, y: this.aim.y, set: true });
    }

    tick(now) {
      requestAnimationFrame(this.tick);
      const dt = Math.min(0.05, (now - this.prev) / 1000);
      this.prev = now;
      if (!this.visible) return;
      if (this.motion) {
        this.t += dt;
        this.nextBlink -= dt;
        if (this.nextBlink < 0) {
          this.blink = 1;
          this.nextBlink = 2.5 + Math.random() * 4;
        }
        this.blink = Math.max(0, this.blink - dt * 5);
      }
      const p = this.ptr, a = this.aim;
      if (this.lock) {
        const b = this.c.getBoundingClientRect(), r = this.lock.getBoundingClientRect();
        if (b.width) {
          a.x = (r.left + r.width / 2 - b.left) * (this.w / b.width);
          a.y = (r.top + r.height / 2 - b.top) * (this.h / b.height);
          a.k = 1;
        }
      }
      p.x += (a.x - p.x) * 0.08;
      p.y += (a.y - p.y) * 0.08;
      p.k += (a.k - p.k) * 0.04;
      this.draw();
    }

    draw() {
      const { ctx, o, t } = this;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.w, this.h);
      if (this.grow <= 0) return;
      const u = Math.min(this.w, this.h) * o.size;
      const lean = this.ptr.k * clamp((this.ptr.x - this.w * o.cx) / this.w, -0.5, 0.5);
      const tilt = o.tilt + Math.sin(t * 0.45) * 0.04 + lean * 0.14;
      const ox = this.w * o.cx;
      const oy = this.h * o.cy + Math.sin(t * 0.9) * u * 0.015;
      ctx.translate(ox, oy);
      ctx.rotate(tilt);
      // pointer in the octopus's own (tilted) frame
      const dx = this.ptr.x - ox, dy = this.ptr.y - oy;
      const c = Math.cos(-tilt), s = Math.sin(-tilt);
      const P = { x: dx * c - dy * s, y: dx * s + dy * c, k: this.motion ? this.ptr.k : 0 };
      const g = this.grow;
      for (const arm of this.arms) this.drawArm(arm, u, P, clamp((g - 0.1 - arm.order * 0.25) / 0.6));
      const m = smooth(clamp(g * 2.2));
      if (m > 0) this.drawMantle(u * m, P);
    }

    drawArm(arm, u, P, g) {
      if (g <= 0) return;
      const { ctx, t } = this;
      const ge = smooth(g);
      const rx = Math.cos(arm.dir) * u * 0.12, ry = Math.sin(arm.dir) * u * 0.05 + u * 0.01;

      // Arms already facing the pointer uncurl and steer toward it.
      const toP = Math.atan2(P.y - ry, P.x - rx);
      const dist = Math.hypot(P.x - rx, P.y - ry) / u;
      const reach = Math.max(0, Math.cos(wrap(toP - arm.dir))) ** 3 * P.k * this.o.reach * clamp(1.5 - dist / 2.4, 0.2, 1);

      const seg0 = ((arm.len * u) / (N * 0.75)) * lerp(0.1, 1, ge);
      // while growing, the arm is wound up tight and unfurls
      const curl = arm.curl * lerp(4.5, 1, ge) * (1 + 0.12 * Math.sin(t * 0.8 + arm.phase)) * (1 - reach * 0.85);
      const pts = [];
      let x = rx, y = ry, th = arm.dir;
      for (let k = 0; k <= N; k++) {
        const f = k / N;
        pts.push(x, y, th, (u * arm.w * Math.pow(1 - f, 0.85) + 0.6) * lerp(0.5, 1, ge));
        th += curl * (Math.pow(f, 2.4) * 0.16 + this.o.bend) + Math.sin(t * arm.speed - k * 0.21 + arm.phase) * 0.032 * this.o.sway * (0.35 + f);
        if (reach > 0.01) {
          const d = Math.hypot(P.x - x, P.y - y);
          th += wrap(Math.atan2(P.y - y, P.x - x) - th) * reach * 0.09 * clamp(d / (u * 0.25));
        }
        const sl = seg0 * (1 - 0.5 * f);
        x += Math.cos(th) * sl;
        y += Math.sin(th) * sl;
      }

      // a line running along the arm at `off` (-1..1 of the half width)
      const rail = (off, from, to) => {
        ctx.beginPath();
        for (let k = from; k <= to; k++) {
          const i = k * 4, w = (pts[i + 3] / 2) * off, a = pts[i + 2];
          const px = pts[i] - Math.sin(a) * w, py = pts[i + 1] + Math.cos(a) * w;
          k === from ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
      };

      ctx.globalAlpha = clamp(g * 4);
      rail(1, 0, N);
      for (let k = N; k >= 0; k--) {
        const i = k * 4, w = pts[i + 3] / 2, a = pts[i + 2];
        ctx.lineTo(pts[i] + Math.sin(a) * w, pts[i + 1] - Math.cos(a) * w);
      }
      ctx.closePath();
      ctx.fillStyle = rgba(this.body);
      ctx.fill();
      const lw = Math.max(0.6, u * 0.0035);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = lw * 1.3;
      ctx.strokeStyle = rgba(this.line, 0.5);
      ctx.stroke();

      // engraving: a lit edge, a contour line and a dotted one
      const side = Math.sign(arm.curl); // suckers sit on the inside of the curl
      rail(-side * 0.55, 1, N - 4);
      ctx.lineWidth = lw * 1.6;
      ctx.strokeStyle = rgba(this.line, 0.8);
      ctx.stroke();
      rail(-side * 0.1, 2, N - 8);
      ctx.lineWidth = lw;
      ctx.strokeStyle = rgba(this.line, 0.28);
      ctx.stroke();
      ctx.setLineDash([lw * 2, lw * 3]);
      rail(side * 0.22, 3, N - 10);
      ctx.strokeStyle = rgba(this.line, 0.22);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let k = 4; k < N - 1; k += 2) {
        const i = k * 4, w = pts[i + 3] / 2, rs = w * 0.36;
        if (rs < 0.9) break;
        const a = pts[i + 2], off = w * 0.62 * side;
        const sx = pts[i] - Math.sin(a) * off, sy = pts[i + 1] + Math.cos(a) * off;
        ctx.beginPath();
        ctx.ellipse(sx, sy, rs, rs * 0.8, a, 0, TAU);
        ctx.fillStyle = rgba(this.bodyLight);
        ctx.fill();
        ctx.lineWidth = Math.max(0.5, rs * 0.28);
        ctx.strokeStyle = rgba(this.line, 0.65);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx, sy, rs * 0.32, 0, TAU);
        ctx.fillStyle = rgba(this.line, 0.3);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    drawMantle(k, P) {
      const { ctx, t } = this;
      const br = Math.sin(t * 1.3) * 0.022; // breathing
      ctx.save();
      ctx.scale(k * (1 - br * 0.5), k * (1 + br));
      const px = 1 / k; // one css pixel in body units

      ctx.fillStyle = rgba(this.body);
      ctx.fill(MANTLE);
      ctx.save();
      ctx.clip(MANTLE);
      ctx.lineWidth = px;
      ctx.strokeStyle = rgba(this.line, 0.16);
      for (let j = 0; j < 7; j++) {
        ctx.beginPath();
        ctx.ellipse(0.03, -0.26, 0.2 - j * 0.016, 0.29 - j * 0.016, 0, Math.PI * 0.55, Math.PI * 1.35);
        ctx.stroke();
      }
      ctx.lineWidth = 2.4 * px;
      ctx.strokeStyle = rgba(this.line, 0.65);
      ctx.beginPath();
      ctx.ellipse(0.04, -0.29, 0.14, 0.2, 0, -Math.PI * 0.5, -Math.PI * 0.02);
      ctx.stroke();
      ctx.lineWidth = px;
      ctx.strokeStyle = rgba(this.line, 0.3);
      ctx.beginPath();
      ctx.ellipse(0.04, -0.29, 0.11, 0.17, 0, -Math.PI * 0.45, -Math.PI * 0.08);
      ctx.stroke();
      ctx.strokeStyle = rgba(this.line, 0.2);
      for (const [x, y, r] of this.spots) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
      ctx.lineWidth = 1.5 * px;
      ctx.strokeStyle = rgba(this.line, 0.78);
      ctx.stroke(MANTLE);

      const open = 1 - Math.sin(this.blink * Math.PI);
      for (const [ex, ey, er] of [[0.165, -0.065, 0.056], [-0.16, -0.055, 0.046]]) {
        ctx.lineWidth = 1.3 * px;
        ctx.strokeStyle = rgba(this.line, 0.55);
        ctx.beginPath();
        ctx.arc(ex, ey, er * 1.3, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ex, ey, er, 0, TAU);
        ctx.fillStyle = rgba(this.body);
        ctx.fill();
        ctx.strokeStyle = rgba(this.line, 0.8);
        ctx.stroke();
        ctx.save();
        ctx.translate(ex, ey);
        ctx.scale(1, Math.max(0.08, open));
        ctx.beginPath();
        ctx.arc(0, 0, er * 0.66, 0, TAU);
        ctx.fillStyle = rgba(this.line);
        ctx.fill();
        // the pupil is a bar, like a real octopus, and looks at the pointer
        let lx = P.x / k - ex, ly = P.y / k - ey;
        const d = Math.hypot(lx, ly) || 1, look = er * 0.2 * this.ptr.k;
        lx = (lx / d) * look;
        ly = (ly / d) * look;
        ctx.beginPath();
        ctx.ellipse(lx, ly, er * 0.42, er * 0.14, 0, 0, TAU);
        ctx.fillStyle = rgba(this.bodyDark);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  }

  window.Octopus = Octopus;
})();
