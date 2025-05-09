class Chicken extends MovableObject{
    width = 120;
    height = 100;
    x;
    y = 330;
    speed;
    recievedDamage = 100;
    chichenHurtAudioUrl = "audio/chicken-noise-196746.mp3";
    ImageCacheDead;
    ImageCacheWalking;

    IMAGES_WALKING_NORMAL =[
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    IMAGES_DEAD_NORMAL = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ];

    IMAGES_WALKING_SMAL = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];

    IMAGES_DEAD_SMAL = [
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    ]

    constructor (){
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        if(this.randomZerroOrOne() == 1){
            this.ImageCacheDead = this.IMAGES_DEAD_NORMAL;
            this.ImageCacheWalking = this.IMAGES_WALKING_NORMAL;
        }else{
            this.ImageCacheDead = this.IMAGES_DEAD_SMAL;
            this.ImageCacheWalking = this.IMAGES_WALKING_SMAL;
            this.width = 60;
            this.height = 50;
            this.y = 380;
        }
        this.loadImages(this.ImageCacheDead);
        this.loadImages(this.ImageCacheWalking);
        this.x = 300 + Math.random() * 500;
        this.speed = 0.05 + Math.random() * 0.25;
        this.animate();
    }

    animate(){
        setInterval(() => {
            if(!this.isDead()){
            this.moveLeft(this.speed);
            }
        }, 1000 / 60);

        setInterval(() =>{
            if(this.isDead()){
                this.animateImage(this.ImageCacheDead);
            }else{
                this.animateImage(this.ImageCacheWalking);
            }
        }, 200)
    }
}