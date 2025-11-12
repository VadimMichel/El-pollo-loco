/**
 * @fileoverview Simple Keyboard input state container.
 *
 * Represents the current pressed state of common game keys. Instances are used
 * by game logic to query input without directly handling DOM events here.
 *
 * @class Keyboard
 */
class Keyboard {
    /** @type {boolean} Left arrow (or 'A') key pressed. */
    LEFT = false;

    /** @type {boolean} Right arrow (or 'D') key pressed. */
    RIGHT = false;

    /** @type {boolean} Up arrow (or 'W') key pressed / jump key. */
    UP = false;

    /** @type {boolean} Down arrow key pressed. */
    DOWN = false;

    /** @type {boolean} Space key pressed. */
    SPACE = false;

    /** @type {boolean} 'D' key state (separate flag if used by game). */
    D = false;
}