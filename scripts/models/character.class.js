/**
 * @fileoverview Character class representing the player-controlled character.
 * Extends MovableObject and provides movement, animation and audio logic.
 *
 * Responsibilities:
 * - handle input-driven horizontal movement and jumping
 * - manage animation frames for different states (idle, walk, jump, hurt, dead)
 * - play character-related sounds (jump, step, hurt, dead)
 * - update camera position based on character x
 *
 * @extends {MovableObject}
 */
class Character extends MovableObject{
    /**
     * Default sprite width in pixels.
     * @type {number}
     */
    width = 150;

    /**
     * Default sprite height in pixels.
     * @type {number}
     */
    height = 300;

    /**
     * Reference to the World instance this character belongs to.
     * @type {World}
     */
    world;

    /**
     * Horizontal movement speed.
     * @type {number}
     */
    speed = 6;

    /**
     * Vertical speed component used by gravity.
     * @type {number}
     */
    speedY = 0;

    /**
     * Gravity / upward acceleration factor.
     * @type {number}
     */
    acceleration = 2;

    /**
     * Damage value received from certain hits.
     * @type {number}
     */
    recievedDamage = 20;

    /**
     * Counter used to detect long idle state.
     * @type {number}
     */
    notMoving = 0;

    /**
     * Collision box offsets relative to sprite bounds.
     * @type {{top:number,left:number,right:number,bottom:number}}
     */
    offset = {
        top: 150,
        left: 45,
        right: 45,
        bottom: 15
    };

    /**
     * Initial x position.
     * @type {number}
     */
    x= 20

    /**
     * Walk animation frames.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ];

    /**
     * Jump animation frames.
     * @type {string[]}
     */
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

    /**
     * Death animation frames.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png"
    ];

    /**
     * Hurt animation frames.
     * @type {string[]}
     */
    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png"
    ];

    /**
     * Short idle animation frames.
     * @type {string[]}
     */
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

    /**
     * Long idle animation frames used after prolonged inactivity.
     * @type {string[]}
     */
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
    
    /**
     * Construct the character, load default image and start animation/gravity loops.
     * @returns {void}
     */
    constructor (){
        super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadAllImages();
        this.animate();
        this.applyGravity();
    }

    /**
     * Start repeating intervals that run movement, animation and step sound.
     * Uses setStoppableInterval to allow cleanup.
     *
     * @returns {void}
     */
    animate(){
        setStoppableInterval(() => this.makeCharacterMove(), 1000/60);
        setStoppableInterval(() => this.animateCharacter(), 100);
        setStoppableInterval(() => this.playRunSound(), 140); 
    }

    /**
     * Perform per-frame character logic: horizontal movement, jump handling and camera update.
     * @returns {void}
     */
    makeCharacterMove(){
        this.handleHorizontalMovement();
        this.handleJump();
        this.updateCameraPosition();
    }

    /**
     * Play step sound when walking on ground.
     * @returns {void}
     */
    playRunSound(){
        if(this.isWalking() && !this.isJumping()){
            GameSounds.playAudio(GameSounds.STEP, 0.4, false);
        }
    }

    /**
     * Decide which animation to play based on current state (dead, hurt, jumping, walking, idle).
     * @returns {void}
     */
    animateCharacter(){
        if(this.isDead()){
            this.animateDeath();
        }else if(this.isHurt()){
            this.animateHurt();
        }else if(this.isJumping()){
            this.animateJump()
        } else if(this.isWalking()){
            this.animateWalk();
        }else {
            this.animateIdle();
        }
    }

    /**
     * Preload all image frames used by this character.
     * @returns {void}
     */
    loadAllImages(){
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
    }

    /**
     * Animate death frames and reset notMoving counter.
     * @returns {void}
     */
    animateDeath(){
        this.animateImage(this.IMAGES_DEAD);
        this.notMoving = 0;
    }

    /**
     * Animate hurt frames and reset notMoving counter.
     * @returns {void}
     */
    animateHurt(){
        this.animateImage(this.IMAGES_HURT);
        this.notMoving = 0;
    }

    /**
     * Animate jumping frames and reset notMoving counter.
     * @returns {void}
     */
    animateJump(){
        this.animateImage(this.IMAGES_JUMPING);
        this.notMoving = 0;
    }

    /**
     * Animate walking frames and reset notMoving counter.
     * @returns {void}
     */
    animateWalk(){
        this.animateImage(this.IMAGES_WALKING);
        this.notMoving = 0;
    }

    /**
     * Returns true if the character is in a jump state (not on ground).
     * Delegates to limitationYGround() from MovableObject.
     *
     * @returns {boolean}
     */
    isJumping(){
        return this.limitationYGround();
    }

    /**
     * Returns true if either left or right input is active.
     *
     * @returns {boolean}
     */
    isWalking(){
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /**
     * Animate idle or long idle depending on inactivity counter.
     * @returns {void}
     */
    animateIdle(){
        if (this.notMoving < this.IMAGES_IDLE.length * 3) {
            this.animateImage(this.IMAGES_IDLE);
            this.notMoving++;
        } else {
            this.animateImage(this.IMAGES_LONG_IDLE);
        }
    }

    /**
     * Handle horizontal movement input and enforce world boundaries.
     * Updates sprite direction flag when moving left.
     *
     * @returns {void}
     */
    handleHorizontalMovement(){
        if (this.world.keyboard.LEFT && this.x > -616) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
        }
    }

    /**
     * Handle jump input. If jump key pressed and character is on ground, trigger jump and play sound.
     *
     * @returns {void}
     */
    handleJump(){
        let isJumpKey = this.world.keyboard.UP || this.world.keyboard.SPACE;
        let canJump = !this.limitationYGround();

        if (isJumpKey && canJump) {
            this.jump();
            GameSounds.playAudio(GameSounds.JUMP, 0.4, false);
            this.notMoving = 0;
        }
    }

    /**
     * Update the world's camera_x so the camera follows the character.
     * @returns {void}
     */
    updateCameraPosition(){
        this.world.camera_x = -this.x + 100;
    }
}