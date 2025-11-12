/**
 * @fileoverview StatusBar renders different HUD/status bars (health, coins, bottles, boss)
 * as image-based progress indicators. It extends DrawableObject to use the shared
 * image loading / drawing utilities.
 *
 * Usage:
 * - new StatusBar("health", y, x, percentage)
 * - call setPercentage(...) to update the displayed frame
 *
 * @extends {DrawableObject}
 */
class StatusBar extends DrawableObject{
    /** @type {number} X position in screen/canvas coordinates. */
    x = 20;

    /** @type {number} Y position in screen/canvas coordinates. */
    y = -10;

    /** @type {number} Rendered width in pixels. */
    width = 250;

    /** @type {number} Rendered height in pixels. */
    height= 60;

    /** @type {number} Current percentage value (0-100) represented by the bar. */
    persentage;

    /**
     * Health bar image frames mapped to 0,20,40,60,80,100.
     * @type {string[]}
     */
    IMAGES_HEALTH = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
    ];

    /**
     * Coin bar image frames mapped to 0,20,40,60,80,100.
     * @type {string[]}
     */
    IMAGES_COIN = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png"
    ];

    /**
     * Bottle bar image frames mapped to 0,20,40,60,80,100.
     * @type {string[]}
     */
    IMAGES_BOTTLE = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png"
    ];

    /**
     * Boss bar image frames mapped to 0,20,40,60,80,100.
     * @type {string[]}
     */
    IMAGES_BOSS = [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
    ]

    /**
     * Create a StatusBar instance of the requested type and initial position/value.
     *
     * @param {"coin"|"health"|"bottle"|"boss"} array - Type identifier selecting the image set.
     * @param {number} y - Y screen coordinate.
     * @param {number} x - X screen coordinate.
     * @param {number} persentage - Initial percentage value (0-100).
     */
    constructor(array, y, x, persentage){
        super();
        this.setTypeProperties(array);
        this.setPosition(y, x);
        this.loadImages(this.arrayCache);
        this.setPercentage(persentage);
    }

    /**
     * Update the displayed percentage and switch the underlying image accordingly.
     *
     * @param {number} persentage - Percentage value (0-100).
     * @returns {void}
     */
    setPercentage(persentage){
        this.persentage = persentage;
        let path = this.arrayCache[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Set the screen position for the bar.
     *
     * @param {number} y - Y coordinate.
     * @param {number} x - X coordinate.
     * @returns {void}
     */
    setPosition(y, x){
        this.x = x;
        this.y = y;
    }

    /**
     * Resolve which image index corresponds to the current percentage.
     * Index mapping:
     * 0: 0-19, 1:20-39, 2:40-59, 3:60-79, 4:80-99, 5:100
     *
     * @returns {number} Index into the active image array (0-5).
     */
    resolveImageIndex() {
        if(this.persentage >= 100){
            return 5;
        }else if(this.persentage > 79 && this.persentage < 100){
            return 4;
        }else if(this.persentage > 59 && this.persentage < 80){
            return 3;
        }else if(this.persentage > 39 && this.persentage < 60){
            return 2;
        }else if(this.persentage > 19 && this.persentage < 40){
            return 1;
        }else{
            return 0;
        }
    }

    /**
     * Select the appropriate image set for the provided type identifier.
     *
     * @param {"coin"|"health"|"bottle"|"boss"} array - Type identifier.
     * @returns {void}
     */
    setTypeProperties(array){
        if(array == "coin"){
            this.arrayCache = this.IMAGES_COIN;
        }else if (array == "health" ){
            this.arrayCache = this.IMAGES_HEALTH;
        }else if (array == "bottle"){
            this.arrayCache = this.IMAGES_BOTTLE;
        }else if (array == "boss"){
            this.arrayCache = this.IMAGES_BOSS;
        }
    }
}