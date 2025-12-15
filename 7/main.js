/*
const fs = require("fs");

const grid = fs.readFileSync("input.txt", "utf8")
  .trim()
  .split("\n")
  .map(l => l.split(""));

const H = grid.length;
const W = grid[0].length;

// Находим S
let startCol = grid[0].indexOf("S");

// Активные лучи: массив столбцов
let beams = [startCol];

let splits = 0;

for (let r = 0; r < H - 1; r++) {
    const nextBeams = new Set();

    for (const c of beams) {
        const cellBelow = grid[r + 1][c];

        if (cellBelow === "^") {
            // Нашли разветвитель
            splits++;

            // Добавляем лучи слева и справа
            if (c - 1 >= 0) nextBeams.add(c - 1);
            if (c + 1 < W) nextBeams.add(c + 1);
        } else {
            // Луч просто идёт вниз
            nextBeams.add(c);
        }
    }

    beams = [...nextBeams];
}

console.log("Количество разветвлений:", splits);
*/




const fs = require('fs');

const raw = fs.readFileSync('input.txt', 'utf8').replace(/\r/g,'').split('\n').filter(Boolean);
const grid = raw.map(line => line.split(''));
const H = grid.length;
if (H === 0) { console.log('0'); process.exit(0); }
const W = grid[0].length;

// Найти координату S
let startRow = -1, startCol = -1;
for (let r = 0; r < H; r++) {
  const c = grid[r].indexOf('S');
  if (c !== -1) { startRow = r; startCol = c; break; }
}
if (startRow === -1) { throw new Error('Не найден символ S'); }

// counts[c] = количество временных линий, находящихся в столбце c на текущей строке (BigInt)
let counts = Array(W).fill(0n);
counts[startCol] = 1n;

// Продвигаемся по строкам вниз от startRow до предпоследней (потому что смотрим вниз на r+1)
for (let r = startRow; r < H - 1; r++) {
  const next = Array(W).fill(0n);
  for (let c = 0; c < W; c++) {
    const ways = counts[c];
    if (ways === 0n) continue;
    const below = grid[r + 1][c];
    if (below === '^') {
      // при разветвлении: все эти ways идут влево и вправо (границы учитываем)
      if (c - 1 >= 0) next[c - 1] += ways;
      if (c + 1 < W)  next[c + 1] += ways;
      // оригинал не продолжается вниз
    } else {
      // просто продолжают вниз в тот же столбец
      next[c] += ways;
    }
  }
  counts = next;
}

// В конце сумма по всем столбцам — общее число временных линий
const total = counts.reduce((a, b) => a + b, 0n);
console.log(total.toString());

