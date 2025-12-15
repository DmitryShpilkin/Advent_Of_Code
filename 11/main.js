/*
const fs = require('fs');

// Функция для поиска всех путей от 'you' до 'out'
function findPaths(graph, startNode, endNode) {
    const paths = [];

    function dfs(currentNode, currentPath) {
        if (currentNode === endNode) {
            paths.push(currentPath.slice()); // Копируем путь
            return;
        }

        if (!(currentNode in graph)) return; // Узел отсутствует в графе

        for (const neighbor of graph[currentNode]) {
            currentPath.push(neighbor);
            dfs(neighbor, currentPath);
            currentPath.pop(); // Возвращаемся назад
        }
    }

    dfs(startNode, [startNode]); // Начинаем с узла 'you'
    return paths;
}

// Основная функция для запуска
async function main() {
    try {
        // Читаем данные из файла
        const data = await fs.promises.readFile('input.txt', 'utf8');
        const lines = data.trim().split('\n');

        // Строим граф из входных данных
        const graph = {};
        for (const line of lines) {
            const [node, connections] = line.split(': ');
            graph[node] = connections ? connections.split(' ') : [];
        }

        // Находим все пути от 'you' до 'out'
        const allPaths = findPaths(graph, 'you', 'out');
        console.log(`Количество путей от 'you' до 'out': ${allPaths.length}`);
    } catch (err) {
        console.error('Ошибка:', err.message);
    }
}

// Запуск основной функции
main();
*/



const fs = require('fs');

// Функция для поиска всех путей от 'svr' до 'out', проходящих через dac и fft
function findSpecialPaths(graph, startNode, endNode, mustVisitNodes) {
    const paths = [];

    function dfs(currentNode, currentPath) {
        if (currentNode === endNode) {
            // Проверяем, включены ли обязательные узлы
            if (mustVisitNodes.every(node => currentPath.includes(node))) {
                paths.push(currentPath.slice());
            }
            return;
        }

        if (!(currentNode in graph)) return; // Узел отсутствует в графе

        for (const neighbor of graph[currentNode]) {
            currentPath.push(neighbor);
            dfs(neighbor, currentPath);
            currentPath.pop(); // Возвращаемся назад
        }
    }

    dfs(startNode, [startNode]); // Начинаем с узла 'svr'
    return paths;
}

// Основная функция для запуска
async function main() {
    try {
        // Читаем данные из файла
        const data = await fs.promises.readFile('input.txt', 'utf8');
        const lines = data.trim().split('\n');

        // Строим граф из входных данных
        const graph = {};
        for (const line of lines) {
            const [node, connections] = line.split(': ');
            graph[node] = connections ? connections.split(' ') : [];
        }

        // Обязательные узлы
        const mustVisitNodes = ['dac', 'fft'];

        // Находим все специальные пути от 'svr' до 'out'
        const specialPaths = findSpecialPaths(graph, 'svr', 'out', mustVisitNodes);
        console.log(`Количество специальных путей от 'svr' до 'out': ${specialPaths.length}`);
    } catch (err) {
        console.error('Ошибка:', err.message);
    }
}

// Запуск основной функции
main();