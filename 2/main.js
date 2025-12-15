/*
const fs = require("fs");

// Читаем файл с диапазонами
const data = fs.readFileSync("input.txt", "utf-8").trim();

// Функция проверяет, является ли число недействительным (двойное повторение)
function isInvalidId(num) {
    const s = num.toString();
    const len = s.length;

    if (len % 2 !== 0) return false;

    const half = len / 2;
    const first = s.slice(0, half);
    const second = s.slice(half);

    return first === second;
}

let sum = 0;

// Разбиваем диапазоны по запятой
const ranges = data.split(",");

for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);

    for (let i = start; i <= end; i++) {
        if (isInvalidId(i)) {
            sum += i;
        }
    }
}

console.log("Сумма недействительных идентификаторов:", sum);
*/



const fs = require("fs");

// Читаем файл с диапазонами
const data = fs.readFileSync("input.txt", "utf-8").trim();

// Функция проверяет, является ли число недействительным
// Любая последовательность цифр, повторяющаяся два и более раз
function isInvalidId(num) {
    const s = num.toString();

    // Ищем любую повторяющуюся последовательность
    // ^(\d+)\1+$ : от начала строки (\d+), повторяется 1+ раз
    return /^(\d+)\1+$/.test(s);
}

let sum = 0;

const ranges = data.split(",");

for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);

    for (let i = start; i <= end; i++) {
        if (isInvalidId(i)) {
            sum += i;
        }
    }
}

console.log("Сумма недействительных идентификаторов:", sum);

