class BackgroundObject extends MovableObject{
    width = 720;
    height = 480;

    constructor(imagePath, Y){
        super().loadImage(imagePath);
        this.y = Y;
        this.x = 480 - this.height;
    }
}