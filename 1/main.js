/*
const fs = require('fs');

function countZeroStops(moves) {
  let position = 50;
  let zeroCount = 0;

  for (const move of moves) {
    if (!move.trim()) continue;

    const dir = move[0];
    const amount = parseInt(move.slice(1), 10);

    if (dir === "L") {
      position = (position - amount) % 100;
      if (position < 0) position += 100;
    } else {
      position = (position + amount) % 100;
    }

    if (position === 0) zeroCount++;
  }

  return zeroCount;
}

// читаем moves.txt
const text = fs.readFileSync('input.txt', 'utf-8');
const moves = text.trim().split(/\r?\n/);

const result = countZeroStops(moves);
console.log("Пароль:", result);
*/


const fs = require('fs');

// Считаем, сколько раз стрелка проходит через 0, включая промежуточные щелчки
function countZeroClicks(moves) {
  let pos = 50;
  let zeroCount = 0;

  for (const move of moves) {
    if (!move.trim()) continue;

    const dir = move[0];
    const steps = parseInt(move.slice(1), 10);

    for (let i = 0; i < steps; i++) {
      if (dir === "L") {
        pos = (pos - 1 + 100) % 100;
      } else {
        pos = (pos + 1) % 100;
      }

      if (pos === 0) zeroCount++;
    }
  }

  return zeroCount;
}

// читаем файл
const text = fs.readFileSync('input.txt', 'utf-8');
const moves = text.trim().split(/\r?\n/);

// считаем пароль
const password = countZeroClicks(moves);

console.log("Пароль (метод 0x434C49434B):", password);
