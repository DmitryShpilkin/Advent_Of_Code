// count_accessible.js
// Usage: node count_accessible.js path/to/file.txt
// If no path given, will try ./input.txt
/*
const fs = require('fs');
const path = process.argv[2] || 'input.txt';

let raw;
try {
  raw = fs.readFileSync(path, 'utf8');
} catch (err) {
  console.error('Не удалось прочитать файл:', err.message);
  process.exit(1);
}

// Разбиваем на строки, убираем пустые строки в начале/конце
const lines = raw.replace(/\r/g, '').split('\n').filter((_, i, arr) => {
  // сохраняем пустые строки внутри файла, но отбросим ведущие/концевые пустые строки
  if (i === 0 || i === arr.length - 1) return arr[i].trim().length > 0;
  return true;
});

// Если файл пустой
if (lines.length === 0) {
  console.log('0');
  process.exit(0);
}

// Сделаем прямоугольную сетку (паддинг точками для коротких строк)
const width = Math.max(...lines.map(l => l.length));
const height = lines.length;
const grid = lines.map(l => l.padEnd(width, '.').split(''));

// Смещения для 8 соседей
const deltas = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

let accessibleCount = 0;

// Если хотите — можно собрать координаты доступных рулонов
const accessibleCoords = [];

for (let r = 0; r < height; r++) {
  for (let c = 0; c < width; c++) {
    if (grid[r][c] !== '@') continue;
    let neighborsAt = 0;
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
        if (grid[nr][nc] === '@') neighborsAt++;
      }
    }
    if (neighborsAt < 4) {
      accessibleCount++;
      accessibleCoords.push([r, c]); // опционально
    }
  }
}

console.log(accessibleCount);
// Если нужно — можно вывести координаты (раскомментируйте)
// console.log('Coords (row,col):', accessibleCoords.map(([r,c]) => `(${r},${c})`).join(' '));
*/



// remove_iterative.js
// Usage: node remove_iterative.js [path/to/input.txt] [--show-final]
// Example: node remove_iterative.js input.txt --show-final

const fs = require('fs');
const path = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'input.txt';
const showFinal = process.argv.includes('--show-final');

let raw;
try {
  raw = fs.readFileSync(path, 'utf8');
} catch (err) {
  console.error('Не удалось прочитать файл:', err.message);
  process.exit(1);
}

const lines = raw.replace(/\r/g, '').split('\n').filter((_, i, arr) => {
  if (i === 0 || i === arr.length - 1) return arr[i].trim().length > 0;
  return true;
});

if (lines.length === 0) {
  console.log('0');
  process.exit(0);
}

// Normalize to rectangular grid by padding with '.'
const width = Math.max(...lines.map(l => l.length));
let grid = lines.map(l => l.padEnd(width, '.').split(''));

const deltas = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

let totalRemoved = 0;
let round = 0;

while (true) {
  round++;
  const toRemove = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c] !== '@') continue;
      let neigh = 0;
      for (const [dr, dc] of deltas) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < width) {
          if (grid[nr][nc] === '@') neigh++;
        }
      }
      if (neigh < 4) toRemove.push([r, c]);
    }
  }

  if (toRemove.length === 0) {
    // ничего больше убрать
    round--; // последний раунд пустой — не учитываем
    break;
  }

  // Удаляем все помеченные (одновременно)
  for (const [r, c] of toRemove) grid[r][c] = '.';
  totalRemoved += toRemove.length;
  console.log(`Раунд ${round}: удалено ${toRemove.length} рулонов (итого ${totalRemoved})`);
}

console.log('---');
console.log(`Всего удалено рулонов бумаги: ${totalRemoved}`);
if (showFinal) {
  console.log('Итоговое поле:');
  for (const row of grid) console.log(row.join(''));
}
