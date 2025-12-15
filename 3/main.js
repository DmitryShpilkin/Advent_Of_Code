/*
const fs = require('fs');

function maxVoltageForBlock(block) {
    const digits = block.split('').map(Number);
    const n = digits.length;

    // maxRight[i] = максимальная цифра справа от i
    const maxRight = Array(n).fill(0);
    maxRight[n - 1] = digits[n - 1];

    for (let i = n - 2; i >= 0; i--) {
        maxRight[i] = Math.max(digits[i + 1], maxRight[i + 1]);
    }

    let best = 0;

    for (let i = 0; i < n - 1; i++) {
        const pair = digits[i] * 10 + maxRight[i];
        if (pair > best) best = pair;
    }

    return best;
}

function totalMaxVoltage(blocks) {
    return blocks
        .filter(line => line.trim().length > 0) // убрать пустые строки
        .map(maxVoltageForBlock)
        .reduce((a, b) => a + b, 0);
}

// ===== Чтение файла =====

const input = fs.readFileSync('input.txt', 'utf8')
    .trim()
    .split(/\r?\n/); // строки — блоки батареек

console.log("Максимальные напряжения по блокам:");
input.forEach(b => console.log(b, "→", maxVoltageForBlock(b)));

console.log("\nОбщее напряжение:", totalMaxVoltage(input));
*/



const fs = require('fs');

const K = 12; // количество батареек, которые нужно выбрать в каждом блоке

function maxKSubsequenceDigits(s, k) {
    const n = s.length;
    if (n < k) {
        throw new Error(`Длина строки (${n}) меньше требуемых ${k} цифр.`);
    }

    let start = 0;
    let result = '';

    for (let pick = 0; pick < k; pick++) {
        // максимально допустимый индекс для выбора на этом шаге
        const maxIndex = n - (k - pick);
        // ищем максимальную цифру в s[start .. maxIndex] включительно
        let bestChar = '0';
        let bestPos = start;
        for (let j = start; j <= maxIndex; j++) {
            const ch = s[j];
            if (ch > bestChar) {
                bestChar = ch;
                bestPos = j;
                // оптимизация: если нашли '9', это уже максимум возможный
                if (bestChar === '9') break;
            }
        }
        result += bestChar;
        start = bestPos + 1;
    }

    return result; // строка длины k
}

function processFile(filename) {
    const raw = fs.readFileSync(filename, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    const perBlock = [];
    let total = 0n;

    for (const line of lines) {
        const picked = maxKSubsequenceDigits(line, K);
        const value = BigInt(picked); // безопасно даже для очень больших чисел
        perBlock.push({ line, picked, value });
        total += value;
    }

    // вывод
    console.log("Результаты по блокам:");
    perBlock.forEach((b, i) => {
        console.log(`${i + 1}. ${b.line} → ${b.picked} (число: ${b.value}n)`);
    });
    console.log("\nОбщее выходное напряжение:", total.toString());
}

// ====== Запуск: читаем input.txt в той же папке ======
try {
    processFile('input.txt');
} catch (err) {
    console.error("Ошибка:", err.message);
    process.exit(1);
}
