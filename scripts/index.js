const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const randomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const COLORS = [
    "red",
    "orange",
    "green",
    "purple",
    "yellow",
    "blue",
    "cyan",
    "white",
];
const WHITE_ID = 7;
const BRICK_LAYOUTS = [
    [
        [
            [7, 0, 7],
            [0, 0, 0],
            [7, 7, 7],
        ],
        [
            [7, 0, 7],
            [7, 0, 0],
            [7, 0, 7],
        ],
        [
            [7, 7, 7],
            [0, 0, 0],
            [7, 0, 7],
        ],
        [
            [7, 0, 7],
            [0, 0, 7],
            [7, 0, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [7, 1, 7],
            [7, 1, 1],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 1],
            [1, 1, 1],
            [7, 7, 7],
        ],
    ],
    [
        [
            [2, 7, 7],
            [2, 2, 7],
            [7, 2, 7],
        ],
        [
            [7, 7, 7],
            [7, 2, 2],
            [2, 2, 7],
        ],
        [
            [2, 7, 7],
            [2, 2, 7],
            [7, 2, 7],
        ],
        [
            [7, 7, 7],
            [7, 2, 2],
            [2, 2, 7],
        ],
    ],
    [
        [
            [3, 3, 7],
            [7, 3, 3],
            [7, 7, 7],
        ],
        [
            [7, 3, 7],
            [3, 3, 7],
            [3, 7, 7],
        ],
        [
            [3, 3, 7],
            [7, 3, 3],
            [7, 7, 7],
        ],
        [
            [7, 3, 7],
            [3, 3, 7],
            [3, 7, 7],
        ],
    ],
    [
        [
            [7, 4, 7, 7],
            [7, 4, 7, 7],
            [7, 4, 7, 7],
            [7, 4, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [4, 4, 4, 4],
            [7, 7, 7, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 4, 7, 7],
            [7, 4, 7, 7],
            [7, 4, 7, 7],
            [7, 4, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [4, 4, 4, 4],
            [7, 7, 7, 7],
            [7, 7, 7, 7],
        ],
    ],
    [
        [
            [7, 7, 7, 7],
            [7, 5, 5, 7],
            [7, 5, 5, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 5, 5, 7],
            [7, 5, 5, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 5, 5, 7],
            [7, 5, 5, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 5, 5, 7],
            [7, 5, 5, 7],
            [7, 7, 7, 7],
        ],
    ],
    [
        [
            [6, 7, 7],
            [6, 6, 6],
            [7, 7, 7],
        ],
        [
            [7, 6, 6],
            [7, 6, 7],
            [7, 6, 7],
        ],
        [
            [7, 7, 7],
            [6, 6, 6],
            [7, 7, 6],
        ],
        [
            [7, 6, 7],
            [7, 6, 7],
            [6, 6, 7],
        ],
    ],
];
const KEY_CODES = {
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    DOWN: "ArrowDown",
    UP: "ArrowUp",
};

const alertDialog = document.getElementById("alert");
const playBtn = document.getElementById("play");

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
        this.score = 0;
        this.gameOver = false;
        this.isPlaying = false;
        this.completeSound = new Audio("audio/uwu.mp3");
        this.gameOverSound = new Audio("audio/fail.mp3");
    }

    generateWhiteBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_ID));
    }

    drawCell(xAxis, yAxis, colorId) {
        this.ctx.fillStyle = colorId !== WHITE_ID ? randomColor() : COLORS[WHITE_ID];
        this.ctx.fillRect(
            xAxis * BLOCK_SIZE,
            yAxis * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(
            xAxis * BLOCK_SIZE,
            yAxis * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
    }

    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }

    handleCompleteRows() {
        const latestGrid = this.grid.filter((row) => {
            return row.some((col) => col === WHITE_ID);
        });

        const newScore = ROWS - latestGrid.length;
        if (newScore) {
            const newRows = Array.from({ length: newScore }, () =>
                Array(COLS).fill(WHITE_ID)
            );
            this.grid = [...newRows, ...latestGrid];
            this.handleUpdateScore(newScore);
            this.completeSound.play();
        }
        return newScore;
    }

    handleUpdateScore(newScore) {
        this.score += newScore;
        document.getElementById("score").innerHTML = this.score;
    }

    handleGameOver() {
        this.gameOver = true;
        this.isPlaying = false;
        this.gameOverSound.play();
        alertDialog.style.display = 'flex';
    }

    reset () {
        this.score = 0;
        this.gameOver = false;
        this.grid = this.generateWhiteBoard();
        this.drawBoard();
    }
}

class Brick {
    constructor(id) {
        this.id = id;
        this.layout = BRICK_LAYOUTS[id];
        this.activeIndex = 0;
        this.colPos = 3;
        this.rowPos = -2;
        this.landedSound = new Audio("audio/landed.mp3");
    }

    draw() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (
                let col = 0;
                col < this.layout[this.activeIndex][0].length;
                col++
            ) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
                    board.drawCell(
                        col + this.colPos,
                        row + this.rowPos,
                        this.id
                    );
                }
            }
        }
    }

    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (
                let col = 0;
                col < this.layout[this.activeIndex][0].length;
                col++
            ) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
                    board.drawCell(
                        col + this.colPos,
                        row + this.rowPos,
                        WHITE_ID
                    );
                }
            }
        }
    }

    moveLeft() {
        if (
            !this.checkColision(
                this.rowPos,
                this.colPos - 1,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.colPos--;
            this.draw();
        }
    }

    moveRight() {
        if (
            !this.checkColision(
                this.rowPos,
                this.colPos + 1,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }

    moveDown() {
        if (
            !this.checkColision(
                this.rowPos + 1,
                this.colPos,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.rowPos++;
            this.draw();
            return;
        }
        this.handleLanded();
        if (!board.gameOver) {
            generateNewBrick();
        }
    }

    rotate() {
        if (
            !this.checkColision(
                this.rowPos + 1,
                this.colPos,
                this.layout[(this.activeIndex + 1) % 4]
            )
        ) {
            this.clear();
            this.activeIndex = (this.activeIndex + 1) % 4;
            this.draw();
        }
    }

    checkColision(nextRow, nextCol, nextLayout) {
        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if (nextLayout[row][col] !== WHITE_ID && nextRow >=0) {
                    if (
                        col + nextCol < 0 ||
                        col + nextCol >= COLS ||
                        row + nextRow >= ROWS ||
                        board.grid[row + nextRow][col + nextCol] !== WHITE_ID
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    handleLanded() {
        if (this.rowPos < 0) {
            board.handleGameOver();
            return
        }
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (
                let col = 0;
                col < this.layout[this.activeIndex][0].length;
                col++
            ) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id;
                }
            }
        }

        const newScore = board.handleCompleteRows();
        board.drawBoard();
        if (!newScore) {
            this.landedSound.play();
        }
    }
}
let brick;
const generateNewBrick = () => {
    brick = new Brick(Math.floor((Math.random() * 10) % BRICK_LAYOUTS.length));
};

const board = new Board(ctx);
board.drawBoard();

playBtn.addEventListener("click", function() {
    if(!board.isPlaying) {{
        const opening = new Audio("audio/opening.mp3");
        opening.play();
        board.reset();
        board.isPlaying = true;
        playBtn.style.display = "none";
        generateNewBrick();
        
        const interval = setInterval(() => {
            if (!board.gameOver) {
                brick.moveDown();
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }}
})

document.addEventListener("keydown", function (e) {
    if (!board.gameOver && board.isPlaying) {
        switch (e.code) {
            case KEY_CODES.DOWN: {
                brick.moveDown();
                break;
            }
            case KEY_CODES.LEFT: {
                brick.moveLeft();
                break;
            }
            case KEY_CODES.RIGHT: {
                brick.moveRight();
                break;
            }
            case KEY_CODES.UP: {
                brick.rotate();
                break;
            }
            default: {
                break;
            }
        }
    }
});

document.getElementById("close-btn").addEventListener("click", function() {
    alertDialog.style.display = "none";
    playBtn.style.display = "block";
    board.reset();

})
