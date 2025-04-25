class MovableObject {
    x = 120;
    y= 175;
    img;
    imageCache = {};
    currentImage = 0;

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
        console.log("moving right");
    }

    moveLeft(speed){
        setInterval(() => {
            this.x -= speed;
        }, 1000 / 60);
    }
}