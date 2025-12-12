// main.js
// Читает координаты красных плиток из input.txt в той же папке
// И выводит максимальную площадь прямоугольника между двумя красными плитками

const fs = require('fs');
const path = require('path');

// Имя файла фиксированное
const filePath = path.join(__dirname, 'input.txt');

let text;
try {
  text = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error('Не удалось прочитать input.txt:', err.message);
  process.exit(1);
}

// Парсим строки вида "x,y"
const points = [];
for (const rawLine of text.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line) continue;

  const m = line.match(/^(-?\d+)\s*,\s*(-?\d+)$/);
  if (!m) {
    console.warn(`Игнорирую некорректную строку: "${line}"`);
    continue;
  }

  points.push({ x: Number(m[1]), y: Number(m[2]) });
}

if (points.length < 2) {
  console.log('0 (недостаточно точек)');
  process.exit(0);
}

// Убираем дубликаты
const uniqMap = new Map();
for (const p of points) {
  uniqMap.set(`${p.x},${p.y}`, p);
}
const uniqPoints = Array.from(uniqMap.values());

let maxArea = 0;
let bestPair = null;

// Перебираем все пары O(n^2)
for (let i = 0; i < uniqPoints.length; i++) {
  const a = uniqPoints[i];
  for (let j = i + 1; j < uniqPoints.length; j++) {
    const b = uniqPoints[j];

    // Противоположные углы требуют различия по x и y
    if (a.x === b.x || a.y === b.y) continue;

    const area = Math.abs(a.x - b.x) * Math.abs(a.y - b.y);
    if (area > maxArea) {
      maxArea = area;
      bestPair = { a, b };
    }
  }
}

console.log('Максимальная площадь:', maxArea);

if (bestPair) {
  console.log('Координаты углов:', `${bestPair.a.x},${bestPair.a.y}`, 'и', `${bestPair.b.x},${bestPair.b.y}`);
}
