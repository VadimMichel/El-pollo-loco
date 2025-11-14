/**
 * @fileoverview Character is the player-controlled entity. It holds rendering-related
 * properties and image asset lists. Movement, animation and input handling logic is
 * implemented in CharacterLogic which this class extends. Ensure character.logic.class.js
 * is loaded before this file so Character can extend CharacterLogic.
 *
 * The class exposes sprite dimensions, collision offsets and animation frame arrays.
 * Instances expect a World reference to be attached to the "world" property so input
 * and camera following work correctly.
 *
 * @extends {CharacterLogic}
 * @class Character
 */
class Character extends CharacterLogic{
    /** @type {number} Default sprite width in pixels. */
    width = 150;

    /** @type {number} Default sprite height in pixels. */
    height = 300;

    /** @type {World} Reference to the World instance this character belongs to. */
    world;

    /** @type {number} Horizontal movement speed (pixels per frame). */
    speed = 6;

    /** @type {number} Vertical velocity component for gravity physics. */
    speedY = 0;

    /** @type {number} Gravity / vertical acceleration factor. */
    acceleration = 2;

    /** @type {number} Damage value applied when the character is hit. */
    recievedDamage = 20;

    /** @type {number} Counter used to detect long idle state (frames). */
    notMoving = 0;

    /** @type {{top:number,left:number,right:number,bottom:number}} Collision box offsets. */
    offset = {
        top: 150,
        left: 45,
        right: 45,
        bottom: 15
    };

    /** @type {number} Initial horizontal position. */
    x = 20;

    /** @type {string[]} Walk animation frame paths. */
    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ];

    /** @type {string[]} Jump animation frame paths. */
    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png",
    ];

    /** @type {string[]} Death animation frame paths. */
    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png"
    ];

    /** @type {string[]} Hurt animation frame paths. */
    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png"
    ];

    /** @type {string[]} Short idle animation frame paths. */
    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/idle/I-1.png",
        "img/2_character_pepe/1_idle/idle/I-2.png",
        "img/2_character_pepe/1_idle/idle/I-3.png",
        "img/2_character_pepe/1_idle/idle/I-4.png",
        "img/2_character_pepe/1_idle/idle/I-5.png",
        "img/2_character_pepe/1_idle/idle/I-6.png",
        "img/2_character_pepe/1_idle/idle/I-7.png",
        "img/2_character_pepe/1_idle/idle/I-8.png",
        "img/2_character_pepe/1_idle/idle/I-9.png",
        "img/2_character_pepe/1_idle/idle/I-10.png",
    ];

    /** @type {string[]} Long idle animation frame paths. */
    IMAGES_LONG_IDLE = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png"
    ];

    /**
     * Create a Character instance, preload assets and start animation/physics loops.
     *
     * Initializes the default sprite image, loads all image sets and starts
     * animation and gravity behavior provided by the parent class (CharacterLogic).
     *
     * @constructor
     */
    constructor(){
        super(); 
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadAllImages();
        this.animate();
        this.applyGravity();
    }
}