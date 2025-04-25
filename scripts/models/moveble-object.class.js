class MovableObject {
    x = 120;
    y= 175;
    img;
    imageCache = {};

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = path;
        });
    }

    moveRight(){
        console.log("moving right");
    }

    moveLeft(){}
}