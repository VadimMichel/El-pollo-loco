class Endboss extends MovableObject{
    width = 200;
    height = 400;
    y = 45;
    recievedDamage = 20;
    startBossFight = false;
    startAnimation = 0;
    speed = 3;
    offset = {
        top: 100,
        left: 30,
        right: 30,
        bottom: 15
    };

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    IMAGES_ALERT = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png",
    ];

    IMAGES_ATTACK = [
        "img/4_enemie_boss_chicken/3_attack/G13.png",
        "img/4_enemie_boss_chicken/3_attack/G14.png",
        "img/4_enemie_boss_chicken/3_attack/G15.png",
        "img/4_enemie_boss_chicken/3_attack/G16.png",
        "img/4_enemie_boss_chicken/3_attack/G17.png",
        "img/4_enemie_boss_chicken/3_attack/G18.png",
        "img/4_enemie_boss_chicken/3_attack/G19.png",
        "img/4_enemie_boss_chicken/3_attack/G13.png"
    ];

    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    constructor(){
        super()
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 2800;
        this.animate();
    }

    animate(){
        setStoppableInterval(() => this.animateEndboss(), 200);
        setStoppableInterval(() => this.makeBoosMoveLeft(), 100);
    }

    makeBoosMoveLeft(){
        if((this.startBossFight && this.x > 2500 && !this.isDead()) || (this.startAnimation >= this.IMAGES_WALKING.length +1 && !this.isDead())){
            this.moveLeft(this.speed);
        }
    }

    animateEndboss(){
        if(this.isDead()){
            this.animateImage(this.IMAGES_DEAD);
        }else if(this.isHurt()){
            this.animateImage(this.IMAGES_HURT);
        }else if(this.startBossFight && this.x > 2500){
            this.animateImage(this.IMAGES_WALKING);
        }else if (this.startBossFight && this.x > 2490 && this.startAnimation < this.IMAGES_ALERT.length +1){
            this.animateImage(this.IMAGES_ALERT);
            this.startAnimation++
            console.log(this.startAnimation)
        }else if (this.startAnimation >= this.IMAGES_WALKING.length +1){
            this.j = 0;
            this.animateImage(this.IMAGES_ATTACK);
        }  
    }
}