class MovableObject {
    x = 100;
    y= 250;
    img;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight(){
        console.log("moving right");
    }

    moveLeft(){}
}