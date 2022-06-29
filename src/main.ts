const snakeGrid = document.querySelector("#game-grid") as HTMLElement;
const messages = document.querySelector("#messages") as HTMLElement;

const gridRows = 21;
const gridColumns = 21;

let done = false;
let defaultDelay = 200;
let delay = defaultDelay;

for (let i = 0; i < gridRows; i++) {
	for (let j = 0; j < gridColumns; j++) {
		const gridSquare = document.createElement("div");
		gridSquare.id = `${i}-${j}`;
		gridSquare.classList.add(
			"grid-element",
			"w-full",
			"h-full",
			"border",
			"box-border"
		);
		snakeGrid.appendChild(gridSquare);
	}
}

function toggleClass(className: string, elementIds: Array<string>): void {
	for (const elementId of elementIds) {
		const element = document.getElementById(elementId) as HTMLElement;
		element.classList.toggle(className);
	}
}

let score = 0;
const startSnake = ["12-10", "11-10", "10-10"];
let currentSnake = startSnake.slice(); // copy startSnake to start off with

// paint startSnake to grid
toggleClass("snake-square", startSnake);

function randomNumber(range: number) {
	return Math.floor(Math.random() * range);
}

function randomCoordinate(xRange: number, yRange: number): Coordinate {
	return [randomNumber(xRange), randomNumber(yRange)];
}

function randomApple() {
	let newApple = coordToId(randomCoordinate(gridRows, gridColumns));

	if (currentSnake.includes(newApple)) {
		return randomApple();
	}

	return newApple;
}

let apple = randomApple();

toggleClass("apple-square", [apple]);

const directions = {
	left: [0, -1],
	right: [0, 1],
	up: [-1, 0],
	down: [1, 0],
} as const;

type Directions = typeof directions;
type Direction = Directions[keyof Directions];

const defaultDirection: Direction = directions.up;

let currentDirection: Direction = defaultDirection;

type Coordinate = [number, number];

function coordToId(coord: Coordinate): string {
	const [column, row] = coord;
	return `${column}-${row}`;
}

function idToCoord(id: string): Coordinate {
	return id.split("-").map(Number) as Coordinate;
}

function findHead(snake: Array<string>): string {
	return snake[snake.length - 1];
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function computeNewHead(
	currentDirection: Direction,
	currentSnake: Array<string>
): string {
	const headId = findHead(currentSnake);
	const headCoord = idToCoord(headId);
	const row = headCoord[0];
	const column = headCoord[1];

	const changeRow = currentDirection[0];
	const changeColumn = currentDirection[1];

	const newCoord: Coordinate = [
		mod(row + changeRow, gridRows),
		mod(column + changeColumn, gridColumns),
	];
	console.log(newCoord);
	return coordToId(newCoord);
}

function resetGameState() {
	toggleClass("snake-square", currentSnake);
	currentSnake = startSnake.slice();
	toggleClass("snake-square", currentSnake);

	toggleClass("apple-square", [apple]);
	apple = randomApple();
	toggleClass("apple-square", [apple]);

	score = 0;
	updateScore();
}

const scoreElement = document.querySelector("#score > span") as HTMLElement;

function updateScore() {
	scoreElement.innerText = String(score);
}

function moveSnake() {
	let updateSnakeSquares: Array<string> = [];

	const newHead = computeNewHead(currentDirection, currentSnake);
	updateSnakeSquares.push(newHead);

	if (currentSnake.includes(newHead)) {
		resetGameState();
		return;
	}

	if (newHead == apple) {
		score++;
		updateScore();
		const newApple = randomApple();
		toggleClass("apple-square", [apple, newApple]);
		apple = newApple;

		delay = Math.max(100, delay - 5);
	} else {
		const tail = currentSnake.shift() as string;
		updateSnakeSquares.push(tail);
	}

	currentSnake.push(newHead);
	toggleClass("snake-square", updateSnakeSquares);
}

document.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "ArrowUp":
			if (currentDirection != directions.down) {
				currentDirection = directions.up;
			}
			break;
		case "ArrowDown":
			if (currentDirection != directions.up) {
				currentDirection = directions.down;
			}
			break;
		case "ArrowRight":
			if (currentDirection != directions.left) {
				currentDirection = directions.right;
			}
			break;
		case "ArrowLeft":
			if (currentDirection != directions.right) {
				currentDirection = directions.left;
			}
			break;
	}
});

///////////////////
//// Game Loop ////
///////////////////

function gameLoop() {
	if (!done) {
		updateGameState();
		setTimeout(() => {
			window.requestAnimationFrame(gameLoop);
		}, delay);
	}
}

function updateGameState() {
	// call checks and transitions here
	moveSnake();
}

gameLoop();
