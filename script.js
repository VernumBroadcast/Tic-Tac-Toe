// Game constants
const PLAYER_HAND = '✋';
const PLAYER_BALL = '🏐';
const EMPTY = '';

// Game state
let board = Array(9).fill(EMPTY);
let currentPlayer = PLAYER_HAND;
let gameOver = false;

// DOM elements
const cells = document.querySelectorAll('.cell');
const playerIndicator = document.getElementById('player-indicator');
const gameStatus = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');
const fullscreenSting = document.getElementById('fullscreen-sting');
const stingEmoji = document.getElementById('sting-emoji');
const stingMessage = document.getElementById('sting-message');
const stingResetBtn = document.getElementById('sting-reset-btn');

// Winning combinations
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Initialize the game
function initGame() {
    resetGame();
    setupEventListeners();
}

// Reset the game
function resetGame() {
    board = Array(9).fill(EMPTY);
    currentPlayer = PLAYER_HAND;
    gameOver = false;
    
    cells.forEach((cell) => {
        const numberSpan = cell.querySelector('.cell-number');
        if (numberSpan) {
            numberSpan.style.display = 'block';
        }
        // Clear emoji content (text nodes that aren't numbers)
        const childNodes = Array.from(cell.childNodes);
        childNodes.forEach(node => {
            if (node.nodeType === 3) {
                const text = node.textContent.trim();
                if (text && (text === PLAYER_HAND || text === PLAYER_BALL)) {
                    node.remove();
                }
            }
        });
        cell.classList.remove('winner', 'filled');
    });
    
    updatePlayerIndicator();
    gameStatus.textContent = '';
    resetBtn.style.display = 'none';
    hideFullscreenSting();
}

// Setup event listeners
function setupEventListeners() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetBtn.addEventListener('click', resetGame);
    stingResetBtn.addEventListener('click', resetGame);
    
    // Keyboard input for number selection
    document.addEventListener('keydown', handleKeyPress);
}

// Handle cell click
function handleCellClick(event) {
    if (gameOver) return;
    
    const cell = event.target.closest('.cell');
    if (!cell) return;
    
    const index = parseInt(cell.dataset.index);
    
    // Check if cell is already taken
    if (board[index] !== EMPTY) return;
    
    makeMove(index, cell);
}

// Handle keyboard press
function handleKeyPress(event) {
    if (gameOver) return;
    
    const key = event.key;
    // Check if key is a number 1-9
    if (key >= '1' && key <= '9') {
        const number = parseInt(key);
        const index = number - 1; // Convert to 0-based index
        
        // Check if cell is already taken
        if (board[index] !== EMPTY) return;
        
        makeMove(index, cells[index]);
    }
}

// Make a move on the board
function makeMove(index, cellElement) {
    // Make the move
    board[index] = currentPlayer;
    
    // Hide the number
    const numberSpan = cellElement.querySelector('.cell-number');
    if (numberSpan) {
        numberSpan.style.display = 'none';
    }
    
    // Add emoji to cell (create text node if needed)
    const existingText = Array.from(cellElement.childNodes).find(node => 
        node.nodeType === 3 && node.textContent.trim() && !node.textContent.match(/^\d+$/)
    );
    
    if (existingText) {
        existingText.textContent = currentPlayer;
    } else {
        const emojiText = document.createTextNode(currentPlayer);
        cellElement.appendChild(emojiText);
    }
    
    cellElement.classList.add('filled');
    
    // Check for win or draw
    if (checkWin(currentPlayer)) {
        gameOver = true;
        highlightWinningCells();
        setTimeout(() => {
            showFullscreenSting(`${currentPlayer} Wins!`, currentPlayer);
        }, 500);
    } else if (checkDraw()) {
        gameOver = true;
        setTimeout(() => {
            showFullscreenSting("It's a Draw!", '');
        }, 500);
    } else {
        // Switch player
        currentPlayer = currentPlayer === PLAYER_HAND ? PLAYER_BALL : PLAYER_HAND;
        updatePlayerIndicator();
    }
}

// Check for win
function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

// Check for draw
function checkDraw() {
    return board.every(cell => cell !== EMPTY);
}

// Highlight winning cells
function highlightWinningCells() {
    const winningCombo = winningCombinations.find(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
    
    if (winningCombo) {
        winningCombo.forEach(index => {
            cells[index].classList.add('winner');
        });
    }
}

// Update player indicator
function updatePlayerIndicator() {
    playerIndicator.textContent = currentPlayer;
}

// Show fullscreen sting animation
function showFullscreenSting(message, emoji) {
    stingMessage.textContent = message;
    stingEmoji.textContent = emoji;
    fullscreenSting.classList.add('active');
}

// Hide fullscreen sting animation
function hideFullscreenSting() {
    fullscreenSting.classList.remove('active');
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);
