/**
 * @fileoverview Cloud background object for parallax layers.
 * Extends MovableObject and provides randomized positioning and continuous leftward movement.
 *
 * Clouds select one of two images and move at a randomized speed. Intended to be used
 * as a decorative background element in the world.
 *
 * @extends {MovableObject}
 */
class Cloud extends MovableObject{
    /**
     * Sprite width in pixels.
     * @type {number}
     */
    width = 700;

    /**
     * Sprite height in pixels.
     * @type {number}
     */
    height = 250;

    /**
     * Vertical position in pixels.
     * @type {number}
     */
    y = 20;

    /**
     * Horizontal position in world coordinates.
     * @type {number|undefined}
     */
    x;

    /**
     * Horizontal movement speed (pixels per tick or similar unit).
     * @type {number|undefined}
     */
    speed;

    /**
     * Reference to the World instance this cloud belongs to.
     * @type {World|undefined}
     */
    world;

    /**
     * Create a Cloud instance, select a variant image, set position/speed and start animation.
     *
     * @param {World} [world] - Optional world reference used to determine placement range.
     */
    constructor (world){
        super();
        this.setVariant();
        this.setPositionAndSpeed(world);
        this.animate();
    }

    /**
     * Start the interval that moves the cloud leftwards.
     * Uses setStoppableInterval so the interval can be cleared by the game.
     *
     * @returns {void}
     */
    animate(){
        setStoppableInterval(() => this.moveLeft(), 50);
    }

    /**
     * Set a randomized horizontal position and speed for the cloud.
     * Stores the provided world reference.
     *
     * @param {World} [world] - Optional world used for context (stored on the instance).
     * @returns {void}
     */
    setPositionAndSpeed(world){
        this.world = world;
        this.x = Math.random() * 2500;
        this.speed = 0.15 + Math.random() * 1;
    }

    /**
     * Choose and load one of two cloud images at random.
     *
     * @returns {void}
     */
    setVariant(){
        if(this.randomZerroOrOne() == 1){
            this.loadImage("img/5_background/layers/4_clouds/1.png");
        } else {
            this.loadImage("img/5_background/layers/4_clouds/2.png");
        }
    }
}