let walkingFrames = [];
let playerX, playerY;
let movementSpeed = 5;
let score = 0;
let health = 100;
let foods = [];
let obstacles = [];
let timer = 60;
let gameOver = false;
let eatGoodSound, eatBadSound, bgMusic;

function preload() {
    eatGoodSound = loadSound("sounds/385892__spacether__262312__steffcaffrey__cat-meow1.mp3");
    eatBadSound = loadSound("sounds/159367__huminaatio__7-error.wav");
    bgMusic = loadSound("sounds/645486__skylarmianlind__pulse-width.wav");

    for (let n = 1; n <= 5; n++) {
        walkingFrames.push(loadImage("images/2_WALK_000.png (" + n + ").png"));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    playerX = width / 2;
    playerY = height / 2;

    for (let i = 0; i < 5; i++) {
        foods.push(new Food(random(width), random(height), [random(255), random(255), random(255)]));
    }

    for (let i = 0; i < 4; i++) {
        obstacles.push(new Obstacle(random(width), random(height), [0, 0, 255]));
    }

    bgMusic.loop();
}

function draw() {
    background(220);

    movePlayer();
    displayPlayer();

    for (let food of foods) {
        food.display();
        food.checkCollision();
    }

    for (let obstacle of obstacles) {
        obstacle.display();
    }

    displayScore();
    displayTimer();
    displayHealth();
    checkGameStatus();
}

function movePlayer() {
    if (keyIsDown(65)) playerX -= movementSpeed; // A key
    if (keyIsDown(68)) playerX += movementSpeed; // D key
    if (keyIsDown(87)) playerY -= movementSpeed; // W key
    if (keyIsDown(83)) playerY += movementSpeed; // S key

    playerX = constrain(playerX, 0, width);
    playerY = constrain(playerY, 0, height);
}

function displayPlayer() {
    let frameIndex = frameCount % walkingFrames.length;
    image(walkingFrames[frameIndex], playerX, playerY, 100, 100);
}

function displayScore() {
    fill(0);
    textSize(20);
    text("Score: " + score, width / 10, height / 30);
}

function displayTimer() {
    textAlign(LEFT);
    textSize(20);
    fill(0);
    text("Time: " + timer, width / 10, height / 10);
    if (frameCount % 60 == 0 && timer > 0) timer--;
    if (timer === 0) gameOver = true;
}

function displayHealth() {
    let healthBarWidth = 200;
    let healthBarHeight = 20;
    fill(255);
    rect(width / 2 - healthBarWidth / 2, 20, healthBarWidth, healthBarHeight);
    let filledWidth = map(health, 0, 100, 0, healthBarWidth);
    fill(0, 255, 0);
    rect(width / 2 - healthBarWidth / 2, 20, filledWidth, healthBarHeight);
}

function checkGameStatus() {
    if (score >= 10 || health <= 0 || timer === 0) {
        gameOver = true;
        textSize(40);
        textAlign(CENTER, CENTER);
        fill(0);
        if (score >= 10) text("You Win!", width / 2, height / 2);
        else text("Game Over!", width / 2, height / 2);
        noLoop();
    }
}

class Food {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 20;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }

    checkCollision() {
        let distance = dist(playerX, playerY, this.x, this.y);
        if (distance < this.size / 2) {
            if (this.color[0] === 255 && this.color[1] === 0 && this.color[2] === 0) {
                score++;
                health += 10;
                eatGoodSound.play();
            } else {
                score--;
                health -= 10;
                if (score < 0) score = 0;
                if (health < 0) health = 0;
                eatBadSound.play();
            }
            this.reset();
        }
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
    }
}

class Obstacle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 50;
    }

    display() {
        fill(this.color);
        rectMode(CENTER);
        rect(this.x, this.y, this.size, this.size);
    }
}
