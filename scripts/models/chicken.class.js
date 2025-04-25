class Chicken extends MovableObject{
    width = 45;
    height = 70;
    x;
    y = 350;
    speed;

    IMAGES_WALK =[
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    constructor (){
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALK);
        this.x = 300 + Math.random() * 500;
        this.speed = 0.05 + Math.random() * 0.25;
        this.animate();
    }

    animate(){
        this.moveLeft(this.speed);

        setInterval(() =>{
            let i = this.currentImage % this.IMAGES_WALK.length;
            let path = this.IMAGES_WALK[i];
            this.img = this.imageCache[path];
            this.currentImage ++;
        }, 200)
    }
}