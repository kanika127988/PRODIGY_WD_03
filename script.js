const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const winningLine = document.getElementById('winningLine');

let options = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // X is Human, O is AI
let isRunning = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
];

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    statusText.textContent = `Your Turn (X)`;
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    // If cell is taken, game stopped, or it's AI's turn, ignore click
    if (options[cellIndex] !== '' || !isRunning || currentPlayer === 'O') {
        return;
    }

    makeMove(cellIndex, 'X');
    
    if (isRunning) {
        currentPlayer = 'O';
        statusText.textContent = `AI is thinking... (O)`;
        setTimeout(aiMove, 500); // 0.5s delay for realistic AI thinking
    }
}

function makeMove(index, player) {
    options[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    checkWinner();
}

// Smart AI Logic (Blocks player win, takes winning move, or picks random)
function aiMove() {
    if (!isRunning) return;

    let move = findBestMove('O'); // Try to win
    if (move === null) {
        move = findBestMove('X'); // Block human win
    }
    if (move === null) {
        // Pick random available cell
        let emptyCells = [];
        options.forEach((val, idx) => {
            if (val === '') emptyCells.push(idx);
        });
        if (emptyCells.length > 0) {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    }

    if (move !== null) {
        makeMove(move, 'O');
        if (isRunning) {
            currentPlayer = 'X';
            statusText.textContent = `Your Turn (X)`;
        }
    }
}

function findBestMove(player) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        let line = [options[a], options[b], options[c]];
        if (line.filter(val => val === player).length === 2 && line.includes('')) {
            if (options[a] === '') return a;
            if (options[b] === '') return b;
            if (options[c] === '') return c;
        }
    }
    return null;
}

function checkWinner() {
    let roundWon = false;
    let winningConditionIndex = -1;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === '' || cellB === '' || cellC === '') {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            winningConditionIndex = i;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = options[winningConditionIndex === -1 ? 0 : winConditions[winningConditionIndex][0]] === 'X' ? `You Win! 🎉` : `AI Wins! 🤖`;
        isRunning = false;
        highlightWinner(winningConditionIndex);
    } else if (!options.includes('')) {
        statusText.textContent = `It's a Draw! 🤝`;
        isRunning = false;
    } else if (currentPlayer === 'X') {
        currentPlayer = 'O';
    }
}

function highlightWinner(index) {
    const condition = winConditions[index];
    // Add pulsing green glow to winning cells
    condition.forEach(idx => {
        cells[idx].classList.add('winner');
    });

    // Draw strike line based on winning condition
    drawWinningLine(index);
}

function drawWinningLine(index) {
    winningLine.style.display = 'block';
    
    // Coordinates and transforms for the 8 win conditions in a 3x3 grid
    switch(index) {
        case 0: // Top Row
            winningLine.style.width = '100%';
            winningLine.style.height = '4px';
            winningLine.style.top = '16.5%';
            winningLine.style.left = '0';
            winningLine.style.transform = 'none';
            break;
        case 1: // Middle Row
            winningLine.style.width = '100%';
            winningLine.style.height = '4px';
            winningLine.style.top = '50%';
            winningLine.style.left = '0';
            winningLine.style.transform = 'translateY(-50%)';
            break;
        case 2: // Bottom Row
            winningLine.style.width = '100%';
            winningLine.style.height = '4px';
            winningLine.style.bottom = '16.5%';
            winningLine.style.left = '0';
            winningLine.style.transform = 'none';
            break;
        case 3: // Left Col
            winningLine.style.width = '4px';
            winningLine.style.height = '100%';
            winningLine.style.top = '0';
            winningLine.style.left = '16.5%';
            winningLine.style.transform = 'none';
            break;
        case 4: // Center Col
            winningLine.style.width = '4px';
            winningLine.style.height = '100%';
            winningLine.style.top = '0';
            winningLine.style.left = '50%';
            winningLine.style.transform = 'translateX(-50%)';
            break;
        case 5: // Right Col
            winningLine.style.width = '4px';
            winningLine.style.height = '100%';
            winningLine.style.top = '0';
            winningLine.style.right = '16.5%';
            winningLine.style.transform = 'none';
            break;
        case 6: // Diagonal Top-Left to Bottom-Right
            winningLine.style.width = '135%';
            winningLine.style.height = '4px';
            winningLine.style.top = '50%';
            winningLine.style.left = '-17%';
            winningLine.style.transform = 'rotate(45deg)';
            break;
        case 7: // Diagonal Top-Right to Bottom-Left
            winningLine.style.width = '135%';
            winningLine.style.height = '4px';
            winningLine.style.top = '50%';
            winningLine.style.left = '-17%';
            winningLine.style.transform = 'rotate(-45deg)';
            break;
    }
}

function restartGame() {
    currentPlayer = 'X';
    options = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `Your Turn (X)`;
    isRunning = true;
    winningLine.style.display = 'none';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
}

initializeGame();