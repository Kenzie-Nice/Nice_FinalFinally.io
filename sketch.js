let walkingFrames = []; //lil legs go zoooom
let imageX = 100;
let imageY = 100; 
let i = 0;
let myImageArray = [];
let myFood1;
let myFood2;
let myFood3;
let myFood4;
let myFood5;
let timer = 60;
let movementSpeed = 3;
let eatGoodSound;
let eatBadSound;
let health = 100;
let healthBarWidth = 200;
let healthBarHeight = 20;
let bgMusic;
let myObstacles = [];
let score = 0; 
let gameOver = false; 
let win = false; 
let particles = [];
let specialBall; // Declare special ball variable

// Control legend
let controlLegend = "Controls:\nW - Up\nA - Left\nS - Down\nD - Right";
let legendWidth = 200;
let legendHeight = 100;
let legendX = 20;
let legendY = 20;

function preload() {
    //walking animation
    for (let n = 0; n <= 4; n++) {
        walkingFrames.push(loadImage('images/2_WALK_00' + n + '.png'));
    }
    eatGoodSound = loadSound("sounds/270396__littlerobotsoundfactory__spell_01.wav");
    eatBadSound = loadSound("sounds/541480__eminyildirim__magic-lighting-spell-impact-punch.wav");
    bgMusic = loadSound("sounds/514878__mrthenoronha__childish-theme-loop-4.wav");
    // Load background image
    bgImage = loadImage("images/game_background_4.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Set frame rate for smoother animation
    frameRate(30);

    // Create character images
    for (let i = 0; i < walkingFrames.length; i++) {
        let myImage = new MyImage(walkingFrames, imageX, imageY, 100, 100);
        myImageArray.push(myImage);
    }

    myFood1 = new Food(random(width), random(height), [255, 0, 0]); // Red food
    myFood2 = new Food(random(width), random(height), [0, 255, 0]); // Green food
    myFood3 = new Food(random(width), random(height), [255, 0, 0]); // Red food
    myFood4 = new Food(random(width), random(height), [0, 255, 0]); // Green food
    myFood5 = new Food(random(width), random(height), [255, 0, 0]); // Red food

    // Initialize special ball
    specialBall = new SpecialBall(random(width), random(height));

    for (let i = 0; i < 4; i++) {
        let obstacle = {
            x: random(width),
            y: random(height),
            width: 50,
            height: 50,
            color: [0, 0, 255]
        };
        myObstacles.push(obstacle);
    }

    setInterval(moveFoodRandomly, 1000);
    bgMusic.loop();
}


function draw() {
    // Draw background image
    image(bgImage, 0, 0, width, height);

    myImageArray[i].draw();
    myFood1.display();
    myFood2.display();
    myFood3.display();
    myFood4.display();
    myFood5.display();

    fill(0, 0, 255);
    for (let obstacle of myObstacles) {
        rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
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

    //collision food
    if (myFood1.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        score++;
        health += 10;
        eatGoodSound.play();
        myFood1.reset();
    }
    if (myFood2.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        score--;
        health -= 10;
        if (score < 0) {
            score = 0;
        }
        if (health < 0) {
            health = 0; 
        }
        eatBadSound.play();
        myFood2.reset();
    }
    //collision food
    if (myFood3.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        score++;
        health += 10;
        eatGoodSound.play();
        myFood3.reset();
    }
    if (myFood4.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        score--;
        health -= 10;
        if (score < 0) {
            score = 0;
        }
        if (health < 0) {
            health = 0; 
        }
        eatBadSound.play();
        myFood4.reset();
    }
    if (myFood5.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        score--;
        health -= 10;
        if (score < 0) {
            score = 0;
        }
        if (health < 0) {
            health = 0; 
        }
        eatBadSound.play();
        myFood5.reset();
    }

    //collision special ball
    if (specialBall.isCollected(myImageArray[i].x, myImageArray[i].y, myImageArray[i].width, myImageArray[i].height)) {
        // Trigger sparkle effect
        specialBall.sparkleEffect();
        // Handle other actions when special ball is collected
        // For example: Increase score, play sound, etc.
        // Reset special ball position
        specialBall.reset();
    }

    // Display score
    fill(0);
    textSize(20);
    text("Score: " + score, width - 120, height / 30);

    displayTimer();
    displayHealth();
    
    // Draw control legend
    fill(255);
    rect(legendX, legendY, legendWidth, legendHeight);
    fill(0);
    textSize(14);
    text(controlLegend, legendX + 10, legendY + 20);

    //win/lose conditions
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
            fill(0, 255, 255); // Bright cyan color
            text("You Win!", width / 2, height / 2);
        } else {
            textSize(40);
            textAlign(CENTER, CENTER);
            fill(0, 255, 255); // Bright cyan color
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
    myFood3.moveRandomly();
    myFood4.moveRandomly();
    myFood5.moveRandomly();
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
        this.color = color || [255, 0, 0];
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
                score++; // Increase score
                health += 10; // Increase health 
                eatGoodSound.play(); // Play sound for red food
            } else if (this.color[0] === 0 && this.color[1] === 255 && this.color[2] === 0) { // Green food
                score--; // Decrease score
                health -= 10; // Decrease health
                if (score < 0) {
                    score = 0;
                }
                if (health < 0) {
                    health = 0; 
                }
                eatBadSound.play(); 
            }
            // you dead
            if (health === 0) {
                gameOver = true;
            }
            //food position
            this.reset();
            return true;
        }
        return false; 
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
    }
}

// SpecialBall class definition
class SpecialBall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30; // Adjust size as needed
        this.color = [0, 0, 255]; // Bright blue color
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
    }

    // Add sparkle effect when collected
    sparkleEffect() {
        for (let i = 0; i < 30; i++) {
            let angle = random(TWO_PI);
            let speed = random(1, 5);
            let vx = cos(angle) * speed;
            let vy = sin(angle) * speed;
            let size = random(3, 10);
            let lifespan = random(20, 50);
            let particleColor = color(0, 0, 255); // Bright blue color
            particles.push(new Particle(this.x, this.y, vx, vy, size, lifespan, particleColor));
        }
    }

    // Check if special ball is collected
    isCollected(x, y, width, height) {
        let distance = dist(this.x, this.y, x + width / 2, y + height / 2);
        if (distance < (this.size + min(width, height)) / 2) {
            score += 5; // Increase score
            eatGoodSound.play(); // Play sound for special ball
            return true;
        }
        return false; 
    }

    // Reset special ball position
    reset() {
        this.x = random(width);
        this.y = random(height);
    }
}

function keyPressed() {
    if (key === 'f' || key === 'F') {
        // Find the closest blue obstacle to the player
        let closestObstacleIndex = -1;
        let closestObstacleDistance = Infinity;

        for (let i = 0; i < myObstacles.length; i++) {
            let obstacle = myObstacles[i];
            if (obstacle.color && obstacle.color[0] === 0 && obstacle.color[1] === 0 && obstacle.color[2] === 255) {
                let distance = dist(imageX + myImageArray[i].width / 2, imageY + myImageArray[i].height / 2, obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
                if (distance < closestObstacleDistance) {
                    closestObstacleDistance = distance;
                    closestObstacleIndex = i;
                }
            }
        }

        // Remove the closest blue obstacle from the canvas
        if (closestObstacleIndex !== -1) {
            createExplosion(myObstacles[closestObstacleIndex].x + myObstacles[closestObstacleIndex].width / 2, myObstacles[closestObstacleIndex].y + myObstacles[closestObstacleIndex].height / 2);
            myObstacles.splice(closestObstacleIndex, 1);
        }
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
        let angle = random(TWO_PI);
        let speed = random(1, 5);
        let vx = cos(angle) * speed;
        let vy = sin(angle) * speed;
        let size = random(3, 10);
        let lifespan = random(20, 50);
        let particleColor = color(random(255), random(255), random(255)); // Renamed to particleColor
        particles.push(new Particle(x, y, vx, vy, size, lifespan, particleColor));
    }
}

class Particle {
    constructor(x, y, vx, vy, size, lifespan, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.lifespan = lifespan;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifespan--;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }

    isDead() {
        return this.lifespan <= 0;
    }
}
