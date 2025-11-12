/**
 * @fileoverview DrawableObject is the base visual class that manages image loading,
 * caching and basic drawing utilities used by all game entities.
 *
 * Responsibilities:
 * - load single images and preload image arrays into a cache
 * - draw current image to a canvas context using the object's geometry
 * - provide simple helpers and image index tracking for animations
 *
 * @class DrawableObject
 */
class DrawableObject{
    /**
     * Currently displayed HTMLImageElement.
     * @type {HTMLImageElement|undefined}
     */
    img;

    /**
     * Cache of preloaded images keyed by path.
     * @type {{[path: string]: HTMLImageElement}}
     */
    imageCache = {};

    /**
     * Index of the currently used image in an animation sequence.
     * @type {number}
     */
    currentImage = 0;

    /**
     * Optional reference to the active image path array for animation.
     * @type {string[]|undefined}
     */
    arrayCache;

    /**
     * Load a single image and set it as the current image.
     *
     * @param {string} path - Image file path to load.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preload an array of image paths into the imageCache for fast access.
     *
     * @param {string[]} array - Array of image paths to preload.
     * @returns {void}
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draw the current image to the provided 2D canvas context.
     *
     * Note: this.x, this.y, this.width and this.height are expected to be defined
     * on the instance (usually by subclasses).
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
     * @returns {void}
     */
    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);    
    }

    /**
     * Helper that returns either 0 or 1 randomly.
     * Useful for selecting between two variants (e.g. cloud/chicken sprites).
     *
     * @returns {0|1} Randomly 0 or 1.
     */
    randomZerroOrOne(){
        let rndNummber = Math.random() * 10
        if(rndNummber > 5){
            return 1;
        }else{
            return 0;
        }
    }
}