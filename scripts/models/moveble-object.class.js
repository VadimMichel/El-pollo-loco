/**
 * @fileoverview MovableObject extends DrawableObject and provides physics, movement,
 * collision checks and animation helpers used by game entities.
 *
 * Responsibilities:
 * - position and basic movement (left/right/jump)
 * - gravity application and ground limitation logic
 * - image animation helpers and image cache management
 * - collision detection utilities (including top-only collision)
 *
 * @extends {DrawableObject}
 */
class MovableObject extends DrawableObject{
    /**
     * X position in world coordinates.
     * @type {number}
     */
    x = 100;

    /**
     * Y position in world coordinates.
     * @type {number}
     */
    y = 145;

    /**
     * Flip sprite horizontally when true.
     * @type {boolean}
     */
    otherDirection = false;

    /**
     * Collision flag.
     * @type {boolean}
     */
    collided = false;

    /**
     * Current health/energy of the object.
     * @type {number}
     */
    energy = 100;

    /**
     * Timestamp (ms) of the last hit taken.
     * @type {number}
     */
    lastHit = 0;

    /**
     * Path to the currently displayed image.
     * @type {string|undefined}
     */
    path;

    /**
     * Array of interval IDs created by this instance (not currently used everywhere).
     * @type {number[]}
     */
    interval = [];

    /**
     * Generic frame index used by some animation helpers.
     * @type {number}
     */
    i = 0;

    /**
     * Secondary frame index used for non-looping animations.
     * @type {number}
     */
    j = 0;

    /**
     * Collision box offsets relative to the sprite bounds.
     * @type {{top:number,left:number,right:number,bottom:number}}
     */
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Start applying gravity by scheduling a repeating call to gravitySettings.
     * Uses global setStoppableInterval so intervals can be cleared externally.
     *
     * @returns {void}
     */
    applyGravity(){
        setStoppableInterval(() => this.gravitySettings(), 1000/25);
    }

    /**
     * Gravity update tick: move vertically according to speedY and acceleration
     * while respecting ground limitation and collision state.
     *
     * @returns {void}
     */
    gravitySettings(){
        if((this.limitationYGround() || this.speedY > 0) && !this.collided){
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    /**
     * Determine whether the object is considered "above ground".
     * Throwable objects are exempt and treated as always above ground.
     *
     * @returns {boolean} true if object is off the ground (jumping), false if on/at ground.
     */
    limitationYGround(){
        if (this instanceof ThrowableObject){
            return true;
        } else{
            return this.y <= 130;
        }  
    }

    /**
     * Move the object to the right and ensure sprite faces right.
     *
     * @returns {void}
     */
    moveRight(){
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Move the object to the left.
     *
     * @returns {void}
     */
    moveLeft(){
        this.x -= this.speed;
    }

    /**
     * Update the displayed image from the provided image path array.
     * Uses getNextImageIndex to determine the frame index.
     *
     * @param {string[]} IMAGES_ARRAY - Array of image paths.
     * @returns {void}
     */
    animateImage(IMAGES_ARRAY) {
        let index = this.getNextImageIndex(IMAGES_ARRAY);
        this.path = IMAGES_ARRAY[index];
        this.img = this.imageCache[this.path];
    }

    /**
     * Return the next frame index for the given image array.
     * Some arrays are treated as looping; others advance once.
     *
     * @param {string[]} array - Image path array to step through.
     * @returns {number} Next index to use from the provided array.
     */
    getNextImageIndex(array) {
        let loopingArrays = [
            this.IMAGES_ATTACK,
            this.IMAGES_IDLE,
            this.ImageCacheWalking,
            this.IMAGES_WALKING,
            this.IMAGES_HURT,
            this.IMAGES_LONG_IDLE,
            this.IMAGES_Coin,
            this.IMAGES_BOTTLE_ROTATION
        ];

        if (loopingArrays.includes(array)) {
            this.currentImage++;
            return this.currentImage % array.length;
        } else {
            if (this.j < array.length - 1) this.j++;
            return this.j;
        }
    }

    /**
     * Apply damage to this object if not currently in hurt state.
     * Updates energy and records lastHit timestamp if still alive.
     *
     * @returns {void}
     */
    getHit(){
        if(!this.isHurt()){
            this.energy -= this.recievedDamage;
            if(this.energy <= 0){
                this.energy = 0;
            } else {
                this.lastHit = new Date().getTime();
            }
        }
    }

    /**
     * Returns whether the object is currently in a hurt cooldown period.
     *
     * @returns {boolean} true if hurt cooldown is active, false otherwise.
     */
    isHurt(){
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.6;
    }

    /**
     * Returns whether the object is dead (energy == 0).
     *
     * @returns {boolean}
     */
    isDead(){
        return this.energy == 0;
    }

    /**
     * Start a jump by resetting the non-looping index and setting initial vertical speed.
     *
     * @returns {void}
     */
    jump(){
        this.j = 0;
        this.speedY = 25;
    }

    /**
     * Axis-aligned bounding box collision test.
     *
     * @param {MovableObject} mo - Other movable object to test against.
     * @returns {boolean} true if bounding boxes (with offsets) overlap.
     */
    isCollading(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Check for a collision coming from above (e.g. player stomping an enemy).
     * This method tests that the bottom of this object overlaps the top half of the other
     * object and that the x ranges overlap.
     *
     * @param {MovableObject} mo - Other movable object to test against.
     * @returns {boolean} true if this object is colliding from above.
     */
    isCollidingFromTop(mo) {
        return this.y + this.height <= mo.y + mo.height / 2 && 
            this.y + this.height > mo.y + mo.offset.top &&  
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right;
    }
}