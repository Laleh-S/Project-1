
function init() {
  // All Variables
  const container = document.querySelector('.container');
  const width = 20;
  const cellCount = width * width;
  const cells = [];
  let snakeBody = [202];
  let apple = [Math.floor(Math.random() * cellCount)];
  let lastTimestamp = 0;
  let score = 0;
  let snakeSpeed = 2;
  let gameOver = false;
  let currentDirection = 'up'; // Initialize default direction

  // DOM elements
  const scoreDisplay = document.querySelector('span');
  const speedDisplay = document.querySelector('.speed');
  const gameOverElement = document.querySelector('#gameOver');
  const gameOverSound = document.querySelector('#gameover-audio');
  const appleEatingSound = document.querySelector('#apple-audio');

  // Initialize game
  function initializeGame() {
    createGrid();
    displaySnakeAndApple();
    resetGame();
  }

  // Create grid cells
  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div');
      cell.id = `cell-${i}`;
      cell.classList.add('grid');
      container.appendChild(cell);
      cells.push(cell);
    }
  }

  // Display snake and apple on the grid
  function displaySnakeAndApple() {
    snakeBody.forEach((id) => cells[id].classList.add('snake'));
    apple.forEach((id) => cells[id].classList.add('apple'));
  }

  // Reset game state
  function resetGame() {
    snakeBody = [202];
    apple = [Math.floor(Math.random() * cellCount)];
    score = 0;
    snakeSpeed = 3;
    gameOver = false;
    scoreDisplay.textContent = score;
    speedDisplay.textContent = snakeSpeed;
    gameOverElement.style.visibility = 'hidden';
  }

  // Handle snake movement
  function moveSnake(direction) {
    const snakeHead = snakeBody[snakeBody.length - 1];
    // const snakeTail = snakeBody[0];
    let newSnakeHead;

    switch (direction) {
      case 'up':
        newSnakeHead = (snakeHead - width + cellCount) % cellCount;
        break;
      case 'right':
        newSnakeHead = snakeHead % width === width - 1 ? snakeHead - width + 1 : snakeHead + 1;
        break;
      case 'down':
        newSnakeHead = (snakeHead + width) % cellCount;
        break;
      case 'left':
        newSnakeHead = snakeHead % width === 0 ? snakeHead + width - 1 : snakeHead - 1;
        break;
    }

    const nextCell = cells[newSnakeHead];

    if (nextCell.classList.contains('snake') || gameOver) {
      endGame();
      return;
    }

    snakeBody.push(newSnakeHead);

    if (nextCell.classList.contains('apple')) {
      nextCell.classList.remove('apple');
      appleEatingSound.play();
      spawnNewApple();
      updateScoreAndSpeed();
    } else {

      const snakeTail = snakeBody.shift(); // Remove the first element (tail)
    cells[snakeTail].classList.remove('snake');
    }

    nextCell.classList.add('snake');
  }

  // Update game score and speed
  function updateScoreAndSpeed() {
    score++;
    scoreDisplay.textContent = score;
    snakeSpeed++;
    speedDisplay.textContent = snakeSpeed;
  }

  // Add a new apple on the grid
  function spawnNewApple() {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * cellCount);
    } while (cells[randomId].classList.contains('snake'));

    apple.push(randomId);
    cells[randomId].classList.add('apple');
  }

  // End the game
  function endGame() {
    gameOver = true;
    gameOverElement.style.visibility = 'visible';
    gameOverSound.play();
  }

  // Handle key events to change snake direction
  function handleKeyPress(event) {
    const key = event.keyCode;
    if (key === 38 && currentDirection !== 'down') currentDirection = 'up';
    else if (key === 39 && currentDirection !== 'left') currentDirection = 'right';
    else if (key === 40 && currentDirection !== 'up') currentDirection = 'down';
    else if (key === 37 && currentDirection !== 'right') currentDirection = 'left';
    console.log('Current Direction:', currentDirection); // Debugging
  }

  // Main game loop
  function gameLoop(timestamp) {
    const timeElapsed = timestamp - lastTimestamp;
    if (timeElapsed < 1000 / snakeSpeed || gameOver) {
      requestAnimationFrame(gameLoop);
      return;
    }

    lastTimestamp = timestamp;
    moveSnake(currentDirection);
    requestAnimationFrame(gameLoop);
  }

  // Initialize game on DOM content load
  document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.addEventListener('keydown', handleKeyPress);
    requestAnimationFrame(gameLoop);
  });
}

// Start the game
init();


















