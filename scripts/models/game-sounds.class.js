class GameSounds{
    static CHICKEN_NOISE = new Audio("./audio/chicken-noise-196746.mp3");
    static COLLECT_BOTTLE = new Audio("./audio/collect_bottle.mp3");
    static GLASS_SHATTER = new Audio("./audio/glass-shatter-3-100155.mp3");
    static JUMP = new Audio("./audio/jump.mp3");
    static BACKGROUND_MUSIK = new Audio("./audio/latin-traditional-music-spanish-mexican-background-intro-theme-258024.mp3");
    static LOSE = new Audio("./audio/lose.mp3");
    static HURT_SOUND = new Audio("./audio/male_hurt7-48124.mp3");
    static COIN = new Audio("./audio/sound-effects-library-coin.mp3");
    static STEP = new Audio("./audio/step.mp3");
    static WIN = new Audio("./audio/win.mp3");
    static mute = false;

    static allSounds = [
        GameSounds.CHICKEN_NOISE,
        GameSounds.COLLECT_BOTTLE,
        GameSounds.GLASS_SHATTER,
        GameSounds.JUMP,
        GameSounds.BACKGROUND_MUSIK,
        GameSounds.LOSE,
        GameSounds.HURT_SOUND,
        GameSounds.COIN,
        GameSounds.STEP,
        GameSounds.WIN
    ]

    static muteGame(id){
        GameSounds.allSounds.forEach(sound => {
            sound.pause();
        });
        GameSounds.mute = true;
        document.getElementById(`muteButton${id}`).classList.toggle("d-none");
        document.getElementById(`unMuteButton${id}`).classList.toggle("d-none");
    }

    static unMuteGame(id){
        GameSounds.mute = false;
        GameSounds.playAudio(GameSounds.BACKGROUND_MUSIK, 0.2, true);
        document.getElementById(`muteButton${id}`).classList.toggle("d-none");
        document.getElementById(`unMuteButton${id}`).classList.toggle("d-none");
        console.log(`unMuteButton${id}`)
    }
        
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
}
