import fs from "fs";

/* =====================
   READ INPUT
===================== */
const input = fs.readFileSync("input.txt", "utf-8").trimEnd();
const blocks = input.split(/\n\s*\n/);

const shapesBlock = blocks[0];
const regionsBlock = blocks.slice(1).join("\n");

/* =====================
   PARSE SHAPES
===================== */
const shapes = [];

const shapeChunks = shapesBlock.split(/\n\s*\n/);
for (const chunk of shapeChunks) {
  const lines = chunk
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const index = Number(lines[0].replace(":", ""));
  const grid = lines.slice(1).map(r => r.split(""));
  shapes[index] = grid;
}

/* =====================
   SHAPE TRANSFORMS
===================== */
function getCells(grid) {
  const res = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "#") res.push([x, y]);
    }
  }
  return res;
}

function normalize(cells) {
  const minX = Math.min(...cells.map(c => c[0]));
  const minY = Math.min(...cells.map(c => c[1]));
  return cells
    .map(([x, y]) => [x - minX, y - minY])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function rotate(cells) {
  return cells.map(([x, y]) => [-y, x]);
}

function reflect(cells) {
  return cells.map(([x, y]) => [-x, y]);
}

function allTransforms(grid) {
  if (!grid) return [];

  let cells = getCells(grid);
  const seen = new Set();
  const result = [];

  for (let r = 0; r < 4; r++) {
    cells = r === 0 ? cells : rotate(cells);
    for (const variant of [cells, reflect(cells)]) {
      const norm = normalize(variant);
      const key = JSON.stringify(norm);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(norm);
      }
    }
  }
  return result;
}

const shapeVariants = shapes.map(allTransforms);

/* =====================
   BACKTRACKING
===================== */
function canFill(width, height, pieces) {
  const board = Array.from({ length: height }, () =>
    Array(width).fill(false)
  );

  pieces.sort((a, b) => b.area - a.area);

  function dfs(i) {
    if (i === pieces.length) return true;

    const piece = pieces[i];
    for (const variant of piece.variants) {
      const maxX = Math.max(...variant.map(c => c[0]));
      const maxY = Math.max(...variant.map(c => c[1]));

      for (let y = 0; y <= height - maxY - 1; y++) {
        for (let x = 0; x <= width - maxX - 1; x++) {
          let ok = true;
          for (const [cx, cy] of variant) {
            if (board[y + cy][x + cx]) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          for (const [cx, cy] of variant) board[y + cy][x + cx] = true;
          if (dfs(i + 1)) return true;
          for (const [cx, cy] of variant) board[y + cy][x + cx] = false;
        }
      }
    }
    return false;
  }

  return dfs(0);
}

/* =====================
   PROCESS REGIONS
===================== */
let answer = 0;

const regionLines = regionsBlock
  .split("\n")
  .map(l => l.trim())
  .filter(l => l.length > 0 && l.includes(":"));

for (const line of regionLines) {
  const [sizePart, countPart] = line.split(":");
  if (!countPart) continue;

  const [w, h] = sizePart.trim().split("x").map(Number);
  const counts = countPart.trim().split(/\s+/).map(Number);

  const pieces = [];

  for (let i = 0; i < counts.length; i++) {
    const variants = shapeVariants[i];
    if (!variants || variants.length === 0) continue;

    for (let k = 0; k < counts[i]; k++) {
     pieces.push({
  id: `${i}_${k}`,   // уникальный ID
  variants,
  area
});

    }
  }

  const totalArea = pieces.reduce((s, p) => s + p.area, 0);
  if (totalArea > w * h) continue;

  if (canFill(w, h, pieces)) answer++;
}

console.log(answer);
