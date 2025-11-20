/**
 * @fileoverview Utility class that centralizes game audio assets and provides
 * convenience methods for playing, muting and managing global audio state.
 *
 * All audio assets are stored as static HTMLAudioElement instances and can be
 * played via GameSounds.playAudio. The class also maintains a global mute
 * flag and persists the mute state to localStorage.
 *
 * Usage:
 * - GameSounds.playAudio(GameSounds.JUMP, 0.4, false);
 * - GameSounds.muteGame(id);
 * - GameSounds.unMuteGame(id);
 *
 * @class GameSounds
 */
class GameSounds{
    /** @type {HTMLAudioElement} Chicken hurt/noise sound. */
    static CHICKEN_NOISE = new Audio("./audio/chicken-noise-196746.mp3");
    /** @type {HTMLAudioElement} Bottle collect sound. */
    static COLLECT_BOTTLE = new Audio("./audio/collect_bottle.mp3");
    /** @type {HTMLAudioElement} Can not trow error sound. */
    static BOTTLE_ERROR = new Audio("./audio/error-bottle.mp3")
    /** @type {HTMLAudioElement} Glass shatter sound. */
    static GLASS_SHATTER = new Audio("./audio/glass-shatter-3-100155.mp3");
    /** @type {HTMLAudioElement} Jump sound. */
    static JUMP = new Audio("./audio/jump.mp3");
    /** @type {HTMLAudioElement} Background music track. */
    static BACKGROUND_MUSIK = new Audio("./audio/latin-traditional-music-spanish-mexican-background-intro-theme-258024.mp3");
    /** @type {HTMLAudioElement} Lose sound. */
    static LOSE = new Audio("./audio/lose.mp3");
    /** @type {HTMLAudioElement} Hurt sound. */
    static HURT_SOUND = new Audio("./audio/male_hurt7-48124.mp3");
    /** @type {HTMLAudioElement} Coin collect sound. */
    static COIN = new Audio("./audio/sound-effects-library-coin.mp3");
    /** @type {HTMLAudioElement} Step / running sound. */
    static STEP = new Audio("./audio/step.mp3");
    /** @type {HTMLAudioElement} Win sound. */
    static WIN = new Audio("./audio/win.mp3");

    /** @type {boolean} Instance-level mute flag (unused for static methods, kept for compatibility). */
    mute = false;

    /** @type {HTMLAudioElement[]} Array of all audio assets managed by GameSounds. */
    static allSounds = [
        GameSounds.CHICKEN_NOISE,
        GameSounds.COLLECT_BOTTLE,
        GameSounds.BOTTLE_ERROR,
        GameSounds.GLASS_SHATTER,
        GameSounds.JUMP,
        GameSounds.BACKGROUND_MUSIK,
        GameSounds.LOSE,
        GameSounds.HURT_SOUND,
        GameSounds.COIN,
        GameSounds.STEP,
        GameSounds.WIN
    ]

    /**
     * Mute the game: stop all sounds, set mute state and update UI.
     *
     * @param {string} id - Optional identifier used to target specific mute UI elements (may be empty string).
     * @returns {void}
     */
    static muteGame(id) {
        GameSounds.stopAllSounds();
        GameSounds.setMuteState(true);
        GameSounds.updateMuteUI(id, 'muted');
    }

    /**
     * Unmute the game: clear mute state, start background music and update UI.
     *
     * @param {string} id - Optional identifier used to target specific mute UI elements (may be empty string).
     * @returns {void}
     */
    static unMuteGame(id){
        GameSounds.setMuteState(false);
        GameSounds.playAudio(GameSounds.BACKGROUND_MUSIK, 0.1, true);
        GameSounds.updateMuteUI(id, 'unmuted');
    }
        
    /**
     * Play a given audio element when it is ready. This function polls the audio
     * readyState and only plays when the media is loaded to avoid errors.
     *
     * @param {HTMLAudioElement} audio - The audio element to play.
     * @param {number} volume - Volume level between 0.0 and 1.0.
     * @param {boolean} loop - Whether the audio should loop.
     * @returns {void}
     */
    static playAudio(audio, volume, loop){
        let intervalSound = setInterval(() => {
            if(!GameSounds.mute && audio.readyState == 4){
                audio.volume = volume;
                audio.loop = loop;
                audio.play();
                clearInterval(intervalSound);
            } 
        }, 200)
    }

    /**
     * Pause all managed audio elements immediately.
     *
     * @returns {void}
     */
    static stopAllSounds(){
        GameSounds.allSounds.forEach(sound => sound.pause());
    }

    /**
     * Persist and set the global mute flag.
     *
     * @param {boolean} isMuted - true to mute, false to unmute.
     * @returns {void}
     */
    static setMuteState(isMuted){
        GameSounds.mute = isMuted;
        localStorage.setItem("soundMute", JSON.stringify(isMuted));
    }

    /**
     * Update the mute/unmute UI buttons associated with the provided id.
     * Expects elements with IDs `muteButton{ id }` and `unMuteButton{ id }` to exist.
     *
     * @param {string} id - Identifier suffix for the mute UI elements.
     * @param {'muted'|'unmuted'} muteState - Current mute state string.
     * @returns {void}
     */
    static updateMuteUI(id, muteState) {
        const isMuted = muteState === 'muted';
        document.getElementById(`muteButton${id}`).classList.toggle("d-none", isMuted);
        document.getElementById(`unMuteButton${id}`).classList.toggle("d-none", !isMuted);
    }
}
