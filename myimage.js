class MyImage {
    constructor(frames, x, y, w, h) {
        this.frames = frames;
        this.currentFrame = 0;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        image(this.frames[this.currentFrame], this.x, this.y, this.w, this.h);
    }

    update(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.currentFrame = (this.currentFrame + 1) % this.frames.length; // Cycle through frames
    }
}
