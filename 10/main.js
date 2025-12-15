/*
const fs = require('fs');

function parseMachine(line) {
  const indicatorMatch = line.match(/\[([.#]+)\]/);
  const buttonMatches = [...line.matchAll(/\(([\d,]+)\)/g)];

  const target = indicatorMatch[1].split('').map(ch => ch === '#' ? 1 : 0);
  const buttons = buttonMatches.map(m => m[1].split(',').map(Number));

  return { target, buttons };
}

// Решение минимальной системы XOR (GF(2)) через перебор всех комбинаций кнопок
function minPresses(machine) {
  const { target, buttons } = machine;
  const nButtons = buttons.length;
  const nIndicators = target.length;

  let minPress = Infinity;

  for (let mask = 0; mask < (1 << nButtons); mask++) {
    const state = Array(nIndicators).fill(0);
    for (let i = 0; i < nButtons; i++) {
      if ((mask >> i) & 1) {
        for (let idx of buttons[i]) {
          state[idx] ^= 1; // переключение индикатора
        }
      }
    }
    if (state.every((v, idx) => v === target[idx])) {
      const presses = mask.toString(2).split('1').length - 1;
      if (presses < minPress) minPress = presses;
    }
  }

  return minPress;
}

function solve(filename) {
  const lines = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  let total = 0;
  for (let line of lines) {
    const machine = parseMachine(line);
    total += minPresses(machine);
  }
  return total;
}

// Использование:
const filename = 'input.txt'; // ваш файл с машинами
console.log(solve(filename));
*/



const fs = require('fs');

// Функция для поиска минимального количества нажатий кнопок
function countMinVoltageChanges(devices) {
    let totalPresses = 0;

    devices.forEach(device => {
        const { voltageRequirements, buttons } = device;
        const requiredVoltages = voltageRequirements.map(Number);
        const buttonIncrements = buttons.map(button => button.map(Number));

        // Перебираем все возможные комбинации нажатий кнопок
        let bestResult = Infinity;
        for (let mask = 0; mask < (1 << buttons.length); mask++) {
            let voltages = Array(requiredVoltages.length).fill(0);
            let presses = 0;

            // Применяем комбинации нажатий
            for (let bit = 0; bit < buttons.length; bit++) {
                if (mask & (1 << bit)) {
                    buttonIncrements[bit].forEach(index => {
                        voltages[index]++;
                    });
                    presses++;
                }
            }

            // Проверяем, достигли ли мы нужных значений напряжения
            if (voltages.every((val, idx) => val >= requiredVoltages[idx])) {
                bestResult = Math.min(bestResult, presses);
            }
        }

        // Добавляем минимальное количество нажатий
        totalPresses += bestResult;
    });

    return totalPresses;
}

// Основная функция для запуска
async function main() {
    try {
        // Читаем данные из файла
        const data = await fs.promises.readFile('input.txt', 'utf8');
        const lines = data.trim().split('\n');

        // Готовим устройства для обработки
        const devices = lines.map(line => {
            const match = line.match(/{(.*?)}(.*)/);
            if (!match) throw new Error('Ошибка в формате данных!');

            const voltagePart = match[1];
            const buttonsPart = match[2].trim();

            const voltageRequirements = voltagePart.split(', ').map(Number);
            const buttons = buttonsPart.split(') (').map(btn => btn.split(', ').map(Number));

            return { voltageRequirements, buttons };
        });

        // Находим минимальное количество нажатий
        const result = countMinVoltageChanges(devices);
        console.log(`Минимальное количество нажатий кнопок: ${result}`);
    } catch (err) {
        console.error('Ошибка:', err.message);
    }
}

// Запуск основной функции
main();