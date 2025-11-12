/**
 * @fileoverview Level 1 definition: creates and initializes the Level instance
 * with enemies, clouds, background layers and collectable items used in the first level.
 */

/**
 * Global reference to the Level instance for level 1.
 * Will be created by initLevel().
 * @type {Level|undefined}
 */
let level1;

/**
 * Initialize level1 by constructing a Level object populated with:
 * - enemies (Chicken, Endboss)
 * - clouds
 * - background layers (BackgroundObject)
 * - coins (CollectableObject of type "coin")
 * - bottles (CollectableObject of type "bottle")
 *
 * The arrays and object positions are hard-coded for the first level layout.
 *
 * Side effects:
 * - Assigns a new Level instance to the global `level1` variable.
 *
 * @returns {void}
 */
function initLevel(){
    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Endboss(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken()
        ],
        [
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud()
        ],
        [
            new BackgroundObject("img/5_background/layers/air.png", -719),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
            new BackgroundObject("img/5_background/layers/air.png", 0),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/air.png", 719),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
            new BackgroundObject("img/5_background/layers/air.png", 719 *2), 
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3)
        ],
        [
            new CollectableObject("coin", 20),
            new CollectableObject("coin", 20),
            new CollectableObject("coin", 20),
            new CollectableObject("coin", 20),
            new CollectableObject("coin", 20)
        ],
        [
            new CollectableObject("bottle", 330),
            new CollectableObject("bottle", 330),
            new CollectableObject("bottle", 330),
            new CollectableObject("bottle", 330),
            new CollectableObject("bottle", 330),
            new CollectableObject("bottle", 330),
            new CollectableObject("bottle", 330),
            new CollectableObject("bottle", 330)
        ]
    );
}
