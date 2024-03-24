let walkingFrames = []; // Array to hold walking animation frames
let imageX = 100;
let imageY = 100; // Add variable for vertical movement
let i = 0;
let myImageArray = [];
let myFood1;
let myFood2;
let timer = 60;
let movementSpeed = 5;
let eatGoodSound;
let eatBadSound;
let health = 100;
let healthBarWidth = 200;
let healthBarHeight = 20;
let bgMusic;
let myObstacles = [];
let score = 0; // Initialize score variable
let gameOver = false; // Flag to check if game over message is displayed
let win = false; // Flag to check if win message is displayed

function preload() {
    // Load walking animation frames
    for (let n = 1; n <= 10; n++) {
        walkingFrames.push(loadImage("images/Walk (" + n + ").png"));
    }
    eatGoodSound = loadSound("sounds/385892__spacether__262312__steffcaffrey__cat-meow1.mp3");
    eatBadSound = loadSound("sounds/159367__huminaatio__7-error.wav");
    bgMusic = loadSound("sounds/645486__skylarmianlind__pulse-width.wav");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Create character images
    for (let i = 0; i < walkingFrames.length; i++) {
        let myImage = new MyImage(walkingFrames, imageX, imageY, 100, 100);
        myImageArray.push(myImage);
    }

    myFood1 = new Food(random(width), random(height), [255, 0, 0]); // Red food
    myFood2 = new Food(random(width), random(height), [0, 255, 0]); // Green food

    for (let i = 0; i < 4; i++) {
        let obstacle = {
            x: random(width),
            y: random(height),
            width: 50,
            height: 50
        };
        myObstacles.push(obstacle);
    }

    setInterval(updateImage, 50);
    setInterval(moveFoodRandomly, 1000);
    bgMusic.loop();
}

function draw() {
    background(220);

    myImageArray[i].draw();
    myFood1.display();
    myFood2.display();

    fill(0, 0, 255);
    for (let obstacle of myObstacles) {
        rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    let newX = imageX;
    let newY = imageY;
    if (keyIsDown(65)) { // A key
        newX -= movementSpeed;
    }
    if (keyIsDown(68)) { // D key
        newX += movementSpeed;
    }
    if (keyIsDown(87)) { // W key
        newY -= movementSpeed;
    }
    if (keyIsDown(83)) { // S key
        newY += movementSpeed;
    }

    let canMoveX = true;
    let canMoveY = true;
    for (let obstacle of myObstacles) {
        if (newX + myImageArray[i].width >= obstacle.x && newX <= obstacle.x + obstacle.width &&
            imageY + myImageArray[i].height >= obstacle.y && imageY <= obstacle.y + obstacle.height) {
            canMoveX = false;
            break;
        }
        if (imageX + myImageArray[i].width >= obstacle.x && imageX <= obstacle.x + obstacle.width &&
            newY + myImageArray[i].height >= obstacle.y && newY <= obstacle.y + obstacle.height) {
            canMoveY = false;
            break;
        }
    }

    if (canMoveX) {
        imageX = newX;
    }
    if (canMoveY) {
        imageY = newY;
    }

    myImageArray.forEach(myImage => {
        myImage.update(imageX, imageY);
    });

    // Check for collision with food
    if (myFood1.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        // Increment score if red food collected
    }
    if (myFood2.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        // Decrement score if green food collected
    }

    // Display score
    fill(0);
    textSize(20);
    text("Score: " + score, width / 10, height / 30);

    displayTimer();
    displayHealth();

    // Check win/lose conditions
    if (score >= 10) {
        win = true;
        gameOver = true;
    }

    if (health <= 0) {
        gameOver = true;
    }

    if (gameOver) {
        if (win) {
            textSize(40);
            textAlign(CENTER, CENTER);
            text("You Win!", width / 2, height / 2);
        } else {
            textSize(40);
            textAlign(CENTER, CENTER);
            text("Game Over!", width / 2, height / 2);
        }
        noLoop(); // Stop the draw loop
    }
}

function updateImage() {
    i = (i + 1) % myImageArray.length;
}

function moveFoodRandomly() {
    myFood1.moveRandomly();
    myFood2.moveRandomly();
}

function displayTimer() {
    textAlign(LEFT);
    textSize(20);
    fill(0);
    text("Time: " + timer, width / 10, height / 10);
    if (frameCount % 60 == 0 && timer > 0) {
        timer--;
    }
    if (timer === 0) {
        gameOver = true;
    }
}

function displayHealth() {
    fill(255);
    rect(width / 2 - healthBarWidth / 2, 20, healthBarWidth, healthBarHeight);

    let filledWidth = map(health, 0, 100, 0, healthBarWidth);
    fill(0, 255, 0);
    rect(width / 2 - healthBarWidth / 2, 20, filledWidth, healthBarHeight);
}

class MyImage {
    constructor(frames, x, y, width, height) {
        this.frames = frames;
        this.currentFrame = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        image(this.frames[this.currentFrame], this.x, this.y, this.width, this.height);
    }

    update(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.currentFrame = (this.currentFrame + 1) % this.frames.length; // Cycle through frames
    }
}
class Food {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color || [255, 0, 0]; // Default to red if color is not specified
        this.size = 20;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
    }

    moveRandomly() {
        this.x += random(-5, 5);
        this.y += random(-5, 5);
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }

    isCollected(x, y, width, height) {
        let distance = dist(this.x, this.y, x + width / 2, y + height / 2);
        if (distance < (this.size + min(width, height)) / 2) {
            if (this.color[0] === 255 && this.color[1] === 0 && this.color[2] === 0) { // Red food
                score += 1; // Increase score by 1 for red food
                health += 10; // Increase health for red food
                eatGoodSound.play(); // Play sound for red food
            } else if (this.color[0] === 0 && this.color[1] === 255 && this.color[2] === 0) { // Green food
                score -= 1; // Decrease score by 1 for green food
                health -= 10; // Decrease health for green food
                if (score < 0) {
                    score = 0; // Ensure score doesn't go below 0
                }
                if (health < 0) {
                    health = 0; // Ensure health doesn't go below 0
                }
                eatBadSound.play(); // Play sound for green food
            }
            // Check for game over condition (health reaches 0)
            if (health === 0) {
                gameOver = true;
            }
            // Reset food position
            this.reset();
            return true; // Food collected
        }
        return false; // Food not collected
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
    }
}
