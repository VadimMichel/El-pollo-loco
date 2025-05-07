class Cloud extends MovableObject{
    width = 700;
    height = 250;
    y = 20;
    x;
    speed = 0.15;

    constructor (){
        super().loadImage("img/5_background/layers/4_clouds/1.png");
        this.x = Math.random() * 500;
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 50);
    }
}