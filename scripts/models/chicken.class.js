class Chicken extends MovableObject{
    width = 45;
    height = 70;
    x;
    y = 350;

    constructor (){
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = 300 + Math.random() * 500;
    }
}