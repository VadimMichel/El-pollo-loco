/**
 * @fileoverview Endboss enemy class. Extends MovableObject and implements
 * complex behaviour for the level boss including staged entrance, alert,
 * walking, attacking, hurt and death animations.
 *
 * The endboss uses several image sets for different states and controls when
 * to start the boss fight via `startBossFight` and `startAnimation`.
 *
 * @extends {MovableObject}
 */
class Endboss extends MovableObject{
    /**
     * Sprite width in pixels.
     * @type {number}
     */
    width = 200;

    /**
     * Sprite height in pixels.
     * @type {number}
     */
    height = 400;

    /**
     * Vertical position in world coordinates.
     * @type {number}
     */
    y = 45;

    /**
     * Damage value applied when boss is hit.
     * @type {number}
     */
    recievedDamage = 20;

    /**
     * Flag that triggers the boss fight behaviour when set to true.
     * @type {boolean}
     */
    startBossFight = false;

    /**
     * Counter used to control staged animations (alert -> walk -> attack).
     * @type {number}
     */
    startAnimation = 0;

    /**
     * Horizontal movement speed.
     * @type {number}
     */
    speed = 3;

    /**
     * Collision box offsets relative to sprite bounds.
     * @type {{top:number,left:number,right:number,bottom:number}}
     */
    offset = {
        top: 100,
        left: 30,
        right: 30,
        bottom: 15
    };

    /**
     * Walking animation frames.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    /**
     * Alert animation frames (boss entrance / pre-attack).
     * @type {string[]}
     */
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

    /**
     * Attack animation frames.
     * @type {string[]}
     */
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

    /**
     * Hurt animation frames.
     * @type {string[]}
     */
    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    /**
     * Dead animation frames.
     * @type {string[]}
     */
    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    /**
     * Construct the Endboss, preload images, set start position and begin animation loops.
     *
     * @returns {void}
     */
    constructor(){
        super();
        this.loadAllImages();
        this.setPosition();
        this.animate();
    }

    /**
     * Start repeating intervals for boss animation and movement.
     * Uses global setStoppableInterval so intervals can be cleared by the game.
     *
     * @returns {void}
     */
    animate(){
        setStoppableInterval(() => this.animateEndboss(), 200);
        setStoppableInterval(() => this.makeBoosMoveLeft(), 100);
    }

    /**
     * Move the boss left under specified conditions:
     * - When fight started and boss is still beyond a threshold (entrance)
     * - Or when alert animation finished and the boss isn't dead.
     *
     * @returns {void}
     */
    makeBoosMoveLeft(){
        if((this.startBossFight && this.x > 2500 && !this.isDead()) || (this.startAnimation >= this.IMAGES_WALKING.length +1 && !this.isDead())){
            this.moveLeft(this.speed);
        }
    }

    /**
     * Decide which animation to run based on current state (dead, hurt, walk, alert, attack).
     *
     * @returns {void}
     */
    animateEndboss(){
        if(this.isDead()){
            this.animateDead();
        }else if(this.isHurt()){
            this.animateHurt();
        }else if(this.shouldWalk()){
            this.animateWalking();
        }else if (this.shouldAlert()){
            this.animateAlert();
        }else if (this.shouldAttack()){
            this.animateAttack();
        }  
    }

    /**
     * Whether alert animation should run.
     * @returns {boolean}
     */
    shouldAlert(){
        return this.startBossFight && this.x > 2490 && this.startAnimation < this.IMAGES_ALERT.length +1;
    }

    /**
     * Whether walking animation should run.
     * @returns {boolean}
     */
    shouldWalk(){
        return this.startBossFight && this.x > 2500;
    }

    /**
     * Whether attack animation should run (after walking/alert counters).
     * @returns {boolean}
     */
    shouldAttack(){
        return this.startAnimation >= this.IMAGES_WALKING.length +1;
    }

    /**
     * Play attack frames (resets non-looping counter).
     *
     * @returns {void}
     */
    animateAttack(){
        this.j = 0;
        this.animateImage(this.IMAGES_ATTACK);
    }

    /**
     * Play walking frames.
     *
     * @returns {void}
     */
    animateWalking(){
        this.animateImage(this.IMAGES_WALKING);
    }

    /**
     * Play alert frames and advance the startAnimation counter.
     *
     * @returns {void}
     */
    animateAlert(){
        this.animateImage(this.IMAGES_ALERT);
        this.startAnimation++;
    }

    /**
     * Play hurt frames.
     *
     * @returns {void}
     */
    animateHurt(){
        this.animateImage(this.IMAGES_HURT);
    }

    /**
     * Play dead frames.
     *
     * @returns {void}
     */
    animateDead(){
        this.animateImage(this.IMAGES_DEAD);
    }

    /**
     * Preload representative image and all image sets used by the boss.
     *
     * @returns {void}
     */
    loadAllImages(){
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
    }

    /**
     * Set the initial horizontal position for the boss (off-screen start).
     *
     * @returns {void}
     */
    setPosition(){
        this.x = 2800;
    }
}