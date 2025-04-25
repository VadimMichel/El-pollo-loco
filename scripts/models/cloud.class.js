class Cloud extends MovableObject{
    width = 700;
    height = 250;
    y = 20;
    x;

    constructor (){
        super().loadImage("img/5_background/layers/4_clouds/1.png");
        this.x = Math.random() * 500;
    }
}