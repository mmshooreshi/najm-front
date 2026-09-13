const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function traceSilhouette(pngPath, targetW, targetH) {
  const cmd = `magick "${pngPath}" -alpha extract -threshold 10% -resize 120x120 -compress none pbm:-`;
  let output;
  try {
    output = execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString();
  } catch (err) {
    return `M 0 0 L ${targetW} 0 L ${targetW} ${targetH} L 0 ${targetH} Z`;
  }

  const lines = output.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  const [gridW, gridH] = lines[1].trim().split(/\s+/).map(Number);
  const rawTokens = lines.slice(2).join(' ').trim().split(/\s+/).map(Number);

  const grid = [];
  let idx = 0;
  for (let y = 0; y < gridH; y++) {
    const row = [];
    for (let x = 0; x < gridW; x++) {
      row.push(rawTokens[idx++]);
    }
    grid.push(row);
  }

  const bgVal = grid[0][0];
  const isFg = (v) => v !== bgVal;

  const leftPoints = [];
  const rightPoints = [];

  for (let y = 0; y < gridH; y++) {
    let minX = -1;
    let maxX = -1;
    for (let x = 0; x < gridW; x++) {
      if (isFg(grid[y][x])) {
        if (minX === -1) minX = x;
        maxX = x;
      }
    }
    if (minX !== -1) {
      const normY = (y / (gridH - 1)) * targetH;
      leftPoints.push([ (minX / (gridW - 1)) * targetW, normY ]);
      rightPoints.push([ (maxX / (gridW - 1)) * targetW, normY ]);
    }
  }

  if (leftPoints.length === 0) {
    return `M 0 0 L ${targetW} 0 L ${targetW} ${targetH} L 0 ${targetH} Z`;
  }

  const allPoints = [...leftPoints, ...rightPoints.reverse()];

  function getSqSegDist(p, p1, p2) {
    let x = p1[0], y = p1[1], dx = p2[0] - x, dy = p2[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = p2[0]; y = p2[1];
      } else if (t > 0) {
        x += dx * t; y += dy * t;
      }
    }
    dx = p[0] - x; dy = p[1] - y;
    return dx * dx + dy * dy;
  }

  function simplifyDPStep(pts, first, last, sqTolerance, simplified) {
    let maxSqDist = sqTolerance, index = -1;
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSqSegDist(pts[i], pts[first], pts[last]);
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    if (maxSqDist > sqTolerance) {
      if (index - first > 1) simplifyDPStep(pts, first, index, sqTolerance, simplified);
      simplified.push(pts[index]);
      if (last - index > 1) simplifyDPStep(pts, index, last, sqTolerance, simplified);
    }
  }

  function simplify(pts, tolerance) {
    if (pts.length <= 2) return pts;
    const sqTolerance = tolerance * tolerance;
    const simplified = [pts[0]];
    simplifyDPStep(pts, 0, pts.length - 1, sqTolerance, simplified);
    simplified.push(pts[pts.length - 1]);
    return simplified;
  }

  // Tolerance 1.5 preserves fine box corners, angles, handles and curves
  const simplified = simplify(allPoints, 1.5);

  let d = `M ${simplified[0][0].toFixed(1)} ${simplified[0][1].toFixed(1)}`;
  for (let i = 1; i < simplified.length; i++) {
    d += ` L ${simplified[i][0].toFixed(1)} ${simplified[i][1].toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

const imagesToProcess = [
  { key: 'main/1.png', w: 158, h: 189 },
  { key: 'main/2.png', w: 239, h: 210 },
  { key: 'main/3.png', w: 156, h: 152 },
  { key: 'main/4.png', w: 145, h: 152 },
  { key: 'main/5.png', w: 140, h: 194 },
  { key: 'main/6.png', w: 181, h: 153 },
  { key: 'main/7.png', w: 167, h: 167 },
  { key: 'main/8.png', w: 170, h: 170 },
  { key: 'main/9.png', w: 122, h: 216 },
  { key: 'main/10.png', w: 178, h: 168 },
  { key: 'main/11.png', w: 140, h: 194 },
  { key: 'main/12.png', w: 140, h: 194 },
  { key: 'main/13.png', w: 140, h: 194 },
  { key: 'main/14.png', w: 191, h: 277 },
  { key: 'main/15.png', w: 140, h: 194 },
  { key: 'main/16.png', w: 140, h: 194 },
  { key: 'main/17.png', w: 140, h: 194 },
  { key: 'free-kraft-paper-shopping-bag-mockup-1.png', w: 153, h: 220 }
];

const masksData = {};
for (const item of imagesToProcess) {
  const p = path.join('public/images', item.key);
  if (fs.existsSync(p)) {
    const pathD = traceSilhouette(p, item.w, item.h);
    masksData[item.key] = { w: item.w, h: item.h, d: pathD };
    console.log(`Processed ${item.key}: points=${pathD.split('L').length}, len=${pathD.length}`);
  }
}

fs.writeFileSync('utils/imageMasks.json', JSON.stringify(masksData, null, 2));
console.log('Successfully generated utils/imageMasks.json!');
