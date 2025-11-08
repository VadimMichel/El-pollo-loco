class CollectableObject extends MovableObject{
    width = 100;
    height = 100;
    y = 100;
    amount = 0;
    coinAudioUrl = "audio/sound-effects-library-coin.mp3";
    bottleCollectAudioUrl = "audio/collect_bottle.mp3";
    offset = {
        top: 30,
        left: 40,
        right: 45,
        bottom: 15
    };

    IMAGES_Coin = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    IMAGES_BOTTTLE = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];

    constructor(array, y){
        super();
        this.setTypeProperties(array);
        this.loadImagesForType();
        this.setPosition(y);
    }

    animate(){
        setStoppableInterval(() => this.animateImage(this.arrayCache), 300);
    }

    setTypeProperties(array){
        if(array == "coin"){
            this.arrayCache = this.IMAGES_Coin;
            this.animate();
            this.offset = { top: 35, left: 35, right: 35, bottom: 35 };
        }else if (array == "bottle"){
            this.arrayCache = this.IMAGES_BOTTTLE;
           this.offset = { top: 20, left: 35, right: 25, bottom: 15 };
        }
    }

    setPosition(y){
        this.y = y;
        this.x = 300 + Math.random() * 1700;
    }

    loadImagesForType() {
        this.loadImage(this.arrayCache[this.randomZerroOrOne()]);
        this.loadImages(this.arrayCache);
    }
}