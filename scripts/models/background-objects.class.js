class BackgroundObject extends MovableObject{
    width = 720;
    height = 480;

    constructor(imagePath, x, Y){
        super().loadImage(imagePath);
        this.y = Y;
        this.x = x;
    }
}