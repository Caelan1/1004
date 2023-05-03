const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let score = 0;
let gameLoop;

class Snake {
    constructor() {
        this.x = 10;
        this.y = 10;
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        this.tail = [];
        this.total = 0;
    }

    draw() {
        ctx.fillStyle = '#4CAF50';

        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    }

    update() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
    
        this.tail[this.total - 1] = { x: this.x, y: this.y };
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    
        if (this.x >= canvas.width) this.x = 0;
        if (this.y >= canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width - scale;
        if (this.y < 0) this.y = canvas.height - scale;
    }

    changeDirection(direction) {
        switch (direction) {
            case 'Up':
                this.xSpeed = 0;
                this.ySpeed = -scale * 1;
                break;
            case 'Down':
                this.xSpeed = 0;
                this.ySpeed = scale * 1;
                break;
            case 'Left':
                this.xSpeed = -scale * 1;
                this.ySpeed = 0;
                break;
            case 'Right':
                this.xSpeed = scale * 1;
                this.ySpeed = 0;
                break;
        }
    }
    eat(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }

        return false;
    }

    checkCollision() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0;
                this.tail = [];
                return true;
            }
        }
        return false;
    }
}

class Fruit {
    constructor() {
        this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    }

    draw() {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

const snake = new Snake();
const fruit = new Fruit();

function drawGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.strokeRect(j * scale, i * scale, scale, scale);
        }
    }
}
function endGame() {
    clearInterval(gameLoop);
    const playerName = prompt('Game Over! Your score is: ' + score + '. Please enter your name:');
    if (playerName !== null && playerName !== '') {
        addToScoreboard(playerName, score);
    }
    score = 0;
    document.getElementById('score').textContent = score;
    snake.total = 0;
    snake.tail = [];
    snake.x = 10;
    snake.y = 10;
    snake.xSpeed = scale * 1;
    snake.ySpeed = 0;
    setTimeout(() => {
        gameLoop = setInterval(updateGame, 250);
    }, 500);
}
function addToScoreboard(name, score) {
    const scores = loadScores();
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10); // Keep only the top 10 scores
    saveScores(scores);
    updateScoreList();
}
function saveScores(scores) {
    localStorage.setItem('scores', JSON.stringify(scores));
}

function loadScores() {
    const savedScores = localStorage.getItem('scores');
    return savedScores ? JSON.parse(savedScores) : [];
}
function updateScoreList() {
    const scoreList = document.getElementById('scoreboard');
    scoreList.innerHTML = ''; // Clear the existing list
    const scores = loadScores();
    for (const entry of scores) {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name}: ${entry.score}`;
        scoreList.appendChild(listItem);
    }
}
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    fruit.draw();
    snake.update();
    snake.draw();

    if (snake.eat(fruit)) {
        score++;
        document.getElementById('score').textContent = score;
        fruit.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        fruit.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    }

    if (snake.checkCollision() && score > 0) {
        endGame();
    }
}
function startGame() {
  gameLoop = setInterval(updateGame, 250);
}
updateScoreList();
startGame();
window.addEventListener('keydown', (evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
});