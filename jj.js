document.addEventListener('DOMContentLoaded', function () {
    const selectFriendBtn = document.getElementById('select-friend');
    const gameContainer = document.getElementById('game-container');
    const gameModal = document.getElementById('game-modal');
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    const gameBoard = document.getElementById('game-board');
    const refreshMessage = document.getElementById('refresh-message');
    
    let currentPlayer = 'player-one'; // Start with player one
    let gameOver = false; // Track the game state
    let playingWithAI = false; // Determine if playing with AI
    let difficulty = 'medium'; // Default difficulty

    function createGameBoard() {
        gameBoard.innerHTML = ''; // Clear existing game board, if any

        // Create a 7x6 grid for Connect Four
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameBoard.appendChild(cell);
            }
        }

        // Add click event to each column
        const columns = Array.from({ length: 7 }, (_, col) => col);
        columns.forEach(col => {
            const columnCells = document.querySelectorAll(`[data-col='${col}']`);
            columnCells.forEach(cell => {
                cell.addEventListener('click', () => handleClick(col));
            });
        });
    }

    function handleClick(col) {
        if (gameOver) return; // Prevent further moves if the game is over

        const columnCells = Array.from(document.querySelectorAll(`[data-col='${col}']`));

        // Find the first empty cell in the column (from bottom to top)
        for (let i = columnCells.length - 1; i >= 0; i--) {
            const cell = columnCells[i];
            if (!cell.classList.contains('player-one') && !cell.classList.contains('player-two')) {
                cell.classList.add(currentPlayer, 'falling');
                if (checkWin(cell.dataset.row, cell.dataset.col)) {
                    displayWinner();
                    gameOver = true;
                    return;
                }
                switchPlayer();
                if (playingWithAI && currentPlayer === 'player-two') {
                    setTimeout(aiMove, 500); // Let the AI make a move after 500ms
                }
                break;
            }
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'player-one' ? 'player-two' : 'player-one';
    }

    function aiMove() {
        if (gameOver) return; // Prevent AI from making a move if the game is over

        const availableColumns = getAvailableColumns();
        let selectedCol = findBestMove(availableColumns);

        handleClick(selectedCol);
    }

    function getAvailableColumns() {
        const availableColumns = [];
        for (let col = 0; col < 7; col++) {
            const columnCells = Array.from(document.querySelectorAll(`[data-col='${col}']`));
            if (columnCells.some(cell => !cell.classList.contains('player-one') && !cell.classList.contains('player-two'))) {
                availableColumns.push(col);
            }
        }
        return availableColumns;
    }

    function findBestMove(availableColumns) {
        // Check for immediate win or block
        for (let col of availableColumns) {
            const columnCells = Array.from(document.querySelectorAll(`[data-col='${col}']`));
            for (let i = columnCells.length - 1; i >= 0; i--) {
                const cell = columnCells[i];
                if (!cell.classList.contains('player-one') && !cell.classList.contains('player-two')) {
                    // Check for a winning move
                    cell.classList.add(currentPlayer);
                    if (checkWin(cell.dataset.row, cell.dataset.col)) {
                        cell.classList.remove(currentPlayer);
                        return col; // Take the winning move immediately
                    }
                    cell.classList.remove(currentPlayer);

                    // Check if the opponent has a winning move to block
                    const opponent = currentPlayer === 'player-one' ? 'player-two' : 'player-one';
                    cell.classList.add(opponent);
                    if (checkWin(cell.dataset.row, cell.dataset.col)) {
                        cell.classList.remove(opponent);
                        return col; // Block the opponent's winning move
                    }
                    cell.classList.remove(opponent);
                    break;
                }
            }
        }

        // Randomly choose a column if no immediate win or block is available
        return availableColumns[Math.floor(Math.random() * availableColumns.length)];
    }

    function checkWin(row, col) {
        const directions = [
            { r: 0, c: 1 }, // Horizontal
            { r: 1, c: 0 }, // Vertical
            { r: 1, c: 1 }, // Diagonal down-right
            { r: 1, c: -1 } // Diagonal down-left
        ];

        const checkDirection = (rInc, cInc) => {
            let count = 0;
            let r = parseInt(row);
            let c = parseInt(col);

            for (let i = 0; i < 4; i++) {
                const checkCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (checkCell && checkCell.classList.contains(currentPlayer)) {
                    count++;
                    r += rInc;
                    c += cInc;
                } else {
                    break;
                }
            }
            return count;
        };

        return directions.some(direction => checkDirection(direction.r, direction.c) + checkDirection(-direction.r, -direction.c) - 1 >= 4);
    }

    function displayWinner() {
        const winner = currentPlayer === 'player-one' ? 'Red' : 'Yellow';
        refreshMessage.textContent = `${winner} won! Refresh to play again.`;

        // Add a noticeable animation for the win
        gameBoard.classList.add('win-flash');
        setTimeout(() => {
            gameBoard.classList.remove('win-flash');
        }, 2000);

        // Optionally add a Google event to draw attention
        gtag('event', 'Game Win', {
            'event_category': 'Connect Four',
            'event_label': `${winner} Wins`,
            'value': 1
        });
    }

    function hideModal() {
        gameModal.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameContainer.classList.add('visible'); // Trigger the slide down
        createGameBoard(); // Create the game board when starting the game
    }

    selectFriendBtn.addEventListener('click', function () {
        playingWithAI = false;
        hideModal();
    });

    difficultyButtons.forEach(button => {
        button.addEventListener('click', function () {
            difficulty = button.dataset.difficulty;
            playingWithAI = true;
            hideModal();
        });
    });
});
