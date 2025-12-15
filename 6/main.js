/*
import fs from 'fs';

// Читаем файл
const data = fs.readFileSync('input.txt', 'utf-8');

// Разбиваем на строки
const lines = data.trim().split('\n');

// Последняя строка — это операции
const operations = lines[lines.length - 1].trim().split(/\s+/);

// Все остальные строки — это числа
const numberLines = lines.slice(0, -1);

// Определяем количество задач по количеству операций
const taskCount = operations.length;

// Инициализируем массив для задач
const tasks = Array.from({ length: taskCount }, () => []);

// Разбираем числа по столбцам
for (let line of numberLines) {
    const nums = line.trim().split(/\s+/);
    for (let i = 0; i < nums.length; i++) {
        tasks[i].push(Number(nums[i]));
    }
}

// Вычисляем результат каждой задачи
const results = tasks.map((numbers, idx) => {
    const op = operations[idx];
    if (op === '+') {
        return numbers.reduce((a, b) => a + b, 0);
    } else if (op === '*') {
        return numbers.reduce((a, b) => a * b, 1);
    } else {
        throw new Error(`Неизвестная операция: ${op}`);
    }
});

// Суммируем все результаты
const total = results.reduce((a, b) => a + b, 0);

console.log(total);
*/



const fs = require('fs'); // Подключаем модуль файловой системы Node.js

// Путь к файлу с данными
const filePath = './input.txt'; // Здесь указываем полный путь к файлу

// Функция для парсинга входных данных
function parseInput(data) {
    const rows = data.split('\n').filter(line => line.trim() !== '');
    const opsRow = rows.pop(); // Извлекаем строку с операторами
    const numRows = rows.map(row => row.trim().split(/\s+/)).reverse();

    // Создаем массив номеров задач
    const tasks = [];
    for (let j = 0; j < numRows[0].length; j++) {
        const taskNum = [];
        for (let i = 0; i < numRows.length; i++) {
            const cellValue = numRows[i][j];
            if (cellValue && !isNaN(parseInt(cellValue))) {
                taskNum.unshift(cellValue.padStart(numRows.length, ' ').replace(/ /g, ''));
            }
        }
        tasks.push(taskNum.join(''));
    }

    return {tasks, operators: opsRow.split(/\s+/)};
}

// Функция для выполнения операций
function computeTasks(tasks, operators) {
    let result = 0;
    for (let i = 0; i < tasks.length; i++) {
        const nums = tasks[i].split(' ');
        switch (operators[i]) {
            case '+':
                result += nums.reduce((a, b) => a + Number(b), 0);
                break;
            case '*':
                result += nums.reduce((a, b) => a * Number(b), 1);
                break;
        }
    }
    return result;
}

// Основной обработчик
async function main() {
    try {
        const rawData = await fs.promises.readFile(filePath, 'utf8');
        const {tasks, operators} = parseInput(rawData);
        console.log(computeTasks(tasks, operators));
    } catch (err) {
        console.error(err.message);
    }
}

main();