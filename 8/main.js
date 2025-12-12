/*

const fs = require('fs');
const path = process.argv[2] || 'input.txt';
const K = 1000; // количество самых коротких соединений

// Read and parse points
const raw = fs.readFileSync(path, 'utf8').trim();
if (!raw) {
  console.error('Файл пуст или не найден:', path);
  process.exit(1);
}
const points = raw.split(/\r?\n/).map(line => {
  const parts = line.trim().split(',').map(s => s.trim());
  if (parts.length !== 3) throw new Error('Неправильная строка: ' + line);
  return parts.map(Number);
});
const n = points.length;
if (n < 1) {
  console.error('Нет точек в файле.');
  process.exit(1);
}
console.log(`Найдено ${n} точек, ищем ${K} самых коротких пар...`);

// --- Max-heap (по расстоянию) для хранения K наименьших пар ---
class MaxHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  push(item) {
    this.a.push(item);
    this._siftUp(this.a.length - 1);
  }
  peek() { return this.a[0]; }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      this._siftDown(0);
    }
    return top;
  }
  _siftUp(i) {
    const a = this.a;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (a[p].d >= a[i].d) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  _siftDown(i) {
    const a = this.a, N = a.length;
    while (true) {
      let largest = i;
      const l = 2*i + 1, r = 2*i + 2;
      if (l < N && a[l].d > a[largest].d) largest = l;
      if (r < N && a[r].d > a[largest].d) largest = r;
      if (largest === i) break;
      [a[i], a[largest]] = [a[largest], a[i]];
      i = largest;
    }
  }
  toArray() { return this.a.slice(); }
}

// --- перебираем все пары, но храним только K наименьших ---
const heap = new MaxHeap();
for (let i = 0; i < n; i++) {
  const [xi, yi, zi] = points[i];
  for (let j = i + 1; j < n; j++) {
    const [xj, yj, zj] = points[j];
    const dx = xi - xj;
    const dy = yi - yj;
    const dz = zi - zj;
    // храните квадрат расстояния (достаточно для сравнения)
    const d = dx*dx + dy*dy + dz*dz;
    if (heap.size() < K) {
      heap.push({ d, i, j });
    } else if (d < heap.peek().d) {
      heap.pop();
      heap.push({ d, i, j });
    }
  }
}

// Получаем массив K (или меньше, если пар меньше)
let edges = heap.toArray();
// Сортируем по возрастанию расстояния
edges.sort((a,b) => a.d - b.d);

// --- DSU (union-find) ---
class DSU {
  constructor(n) {
    this.p = new Array(n);
    this.sz = new Array(n);
    for (let i = 0; i < n; i++) { this.p[i] = i; this.sz[i] = 1; }
  }
  find(x) {
    while (this.p[x] !== x) {
      this.p[x] = this.p[this.p[x]];
      x = this.p[x];
    }
    return x;
  }
  union(a, b) {
    a = this.find(a); b = this.find(b);
    if (a === b) return false;
    if (this.sz[a] < this.sz[b]) [a,b] = [b,a];
    this.p[b] = a;
    this.sz[a] += this.sz[b];
    return true;
  }
}

const dsu = new DSU(n);

// Process edges in ascending order (these are the K shortest pairs)
for (let e of edges) {
  dsu.union(e.i, e.j);
}

// Compute component sizes
const comp = new Map();
for (let i = 0; i < n; i++) {
  const r = dsu.find(i);
  comp.set(r, (comp.get(r) || 0) + 1);
}
const sizes = Array.from(comp.values()).sort((a,b) => b - a);

// Take top 3 (if меньше 3 — дополняем единицами)
while (sizes.length < 3) sizes.push(1);

// Используем BigInt на случай больших произведений
let prod = 1n;
prod *= BigInt(sizes[0]);
prod *= BigInt(sizes[1]);
prod *= BigInt(sizes[2]);

console.log('Три наибольшие компоненты:', sizes.slice(0,3));
console.log('Произведение их размеров:', prod.toString());
*/




// last_union.js
// Usage: node last_union.js [input-file]
// Default input-file: input.txt

const fs = require('fs');
const file = process.argv[2] || 'input.txt';

const raw = fs.readFileSync(file, 'utf8').trim();
if (!raw) {
  console.error('Файл пуст или не найден:', file);
  process.exit(1);
}
const pts = raw.split(/\r?\n/).map(l => {
  const p = l.trim().split(',').map(s => Number(s.trim()));
  if (p.length !== 3 || p.some(isNaN)) throw new Error('Неправильная строка: ' + l);
  return p;
});
const n = pts.length;
if (n === 0) { console.error('Нет точек'); process.exit(1); }
if (n === 1) {
  console.log('Одна точка — соединений не требуется.');
  process.exit(0);
}

console.log(`Загружено ${n} точек. Строим MST (Прим) O(n^2) ...`);

// Прим без приоритетной очереди (минимальное по памяти, O(n^2) времени)
const inMST = new Array(n).fill(false);
const minDist = new Array(n).fill(Infinity); // хранит квадрат расстояния до MST
const parent = new Array(n).fill(-1);        // родитель в MST

// начинаем с вершины 0
minDist[0] = 0;
let addedCount = 0;
const edgesAdded = []; // {u, v, d2} - порядок добавления

function sqDist(i, j) {
  const a = pts[i], b = pts[j];
  const dx = a[0]-b[0], dy = a[1]-b[1], dz = a[2]-b[2];
  return dx*dx + dy*dy + dz*dz;
}

for (let iter = 0; iter < n; iter++) {
  // найти вершину вне MST с минимальным minDist
  let v = -1;
  let best = Infinity;
  for (let i = 0; i < n; i++) {
    if (!inMST[i] && minDist[i] < best) {
      best = minDist[i];
      v = i;
    }
  }
  if (v === -1) break; // на всякий случай

  // добавить v в MST
  inMST[v] = true;
  if (parent[v] !== -1) {
    edgesAdded.push({ u: parent[v], v: v, d2: minDist[v] });
  } else {
    // root (первый узел), без ребра
  }
  addedCount++;

  // обновляем расстояния для оставшихся вершин
  for (let to = 0; to < n; to++) {
    if (inMST[to]) continue;
    const d2 = sqDist(v, to);
    if (d2 < minDist[to]) {
      minDist[to] = d2;
      parent[to] = v;
    }
  }
}

// Теперь в edgesAdded у нас n-1 ребро MST в порядке добавления (по итерациям Прима).
if (edgesAdded.length !== n-1) {
  console.error('Что-то пошло не так: добавлено ребер MST != n-1');
  process.exit(1);
}

// Последнее ребро (в порядке добавления) — это ребро, которое в момент его добавления расширило MST.
// Но внимание: в задаче "связывать ближайшие незадействованные пары пока все в одной цепи" — 
// это соответствует Kruskal'у с ребрами, отсортированными по длине. Однако максимальное ребро в MST
// (по весу) — это ребро, которое в момент соединения всех компонент было последним. 
// Поэтому найдём ребро MST с наибольшим веса (d2) — его и берем как "последнее соединение".
let maxEdge = edgesAdded[0];
for (let e of edgesAdded) {
  if (e.d2 > maxEdge.d2) maxEdge = e;
}

const a = pts[maxEdge.u], b = pts[maxEdge.v];
const dist = Math.sqrt(maxEdge.d2);
const prodX = BigInt(a[0]) * BigInt(b[0]);

console.log('Последнее критическое ребро (макс в MST):');
console.log(`  Точка A (индекс ${maxEdge.u}): ${a[0]},${a[1]},${a[2]}`);
console.log(`  Точка B (индекс ${maxEdge.v}): ${b[0]},${b[1]},${b[2]}`);
console.log(`  Квадрат расстояния: ${maxEdge.d2}`);
console.log(`  Евклидово расстояние: ${dist}`);
console.log(`  Произведение X-координат: ${a[0]} * ${b[0]} = ${prodX.toString()}`);
