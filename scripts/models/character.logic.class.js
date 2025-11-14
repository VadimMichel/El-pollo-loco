/**
 * @fileoverview CharacterLogic contains the behavior and movement logic for the player character.
 *
 * Responsibilities:
 * - start and manage animation / movement intervals
 * - per-frame movement handling (left/right/jump) and camera update
 * - decide and play the correct animation state (idle, walk, jump, hurt, dead)
 * - play step/jump/hurt audio where appropriate
 *
 * This class expects to be used as a superclass for Character (no exports).
 * It references properties and image arrays that must be provided on the derived class
 * (e.g. IMAGES_WALKING, IMAGES_JUMPING, world, speed, acceleration, etc.).
 *
 * IMPORTANT: Load this file before character.class.js in HTML so Character can extend CharacterLogic.
 *
 * @extends {MovableObject}
 * @class CharacterLogic
 */
class CharacterLogic extends MovableObject {
    /**
     * Start repeated intervals for movement, animation and step sound.
     * Uses global setStoppableInterval to allow external clearing.
     *
     * @returns {void}
     */
    animate(){
        setStoppableInterval(() => this.makeCharacterMove(), 1000/60);
        setStoppableInterval(() => this.animateCharacter(), 100);
        setStoppableInterval(() => this.playRunSound(), 140);
    }

    /**
     * Per-frame character logic: handle horizontal movement, jump handling and camera follow.
     *
     * @returns {void}
     */
    makeCharacterMove(){
        this.handleHorizontalMovement();
        this.handleJump();
        this.updateCameraPosition();
    }

    /**
     * Play step sound when character is walking on the ground.
     *
     * @returns {void}
     */
    playRunSound(){
        if(this.isWalking() && !this.isJumping()){
            GameSounds.playAudio(GameSounds.STEP, 0.4, false);
        }
    }

    /**
     * Decide and play which animation is appropriate given current state.
     *
     * @returns {void}
     */
    animateCharacter(){
        if(this.isDead()){
            this.animateDeath();
        } else if(this.isHurt()){
            this.animateHurt();
        } else if(this.isJumping()){
            this.animateJump();
        } else if(this.isWalking()){
            this.animateWalk();
        } else {
            this.animateIdle();
        }
    }

    /**
     * Animate death frames and reset idle counter.
     *
     * @returns {void}
     */
    animateDeath(){
        this.animateImage(this.IMAGES_DEAD);
        this.notMoving = 0;
    }

    /**
     * Animate hurt frames and reset idle counter.
     *
     * @returns {void}
     */
    animateHurt(){
        this.animateImage(this.IMAGES_HURT);
        this.notMoving = 0;
    }

    /**
     * Animate jumping frames and reset idle counter.
     *
     * @returns {void}
     */
    animateJump(){
        this.animateImage(this.IMAGES_JUMPING);
        this.notMoving = 0;
    }

    /**
     * Animate walking frames and reset idle counter.
     *
     * @returns {void}
     */
    animateWalk(){
        this.animateImage(this.IMAGES_WALKING);
        this.notMoving = 0;
    }

    /**
     * Animate idle or long idle depending on inactivity counter.
     *
     * @returns {void}
     */
    animateIdle(){
        if (this.notMoving < this.IMAGES_IDLE.length * 3) {
            this.animateImage(this.IMAGES_IDLE);
            this.notMoving++;
        } else {
            this.animateImage(this.IMAGES_LONG_IDLE);
        }
    }

    /**
     * Returns true if the character is in a jump state (off the ground).
     *
     * @returns {boolean}
     */
    isJumping(){
        return this.limitationYGround();
    }

    /**
     * Returns true if left or right input is active on the world's keyboard.
     *
     * @returns {boolean}
     */
    isWalking(){
        return this.world && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT);
    }

    /**
     * Handle horizontal movement input and enforce world boundaries.
     * Updates sprite direction flag when moving left.
     *
     * @returns {void}
     */
    handleHorizontalMovement(){
        if (!this.world) return;
        if (this.world.keyboard.LEFT && this.x > -616) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
        }
    }

    /**
     * Handle jump input. If jump key pressed and character is on ground, trigger jump and play sound.
     *
     * @returns {void}
     */
    handleJump(){
        if (!this.world) return;
        let isJumpKey = this.world.keyboard.UP || this.world.keyboard.SPACE;
        let canJump = !this.limitationYGround();

        if (isJumpKey && canJump) {
            this.jump();
            GameSounds.playAudio(GameSounds.JUMP, 0.4, false);
            this.notMoving = 0;
        }
    }

    /**
     * Update the world's camera_x so the camera follows the character.
     *
     * @returns {void}
     */
    updateCameraPosition(){
        if (!this.world) return;
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Preload all image sets used by the character.
     * Expects IMAGES_* arrays to be defined on the derived class.
     *
     * @returns {void}
     */
    loadAllImages(){
        if (this.IMAGES_WALKING) this.loadImages(this.IMAGES_WALKING);
        if (this.IMAGES_JUMPING) this.loadImages(this.IMAGES_JUMPING);
        if (this.IMAGES_DEAD) this.loadImages(this.IMAGES_DEAD);
        if (this.IMAGES_HURT) this.loadImages(this.IMAGES_HURT);
        if (this.IMAGES_IDLE) this.loadImages(this.IMAGES_IDLE);
        if (this.IMAGES_LONG_IDLE) this.loadImages(this.IMAGES_LONG_IDLE);
    }
}