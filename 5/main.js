/*
import fs from 'fs';

// Читаем файл (замени 'database.txt' на свой файл)
const data = fs.readFileSync('input.txt', 'utf-8').trim();

// Разбиваем на части: диапазоны и доступные ингредиенты
const [rangesPart, availablePart] = data.split('\n\n');

const ranges = rangesPart.split('\n').map(line => {
  const [start, end] = line.split('-').map(Number);
  return { start, end };
});

const available = availablePart.split('\n').map(Number);

// Функция проверки, входит ли число в любой диапазон
function isFresh(id) {
  return ranges.some(range => id >= range.start && id <= range.end);
}

// Считаем количество свежих
const freshCount = available.filter(isFresh).length;

console.log('Количество свежих ингредиентов:', freshCount);
*/



import fs from 'fs';

// Читаем файл
const data = fs.readFileSync('input.txt', 'utf-8').trim();
const [rangesPart] = data.split('\n\n');

let ranges = rangesPart.split('\n').map(line => {
  const [start, end] = line.split('-').map(Number);
  return { start, end };
});

// Сначала сортируем диапазоны по старту
ranges.sort((a, b) => a.start - b.start);

// Объединяем пересекающиеся или смежные диапазоны
const merged = [];
for (const range of ranges) {
  if (merged.length === 0) {
    merged.push({...range});
  } else {
    const last = merged[merged.length - 1];
    if (range.start <= last.end + 1) {
      // пересекаются или смежные — объединяем
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({...range});
    }
  }
}

// Считаем общее количество свежих идентификаторов
const totalFresh = merged.reduce((sum, r) => sum + (r.end - r.start + 1), 0);

console.log('Общее количество свежих идентификаторов:', totalFresh);
