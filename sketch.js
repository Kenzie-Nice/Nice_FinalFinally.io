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

    myFood1 = new Food(random(width), random(height));
    myFood2 = new Food(random(width), random(height), [0, 255, 0]);

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

    myFood1.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height);
    myFood2.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height);

    displayTimer();
    displayHealth();
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
        textSize(40);
        textAlign(CENTER, CENTER);
        text("Game Over!", width / 2, height / 2);
        noLoop();
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
        this.size = 20;
        this.color = color || [255, 0, 0]; // Default to red if color is not specified
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
            if (this.color[0] === 255 && this.color[1] === 0 && this.color[2] === 0) { // Checking if food is red
                health += 10; // Increase health for food1
                eatGoodSound.play(); // Play sound for food1
            } else {
                health -= 10; // Decrease health for food2
                eatBadSound.play(); // Play sound for food2
            }
            this.reset();
        }
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
    }
}

function keyPressed() {
    // Add key press events here if needed
}

function keyReleased() {
    // Add key release events here if needed
}

