/*
const fs = require('fs');

// Функция для чтения файла и преобразования данных
function readPointsFromFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.trim().split('\n')
                    .map(line => line.split(',')
                        .map(coord => parseInt(coord))));
            }
        });
    });
}

// Функция для нахождения максимального размера прямоугольника
function findMaxRectangleArea(points) {
    let maxArea = 0;

    // Перебираем все возможные пары точек
    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        for (let j = i + 1; j < points.length; j++) {
            const [x2, y2] = points[j];

            // Расчет ширины и высоты прямоугольника
            const width = Math.abs(x1 - x2) + 1;
            const height = Math.abs(y1 - y2) + 1;

            // Рассчитываем площадь прямоугольника
            const currentArea = width * height;

            // Обновляем максимальное значение площади
            if (currentArea > maxArea) {
                maxArea = currentArea;
            }
        }
    }

    return maxArea;
}

// Имя файла с данными
const filename = 'input.txt';

// Асинхронная обработка файла
readPointsFromFile(filename)
    .then(points => {
        const result = findMaxRectangleArea(points);
        console.log(`Максимальная площадь прямоугольника: ${result}`);
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
    */


    

const fs = require('fs');

// Функция для проверки допустимости прямоугольника
function isValidRectangle(grid, topLeft, bottomRight) {
    const [startY, startX] = topLeft;
    const [endY, endX] = bottomRight;

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            if (!['R', 'G'].includes(grid[y][x])) {
                return false;
            }
        }
    }
    return true;
}

// Функция для поиска наибольшего допустимого прямоугольника
function findMaxRectangle(grid, redPoints) {
    let maxArea = 0;

    for (let i = 0; i < redPoints.length; i++) {
        const [x1, y1] = redPoints[i];
        for (let j = i + 1; j < redPoints.length; j++) {
            const [x2, y2] = redPoints[j];

            // Определяем границу прямоугольника
            const leftTop = [Math.min(y1, y2), Math.min(x1, x2)];
            const rightBottom = [Math.max(y1, y2), Math.max(x1, x2)];

            // Проверяем, является ли прямоугольник допустимым
            if (isValidRectangle(grid, leftTop, rightBottom)) {
                const area = (rightBottom[1] - leftTop[1] + 1) * (rightBottom[0] - leftTop[0] + 1);
                maxArea = Math.max(maxArea, area);
            }
        }
    }

    return maxArea;
}

// Основная функция для запуска
async function main() {
    try {
        // Читаем данные из файла
        const data = await fs.promises.readFile('input.txt', 'utf8');
        const lines = data.trim().split('\n');

        // Первая строка содержит размер сетки
        const sizeLine = lines.shift().trim(); // удаляем лишнюю строку
        const [rowsStr, colsStr] = sizeLine.split(' '); // получаем строки с размерами

        // Конвертируем строки в числа и проверяем корректность
        const rows = parseInt(rowsStr, 10);
        const cols = parseInt(colsStr, 10);

        if (Number.isNaN(rows) || Number.isNaN(cols) || rows <= 0 || cols <= 0) {
            throw new Error('Некорректные размеры сетки.');
        }

        // Создание пустой сетки
        const grid = Array(rows).fill(null).map(() => Array(cols).fill('.'));

        // Заполняем сетку красными точками
        const redPoints = [];
        for (const line of lines) {
            const [x, y] = line.split(',').map(Number);
            grid[x][y] = 'R';
            redPoints.push([x, y]);
        }

        // Заполняем оставшиеся поля зелёными плитками
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === '.') {
                    grid[i][j] = 'G';
                }
            }
        }

        // Находим максимальный допустимый прямоугольник
        const result = findMaxRectangle(grid, redPoints);
        console.log(`Наибольшая площадь допустимого прямоугольника: ${result}`);
    } catch (err) {
        console.error('Ошибка:', err.message);
    }
}

// Запуск основной функции
main();