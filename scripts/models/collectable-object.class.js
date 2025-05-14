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
        if(array == "coin"){
            this.arrayCache = this.IMAGES_Coin;
            this.animate();
            this.offset.top = 35;
            this.offset.left = 35;
            this.offset.right = 35;
            this.offset.bottom = 35;
        }else if (array == "bottle"){
            this.arrayCache = this.IMAGES_BOTTTLE;
            this.offset.top = 20;
            this.offset.left = 35;
            this.offset.right = 25;
            this.offset.bottom = 15;
        }
        this.y = y;
        this.loadImage(this.arrayCache[this.randomZerroOrOne()]);
        this.loadImages(this.arrayCache);
        this.x = 300 + Math.random() * 1700;
    }

    animate(){
        setStoppableInterval(() => this.animateImage(this.arrayCache), 300);
    }
}