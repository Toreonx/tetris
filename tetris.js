const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const scoreElement = document.getElementById('score')
const mini = 4;
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = 'White';


// create square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = 'Black';
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}



// create board
let board = [];
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
        // all the squares are empty so the value is "#FFF".
    }
}
//create the miniboard

let miniBoard = [];
for (r = 0; r < mini; r++) {
    miniBoard[r] = [];
    for (c = 12; c < 16; c++) {
        miniBoard[r][c] = VACANT;
    }
}

// draw board
function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}
// draw the mini board
function drawMiniBoard() {
    for (r = 0; r < mini; r++) {
        for (c = 12; c < 16; c++) {
            drawSquare(c, r, miniBoard[r][c]);
        }
    }
}
drawMiniBoard();
drawBoard();

// pieces and their color
const PIECES = [
    [Z, "gray"],
    [S, 'orange'],
    [T, 'blue'],
    [O, 'green'],
    [L, 'yellow'],
    [I, 'red'],
    [J, 'purple'],
];

// random piece 
function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length) //0 -> 6
    return new Piece(PIECES[r][0], PIECES[r][1]);
}


let p = randomPiece();
let n = randomPiece();

Piece.prototype.resetFallPosition = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.x = 3;
        this.y = -2;
        this.draw();
    } else {
        // we lock the piece and generate a new one
        this.lock();
        p = n;
        n = randomPiece();
    }

}

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    // to control the pieces
    this.x = 3;
    this.y = -2;
}


// fill function

Piece.prototype.fill = function(color) {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                // draw only occupied square
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }
    // draw piece to the bord
Piece.prototype.draw = function() {
        this.fill(this.color)
    }
    // undraw piece

Piece.prototype.unDraw = function() {
        this.fill(VACANT)
    }
    // move down the piece
Piece.prototype.moveDown = function() {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            // lock the piece and generate a new piece
            this.lock();
            p = n;
            n = randomPiece();
        }

    }
    // move Right the piece
Piece.prototype.moveRight = function() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    // move the piece  to the left
Piece.prototype.moveLeft = function() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    // rotate piece
Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            // its the right wall
            kick = -1; //we need to move the piece to the left 
        } else {
            // its the left wall
            kick = 1; //we need to move the piece to the right
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; //(0+1)%4=> 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}
let lines = 0;
let score = 0;

Piece.prototype.lock = function() {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                // skip the vacant square
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                //pieces locked to the top  = game over
                if (this.y + r < 0) {
                    alert("Game Over")
                        /// stop request animation frame
                    gameOver = true;
                    break;
                }
                // we unlock this piece
                board[this.y + r][this.x + c] = this.color;
            }
        }
        // remove full row 
        for (r = 0; r < ROW; r++) {
            let isRowFull = true;

            for (c = 0; c < COL; c++) {
                isRowFull = isRowFull && (board[r][c] != VACANT);

            }
            if (isRowFull) {
                // if the row is full
                // we move down all the rows above it down
                for (y = r; y > 1; y--) {
                    for (c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];

                    }
                }
                // the top row board[0][..] has no rows above it
                for (c = 0; c < COL; c++) {
                    board[0][c] = VACANT;
                }
                // increment the score
                score += 10
                lines++;
            }
        }
        // update the board

        drawBoard();

        //update score
        scoreElement.innerHTML = score;
        linesElement = document.getElementById('lines')
        linesElement.innerHTML = lines
    }
    // collision function
Piece.prototype.collision = function(x, y, piece) {
        for (r = 0; r < piece.length; r++) {
            for (c = 0; c < piece.length; c++) {
                // if square is vacant, we skip it 
                if (!piece[r][c]) {
                    continue;
                }
                // coordinates after movemont
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                // conditions
                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }
                // skip newY < 0; board(-1) will crush game
                if (newY < 0) {
                    continue;
                }
                // check if locked piece on the board
                if (board[newY][newX] != VACANT) {
                    return true;
                }
            }
        }
        return false;
    }
    // control piece
document.addEventListener('keydown', CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
};
// drop the piece every 1 sec
let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}
drop();