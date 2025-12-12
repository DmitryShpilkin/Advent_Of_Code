/*import fs from 'fs';

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

console.log(total);*/



const fs = require('fs');

function solveCephalopodMath(filename) {
    // Загружаем данные из файла
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.trim().split('\n');
    
    // Определяем количество столбцов
    const maxLength = Math.max(...lines.map(line => line.length));
    
    // Разбиваем на отдельные задачи (разделитель - столбец из пробелов)
    const problems = [];
    let currentProblem = [];
    
    for (let col = maxLength - 1; col >= 0; col--) {
        const column = lines.map(line => line[col] || ' ');
        
        // Проверяем, является ли столбец разделителем (только пробелы)
        const isEmptyColumn = column.every(char => char === ' ' || char === undefined);
        
        if (isEmptyColumn) {
            if (currentProblem.length > 0) {
                problems.push(currentProblem);
                currentProblem = [];
            }
        } else {
            currentProblem.push(column);
        }
    }
    
    // Добавляем последнюю задачу
    if (currentProblem.length > 0) {
        problems.push(currentProblem);
    }
    
    // Решаем каждую задачу
    const results = [];
    
    for (const problem of problems) {
        // Последний столбец содержит оператор
        const operatorColumn = problem[problem.length - 1];
        const operator = operatorColumn.find(c => ['+','*'].includes(c));

        
        // Остальные столбцы содержат числа
        const numbers = [];
        
        for (let i = 0; i < problem.length - 1; i++) {
            const numStr = problem[i].filter(char => char !== ' ').join('');
            if (/^\d+$/.test(numStr)) {
    numbers.push(Number(numStr));
}

        }
        
        // Вычисляем результат
        let result;
        if (operator === '+') {
            result = numbers.reduce((sum, num) => sum + num, 0);
        } else if (operator === '*') {
            result = numbers.reduce((prod, num) => prod * num, 1);
        }
        
        results.push(result);
        console.log(`Задача: ${numbers.join(` ${operator} `)} = ${result}`);
    }
    
    // Считаем общую сумму
    const totalSum = results.reduce((sum, val) => sum + val, 0);
    
    console.log(`\nОбщая сумма: ${totalSum}`);
    return totalSum;
}

// Использование
solveCephalopodMath('input.txt');