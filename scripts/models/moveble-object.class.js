class MovableObject {
    x = 100;
    y= 125;
    img;
    imageCache = {};
    currentImage = 0;
    otherDirection = false;

    applyGravity(){
        setInterval(() =>{
            if(this.limitationYGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    limitationYGround(){
        return this.y <= 125;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight(){
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft(){
        this.x -= this.speed;
    }

    animateImage(IMAGES_ARRAY){
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = IMAGES_ARRAY[i];
        this.img = this.imageCache[path];
        this.currentImage ++;
    }

    jump(){
        this.speedY = 25;
    }

    drawFrame(ctx){
        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}