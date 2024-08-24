const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

const box = 25;
const canvasSize = canvas.width;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = '';
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
};
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

highScoreDisplay.innerText = highScore;

document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
    else if (event.key === 'a' && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.key === 'w' && direction !== 'DOWN') direction = 'UP';
    else if (event.key === 'd' && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.key === 's' && direction !== 'UP') direction = 'DOWN';
}

function collision(newHead, snakeArray) {
    for (let i = 0; i < snakeArray.length; i++) {
        if (newHead.x === snakeArray[i].x && newHead.y === snakeArray[i].y) {
            return true;
        }
    }
    return false;
}

function drawGame() {
    ctx.fillStyle = '#1f2833';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#38ef7d' : '#11998e';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#38ef7d';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreDisplay.innerText = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)
    ) {
        clearInterval(game);
        restartButton.style.display = 'block';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.innerText = highScore;
        }
        return;
    }

    snake.unshift(newHead);
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    direction = 'RIGHT';
    score = 0;
    scoreDisplay.innerText = score;
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
    };
    game = setInterval(drawGame, 200); // Slower speed
});

restartButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    direction = 'RIGHT';
    score = 0;
    scoreDisplay.innerText = score;
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
    };
    game = setInterval(drawGame, 200); // Slower speed
});

let game;
