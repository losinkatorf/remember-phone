const background = (() => {
  const TARGET_FPS = 30;
  const DPR = 1;
  const ANGLE = Math.PI / 4;
  const FONT_FAMILY = "'Courier New', monospace";
  const MIN_NUM = 8;
  const MAX_NUM = 50;
  const START_NUM = 20;
  const ADJUST_INTERVAL = 1200;

  let canvas, ctx, numbers = [];
  let width = 0, height = 0, lastTime = 0, themeDark = null;
  let desiredCount = START_NUM;
  let accMs = 0, accDrawMs = 0, accFrames = 0;

  function init() {
    canvas = document.getElementById('background-canvas');
    ctx = canvas.getContext('2d', { alpha: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    lastTime = performance.now();
    requestAnimationFrame(tick);
  }

  function resizeCanvas() {
    width = Math.floor(window.innerWidth);
    height = Math.floor(window.innerHeight);
    canvas.width = Math.max(1, Math.floor(width * DPR));
    canvas.height = Math.max(1, Math.floor(height * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    numbers = [];
    for (let i = 0; i < desiredCount; i++) numbers.push(createNumber());
    buildSprites(getColor());
  }

  function getColor() {
    const isDark = document.body.classList.contains('dark-theme');
    if (themeDark === null) themeDark = isDark;
    return isDark ? '#FFFFFF' : '#000000';
  }

  function createNumber() {
    return {
      text: '+' + Math.random().toString().substring(2, 2 + Math.floor(Math.random() * 6) + 5),
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 20 + 30,
      opacity: Math.random() * 0.4 + 0.3,
      blur: Math.random() * 2 + 1,
      speed: Math.random() * 40 + 12,
      blink: Math.random() > 0.95,
      sprite: null,
      sw: 0, sh: 0
    };
  }

  function buildSprites(color) {
    for (const n of numbers) {
      const s = makeSprite(n.text, n.size, ANGLE, n.blur, color);
      n.sprite = s.sprite; n.sw = s.w; n.sh = s.h;
    }
  }

  function rebuildSpritesIfThemeChanged() {
    const isDark = document.body.classList.contains('dark-theme');
    if (themeDark === isDark) return;
    themeDark = isDark;
    buildSprites(getColor());
  }

  function makeSprite(text, sizePx, angleRad, blurPx, color) {
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = `${Math.round(sizePx)}px ${FONT_FAMILY}`;
    const textW = Math.ceil(measure.measureText(text).width);
    const textH = Math.ceil(sizePx * 1.2);
    const diag = Math.ceil(Math.hypot(textW, textH));
    const pad = Math.ceil(blurPx * 2 + 4);
    const w = diag + pad, h = diag + pad;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const octx = off.getContext('2d');
    octx.translate(w / 2, h / 2);
    octx.rotate(angleRad);
    octx.filter = `blur(${blurPx}px)`;
    octx.fillStyle = color;
    octx.font = `${Math.round(sizePx)}px ${FONT_FAMILY}`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(text, 0, 0);
    return { sprite: off, w, h };
  }

  function ensureCount(color) {
    if (numbers.length === desiredCount) return;
    if (numbers.length < desiredCount) {
      const need = desiredCount - numbers.length;
      for (let i = 0; i < need; i++) numbers.push(createNumber());
      for (let i = numbers.length - need; i < numbers.length; i++) {
        const n = numbers[i];
        const s = makeSprite(n.text, n.size, ANGLE, n.blur, color);
        n.sprite = s.sprite; n.sw = s.w; n.sh = s.h;
      }
    } else {
      numbers.length = desiredCount;
    }
  }

  function updateNumber(n, dt, color) {
    n.y -= n.speed * dt;
    if (n.y < -n.sh) {
      n.y = height + n.sh;
      n.x = Math.random() * width;
      n.text = '+' + Math.random().toString().substring(2, 2 + Math.floor(Math.random() * 6) + 5);
      const s = makeSprite(n.text, n.size, ANGLE, n.blur, color);
      n.sprite = s.sprite; n.sw = s.w; n.sh = s.h;
    }
    if (n.blink) n.opacity = 0.1 + Math.random() * 0.3;
  }

  function adjustLoad(avgDrawMs) {
    const budget = 1000 / TARGET_FPS;
    if (avgDrawMs > budget * 1.15 && desiredCount > MIN_NUM) desiredCount = Math.max(MIN_NUM, desiredCount - 2);
    else if (avgDrawMs < budget * 0.75 && desiredCount < MAX_NUM) desiredCount = Math.min(MAX_NUM, desiredCount + 1);
  }

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const drawStart = performance.now();
    const color = getColor();
    rebuildSpritesIfThemeChanged();
    ensureCount(color);

    ctx.clearRect(0, 0, width, height);
    const baseAlpha = 0.1;
    for (const n of numbers) {
      if (!n.sprite) continue;
      ctx.globalAlpha = Math.max(0, Math.min(1, n.opacity * baseAlpha));
      ctx.drawImage(n.sprite, (n.x - n.sw / 2) | 0, (n.y - n.sh / 2) | 0);
      updateNumber(n, dt, color);
    }
    ctx.globalAlpha = 1;

    const drawMs = performance.now() - drawStart;
    accDrawMs += drawMs; accFrames++; accMs += now - lastTime + dt * 1000;
    if (accMs >= ADJUST_INTERVAL) {
      const avg = accDrawMs / accFrames;
      adjustLoad(avg);
      accMs = 0; accDrawMs = 0; accFrames = 0;
    }

    requestAnimationFrame(tick);
  }

  return { init };
})();

background.init();
