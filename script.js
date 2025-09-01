// DOM Elements
const gameModal = document.getElementById('gameModal');
const detailsModal = document.getElementById('detailsModal');
const gameContainer = document.getElementById('gameContainer');
const detailsContainer = document.getElementById('detailsContainer');
const closeButtons = document.querySelectorAll('.close');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Game Data
const games = {
    snake: {
        title: "Islamic Snake Game",
        description: "Navigate through beautiful Islamic geometric patterns. Collect golden crescents and avoid obstacles while learning about Islamic symbols.",
        instructions: "Use arrow keys to control the snake. Collect golden crescents to grow and earn points. Avoid hitting walls or yourself.",
        features: ["Beautiful Islamic geometric patterns", "Educational content about Islamic symbols", "Progressive difficulty levels", "Score tracking"]
    },
    tetris: {
        title: "Islamic Tetris",
        description: "Build beautiful patterns with Islamic geometric shapes. Each piece represents different elements of Islamic art and architecture.",
        instructions: "Rotate and position falling pieces to create complete rows. Use arrow keys to move and rotate pieces.",
        features: ["Islamic geometric shapes", "Beautiful color schemes", "Multiple difficulty levels", "Pattern recognition"]
    },
    memory: {
        title: "Islamic Memory Match",
        description: "Match beautiful Islamic calligraphy, symbols, and geometric patterns. Test your memory while learning about Islamic art.",
        instructions: "Click on cards to reveal them. Find matching pairs to clear the board. Complete the game with the fewest moves.",
        features: ["Islamic calligraphy", "Geometric patterns", "Multiple difficulty levels", "Move counter"]
    },
    puzzle: {
        title: "Islamic Puzzle",
        description: "Solve puzzles featuring beautiful Islamic architecture and geometric designs. Piece together stunning images of mosques and Islamic art.",
        instructions: "Click on pieces adjacent to the empty space to move them. Arrange pieces to complete the puzzle. Use the shuffle button to start a new puzzle.",
        features: ["Islamic architecture", "Beautiful imagery", "Multiple puzzle sizes", "Progressive unlocking"]
    }
};

// Navigation
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Mobile navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    }
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        gameModal.style.display = 'none';
        detailsModal.style.display = 'none';
        if (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        gameModal.style.display = 'none';
        if (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
    }
    if (e.target === detailsModal) {
        detailsModal.style.display = 'none';
    }
});

// Play Game Function
function playGame(gameType) {
    gameModal.style.display = 'block';
    
    // Clear previous game
    if (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }
    
    switch(gameType) {
        case 'snake':
            createSnakeGame();
            break;
        case 'tetris':
            createTetrisGame();
            break;
        case 'memory':
            createMemoryGame();
            break;
        case 'puzzle':
            createPuzzleGame();
            break;
    }
}

// Show Game Details Function
function showGameDetails(gameType) {
    detailsModal.style.display = 'block';
    const game = games[gameType];
    
    detailsContainer.innerHTML = `
        <div class="game-details">
            <h2>${game.title}</h2>
            <p class="game-description">${game.description}</p>
            
            <div class="game-instructions">
                <h3>How to Play</h3>
                <p>${game.instructions}</p>
            </div>
            
            <div class="game-features">
                <h3>Features</h3>
                <ul>
                    ${game.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="game-actions">
                <button class="btn btn-primary" onclick="playGame('${gameType}')">Play Now</button>
                <button class="btn btn-secondary" onclick="detailsModal.style.display='none'">Close</button>
            </div>
        </div>
    `;
}

// Snake Game Implementation
function createSnakeGame() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = '2px solid #1e3c72';
    canvas.style.borderRadius = '10px';
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameSpeed = 100;
    let gameLoop;
    let gameStarted = false;
    
    // Game controls
    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        
        const keyPressed = event.keyCode;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;
        
        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -1;
            dy = 0;
            if (!gameStarted) startGame();
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -1;
            if (!gameStarted) startGame();
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 1;
            dy = 0;
            if (!gameStarted) startGame();
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 1;
            if (!gameStarted) startGame();
        }
    }
    
    document.addEventListener('keydown', changeDirection);
    
    function startGame() {
        gameStarted = true;
        gameLoop = setInterval(gameStep, gameSpeed);
    }
    
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw Islamic pattern background
        drawIslamicPattern();
        
        // Draw snake
        ctx.fillStyle = '#1e3c72';
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Draw head with different color
                ctx.fillStyle = '#2a5298';
            } else {
                ctx.fillStyle = '#1e3c72';
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
        
        // Draw food (golden crescent)
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw score
        ctx.fillStyle = '#1e3c72';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
        
        // Draw instructions if game hasn't started
        if (!gameStarted) {
            ctx.fillStyle = 'rgba(30, 60, 114, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Use arrow keys to start the game', canvas.width/2, canvas.height/2);
        }
    }
    
    function drawIslamicPattern() {
        ctx.strokeStyle = 'rgba(30, 60, 114, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < tileCount; i++) {
            for (let j = 0; j < tileCount; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
                }
            }
        }
    }
    
    function moveSnake() {
        if (!gameStarted) return;
        
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check self collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            generateFood();
            if (score % 50 === 0) {
                gameSpeed = Math.max(50, gameSpeed - 10);
                clearInterval(gameLoop);
                gameLoop = setInterval(gameStep, gameSpeed);
            }
        } else {
            snake.pop();
        }
    }
    
    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        
        // Avoid placing food on snake
        snake.forEach(segment => {
            if (food.x === segment.x && food.y === segment.y) {
                generateFood();
            }
        });
    }
    
    function gameStep() {
        moveSnake();
        drawGame();
    }
    
    function gameOver() {
        clearInterval(gameLoop);
        gameStarted = false;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
        
        ctx.fillText('Press any key to restart', canvas.width/2, canvas.height/2 + 60);
        
        document.addEventListener('keydown', restartGame, {once: true});
    }
    
    function restartGame() {
        snake = [{x: 10, y: 10}];
        food = {x: 15, y: 15};
        dx = 0;
        dy = 0;
        score = 0;
        gameSpeed = 100;
        gameStarted = false;
        drawGame();
    }
    
    // Initial draw
    drawGame();
    
    gameContainer.appendChild(canvas);
}

// Tetris Game Implementation
function createTetrisGame() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    canvas.style.border = '2px solid #1e3c72';
    canvas.style.borderRadius = '10px';
    
    const ctx = canvas.getContext('2d');
    const blockSize = 25;
    const cols = canvas.width / blockSize;
    const rows = canvas.height / blockSize;
    
    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    let currentPiece = null;
    let score = 0;
    let gameLoop;
    let gameStarted = false;
    
    // Tetris pieces with Islamic colors
    const pieces = [
        {shape: [[1,1,1,1]], color: '#ffd700'}, // I
        {shape: [[1,1],[1,1]], color: '#1e3c72'}, // O
        {shape: [[1,1,1],[0,1,0]], color: '#ffed4e'}, // T
        {shape: [[1,1,1],[1,0,0]], color: '#2a5298'}, // L
        {shape: [[1,1,1],[0,0,1]], color: '#f093fb'}, // J
        {shape: [[1,1,0],[0,1,1]], color: '#f5576c'}, // S
        {shape: [[0,1,1],[1,1,0]], color: '#667eea'} // Z
    ];
    
    function createPiece() {
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        return {
            shape: piece.shape,
            color: piece.color,
            x: Math.floor(cols / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }
    
    function drawBoard() {
        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw Islamic pattern background
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if ((row + col) % 2 === 0) {
                    ctx.strokeStyle = 'rgba(30, 60, 114, 0.1)';
                    ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
                }
            }
        }
        
        // Draw placed pieces
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (board[row][col]) {
                    ctx.fillStyle = board[row][col];
                    ctx.fillRect(col * blockSize, row * blockSize, blockSize - 1, blockSize - 1);
                }
            }
        }
    }
    
    function drawPiece(piece) {
        if (!piece) return;
        ctx.fillStyle = piece.color;
        piece.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    ctx.fillRect(
                        (piece.x + colIndex) * blockSize,
                        (piece.y + rowIndex) * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            });
        });
    }
    
    function isValidMove(piece, dx, dy) {
        return piece.shape.every((row, rowIndex) => {
            return row.every((cell, colIndex) => {
                if (!cell) return true;
                const newX = piece.x + colIndex + dx;
                const newY = piece.y + rowIndex + dy;
                return newX >= 0 && newX < cols && newY < rows && 
                       (newY < 0 || !board[newY][newX]);
            });
        });
    }
    
    function placePiece() {
        currentPiece.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    board[currentPiece.y + rowIndex][currentPiece.x + colIndex] = currentPiece.color;
                }
            });
        });
        
        // Check for complete rows
        let linesCleared = 0;
        for (let row = rows - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                board.splice(row, 1);
                board.unshift(Array(cols).fill(0));
                linesCleared++;
                row++;
            }
        }
        
        if (linesCleared > 0) {
            score += linesCleared * 100;
        }
        
        currentPiece = createPiece();
        
        if (!isValidMove(currentPiece, 0, 0)) {
            gameOver();
        }
    }
    
    function gameStep() {
        if (!gameStarted) return;
        
        if (isValidMove(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            placePiece();
        }
        
        drawBoard();
        drawPiece(currentPiece);
        
        // Draw score
        ctx.fillStyle = '#1e3c72';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }
    
    function gameOver() {
        clearInterval(gameLoop);
        gameStarted = false;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
        
        ctx.fillText('Press any key to restart', canvas.width/2, canvas.height/2 + 60);
        
        document.addEventListener('keydown', restartGame, {once: true});
    }
    
    function restartGame() {
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        currentPiece = createPiece();
        score = 0;
        gameStarted = false;
        drawBoard();
        drawPiece(currentPiece);
    }
    
    // Controls
    document.addEventListener('keydown', (e) => {
        if (!currentPiece) return;
        
        switch(e.keyCode) {
            case 37: // Left
                if (isValidMove(currentPiece, -1, 0)) currentPiece.x--;
                if (!gameStarted) startGame();
                break;
            case 39: // Right
                if (isValidMove(currentPiece, 1, 0)) currentPiece.x++;
                if (!gameStarted) startGame();
                break;
            case 40: // Down
                if (isValidMove(currentPiece, 0, 1)) currentPiece.y++;
                if (!gameStarted) startGame();
                break;
            case 38: // Up (rotate)
                const rotated = rotatePiece(currentPiece);
                if (isValidMove(rotated, 0, 0)) {
                    currentPiece.shape = rotated.shape;
                }
                if (!gameStarted) startGame();
                break;
        }
    });
    
    function rotatePiece(piece) {
        const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
        return {shape: rotated, x: piece.x, y: piece.y, color: piece.color};
    }
    
    function startGame() {
        gameStarted = true;
        gameLoop = setInterval(gameStep, 500);
    }
    
    // Start game
    currentPiece = createPiece();
    drawBoard();
    drawPiece(currentPiece);
    
    // Draw instructions
    ctx.fillStyle = 'rgba(30, 60, 114, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Use arrow keys to start the game', canvas.width/2, canvas.height/2);
    
    gameContainer.appendChild(canvas);
}

// Memory Game Implementation
function createMemoryGame() {
    const gameDiv = document.createElement('div');
    gameDiv.style.textAlign = 'center';
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.style.marginBottom = '20px';
    scoreDisplay.style.fontSize = '20px';
    scoreDisplay.style.color = '#1e3c72';
    
    const movesDisplay = document.createElement('div');
    movesDisplay.style.marginBottom = '20px';
    movesDisplay.style.fontSize = '18px';
    movesDisplay.style.color = '#666';
    
    const gameBoard = document.createElement('div');
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gameBoard.style.gap = '10px';
    gameBoard.style.maxWidth = '400px';
    gameBoard.style.margin = '0 auto';
    
    const symbols = ['🕌', '☪️', '🕋', '📿', '🕌', '☪️', '🕋', '📿'];
    const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;
    
    function updateDisplay() {
        scoreDisplay.textContent = `Score: ${matchedPairs * 10}`;
        movesDisplay.textContent = `Moves: ${moves}`;
    }
    
    function createCard(symbol, index) {
        const card = document.createElement('div');
        card.style.width = '80px';
        card.style.height = '80px';
        card.style.backgroundColor = '#1e3c72';
        card.style.border = '2px solid #ffd700';
        card.style.borderRadius = '10px';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
        card.style.fontSize = '30px';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.dataset.flipped = 'false';
        
        card.addEventListener('click', () => flipCard(card));
        
        return card;
    }
    
    function flipCard(card) {
        if (!canFlip || card.dataset.flipped === 'true' || flippedCards.length >= 2) return;
        
        card.style.backgroundColor = '#ffd700';
        card.style.transform = 'rotateY(180deg)';
        card.textContent = card.dataset.symbol;
        card.dataset.flipped = 'true';
        
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            moves++;
            updateDisplay();
            checkMatch();
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.symbol === card2.dataset.symbol;
        
        setTimeout(() => {
            if (match) {
                matchedPairs++;
                card1.style.backgroundColor = '#4CAF50';
                card2.style.backgroundColor = '#4CAF50';
                card1.style.borderColor = '#4CAF50';
                card2.style.borderColor = '#4CAF50';
                
                if (matchedPairs === symbols.length) {
                    setTimeout(() => {
                        alert(`Congratulations! You completed the game in ${moves} moves!`);
                    }, 500);
                }
            } else {
                card1.style.backgroundColor = '#1e3c72';
                card2.style.backgroundColor = '#1e3c72';
                card1.style.transform = 'rotateY(0deg)';
                card2.style.transform = 'rotateY(0deg)';
                card1.textContent = '';
                card2.textContent = '';
                card1.dataset.flipped = 'false';
                card2.dataset.flipped = 'false';
            }
            
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
    
    // Create and add cards
    shuffledSymbols.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        gameBoard.appendChild(card);
    });
    
    gameDiv.appendChild(scoreDisplay);
    gameDiv.appendChild(movesDisplay);
    gameDiv.appendChild(gameBoard);
    
    updateDisplay();
    gameContainer.appendChild(gameDiv);
}

// Puzzle Game Implementation
function createPuzzleGame() {
    const gameDiv = document.createElement('div');
    gameDiv.style.textAlign = 'center';
    
    const puzzleContainer = document.createElement('div');
    puzzleContainer.style.width = '300px';
    puzzleContainer.style.height = '300px';
    puzzleContainer.style.margin = '0 auto';
    puzzleContainer.style.position = 'relative';
    puzzleContainer.style.border = '2px solid #1e3c72';
    puzzleContainer.style.borderRadius = '10px';
    puzzleContainer.style.overflow = 'hidden';
    
    const puzzleSize = 3; // 3x3 puzzle
    const pieceSize = 100;
    let pieces = [];
    let emptyPos = {x: 2, y: 2};
    
    // Create puzzle pieces
    function createPuzzle() {
        pieces = [];
        for (let y = 0; y < puzzleSize; y++) {
            for (let x = 0; x < puzzleSize; x++) {
                if (x === emptyPos.x && y === emptyPos.y) continue;
                
                const piece = document.createElement('div');
                piece.style.width = pieceSize + 'px';
                piece.style.height = pieceSize + 'px';
                piece.style.position = 'absolute';
                piece.style.left = (x * pieceSize) + 'px';
                piece.style.top = (y * pieceSize) + 'px';
                piece.style.backgroundColor = getPieceColor(x, y);
                piece.style.border = '1px solid #fff';
                piece.style.display = 'flex';
                piece.style.alignItems = 'center';
                piece.style.justifyContent = 'center';
                piece.style.fontSize = '24px';
                piece.style.color = '#fff';
                piece.style.cursor = 'pointer';
                piece.style.transition = 'all 0.3s ease';
                piece.textContent = `${x + 1},${y + 1}`;
                
                piece.addEventListener('click', () => movePiece(x, y));
                pieces.push({element: piece, x: x, y: y});
            }
        }
    }
    
    function getPieceColor(x, y) {
        const colors = ['#1e3c72', '#2a5298', '#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700', '#ffed4e'];
        return colors[(x + y) % colors.length];
    }
    
    function movePiece(x, y) {
        const piece = pieces.find(p => p.x === x && p.y === y);
        if (!piece) return;
        
        // Check if piece is adjacent to empty space
        const dx = Math.abs(x - emptyPos.x);
        const dy = Math.abs(y - emptyPos.y);
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // Move piece to empty space
            piece.element.style.left = (emptyPos.x * pieceSize) + 'px';
            piece.element.style.top = (emptyPos.y * pieceSize) + 'px';
            
            // Update piece position
            piece.x = emptyPos.x;
            piece.y = emptyPos.y;
            
            // Update empty position
            emptyPos = {x: x, y: y};
            
            // Check if puzzle is solved
            if (checkWin()) {
                setTimeout(() => {
                    alert('Congratulations! You solved the puzzle!');
                }, 500);
            }
        }
    }
    
    function checkWin() {
        return pieces.every(piece => {
            const expectedX = Math.floor(pieces.indexOf(piece) % puzzleSize);
            const expectedY = Math.floor(pieces.indexOf(piece) / puzzleSize);
            return piece.x === expectedX && piece.y === expectedY;
        });
    }
    
    function shufflePuzzle() {
        // Simple shuffle by making random moves
        for (let i = 0; i < 100; i++) {
            const adjacentPieces = pieces.filter(piece => {
                const dx = Math.abs(piece.x - emptyPos.x);
                const dy = Math.abs(piece.y - emptyPos.y);
                return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
            });
            
            if (adjacentPieces.length > 0) {
                const randomPiece = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
                movePiece(randomPiece.x, randomPiece.y);
            }
        }
    }
    
    // Create shuffle button
    const shuffleBtn = document.createElement('button');
    shuffleBtn.textContent = 'Shuffle Puzzle';
    shuffleBtn.className = 'btn btn-primary';
    shuffleBtn.style.marginBottom = '20px';
    shuffleBtn.addEventListener('click', () => {
        // Reset puzzle
        pieces.forEach(piece => piece.element.remove());
        emptyPos = {x: 2, y: 2};
        createPuzzle();
        shufflePuzzle();
    });
    
    gameDiv.appendChild(shuffleBtn);
    gameDiv.appendChild(puzzleContainer);
    
    createPuzzle();
    shufflePuzzle();
    
    gameContainer.appendChild(gameDiv);
}

// Feedback System
function showFeedbackForm() {
    const feedbackForm = `
        <div class="feedback-form">
            <h3>Share Your Thoughts</h3>
            <p>We'd love to hear from you! Your feedback helps us create better games.</p>
            
            <div class="form-group">
                <label for="feedback-type">What would you like to share?</label>
                <select id="feedback-type">
                    <option value="general">General feedback</option>
                    <option value="game-idea">Game idea</option>
                    <option value="improvement">Improvement suggestion</option>
                    <option value="bug">Bug report</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="feedback-message">Your message:</label>
                <textarea id="feedback-message" rows="4" placeholder="Tell us what you think..."></textarea>
            </div>
            
            <div class="form-group">
                <label for="feedback-email">Email (optional, for follow-up):</label>
                <input type="email" id="feedback-email" placeholder="your@email.com">
            </div>
            
            <div class="form-actions">
                <button class="btn btn-primary" onclick="submitFeedback()">Send Feedback</button>
                <button class="btn btn-secondary" onclick="detailsModal.style.display='none'">Cancel</button>
            </div>
        </div>
    `;
    
    detailsContainer.innerHTML = feedbackForm;
    detailsModal.style.display = 'block';
}

function submitFeedback() {
    const type = document.getElementById('feedback-type').value;
    const message = document.getElementById('feedback-message').value;
    const email = document.getElementById('feedback-email').value;
    
    if (!message.trim()) {
        alert('Please enter your feedback message.');
        return;
    }
    
    // Simulate feedback submission
    alert('Thank you for your feedback! We appreciate you taking the time to help us improve our games. In a real implementation, this would be sent to our team.');
    
    // Close modal
    detailsModal.style.display = 'none';
}



// Scroll event listener
window.addEventListener('scroll', updateActiveNavLink);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavLink();
    
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
