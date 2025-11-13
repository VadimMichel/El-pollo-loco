/**
 * @fileoverview ThrowableObject represents a bottle that can be thrown by the character.
 * Extends MovableObject and handles rotation while flying, gravity, collision splash animation
 * and removal from the world after breaking.
 *
 * Behavior:
 * - On construction the bottle image frames are loaded, positioned relative to the character
 *   and an initial throw impulse is applied.
 * - While airborne the bottle rotates; on collision it plays splash frames and is removed.
 *
 * @extends {MovableObject}
 */
class ThrowableObject extends MovableObject{
    /**
     * Render width in pixels.
     * @type {number}
     */
    width = 120;

    /**
     * Render height in pixels.
     * @type {number}
     */
    height = 100;

    /**
     * Gravity acceleration used for vertical motion.
     * @type {number}
     */
    acceleration = 2;

    /**
     * Horizontal speed used when the bottle is moving.
     * @type {number}
     */
    speed = 20;

    /**
     * Default X position (may be overridden by setPosition).
     * @type {number}
     */
    x = 50;

    /**
     * Default Y position (may be overridden by setPosition).
     * @type {number}
     */
    y = 50;

    /**
     * Counter used to advance the splash animation.
     * @type {number}
     */
    k = 0;

    /**
     * Audio URL for the bottle breaking sound.
     * @type {string}
     */
    bottleBreaksAudioUrl = "audio/glass-shatter-3-100155.mp3";
    
    /**
     * Rotation frames shown while bottle is airborne.
     * @type {string[]}
     */
    IMAGES_BOTTLE_ROTATION = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];

    /**
     * Splash frames shown after the bottle collides/breaks.
     * @type {string[]}
     */
    IMAGES_BOTTLE_SPLASH = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
    ];

    /**
     * Construct a ThrowableObject positioned at (x,y), preload images and immediately throw it.
     *
     * @param {number} x - Base horizontal position (usually character.x).
     * @param {number} y - Base vertical position (usually character.y).
     */
    constructor(x, y){
        super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
        this.loadAllImages();
        this.animate();
        this.setPosition(x, y);
        this.trow();
    }

    /**
     * Apply the initial vertical impulse and start horizontal movement according to
     * the character's facing direction at the moment of throwing.
     *
     * Note: Captures the direction once (throwToLeft) so the bottle will not change
     * direction after being thrown.
     *
     * @returns {void}
     */
   trow() {
        this.speedY = 15;
        this.applyGravity();
        const throwToLeft = world.character.otherDirection;
        setInterval(() => {
            if (!this.collided) {
                if (throwToLeft) {
                    this.moveLeft(this.speed);
                } else {
                    this.moveRight(this.speed);
                }
            }
        }, 1000 / 25);
    
    }

    /**
     * Start the rotation / splash animation interval for the bottle.
     * Uses the global setStoppableInterval helper for consistent interval management.
     *
     * @returns {void}
     */
    animate(){
        setStoppableInterval(() => this.animateBottle(), 100);
    }

    /**
     * Switch between rotation frames while airborne and splash frames after collision.
     * When splash animation finished, remove the bottle from world.bottleThrow array.
     *
     * @returns {void}
     */
    animateBottle(){
        if(this.collided){
            this.animateImage(this.IMAGES_BOTTLE_SPLASH);
            this.k++;

            if (this.k > this.IMAGES_BOTTLE_SPLASH.length) {
                const index = world.bottleThrow.indexOf(this); 
                if (index !== -1) {                            
                    world.bottleThrow.splice(index, 1);        
                }
            }
        } else {
            this.animateImage(this.IMAGES_BOTTLE_ROTATION);
        }
    }

    /**
     * Preload rotation and splash frames into the image cache.
     *
     * @returns {void}
     */
    loadAllImages(){
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    }

    /**
     * Set initial bottle position relative to the character.
     * If the character faces left, the bottle is placed with a left offset so
     * it appears in front of the character.
     *
     * @param {number} x - Base x coordinate (character.x).
     * @param {number} y - Base y coordinate (character.y).
     * @returns {void}
     */
    setPosition(x, y){
        if (world.character.otherDirection) {
            this.x = x - 100;
        } else {
            this.x = x;
        }
        this.y = y;
    }
}