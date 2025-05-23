class Character extends MovableObject{
    width = 150;
    height = 300;
    world;
    speed = 6;
    speedY = 0;
    acceleration = 2;
    recievedDamage = 20;
    notMoving = 0;
    characterJumpAudioUrl = "audio/jump.mp3";
    characterRunAudioUrl = "audio/step.mp3";
    characterDeadAudioUrl = "audio/loose.mp3";
    characterHurtAudioUrl = "audio/male_hurt7-48124.mp3"
    offset = {
        top: 150,
        left: 45,
        right: 45,
        bottom: 15
    };
    x= 20

    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png",
    ];

    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png"
    ];

    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png"
    ];

    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/idle/I-1.png",
        "img/2_character_pepe/1_idle/idle/I-2.png",
        "img/2_character_pepe/1_idle/idle/I-3.png",
        "img/2_character_pepe/1_idle/idle/I-4.png",
        "img/2_character_pepe/1_idle/idle/I-5.png",
        "img/2_character_pepe/1_idle/idle/I-6.png",
        "img/2_character_pepe/1_idle/idle/I-7.png",
        "img/2_character_pepe/1_idle/idle/I-8.png",
        "img/2_character_pepe/1_idle/idle/I-9.png",
        "img/2_character_pepe/1_idle/idle/I-10.png",
    ];

    IMAGES_LONG_IDLE = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png"
    ]
    
    constructor (){
        super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE)
        this.animate();
        this.applyGravity();
    }

    animate(){
        setStoppableInterval(() => this.makeCharacterMove(), 1000/60);
        setStoppableInterval(() => this.animateCharacter(), 100);
        setStoppableInterval(() => this.playRunSound(), 140); 
    }

    makeCharacterMove(){
        if(this.world.keyboard.LEFT && this.x > -617){
            this.moveLeft();
            this.otherDirection = true;
        }if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){
            this.moveRight();
        }
        if(this.world.keyboard.UP && !this.limitationYGround() || this.world.keyboard.SPACE && !this.limitationYGround()){
            this.jump();
            GameSounds.playAudio(GameSounds.JUMP, 0.4, false);
            this.notMoving = 0;
        }
        this.world.camera_x = -this.x + 100;
    }

    playRunSound(){
        if((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.limitationYGround()){
            GameSounds.playAudio(GameSounds.STEP, 0.4, false);
        }
    }

    animateCharacter(){
        if(this.isDead()){
            this.animateImage(this.IMAGES_DEAD);
            this.notMoving = 0;
        }else if(this.isHurt()){
            this.animateImage(this.IMAGES_HURT);
            this.notMoving = 0;
        }else if(this.limitationYGround()){
            this.animateImage(this.IMAGES_JUMPING);
            this.notMoving = 0;
        } else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
            this.animateImage(this.IMAGES_WALKING);
            this.notMoving = 0;
        }else {
            if(this.notMoving < this.IMAGES_IDLE.length * 3){
                this.animateImage(this.IMAGES_IDLE);
                this.notMoving++
            }else{
                this.animateImage(this.IMAGES_LONG_IDLE)
            }
        }
    }
}