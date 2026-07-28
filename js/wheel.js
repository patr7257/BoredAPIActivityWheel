import { segmentAtAngle } from './logic.js';

const COLORS = ['#7c5cff', '#ff7847', '#2dd4bf', '#f43f5e', '#ffb347', '#38bdf8', '#a3e635', '#e879f9'];
const TAU = Math.PI * 2;

export class Wheel {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.labels = [];
    this.angle = 0;

    // Capture the logical (CSS) size before resizing the backing store, so
    // draw()'s math keeps working in the original 640x640 coordinate space.
    this.logicalWidth = canvas.width;
    this.logicalHeight = canvas.height;
    const rawRatio = typeof devicePixelRatio === 'number' ? devicePixelRatio : 1;
    const dpr = Math.min(rawRatio || 1, 2);
    canvas.width = this.logicalWidth * dpr;
    canvas.height = this.logicalHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setItems(labels) {
    this.labels = labels;
    this.angle = 0;
    this.draw();
  }

  draw() {
    const { ctx, labels, logicalWidth, logicalHeight } = this;
    const n = labels.length;
    const cx = logicalWidth / 2;
    const cy = logicalHeight / 2;
    const r = cx - 8;
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    if (n === 0) return;

    const seg = TAU / n;
    for (let i = 0; i < n; i++) {
      const start = this.angle + i * seg;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + seg);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const mid = start + seg / 2;
      const normalized = ((mid % TAU) + TAU) % TAU;
      const flipped = normalized > Math.PI / 2 && normalized < (3 * Math.PI) / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(flipped ? mid + Math.PI : mid);
      ctx.textAlign = flipped ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#101010';
      ctx.font = '600 18px system-ui, sans-serif';
      const label = this.truncate(labels[i], 24);
      ctx.fillText(label, flipped ? -(r - 18) : r - 18, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, TAU);
    ctx.fillStyle = '#14121f';
    ctx.fill();
    ctx.strokeStyle = '#ffb347';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  truncate(text, max) {
    return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
  }

  spin(rng = Math.random) {
    return new Promise((resolve) => {
      const turns = 4 + rng() * 2;
      const offset = rng() * TAU;
      const start = this.angle;
      const delta = turns * TAU + offset;
      const duration = 3800;
      let t0 = null;
      const frame = (ts) => {
        if (t0 === null) t0 = ts;
        const t = Math.min((ts - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        this.angle = start + delta * eased;
        this.draw();
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve(segmentAtAngle(this.angle % TAU, this.labels.length));
        }
      };
      requestAnimationFrame(frame);
    });
  }
}
