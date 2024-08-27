document.addEventListener('DOMContentLoaded', function () {
    const selectFriendBtn = document.getElementById('select-friend');
    const selectAIBtn = document.getElementById('select-ai');
    const gameContainer = document.getElementById('game-container');
    const gameModal = document.getElementById('game-modal');
    const gameBoard = document.getElementById('game-board');
    const ball = document.getElementById('ball');
    const paddleLeft = document.getElementById('paddle-left');
    const paddleRight = document.getElementById('paddle-right');
    const scoreLeftElem = document.createElement('div');
    const scoreRightElem = document.createElement('div');
    const controlsInfo = document.getElementById('controls-info');
    const instructions = document.getElementById('instructions');

    // Append score elements to the game board
    gameBoard.appendChild(scoreLeftElem);
    gameBoard.appendChild(scoreRightElem);

    // Game variables
    let ballX = gameBoard.clientWidth / 2;
    let ballY = gameBoard.clientHeight / 2;
    let ballSpeedX = 4;  // Increased ball speed
    let ballSpeedY = 4;  // Increased ball speed
    let scoreLeft = 0;
    let scoreRight = 0;

    let paddleLeftY = gameBoard.clientHeight / 2 - paddleLeft.clientHeight / 2;
    let paddleRightY = gameBoard.clientHeight / 2 - paddleRight.clientHeight / 2;
    let paddleSpeed = 5;

    // Key press states
    let wKeyPressed = false;
    let sKeyPressed = false;
    let upArrowPressed = false;
    let downArrowPressed = false;

    // Game state variables
    let playingWithAI = false;

    // Initialize game
    selectFriendBtn.addEventListener('click', function () {
        playingWithAI = false;
        controlsInfo.textContent = "Player 1: W and S keys | Player 2: Arrow keys";
        controlsInfo.classList.remove('hidden');
        instructions.textContent = "Player 1: W and S keys | Player 2: Arrow keys";
        startGame();
    });

    selectAIBtn.addEventListener('click', function () {
        playingWithAI = true;
        controlsInfo.textContent = "Use Arrow Up and Arrow Down keys to play";
        controlsInfo.classList.remove('hidden');
        instructions.textContent = "Use Arrow Up and Arrow Down keys to play";
        startGame();
    });

    function startGame() {
        gameModal.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameContainer.classList.add('visible');
        resetScores();
        update(); // Start the game loop
    }

    function resetScores() {
        scoreLeft = 0;
        scoreRight = 0;
        updateScore();
    }

    // Update game objects
    function update() {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with top and bottom
        if (ballY <= 0 || ballY + ball.clientHeight >= gameBoard.clientHeight) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball collision with paddles
        if (ballX <= paddleLeft.clientWidth) {
            if (ballY >= paddleLeftY && ballY <= paddleLeftY + paddleLeft.clientHeight) {
                ballSpeedX = -ballSpeedX;
            }
        }

        if (ballX + ball.clientWidth >= gameBoard.clientWidth - paddleRight.clientWidth) {
            if (ballY >= paddleRightY && ballY <= paddleRightY + paddleRight.clientHeight) {
                ballSpeedX = -ballSpeedX;
            }
        }

        // Ball out of bounds
        if (ballX <= 0) {
            scoreRight++;
            updateScore();
            resetBall();
        }

        if (ballX + ball.clientWidth >= gameBoard.clientWidth) {
            scoreLeft++;
            updateScore();
            resetBall();
        }

        // Move paddles
        if (!playingWithAI) {
            if (wKeyPressed && paddleLeftY > 0) {
                paddleLeftY -= paddleSpeed;
            } else if (sKeyPressed && paddleLeftY < gameBoard.clientHeight - paddleLeft.clientHeight) {
                paddleLeftY += paddleSpeed;
            }
        }

        if (upArrowPressed && paddleRightY > 0) {
            paddleRightY -= paddleSpeed;
        } else if (downArrowPressed && paddleRightY < gameBoard.clientHeight - paddleRight.clientHeight) {
            paddleRightY += paddleSpeed;
        }

        // AI movement for left paddle
        if (playingWithAI) {
            moveAI();
        }

        // Update positions
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        paddleLeft.style.top = `${paddleLeftY}px`;
        paddleRight.style.top = `${paddleRightY}px`;

        requestAnimationFrame(update);
    }

    function moveAI() {
        const aiSpeed = 2.5; // Adjusted speed to make AI beatable
        if (ballY < paddleLeftY + paddleLeft.clientHeight / 2) {
            paddleLeftY -= aiSpeed;
        } else if (ballY > paddleLeftY + paddleLeft.clientHeight / 2) {
            paddleLeftY += aiSpeed;
        }
    }

    // Reset ball position
    function resetBall() {
        ballX = gameBoard.clientWidth / 2 - ball.clientWidth / 2;
        ballY = gameBoard.clientHeight / 2 - ball.clientHeight / 2;
        ballSpeedX = -ballSpeedX; // Change direction
    }

    // Update the score display
    function updateScore() {
        scoreLeftElem.textContent = `Player 1: ${scoreLeft}`;
        scoreRightElem.textContent = `Player 2: ${scoreRight}`;
        scoreLeftElem.style.position = 'absolute';
        scoreLeftElem.style.top = '10px';
        scoreLeftElem.style.left = '20px';
        scoreLeftElem.style.color = '#38ef7d';
        scoreLeftElem.style.fontSize = '1.5rem';
        scoreRightElem.style.position = 'absolute';
        scoreRightElem.style.top = '10px';
        scoreRightElem.style.right = '20px';
        scoreRightElem.style.color = '#38ef7d';
        scoreRightElem.style.fontSize = '1.5rem';
    }

    // Event listeners for paddle movement
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp') {
            upArrowPressed = true;
        } else if (event.key === 'ArrowDown') {
            downArrowPressed = true;
        } else if (!playingWithAI && (event.key === 'w' || event.key === 'W')) {
            wKeyPressed = true;
        } else if (!playingWithAI && (event.key === 's' || event.key === 'S')) {
            sKeyPressed = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.key === 'ArrowUp') {
            upArrowPressed = false;
        } else if (event.key === 'ArrowDown') {
            downArrowPressed = false;
        } else if (!playingWithAI && (event.key === 'w' || event.key === 'W')) {
            wKeyPressed = false;
        } else if (!playingWithAI && (event.key === 's' || event.key === 'S')) {
            sKeyPressed = false;
        }
    });
});
