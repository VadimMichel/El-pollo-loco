/**
 * @fileoverview Container for a single game level definition.
 *
 * Holds arrays of enemies, decorative clouds, background layers and collectable items
 * as well as the level end position. Instances are used by World to populate and
 * update the game world.
 *
 * @class Level
 */
class Level {
    /**
     * Array of enemy instances present in this level.
     * @type {Array<MovableObject>|Array<Enemy>}
     */
    enemies;

    /**
     * Array of BackgroundObject instances used for parallax background layers.
     * @type {BackgroundObject[]}
     */
    backgroundObjects;

    /**
     * Array of Cloud instances used as decorative background elements.
     * @type {Cloud[]}
     */
    clouds;

    /**
     * Array of CollectableObject instances representing coins.
     * @type {CollectableObject[]}
     */
    coins;

    /**
     * Array of CollectableObject instances representing bottles.
     * @type {CollectableObject[]}
     */
    bottle;

    /**
     * X coordinate (in world pixels) that defines the level's end boundary.
     * Used to limit player movement and to trigger end-of-level behaviour.
     * @type {number}
     */
    level_end_x = 2157;

    /**
     * Create a Level instance.
     *
     * @param {Array<MovableObject>|Array<Enemy>} enemies - Enemies to populate the level.
     * @param {Cloud[]} clouds - Clouds used in the level background.
     * @param {BackgroundObject[]} backgroundObjects - Parallax background layers.
     * @param {CollectableObject[]} coins - Collectable coins.
     * @param {CollectableObject[]} bottle - Collectable bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottle){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottle = bottle;
    }
}