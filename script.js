// Элементы управления
const gridElement = document.getElementById('grid')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const randomFillButton = document.getElementById('random-fill')
const clearButton = document.getElementById('clear')
const fieldSizeInput = document.getElementById('field-size')
const cellSizeInput = document.getElementById('cell-size')

// Изначальные размеры
let fieldSize = parseInt(fieldSizeInput.value) // Размер поля (пиксели)
let cellSize = parseInt(cellSizeInput.value) // Размер клетки (пиксели)
let rows = Math.floor(fieldSize / cellSize)
let cols = Math.floor(fieldSize / cellSize)
let cells = []
let intervalId = null

// Перестроение сетки
function initializeGrid(rows, cols) {
	// Очистка предыдущей сетки
	gridElement.innerHTML = ''
	gridElement.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`
	gridElement.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`

	// Инициализация массива клеток
	cells = Array.from({ length: rows }, () => Array(cols).fill(false))

	// Создание клеток DOM
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.style.width = `${cellSize}px`
			cell.style.height = `${cellSize}px`
			cell.addEventListener('click', () => toggleCell(row, col, cell))
			gridElement.appendChild(cell)
		}
	}
}

// Переключение состояния клетки
function toggleCell(row, col, cellElement) {
	cells[row][col] = !cells[row][col]
	cellElement.classList.toggle('alive', cells[row][col])
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

// Очистка сетки
function clearGrid() {
	clearInterval(intervalId)
	intervalId = null
	cells = cells.map(row => row.map(() => false))
	renderGrid()
	startButton.disabled = false
	stopButton.disabled = true
}

// Обновление размеров поля и клеток
function updateFieldSize() {
	fieldSize = parseInt(fieldSizeInput.value)
	cellSize = parseInt(cellSizeInput.value)
	rows = Math.floor(fieldSize / cellSize)
	cols = Math.floor(fieldSize / cellSize)
	initializeGrid(rows, cols)
}

// Запуск игры
startButton.addEventListener('click', () => {
	if (!intervalId) {
		intervalId = setInterval(updateGrid, 200)
		startButton.disabled = true
		stopButton.disabled = false
	}
})

// Остановка игры
stopButton.addEventListener('click', () => {
	clearInterval(intervalId)
	intervalId = null
	startButton.disabled = false
	stopButton.disabled = true
})

// Обработчики событий
randomFillButton.addEventListener('click', randomFill)
clearButton.addEventListener('click', clearGrid)
fieldSizeInput.addEventListener('change', updateFieldSize)
cellSizeInput.addEventListener('change', updateFieldSize)

// Инициализация сетки
initializeGrid(rows, cols)
