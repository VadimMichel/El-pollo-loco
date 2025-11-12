/**
 * @fileoverview CollectableObject represents coins and bottles that the player can pick up.
 * It extends MovableObject and provides type-specific image sets, positioning and collection audio.
 *
 * Usage:
 * - new CollectableObject("coin", y) or new CollectableObject("bottle", y)
 *
 * @extends {MovableObject}
 */
class CollectableObject extends MovableObject{
    /**
     * Default sprite width in pixels.
     * @type {number}
     */
    width = 100;

    /**
     * Default sprite height in pixels.
     * @type {number}
     */
    height = 100;

    /**
     * Vertical position in pixels.
     * @type {number}
     */
    y = 100;

    /**
     * Amount associated with this collectable (unused default).
     * @type {number}
     */
    amount = 0;

    /**
     * Sound file for coin collection.
     * @type {string}
     */
    coinAudioUrl = "audio/sound-effects-library-coin.mp3";

    /**
     * Sound file for bottle collection.
     * @type {string}
     */
    bottleCollectAudioUrl = "audio/collect_bottle.mp3";

    /**
     * Collision box offsets relative to sprite bounds.
     * @type {{top:number,left:number,right:number,bottom:number}}
     */
    offset = {
        top: 30,
        left: 40,
        right: 45,
        bottom: 15
    };

    /**
     * Image frames for coin animation.
     * @type {string[]}
     */
    IMAGES_Coin = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    /**
     * Image frames for bottle animation.
     * @type {string[]}
     */
    IMAGES_BOTTTLE = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];

    /**
     * Array cache for the currently selected image frames (coin or bottle).
     * Set by setTypeProperties.
     * @type {string[]}
     */
    arrayCache;

    /**
     * Create a collectable object of the specified type at a randomized x position and given y.
     *
     * @param {string} array - Type identifier, expected "coin" or "bottle".
     * @param {number} y - Vertical position to place the collectable.
     */
    constructor(array, y){
        super();
        this.setTypeProperties(array);
        this.loadImagesForType();
        this.setPosition(y);
    }

    /**
     * Start a repeating animation interval for the collectable's frames.
     * Uses setStoppableInterval so the interval can be cleared globally.
     *
     * @returns {void}
     */
    animate(){
        setStoppableInterval(() => this.animateImage(this.arrayCache), 300);
    }

    /**
     * Configure internal properties depending on the requested type.
     * - For "coin": use coin frames, adjust offset and start animation.
     * - For "bottle": use bottle frames and adjusted offset.
     *
     * @param {string} array - Type identifier ("coin" | "bottle").
     * @returns {void}
     */
    setTypeProperties(array){
        if(array == "coin"){
            this.arrayCache = this.IMAGES_Coin;
            this.animate();
            this.offset = { top: 35, left: 35, right: 35, bottom: 35 };
        }else if (array == "bottle"){
            this.arrayCache = this.IMAGES_BOTTTLE;
            this.offset = { top: 20, left: 35, right: 25, bottom: 15 };
        }
    }

    /**
     * Set the vertical position and a randomized horizontal start position.
     *
     * @param {number} y - Vertical position in pixels.
     * @returns {void}
     */
    setPosition(y){
        this.y = y;
        this.x = 300 + Math.random() * 1700;
    }

    /**
     * Preload a representative image for immediate rendering and preload all frames
     * for the current type into the MovableObject image cache.
     *
     * @returns {void}
     */
    loadImagesForType() {
        this.loadImage(this.arrayCache[this.randomZerroOrOne()]);
        this.loadImages(this.arrayCache);
    }
}