const gridElement = document.getElementById('grid')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const clearButton = document.getElementById('clear')

const rows = 20
const cols = 20
let intervalId
let cells = Array.from({ length: rows }, () => Array(cols).fill(false))

// Создание сетки
function createGrid() {
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.addEventListener('click', () => toggleCell(row, col, cell))
			gridElement.appendChild(cell)
		}
	}
}

// Переключение состояния клетки
function toggleCell(row, col, cell) {
	cells[row][col] = !cells[row][col]
	cell.classList.toggle('alive', cells[row][col])
}

// Обновление состояния клеток
function updateGrid() {
	const newCells = cells.map(arr => [...arr])

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const aliveNeighbors = countAliveNeighbors(row, col)
			if (cells[row][col]) {
				newCells[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3
			} else {
				newCells[row][col] = aliveNeighbors === 3
			}
		}
	}

	cells = newCells
	renderGrid()
}

// Подсчет живых соседей
function countAliveNeighbors(row, col) {
	let count = 0

	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i === 0 && j === 0) continue
			const newRow = row + i
			const newCol = col + j

			if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
				count += cells[newRow][newCol] ? 1 : 0
			}
		}
	}

	return count
}

// Отрисовка сетки
function renderGrid() {
	const cellElements = document.querySelectorAll('.cell')

	cellElements.forEach((cellElement, index) => {
		const rowIndex = Math.floor(index / cols)
		const colIndex = index % cols
		cellElement.classList.toggle('alive', cells[rowIndex][colIndex])
	})
}

// Случайное заполнение клеток
function randomFill() {
	cells = cells.map(row => row.map(() => Math.random() < 0.5))
	renderGrid()
}

// Запуск игры
startButton.addEventListener('click', () => {
	if (!intervalId) {
		intervalId = setInterval(updateGrid, 100)
	}
})

// Остановка игры
stopButton.addEventListener('click', () => {
	clearInterval(intervalId)
	intervalId = null
})

// Очистка сетки
clearButton.addEventListener('click', () => {
	clearInterval(intervalId)
	intervalId = null

	cells = Array.from({ length: rows }, () => Array(cols).fill(false))

	renderGrid()
})

// Обработчик события для кнопки случайного заполнения
document.getElementById('random-fill').addEventListener('click', () => {
	clearInterval(intervalId)
	intervalId = null
	randomFill()
})

// Инициализация сетки
createGrid()
