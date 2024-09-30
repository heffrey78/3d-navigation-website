// Tetris game implementation
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1, 1], [1]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]]
];

let canvas;
let ctx;
let gameLoop;
let board;
let currentPiece;
let score;

function createTetrisGame(containerId) {
    const container = document.getElementById(containerId);
    canvas = document.createElement('canvas');
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
    ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    document.addEventListener('keydown', handleKeyPress);

    initGame();
}

function initGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    createNewPiece();
    gameLoop = setInterval(update, 1000 / 60);
}

function createNewPiece() {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const color = COLORS[shapeIndex];
    currentPiece = {
        shape: SHAPES[shapeIndex],
        color: color,
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[shapeIndex][0].length / 2),
        y: 0
    };
}

function update() {
    moveDown();
    draw();
}

function moveDown() {
    if (!collision(0, 1)) {
        currentPiece.y++;
    } else {
        lockPiece();
        clearLines();
        createNewPiece();
        if (collision(0, 0)) {
            gameOver();
        }
    }
}

function moveLeft() {
    if (!collision(-1, 0)) {
        currentPiece.x--;
    }
}

function moveRight() {
    if (!collision(1, 0)) {
        currentPiece.x++;
    }
}

function rotate() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    if (!collision(0, 0, rotated)) {
        currentPiece.shape = rotated;
    }
}

function collision(offsetX, offsetY, newShape = currentPiece.shape) {
    for (let y = 0; y < newShape.length; y++) {
        for (let x = 0; x < newShape[y].length; x++) {
            if (newShape[y][x] && (
                board[y + currentPiece.y + offsetY] === undefined ||
                board[y + currentPiece.y + offsetY][x + currentPiece.x + offsetX] === undefined ||
                board[y + currentPiece.y + offsetY][x + currentPiece.x + offsetX] ||
                y + currentPiece.y + offsetY >= ROWS
            )) {
                return true;
            }
        }
    }
    return false;
}

function lockPiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                board[y + currentPiece.y][x + currentPiece.x] = currentPiece.color;
            }
        }
    }
}

function clearLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => !!cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            score += 100;
        }
    }
}

function gameOver() {
    clearInterval(gameLoop);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 40, canvas.height / 2);
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
        row.forEach((color, x) => {
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        });
    });

    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillStyle = currentPiece.color;
                ctx.fillRect((currentPiece.x + x) * BLOCK_SIZE, (currentPiece.y + y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        });
    });

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
}

function handleKeyPress(event) {
    if (event.keyCode === 37) {
        event.preventDefault();
        moveLeft();
    } else if (event.keyCode === 39) {
        event.preventDefault();
        moveRight();
    } else if (event.keyCode === 40) {
        event.preventDefault();
        moveDown();
    } else if (event.keyCode === 38) {
        event.preventDefault();
        rotate();
    }
}

// Export the createTetrisGame function
window.createTetrisGame = createTetrisGame;