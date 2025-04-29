class Chicken extends MovableObject{
    width = 120;
    height = 100;
    x;
    y = 330;
    speed;

    IMAGES_WALKING =[
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    constructor (){
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.x = 300 + Math.random() * 500;
        this.speed = 0.05 + Math.random() * 0.25;
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.moveLeft(this.speed);
        }, 1000 / 60);

        

        setInterval(() =>{
            this.animateImage(this.IMAGES_WALKING)
        }, 200)
    }
}