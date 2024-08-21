const gameBoard = document.getElementById('game-board');
const gameModal = document.getElementById('game-modal');
const gameContainer = document.getElementById('game-container');
const aiDifficultyContainer = document.getElementById('ai-difficulty');

const playFriendBtn = document.getElementById('select-friend');
const difficultyButtons = document.querySelectorAll('.difficulty-button');

const rows = 6;
const cols = 7;
let currentPlayer = 'player-one';
let gameActive = true;
let aiEnabled = false;
let aiDifficulty = 'medium';

// Initialize an empty board
let board = Array(rows).fill(null).map(() => Array(cols).fill(null));

// Ensure no win condition is checked on page load
resetGame(); 

// Handle game mode selection
playFriendBtn.addEventListener('click', () => {
    startGame();
});

difficultyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        aiDifficulty = e.target.dataset.difficulty;
        aiEnabled = true;
        startGame();
    });
});

// Start the game
function startGame() {
    resetGame(); // Ensure the game state is clean before starting
    gameModal.style.display = 'none';
    gameContainer.classList.remove('hidden');
    renderBoard();
}

// Render the board
function renderBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.dataset.row = r;
            cell.dataset.col = c;
            if (board[r][c]) {
                cell.classList.add(board[r][c]);
            }
            gameBoard.appendChild(cell);
        }
    }
}

// Drop disc into column with animation
function dropDisc(col) {
    if (!gameActive) return;

    let row = -1;
    for (let r = rows - 1; r >= 0; r--) {
        if (!board[r][col]) {
            row = r;
            break;
        }
    }

    if (row !== -1) {
        board[row][col] = currentPlayer;
        animateDiscDrop(row, col, currentPlayer, () => {
            if (checkWin()) {
                gameActive = false;
                const playerColor = currentPlayer === 'player-one' ? 'Player One (Red)' : 'Player Two (Yellow)';
                alert(`${playerColor} Wins!`);
            } else {
                currentPlayer = currentPlayer === 'player-one' ? 'player-two' : 'player-one';
                renderBoard();

                if (aiEnabled && currentPlayer === 'player-two') {
                    setTimeout(() => aiMove(), 500); // Faster AI response time
                }
            }
        });
    }
}

// AI Move with delayed animation
function aiMove() {
    let bestCol = -1;
    let bestScore = -Infinity;

    for (let c = 0; c < cols; c++) {
        const r = getRow(c);
        if (r !== -1) {
            board[r][c] = 'player-two';
            const score = minimax(board, 3, false);
            board[r][c] = null;

            if (score > bestScore) {                if (score > bestScore) {
                bestScore = score;
                bestCol = c;
            }
        }
    }
}

if (bestCol === -1) {
    bestCol = Math.floor(Math.random() * cols);
}

const row = getRow(bestCol);
board[row][bestCol] = 'player-two';
animateDiscDrop(row, bestCol, 'player-two', () => {
    if (checkWin()) {
        gameActive = false;
        alert(`Player Two (Yellow) Wins!`);
    } else {
        currentPlayer = 'player-one';
        renderBoard();
    }
});
}

// Animate the disc drop
function animateDiscDrop(row, col, player, callback) {
const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
cell.classList.add(player, 'falling');
setTimeout(() => {
    cell.classList.remove('falling');
    callback();
}, 400);
}

// Minimax Algorithm for AI
function minimax(board, depth, isMaximizing) {
if (checkWin()) {
    return isMaximizing ? -1 : 1;
}
if (depth === 0) {
    return 0;
}

let bestScore = isMaximizing ? -Infinity : Infinity;

for (let c = 0; c < cols; c++) {
    const r = getRow(c);
    if (r !== -1) {
        board[r][c] = isMaximizing ? 'player-two' : 'player-one';
        const score = minimax(board, depth - 1, !isMaximizing);
        board[r][c] = null;

        if (isMaximizing) {
            bestScore = Math.max(score, bestScore);
        } else {
            bestScore = Math.min(score, bestScore);
        }
    }
}

return bestScore;
}

function getRow(col) {
for (let r = rows - 1; r >= 0; r--) {
    if (!board[r][col]) {
        return r;
    }
}
return -1;
}

// Check for a win
function checkWin() {
const directions = [
    { r: 0, c: 1 },  // Horizontal
    { r: 1, c: 0 },  // Vertical
    { r: 1, c: 1 },  // Diagonal down-right
    { r: 1, c: -1 }  // Diagonal down-left
];

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const player = board[r][c];
        if (player) {
            for (const { r: dr, c: dc } of directions) {
                let win = true;
                for (let i = 1; i < 4; i++) {
                    const nr = r + dr * i;
                    const nc = c + dc * i;
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || board[nr][nc] !== player) {
                        win = false;
                        break;
                    }
                }
                if (win) return true;
            }
        }
    }
}
return false;
}

// Reset the game state
function resetGame() {
board = Array(rows).fill(null).map(() => Array(cols).fill(null));  // Reset the board to its initial state
currentPlayer = 'player-one';
gameActive = true;
renderBoard();
}

// Handle column clicks
gameBoard.addEventListener('click', (e) => {
const col = e.target.dataset.col;
if (col !== undefined) {
    dropDisc(parseInt(col));
}
});

// Initial Render
renderBoard();

               
