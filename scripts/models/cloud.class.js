class Cloud extends MovableObject{
    width = 700;
    height = 250;
    y = 20;
    x;
    speed;

    constructor (world){
        super();
        this.setVariant();
        this.setPositionAndSpeed(world);
        this.animate();
    }

    animate(){
        setStoppableInterval(() => this.moveLeft(), 50);
    }

    setPositionAndSpeed(world){
        this.world = world;
        this.x = Math.random() * 2500;
        this.speed = 0.15+ Math.random() * 1;
    }

    setVariant(){
        if(this.randomZerroOrOne() == 1){
            this.loadImage("img/5_background/layers/4_clouds/1.png");
        }else{
            this.loadImage("img/5_background/layers/4_clouds/2.png");
        }
    }
}