const COLORS = ['#7c5cff', '#ff7847', '#2dd4bf', '#f43f5e', '#ffb347', '#38bdf8', '#a3e635', '#e879f9'];
const TAU = Math.PI * 2;

export class Wheel {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.labels = [];
    this.angle = 0;
  }

  setItems(labels) {
    this.labels = labels;
    this.angle = 0;
    this.draw();
  }

  draw() {
    const { ctx, canvas, labels } = this;
    const n = labels.length;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + seg / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#101010';
      ctx.font = '600 18px system-ui, sans-serif';
      const label = this.truncate(labels[i], 24);
      ctx.fillText(label, r - 18, 0);
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
}
