class Coin extends MovableObject{
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

    constructor(){
        super();
        this.collectet = true;
        this.loadImage(this.IMAGES_Coin[0]);
        this.loadImages(this.IMAGES_Coin);
        this.x = 300 + Math.random() * 500;
        this.animate();
    }

    animate(){
        setInterval(() => {
           this.animateImage(this.IMAGES_Coin);
        }, 300);
    }
}