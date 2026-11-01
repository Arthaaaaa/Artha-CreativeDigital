import { useEffect, useRef } from "react";

/* ══ Particles ════════════════════════════════════════════
   A shape made of dots with spring physics and shape morphing.
   Configured with:
   - Shapes: [Cosmic, TwinSparkle, Burst, Surprise, Wing]
   - Dot Count (N): 1200 dots
   - Dot Radius (r): 2px */

const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const W = 480;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const DEFAULT_N = 1200;

export const SHAPES = ["Cosmic", "TwinSparkle", "Burst", "Surprise", "Wing"] as const;
export type Shape = (typeof SHAPES)[number];

const SVG_SHAPES: Record<string, string> = {
  TwinSparkle: "M 315.5 71.0 L 317.5 71.0 L 315.5 76.0 L 296.5 106.0 L 274.5 150.0 L 268.5 168.0 L 268.5 180.0 L 273.0 184.5 L 282.0 188.5 L 300.0 192.5 L 330.0 196.5 L 385.0 198.5 L 386.5 200.0 L 385.0 201.5 L 340.0 202.5 L 296.0 206.5 L 263.0 212.5 L 242.0 220.5 L 229.0 230.5 L 212.5 247.0 L 186.5 278.0 L 151.5 328.0 L 150.0 329.5 L 147.5 328.0 L 159.5 310.0 L 185.5 262.0 L 196.5 234.0 L 197.5 220.0 L 185.0 211.5 L 162.0 206.5 L 124.0 202.5 L 81.0 201.5 L 79.5 200.0 L 81.0 198.5 L 139.0 196.5 L 167.0 193.5 L 197.0 188.5 L 223.0 179.5 L 234.0 171.5 L 263.5 141.0 L 315.0 71.5 Z M 377.5 95.0 L 364.5 120.0 L 363.5 129.0 L 377.0 133.5 L 400.5 135.0 L 372.0 136.5 L 354.0 141.5 L 341.5 154.0 L 325.5 175.0 L 339.5 150.0 L 341.5 142.0 L 337.0 138.5 L 329.0 136.5 L 303.5 135.0 L 329.0 133.5 L 349.0 128.5 L 360.5 118.0 L 377.0 95.5 Z",
  Burst: "M 120.5 61.0 L 150.5 106.0 L 161.5 120.0 L 177.0 133.5 L 186.0 132.5 L 200.0 123.5 L 227.5 97.0 L 252.0 69.5 L 219.5 124.0 L 213.5 141.0 L 213.5 150.0 L 215.5 153.0 L 231.0 161.5 L 250.0 167.5 L 308.0 180.5 L 353.5 188.0 L 267.0 181.5 L 231.0 181.5 L 217.0 183.5 L 210.5 187.0 L 211.5 202.0 L 221.5 229.0 L 271.0 332.5 L 219.5 247.0 L 188.5 203.0 L 180.0 194.5 L 175.0 192.5 L 165.0 194.5 L 151.0 203.5 L 143.0 211.5 L 153.5 189.0 L 153.5 174.0 L 150.0 169.5 L 142.0 164.5 L 118.5 157.0 L 138.0 156.5 L 148.0 153.5 L 153.5 149.0 L 154.5 142.0 L 145.5 113.0 L 121.0 61.5 Z M 254.5 66.0 L 254.0 66.5 Z M 354.5 189.0 L 358.0 188.5 L 355.0 189.5 Z M 272.5 336.0 L 273.0 336.5 Z",
  Surprise: "M 150.5 56.0 L 156.0 55.5 L 161.5 62.0 L 173.5 110.0 L 190.5 167.0 L 190.5 172.0 L 193.5 177.0 L 199.5 199.0 L 197.5 205.0 L 186.0 214.5 L 179.0 214.5 L 175.5 210.0 L 167.5 183.0 L 150.5 138.0 L 146.5 122.0 L 143.5 118.0 L 137.5 100.0 L 137.5 87.0 L 146.5 60.0 L 150.0 56.5 Z M 276.5 83.0 L 286.0 83.5 L 289.5 90.0 L 286.5 119.0 L 280.5 281.0 L 278.5 288.0 L 275.0 290.5 L 270.0 290.5 L 240.0 278.5 L 236.5 274.0 L 225.5 175.0 L 222.5 163.0 L 220.5 134.0 L 216.5 112.0 L 216.5 101.0 L 220.0 97.5 L 276.0 83.5 Z M 197.5 226.0 L 205.0 225.5 L 207.5 228.0 L 216.5 256.0 L 216.5 261.0 L 211.0 266.5 L 197.0 268.5 L 194.5 266.0 L 188.5 251.0 L 185.5 237.0 L 189.0 231.5 L 197.5 227.0 Z M 318.5 262.0 L 325.0 261.5 L 344.5 275.0 L 344.5 281.0 L 329.5 311.0 L 329.5 314.0 L 325.0 319.5 L 317.0 319.5 L 308.5 313.0 L 304.5 305.0 L 314.5 268.0 L 318.5 263.0 Z M 244.5 298.0 L 251.0 298.5 L 278.5 312.0 L 280.5 316.0 L 278.5 341.0 L 274.0 344.5 L 270.0 344.5 L 244.5 330.0 L 241.5 325.0 L 239.5 314.0 L 239.5 301.0 L 244.0 298.5 Z M 301.5 320.0 L 310.0 320.5 L 321.5 331.0 L 320.5 336.0 L 317.0 339.5 L 312.0 340.5 L 298.5 330.0 L 297.5 326.0 L 301.5 321.0 Z",
  Wing: "M 299.5 70.0 L 300.5 74.0 L 297.5 85.0 L 286.5 106.0 L 264.0 125.5 L 265.5 117.0 L 264.5 101.0 L 282.0 82.5 L 299.0 70.5 Z M 307.5 102.0 L 315.5 102.0 L 307.5 118.0 L 293.0 131.5 L 269.5 145.0 L 271.5 141.0 L 271.5 124.0 L 291.0 108.5 L 307.0 102.5 Z M 260.5 104.0 L 262.5 107.0 L 262.5 121.0 L 259.5 129.0 L 249.0 139.5 L 237.0 147.5 L 230.0 155.5 L 229.5 138.0 L 231.5 131.0 L 260.0 104.5 Z M 268.5 125.0 L 269.5 139.0 L 264.5 149.0 L 241.0 167.5 L 234.0 175.5 L 234.5 161.0 L 237.5 152.0 L 257.0 137.5 L 268.0 125.5 Z M 312.5 125.0 L 319.5 125.0 L 319.5 129.0 L 313.5 139.0 L 305.0 147.5 L 288.0 159.5 L 271.5 166.0 L 275.5 159.0 L 277.5 146.0 L 292.0 133.5 L 308.0 125.5 L 312.0 125.5 Z M 226.5 138.0 L 228.5 138.0 L 228.5 141.0 L 224.5 159.0 L 220.5 167.0 L 200.5 191.0 L 197.5 193.0 L 197.5 178.0 L 200.5 162.0 L 215.0 146.5 L 226.0 138.5 Z M 273.5 148.0 L 274.5 154.0 L 270.5 165.0 L 258.0 177.5 L 234.0 195.5 L 233.5 188.0 L 236.5 178.0 L 273.0 148.5 Z M 312.5 151.0 L 319.0 150.5 L 319.5 155.0 L 311.5 171.0 L 299.0 183.5 L 290.0 189.5 L 279.0 193.5 L 270.5 194.0 L 277.5 183.0 L 279.5 170.0 L 298.0 155.5 L 312.0 151.5 Z M 231.5 158.0 L 232.5 164.0 L 226.5 182.0 L 212.5 200.0 L 197.5 214.0 L 197.5 202.0 L 201.5 192.0 L 231.5 159.0 Z M 273.5 171.0 L 275.5 171.0 L 275.5 176.0 L 268.5 193.0 L 257.0 202.5 L 236.0 214.5 L 233.5 214.0 L 237.5 200.0 L 242.5 192.0 L 258.0 179.5 L 273.0 171.5 Z M 231.5 180.0 L 232.5 183.0 L 226.5 201.0 L 216.5 216.0 L 198.5 235.0 L 200.0 236.5 L 234.0 199.5 L 232.5 213.0 L 228.5 220.0 L 197.0 250.5 L 195.5 250.0 L 195.5 244.0 L 198.5 238.0 L 196.5 237.0 L 198.5 218.0 L 218.5 197.0 L 231.0 180.5 Z M 310.5 183.0 L 317.5 183.0 L 317.5 187.0 L 310.5 199.0 L 295.0 212.5 L 280.0 218.5 L 268.5 220.0 L 280.0 197.5 L 296.0 187.5 L 310.0 183.5 Z M 273.5 198.0 L 275.5 198.0 L 273.5 206.0 L 266.5 218.0 L 257.0 226.5 L 245.0 232.5 L 233.5 235.0 L 239.5 219.0 L 246.0 212.5 L 273.0 198.5 Z M 297.5 215.0 L 308.5 215.0 L 307.5 220.0 L 301.5 229.0 L 285.0 240.5 L 268.0 246.5 L 264.5 246.0 L 271.5 237.0 L 276.0 224.5 L 288.0 217.5 L 297.0 215.5 Z M 233.5 221.0 L 235.0 220.5 L 235.5 223.0 L 230.5 236.0 L 210.0 254.5 L 196.0 264.5 L 192.5 265.0 L 197.5 253.0 L 233.0 221.5 Z M 271.5 224.0 L 273.5 225.0 L 269.5 237.0 L 259.0 248.5 L 231.0 258.5 L 239.5 241.0 L 244.0 236.5 L 271.0 224.5 Z M 234.5 241.0 L 234.5 245.0 L 228.5 256.0 L 212.0 270.5 L 191.0 283.5 L 193.5 269.0 L 215.0 252.5 L 234.0 241.5 Z M 291.5 241.0 L 305.5 241.0 L 299.5 252.0 L 292.0 258.5 L 273.5 266.0 L 290.0 265.5 L 287.5 272.0 L 279.0 280.5 L 271.0 284.5 L 254.5 287.0 L 264.5 271.0 L 272.5 267.0 L 259.5 268.0 L 267.5 253.0 L 276.0 246.5 L 291.0 241.5 Z M 262.5 251.0 L 265.0 250.5 L 265.5 252.0 L 261.5 259.0 L 251.0 270.5 L 240.0 272.5 L 225.0 278.5 L 232.5 263.0 L 241.0 256.5 L 262.0 251.5 Z M 225.5 266.0 L 228.0 265.5 L 228.5 268.0 L 222.5 278.0 L 205.0 291.5 L 187.0 299.5 L 186.5 296.0 L 189.5 288.0 L 205.0 276.5 L 225.0 266.5 Z M 257.5 272.0 L 261.5 272.0 L 259.5 277.0 L 255.5 283.0 L 247.0 289.5 L 219.0 297.5 L 228.5 282.0 L 238.0 276.5 L 257.0 272.5 Z M 220.5 285.0 L 223.5 285.0 L 212.5 301.0 L 198.0 313.5 L 185.0 321.5 L 167.0 329.5 L 160.5 330.0 L 172.5 319.0 L 182.5 306.0 L 186.0 302.5 L 220.0 285.5 Z M 256.5 290.0 L 269.0 289.5 L 280.5 294.0 L 275.0 299.5 L 263.0 306.5 L 248.0 309.5 L 244.0 308.5 L 243.5 306.0 L 251.5 294.0 L 256.0 290.5 Z M 248.5 291.0 L 250.5 291.0 L 247.5 298.0 L 239.0 307.5 L 229.0 307.5 L 214.5 302.0 L 231.0 294.5 L 248.0 291.5 Z",
};

type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function addSparkle(
  p: Path2D,
  cx: number,
  cy: number,
  rx: number,
  ryTop: number,
  ryBottom: number,
  waist: number,
  angleRad = 0
) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const pt = (x: number, y: number): [number, number] => [
    cx + x * cos - y * sin,
    cy + x * sin + y * cos,
  ];

  const rT = Math.max(2, Math.min(rx, (ryTop + ryBottom) / 2) * 0.06);
  const [topL_x, topL_y] = pt(-rT, -ryTop + rT * 1.8);
  const [top_x, top_y] = pt(0, -ryTop);
  const [topR_x, topR_y] = pt(rT, -ryTop + rT * 1.8);
  const [rightT_x, rightT_y] = pt(rx - rT * 1.8, -rT);
  const [right_x, right_y] = pt(rx, 0);
  const [rightB_x, rightB_y] = pt(rx - rT * 1.8, rT);
  const [botR_x, botR_y] = pt(rT, ryBottom - rT * 1.8);
  const [bot_x, bot_y] = pt(0, ryBottom);
  const [botL_x, botL_y] = pt(-rT, ryBottom - rT * 1.8);
  const [leftB_x, leftB_y] = pt(-rx + rT * 1.8, rT);
  const [left_x, left_y] = pt(-rx, 0);
  const [leftT_x, leftT_y] = pt(-rx + rT * 1.8, -rT);

  p.moveTo(topL_x, topL_y);
  p.quadraticCurveTo(top_x, top_y, topR_x, topR_y);
  p.bezierCurveTo(
    pt(waist * 0.88, -ryTop * 0.32)[0],
    pt(waist * 0.88, -ryTop * 0.32)[1],
    pt(rx * 0.32, -waist * 0.88)[0],
    pt(rx * 0.32, -waist * 0.88)[1],
    rightT_x,
    rightT_y
  );
  p.quadraticCurveTo(right_x, right_y, rightB_x, rightB_y);
  p.bezierCurveTo(
    pt(rx * 0.32, waist * 0.88)[0],
    pt(rx * 0.32, waist * 0.88)[1],
    pt(waist * 0.88, ryBottom * 0.32)[0],
    pt(waist * 0.88, ryBottom * 0.32)[1],
    botR_x,
    botR_y
  );
  p.quadraticCurveTo(bot_x, bot_y, botL_x, botL_y);
  p.bezierCurveTo(
    pt(-waist * 0.88, ryBottom * 0.32)[0],
    pt(-waist * 0.88, ryBottom * 0.32)[1],
    pt(-rx * 0.32, waist * 0.88)[0],
    pt(-rx * 0.32, waist * 0.88)[1],
    leftB_x,
    leftB_y
  );
  p.quadraticCurveTo(left_x, left_y, leftT_x, leftT_y);
  p.bezierCurveTo(
    pt(-rx * 0.32, -waist * 0.88)[0],
    pt(-rx * 0.32, -waist * 0.88)[1],
    pt(-waist * 0.88, -ryTop * 0.32)[0],
    pt(-waist * 0.88, -ryTop * 0.32)[1],
    topL_x,
    topL_y
  );
}

function drawCosmicShape(g: CanvasRenderingContext2D) {
  g.clearRect(0, 0, W, H);
  g.fillStyle = "#ffffff";

  const starPath = new Path2D();
  addSparkle(starPath, CX, CY, 124, 146, 160, 36, -0.04);
  g.globalCompositeOperation = "source-over";
  g.fill(starPath);

  const ringRot = -0.65;
  const rX = 148;
  const rY = 50;
  const thickness = 14;

  const backRing = new Path2D();
  backRing.ellipse(CX, CY - 2, rX, rY, ringRot, Math.PI, Math.PI * 2, false);
  backRing.ellipse(CX, CY - 2, rX - thickness, rY - thickness, ringRot, Math.PI * 2, Math.PI, true);
  backRing.closePath();
  g.fill(backRing);

  const gap = 12;
  const cutArc = new Path2D();
  cutArc.ellipse(CX, CY - 2, rX + gap, rY + gap, ringRot, -0.05, Math.PI + 0.05, false);
  cutArc.ellipse(CX, CY - 2, rX - thickness - gap, rY - thickness - gap, ringRot, Math.PI + 0.05, -0.05, true);
  cutArc.closePath();
  g.globalCompositeOperation = "destination-out";
  g.fill(cutArc);

  g.globalCompositeOperation = "source-over";
  const frontRing = new Path2D();
  frontRing.ellipse(CX, CY - 2, rX, rY, ringRot, 0, Math.PI, false);
  frontRing.ellipse(CX, CY - 2, rX - thickness, rY - thickness, ringRot, Math.PI, 0, true);
  frontRing.closePath();
  g.fill(frontRing);

  const sp2_x = CX + 58;
  const sp2_y = CY - 82;
  g.globalCompositeOperation = "destination-out";
  g.beginPath();
  g.arc(sp2_x, sp2_y, 28, 0, Math.PI * 2);
  g.fill();
  g.globalCompositeOperation = "source-over";
  const sp2 = new Path2D();
  addSparkle(sp2, sp2_x, sp2_y, 16, 24, 24, 6, -0.12);
  g.fill(sp2);

  const sp3_x = CX - 68;
  const sp3_y = CY + 76;
  g.globalCompositeOperation = "destination-out";
  g.beginPath();
  g.arc(sp3_x, sp3_y, 34, 0, Math.PI * 2);
  g.fill();
  g.globalCompositeOperation = "source-over";
  const sp3 = new Path2D();
  addSparkle(sp3, sp3_x, sp3_y, 22, 34, 36, 8, -0.12);
  g.fill(sp3);

  g.globalCompositeOperation = "source-over";
}

function outline(s: Shape): Path2D {
  const p = new Path2D();
  if (s === "Cosmic") addSparkle(p, CX, CY, 124, 146, 160, 36, -0.04);
  else if (SVG_SHAPES[s]) return new Path2D(SVG_SHAPES[s]);
  return p;
}

function homes(s: Shape, n: number = DEFAULT_N): [number, number][] {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;

  let isInside: (x: number, y: number) => boolean;
  if (s === "Cosmic") {
    drawCosmicShape(g);
    const imgData = g.getImageData(0, 0, W, H).data;
    isInside = (x, y) => imgData[((y | 0) * W + (x | 0)) * 4 + 3] > 128;
  } else {
    const path = outline(s);
    isInside = (x, y) => g.isPointInPath(path, x, y);
  }

  const targetN = Math.max(40, Math.min(6000, n || DEFAULT_N));

  let area = 0;
  for (let y = 1; y < H; y += 2) for (let x = 1; x < W; x += 2) if (isInside(x, y)) area += 4;
  const sp = Math.sqrt((area / targetN) * (2 / Math.sqrt(3)));
  const rowH = (sp * Math.sqrt(3)) / 2;
  const pts: [number, number][] = [];
  for (let y = rowH / 2, row = 0; y < H; y += rowH, row++) {
    for (let x = sp / 2 + (row % 2) * (sp / 2); x < W; x += sp) {
      if (isInside(x, y)) pts.push([x, y]);
    }
  }
  const out: [number, number][] = [];
  for (let i = 0; i < targetN; i++) out.push(pts[Math.floor((i * pts.length) / targetN)]);
  return out;
}

const angle = (x: number, y: number) => Math.atan2(y - CY, x - CX);

export function Particles({
  shape = "Wing",
  reach = 80,
  force = 60,
  grain = "Fine",
  dotSize = 2,
  r,
  count = 1200,
  n,
}: {
  shape?: string;
  reach?: number;
  force?: number;
  grain?: string;
  dotSize?: number;
  r?: number;
  count?: number;
  n?: number;
} = {}) {
  const activeDotSize = dotSize ?? r ?? (grain === "Coarse" ? 2.7 : 1.9);
  const activeCount = count ?? n ?? DEFAULT_N;

  const still = stillness();
  const cv = useRef<HTMLCanvasElement | null>(null);
  const dots = useRef<Dot[]>([]);
  const at = useRef<Shape>("Wing");
  const hand = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  const knobs = useRef({ reach, force, grain, dotSize: activeDotSize, count: activeCount });
  knobs.current = { reach, force, grain, dotSize: activeDotSize, count: activeCount };

  const become = (s: Shape, targetCount: number = knobs.current.count) => {
    at.current = s;
    const next = homes(s, targetCount);
    let ds = dots.current;

    if (!ds.length) {
      dots.current = next.map(([x, y]) => ({ hx: x, hy: y, x, y, vx: 0, vy: 0 }));
      return;
    }

    if (ds.length < next.length) {
      const needed = next.length - ds.length;
      for (let i = 0; i < needed; i++) {
        const randAngle = Math.random() * Math.PI * 2;
        const randDist = Math.random() * 25;
        ds.push({
          hx: CX,
          hy: CY,
          x: CX + Math.cos(randAngle) * randDist,
          y: CY + Math.sin(randAngle) * randDist,
          vx: Math.cos(randAngle) * 0.8,
          vy: Math.sin(randAngle) * 0.8,
        });
      }
    } else if (ds.length > next.length) {
      ds = ds.slice(0, next.length);
      dots.current = ds;
    }

    const a = ds.map((d, i) => [angle(d.x, d.y), i] as const).sort((p, q) => p[0] - q[0]);
    const b = next.map((h, i) => [angle(h[0], h[1]), i] as const).sort((p, q) => p[0] - q[0]);
    a.forEach(([, di], k) => {
      const h = next[b[k][1]];
      ds[di].hx = h[0];
      ds[di].hy = h[1];
      if (still) { ds[di].x = h[0]; ds[di].y = h[1]; }
    });
  };

  const draw = () => {
    const c = cv.current;
    if (!c) return;
    const x = c.getContext("2d")!;
    const k = c.width / W;
    x.setTransform(k, 0, 0, k, 0, 0);
    x.clearRect(0, 0, W, H);
    x.fillStyle = getComputedStyle(c).color;
    const radius =
      typeof knobs.current.dotSize === "number" && knobs.current.dotSize > 0
        ? knobs.current.dotSize
        : knobs.current.grain === "Coarse"
          ? 2.7
          : 1.9;
    x.beginPath();
    for (const d of dots.current) {
      const sp = Math.hypot(d.vx, d.vy);
      if (sp < 0.3) {
        x.moveTo(d.x + radius, d.y);
        x.arc(d.x, d.y, radius, 0, Math.PI * 2);
      } else {
        const s = Math.min(2.6, 1 + sp * 0.12);
        const rot = Math.atan2(d.vy, d.vx);
        x.moveTo(d.x + Math.cos(rot) * radius * s, d.y + Math.sin(rot) * radius * s);
        x.ellipse(d.x, d.y, radius * s, radius / Math.sqrt(s), rot, 0, Math.PI * 2);
      }
    }
    x.fill();
  };

  const run = () => {
    if (raf.current) return;
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      const h = hand.current;
      const R = clamp(knobs.current.reach, 30, 160);
      const S = (clamp(knobs.current.force, 0, 100) / 100) * 11;
      let busy = !!h;
      for (const d of dots.current) {
        if (h) {
          const dx = d.x - h.x;
          const dy = d.y - h.y;
          const dd = Math.hypot(dx, dy);
          if (dd < R && dd > 0.01) {
            const f = Math.pow(1 - dd / R, 2) * S;
            d.vx += (dx / dd) * f * dt;
            d.vy += (dy / dd) * f * dt;
          }
        }
        d.vx = (d.vx + (d.hx - d.x) * 0.05 * dt) * Math.pow(0.84, dt);
        d.vy = (d.vy + (d.hy - d.y) * 0.05 * dt) * Math.pow(0.84, dt);
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (Math.abs(d.hx - d.x) < 0.05 && Math.abs(d.hy - d.y) < 0.05 && Math.abs(d.vx) < 0.02 && Math.abs(d.vy) < 0.02) {
          d.x = d.hx; d.y = d.hy; d.vx = 0; d.vy = 0;
        } else busy = true;
      }
      draw();
      raf.current = busy ? requestAnimationFrame(tick) : 0;
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const c = cv.current;
    const host = c?.parentElement;
    if (!c || !host) return;

    const resize = () => {
      const width = host.clientWidth;
      if (!width) return;
      const scale = Number.parseFloat(getComputedStyle(host).getPropertyValue("--hero-particle-scale")) || 1;
      const dpr = Math.min(2.5, window.devicePixelRatio || 1);
      const pixelWidth = Math.round(width * scale * dpr);
      const pixelHeight = Math.round((width * H / W) * scale * dpr);
      if (c.width === pixelWidth && c.height === pixelHeight) return;
      c.width = pixelWidth;
      c.height = pixelHeight;
      draw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const s: Shape = (SHAPES as readonly string[]).includes(shape)
      ? (shape as Shape)
      : SHAPES[0];
    become(s);
    draw();
    run();
  }, [shape]);

  useEffect(() => {
    become(at.current, activeCount);
    draw();
    run();
  }, [activeCount]);

  useEffect(() => { draw(); }, [grain, activeDotSize]);
  useEffect(() => () => { cancelAnimationFrame(raf.current); raf.current = 0; }, []);
  useEffect(() => {
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const where = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const k = r.width / W;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };

  return (
    <div className="ptc">
      <canvas
        ref={cv}
        className="ptc-canvas"
        role="img"
        aria-label="A shape made of dots. Move over it; press to change the shape."
        onPointerMove={(e) => {
          if (still) return;
          hand.current = where(e);
          run();
        }}
        onPointerLeave={() => { hand.current = null; run(); }}
        onPointerDown={(e) => {
          const p = where(e);
          if (!still) {
            const S = 0.4 + (clamp(knobs.current.force, 0, 100) / 100) * 1.2;
            for (const d of dots.current) {
              const dx = d.x - p.x;
              const dy = d.y - p.y;
              const dd = Math.hypot(dx, dy);
              if (dd > 200 || dd < 0.01) continue;
              const f = (1 - dd / 200) * 30 * S;
              d.vx += (dx / dd) * f;
              d.vy += (dy / dd) * f;
            }
          }
          become(SHAPES[(SHAPES.indexOf(at.current) + 1) % SHAPES.length]);
          draw();
          run();
        }}
      />
    </div>
  );
}
