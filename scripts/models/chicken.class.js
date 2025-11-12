/**
 * @fileoverview Chicken enemy class used in level populations.
 * Extends MovableObject and implements behavior for normal and small chicken variants:
 * - chooses a variant on construction (normal or small)
 * - loads and caches images for walking and dead animations
 * - positions itself at a random x and applies a random horizontal speed
 * - moves left and animates periodically using global setStoppableInterval
 *
 * @extends {MovableObject}
 */
class Chicken extends MovableObject{
    /**
     * Sprite width in pixels (normal variant default).
     * @type {number}
     */
    width = 120;

    /**
     * Sprite height in pixels (normal variant default).
     * @type {number}
     */
    height = 100;

    /**
     * X position in world coordinates (set during initialization).
     * @type {number|undefined}
     */
    x;

    /**
     * Y position in world coordinates.
     * @type {number}
     */
    y = 330;

    /**
     * Death animation / counter value used for progression when dead.
     * @type {number}
     */
    k = 0;

    /**
     * Movement speed factor (set randomly per instance).
     * @type {number|undefined}
     */
    speed;

    /**
     * Damage value applied when chicken is hit (game-specific semantics).
     * @type {number}
     */
    recievedDamage = 100;

    /**
     * Local audio asset path for chicken hurt sound (not played here, provided as reference).
     * @type {string}
     */
    chichenHurtAudioUrl = "audio/chicken-noise-196746.mp3";

    /**
     * Cached image paths for dead animation for the chosen variant.
     * @type {string[]}
     */
    ImageCacheDead;

    /**
     * Cached image paths for walking animation for the chosen variant.
     * @type {string[]}
     */
    ImageCacheWalking;

    /**
     * Collision box offsets relative to sprite bounds.
     * @type {{top:number,left:number,right:number,bottom:number}}
     */
     offset = {
        top: 30,
        left: 10,
        right: 10,
        bottom: 15
    };

    /**
     * Walking frames for the normal chicken variant.
     * @type {string[]}
     */
    IMAGES_WALKING_NORMAL =[
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    /**
     * Dead frames for the normal chicken variant.
     * @type {string[]}
     */
    IMAGES_DEAD_NORMAL = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ];

    /**
     * Walking frames for the small chicken variant.
     * @type {string[]}
     */
    IMAGES_WALKING_SMAL = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];

    /**
     * Dead frames for the small chicken variant.
     * @type {string[]}
     */
    IMAGES_DEAD_SMAL = [
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    ]

    /**
     * Construct a Chicken instance.
     *
     * Responsibilities:
     * - choose a variant (normal or small)
     * - preload images for chosen variant
     * - set random x position and speed
     * - start movement and animation intervals
     *
     * @returns {void}
     */
    constructor (){
        super();
        this.setVariant();
        this.loadAllImages();
        this.setPositionAndSpeed();
        this.animate();
    }

    /**
     * Start recurring intervals for movement and animation.
     * Intervals are created via global setStoppableInterval so they can be cleared by the game.
     *
     * @returns {void}
     */
    animate(){
        setStoppableInterval(() => this.moveLeftIfNotDead(), 1000/60);
        setStoppableInterval(() => this.animateChicken(), 200);
    }

    /**
     * Move the chicken left when it is not dead.
     *
     * @returns {void}
     */
    moveLeftIfNotDead(){
        if(!this.isDead()){
            this.moveLeft(this.speed);
        }
    }
    
    /**
     * Update animation frames depending on state (dead or walking).
     * When dead, increment internal counter `k` which may be used for death progression.
     *
     * @returns {void}
     */
    animateChicken(){
        if(this.isDead()){
            this.k++;
            this.animateImage(this.ImageCacheDead); 
        }else{
            this.animateImage(this.ImageCacheWalking);
        }
    }

    /**
     * Randomly select the chicken variant (normal or small) and configure dimensions,
     * offsets and image caches accordingly.
     *
     * @returns {void}
     */
    setVariant(){
        if (this.randomZerroOrOne() === 1) {
            this.ImageCacheDead = this.IMAGES_DEAD_NORMAL;
            this.ImageCacheWalking = this.IMAGES_WALKING_NORMAL;
        } else {
            this.ImageCacheDead = this.IMAGES_DEAD_SMAL;
            this.ImageCacheWalking = this.IMAGES_WALKING_SMAL;
            this.width = 60;
            this.height = 50;
            this.y = 380;
            this.offset = {top: 0, left: 10, right: 10, bottom: 15};
        }
    }

    /**
     * Set a random horizontal start position and a random walking speed.
     * X is chosen within a range so chickens appear across the level.
     *
     * @returns {void}
     */
    setPositionAndSpeed(){
        this.x = 300 + Math.random() * 1700;
        this.speed = 0.05 + Math.random() * 2;
    }

    /**
     * Preload a representative image and then preload all variant images into the MovableObject cache.
     *
     * @returns {void}
     */
    loadAllImages(){
        this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.ImageCacheDead);
        this.loadImages(this.ImageCacheWalking);
    }
}