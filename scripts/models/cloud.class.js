class Cloud extends MovableObject{
    width = 700;
    height = 250;
    y = 20;
    x;
    speed;

    constructor (world){
        super()
        this.world = world
        if(this.randomZerroOrOne() == 1){
            this.loadImage("img/5_background/layers/4_clouds/1.png");
        }else{
            this.loadImage("img/5_background/layers/4_clouds/2.png")
        }
        this.x = Math.random() * 2500;
        this.speed = 0.15+ Math.random() * 1
        this.animate();
    }

    animate(){
        setStoppableInterval(() => this.moveLeft(), 50);
    }
}