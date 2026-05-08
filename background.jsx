/* global React */
const { useEffect, useRef } = React;

function EnergyField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let raf;
    let particles = [];
    let lines = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      const count = Math.min(120, Math.floor((w * h) / 18000));
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.3,
        hue: Math.random() < 0.55 ? "spectral" : "phantom",
        a: Math.random() * 0.7 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
      }));
      // long energy filament lines
      lines = new Array(3).fill(0).map(() => makeLine());
    }

    function makeLine() {
      const startSide = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      if (startSide === 0) { x = Math.random() * w; y = -20; vx = (Math.random() - 0.5) * 0.4; vy = 0.3 + Math.random() * 0.3; }
      else if (startSide === 1) { x = w + 20; y = Math.random() * h; vx = -(0.3 + Math.random() * 0.3); vy = (Math.random() - 0.5) * 0.4; }
      else if (startSide === 2) { x = Math.random() * w; y = h + 20; vx = (Math.random() - 0.5) * 0.4; vy = -(0.3 + Math.random() * 0.3); }
      else { x = -20; y = Math.random() * h; vx = 0.3 + Math.random() * 0.3; vy = (Math.random() - 0.5) * 0.4; }
      return {
        points: [{ x, y }],
        vx, vy,
        max: 80 + Math.floor(Math.random() * 60),
        hue: Math.random() < 0.5 ? "spectral" : "phantom",
        born: performance.now(),
      };
    }

    let t = 0;
    function frame() {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);

      // soft mouse aura
      const m = mouseRef.current;
      if (m.active) {
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 220);
        grad.addColorStop(0, "rgba(179, 136, 255, 0.10)");
        grad.addColorStop(0.5, "rgba(77, 208, 225, 0.04)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // mouse repulsion
        if (m.active) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22500) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 150) * 0.6;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }

        p.twinkle += 0.04;
        const tw = (Math.sin(p.twinkle) + 1) / 2;
        const alpha = p.a * (0.5 + tw * 0.5);
        const color = p.hue === "spectral" ? "77, 208, 225" : "179, 136, 255";
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // halo
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.08})`;
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // filament lines
      for (let i = lines.length - 1; i >= 0; i--) {
        const ln = lines[i];
        const last = ln.points[ln.points.length - 1];
        const drift = Math.sin(t * 2 + i) * 0.4;
        const nx = last.x + ln.vx + drift;
        const ny = last.y + ln.vy + Math.cos(t * 2 + i) * 0.4;
        ln.points.push({ x: nx, y: ny });
        if (ln.points.length > ln.max) ln.points.shift();

        if (
          last.x < -50 || last.x > w + 50 ||
          last.y < -50 || last.y > h + 50
        ) {
          if (ln.points.length > ln.max - 4) {
            lines[i] = makeLine();
            continue;
          }
        }

        const color = ln.hue === "spectral" ? "77, 208, 225" : "179, 136, 255";
        for (let j = 1; j < ln.points.length; j++) {
          const a = (j / ln.points.length) * 0.45;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${color}, ${a})`;
          ctx.lineWidth = (j / ln.points.length) * 1.2;
          ctx.moveTo(ln.points[j - 1].x, ln.points[j - 1].y);
          ctx.lineTo(ln.points[j].x, ln.points[j].y);
          ctx.stroke();
        }
        // glowing head
        const head = ln.points[ln.points.length - 1];
        const grad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
        grad.addColorStop(0, `rgba(${color}, 0.7)`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    }
    function onLeave() { mouseRef.current.active = false; }
    function onResize() { resize(); }

    init();
    frame();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}

function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let dx = mx, dy = my;
    let raf;
    const ring = ringRef.current;
    const dot = dotRef.current;

    function onMove(e) {
      mx = e.clientX; my = e.clientY;
      const target = e.target;
      if (!target) return;
      const interactive = target.closest("a, button, .game-card, .op-card, .scrapling-cell, .role-item, .pillar, .devlog-item, .link-row, input, .role-cta");
      ring.classList.toggle("hover", !!interactive);
    }
    function onDown() { ring.classList.add("click"); }
    function onUp() { ring.classList.remove("click"); }

    function tick() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }
    tick();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring"></div>
      <div ref={dotRef} className="cursor-dot"></div>
    </>
  );
}

function IntroOverlay() {
  const [done, setDone] = React.useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 3600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={"intro-overlay" + (done ? " done" : "")}>
      <div className="intro-rings">
        {[420, 540, 680, 820].map((s, i) => (
          <div
            key={i}
            className="intro-ring"
            style={{
              width: s, height: s,
              borderColor: i % 2 === 0 ? "rgba(77, 208, 225, 0.3)" : "rgba(179, 136, 255, 0.3)",
              animation: `introRing 2.6s var(--ease-cinema) ${0.2 + i * 0.18}s forwards`,
            }}
          />
        ))}
      </div>
      <div className="intro-core" />
      <div className="intro-line" />
      <div className="intro-text">
        Ghostline
        <small>Studios — Awaken</small>
      </div>
      <style>{`
        @keyframes introRing {
          0% { opacity: 0; transform: scale(0.4); }
          50% { opacity: 1; }
          100% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { EnergyField, CustomCursor, IntroOverlay });
