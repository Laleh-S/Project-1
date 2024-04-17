
// Function to initialize the game
function init() {
  // Constants and game variables
  const container = document.querySelector('.container');
  const width = 20;
  const cellCount = width * width;
  const cells = [];

  // Initialize game state
  let snakeBody = [202, 203];
  let apple = [Math.floor(Math.random() * cellCount)];
  let lastUpdateTime = 0;
  let score = 0;
  let snakeSpeed = 2;
  let gameOver = false;

  // DOM element references
  const scoreDisplay = document.querySelector('span');
  const speedDisplay = document.querySelector('.speed');
  const gameOverElement = document.querySelector('#gameOver');
  const gameOverSound = document.querySelector('#gameover-audio');
  const appleEatingSound = document.querySelector('#apple-audio');

  // Set up grid cells
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div');
    cell.id = `cell-${i}`;
    cell.classList.add('grid');
    container.appendChild(cell);
    cells.push(cell);
  }

  // Place initial snake and apple on the grid
  snakeBody.forEach((id) => cells[id].classList.add('snake'));
  apple.forEach((id) => cells[id].classList.add('apple'));

  // Reset game state
  function resetGame() {
    snakeBody = [202, 203];
    apple = [Math.floor(Math.random() * cellCount)];
    lastUpdateTime = 0;
    score = 0;
    snakeSpeed = 2;
    gameOver = false;

    // Clear grid and reinitialize snake and apple
    cells.forEach((cell) => {
      cell.classList.remove('snake', 'apple');
    });
    snakeBody.forEach((id) => cells[id].classList.add('snake'));
    apple.forEach((id) => cells[id].classList.add('apple'));

    // Hide game over message
    gameOverElement.style.visibility = 'hidden';

    // Update score and speed displays
    scoreDisplay.textContent = score;
    speedDisplay.textContent = snakeSpeed;
  }

  // Handle snake movement
  function moveSnake(direction) {
    const snakeHead = snakeBody[snakeBody.length - 1];
    let newSnakeHead;

    // Determine new snake head position based on direction
    switch (direction) {
      case 38: // Up
        newSnakeHead = snakeHead - width < 0 ? snakeHead + cellCount - width : snakeHead - width;
        break;
      case 39: // Right
        newSnakeHead = snakeHead % width === width - 1 ? snakeHead - width + 1 : snakeHead + 1;
        break;
      case 40: // Down
        newSnakeHead = snakeHead + width >= cellCount ? snakeHead - cellCount + width : snakeHead + width;
        break;
      case 37: // Left
        newSnakeHead = snakeHead % width === 0 ? snakeHead + width - 1 : snakeHead - 1;
        break;
    }

    const isEatingApple = cells[newSnakeHead].classList.contains('apple');

    // Check if snake eats the apple
    if (isEatingApple) {
      cells[newSnakeHead].classList.remove('apple');
      appleEatingSound.play();

      // Increase score and snake speed
      score++;
      scoreDisplay.textContent = score;
      snakeSpeed++;
      speedDisplay.textContent = snakeSpeed;

      // Place new apple
      let randomId;
      do {
        randomId = Math.floor(Math.random() * cellCount);
      } while (snakeBody.includes(randomId));
      apple = [randomId];
      cells[randomId].classList.add('apple');
    } else {
      // Move snake normally
      const tail = snakeBody.shift();
      cells[tail].classList.remove('snake');
    }

    const isSnakeCollision = cells[newSnakeHead].classList.contains('snake');

    // Check if snake bites itself
    if (isSnakeCollision) {
      gameOver = true;
      gameOverElement.style.visibility = 'visible';
      gameOverSound.play();

      // Display final score
      const finalScoreDisplay = document.querySelector('#finalScore');
      finalScoreDisplay.textContent = `Final Score: ${score}`;
    }

    // Update snake body and grid
    snakeBody.push(newSnakeHead);
    cells[newSnakeHead].classList.add('snake');
  }

  let currentDirection = 38; // Initial direction: up

  // Update snake direction based on keyboard input
  function updateDirection(e) {
    const key = e.keyCode;
    if ([38, 39, 40, 37].includes(key)) {
      currentDirection = key;
    }
  }

  // Main game loop
  function gameLoop(currentTime) {
    window.requestAnimationFrame(gameLoop);
    const secondsSinceLastUpdate = (currentTime - lastUpdateTime) / 1000;

    if (secondsSinceLastUpdate < 1 / snakeSpeed) return;

    lastUpdateTime = currentTime;

    if (!gameOver) {
      moveSnake(currentDirection);
    }
  }

  // Start game loop and listen for keyboard input
  window.requestAnimationFrame(gameLoop);
  document.addEventListener('keydown', updateDirection);

  // Reset game on button click
  const restartButton = document.querySelector('#restart');
  restartButton.addEventListener('click', resetGame);
}

// Initialize game when DOM content is loaded
window.addEventListener('DOMContentLoaded', init);
































