class CollectableObject extends MovableObject{
    width = 100;
    height = 100;
    y = 100;
    amount = 0;

    IMAGES_Coin = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    IMAGES_BOTTTLE = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ]

    constructor(array, y){
        super();
        if(array == "coin"){
            this.arrayCache = this.IMAGES_Coin;
            this.animate();
        }else if (array == "bottle"){
            this.arrayCache = this.IMAGES_BOTTTLE;
        }
        this.y = y;
        this.loadImage(this.arrayCache[this.randomZerroOrOne()]);
        this.loadImages(this.arrayCache);
        this.x = 300 + Math.random() * 500;
    }

    animate(){
        setInterval(() => {
           this.animateImage(this.arrayCache);
        }, 300);
    }
}