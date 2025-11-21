/**
 * @fileoverview BackgroundObject represents a static background layer image used for parallax
 * scrolling. It extends MovableObject and provides default dimensions and a helper to position
 * the image so its bottom aligns with the canvas floor.
 */

/**
 * Background layer object used in world backgrounds.
 *
 * @class BackgroundObject
 * @extends {MovableObject}
 */
class BackgroundObject extends MovableObject {
    /**
     * Width of the background image in pixels.
     * @type {number}
     */
    width = 720;

    /**
     * Height of the background image in pixels.
     * @type {number}
     */
    height = 480;

    /**
     * Create a BackgroundObject, load its image and set its horizontal position.
     *
     * @param {string} imagePath - Path to the background image file.
     * @param {number} x - Initial x position in pixels.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.setPosition(x);
    }

    /**
     * Set the x,y position of the background object. The y position is computed so the bottom
     * of the background aligns with the canvas floor (assumed canvas height 480).
     *
     * @param {number} x - X coordinate in pixels.
     * @returns {void}
     */
    setPosition(x) {
        this.y = 480 - this.height;
        this.x = x;
    }

    /**
     * Return a nicely formatted debug string as JSON for console output.
     * Use: console.log(JSON.stringify(bgObj, null, 2))
     *
     * @returns {string}
     */
    toString(){
        return JSON.stringify({
            class: 'BackgroundObject',
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }, null, 2);
    }
}