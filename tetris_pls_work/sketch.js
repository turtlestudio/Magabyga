let cols = 10;
let rows = 20;
let board = [];
let tetromino;
let tetrominoes = [
  [[1, 1, 1, 1]],                 // I
  [[1, 1], [1, 1]],              // O
  [[0, 1, 0], [1, 1, 1]],        // T
  [[1, 0, 0], [1, 1, 1]],        // J
  [[0, 0, 1], [1, 1, 1]],        // L
  [[1, 1, 0], [0, 1, 1]],        // S
  [[0, 1, 1], [1, 1, 0]]         // Z
];
let colors = ['cyan', 'yellow', 'purple', 'blue', 'orange', 'green', 'red'];
let currentColor;
let speed = 30;
let counter = 0;
let gameOver = false;
let restartButton;

function setup() {
  createCanvas(300, 600);
  frameRate(60);

  for (let i = 0; i < rows; i++) {
    board[i] = Array(cols).fill(0);
  }

  spawnTetromino();

  // Create the Restart button
  restartButton = createButton('Restart');
  restartButton.position(10, height + 10);
  restartButton.mousePressed(restartGame);
}

function draw() {
  background(0);
  drawBoard();

  if (!gameOver) {
    counter++;
    if (counter % speed === 0) {
      if (!move(0, 1)) {
        freeze();
        clearLines();
        spawnTetromino();
        if (!validMove(0, 0)) {
          gameOver = true;
        }
      }
    }
    drawTetromino();
  } else {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
  }
}

function drawBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x]) {
        fill(board[y][x]);
        stroke(0);
        rect(x * 30, y * 30, 30, 30);
      }
    }
  }
}

function drawTetromino() {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        fill(currentColor);
        stroke(0);
        rect((tetromino.x + x) * 30, (tetromino.y + y) * 30, 30, 30);
      }
    }
  }
}

function spawnTetromino() {
  let index = floor(random(tetrominoes.length));
  tetromino = {
    shape: tetrominoes[index],
    x: floor(cols / 2) - 1,
    y: 0
  };
  currentColor = colors[index];
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) move(-1, 0);
  else if (keyCode === RIGHT_ARROW) move(1, 0);
  else if (keyCode === DOWN_ARROW) move(0, 1);
  else if (keyCode === UP_ARROW) rotateTetromino();
  else if (key === " " ) hardDrop(); 
}
function hardDrop() {
  while (move(0, 1)) {} // Move down until it can't
  freeze();             // Lock the piece
  clearLines();         // Clear any filled lines
  spawnTetromino();     // New piece
  if (!validMove(0, 0)) {
    gameOver = true;
  }
}

function move(dx, dy) {
  if (validMove(dx, dy)) {
    tetromino.x += dx;
    tetromino.y += dy;
    return true;
  }
  return false;
}

function validMove(dx, dy, testShape = tetromino.shape) {
  for (let y = 0; y < testShape.length; y++) {
    for (let x = 0; x < testShape[y].length; x++) {
      if (testShape[y][x]) {
        let newX = tetromino.x + x + dx;
        let newY = tetromino.y + y + dy;
        if (
          newX < 0 || newX >= cols || newY >= rows ||
          (newY >= 0 && board[newY][newX])
        ) return false;
      }
    }
  }
  return true;
}

function freeze() {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        let px = tetromino.x + x;
        let py = tetromino.y + y;
        if (py >= 0) board[py][px] = currentColor;
      }
    }
  }
}

function clearLines() {
  for (let y = rows - 1; y >= 0; y--) {
    if (board[y].every(cell => cell)) {
      board.splice(y, 1);
      board.unshift(Array(cols).fill(0));
      y++;
    }
  }
}

function rotateTetromino() {
  let newShape = [];
  let oldShape = tetromino.shape;
  for (let x = 0; x < oldShape[0].length; x++) {
    newShape[x] = [];
    for (let y = oldShape.length - 1; y >= 0; y--) {
      newShape[x].push(oldShape[y][x]);
    }
  }
  if (validMove(0, 0, newShape)) {
    tetromino.shape = newShape;
  }
}

function restartGame() {
  for (let i = 0; i < rows; i++) {
    board[i] = Array(cols).fill(0);
  }
  gameOver = false;
  counter = 0;
  spawnTetromino();
}
