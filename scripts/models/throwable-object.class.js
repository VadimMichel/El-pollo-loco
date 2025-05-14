class ThrowableObject extends MovableObject{
    width = 120;
    height = 100;
    acceleration = 2;
    speed = 30;
    x = 50;
    y = 50;
    j = 0;
    bottleBreaksAudioUrl = "audio/glass-shatter-3-100155.mp3";
    
    IMAGES_BOTTLE_ROTATION = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];

    IMAGES_BOTTLE_SPLASH = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
    ];

    constructor(x, y){
        super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.animate();
        this.x = x;
        this.y = y;
        this.trow();
    }

    trow(){
        this.speedY = 15;
        this.applyGravity();
            setInterval(() => {
                if(!this.collided){
                    this.moveRight(this.speed);
                }
            }, 1000 / 25);
    }

    animate(){
        setStoppableInterval(() => this.animateBottle(), 100);
    }

    animateBottle(){
        if(this.collided){
            this.animateImage(this.IMAGES_BOTTLE_SPLASH);
            this.j++
        }else{
            this.animateImage(this.IMAGES_BOTTLE_ROTATION);
        }
    }
}