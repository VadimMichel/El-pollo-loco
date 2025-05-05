class StatusBar extends DrawableObject{
    x = 20;
    y = -10;
    width = 250;
    height= 60;
    persentage;

    IMAGES_HEALTH = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
    ];

    IMAGES_COIN = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png"
    ];

    IMAGES_BOTTLE = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png"
    ];

    constructor(array, y, persentage){
        super();
        if(array == "coin"){
            this.arrayCache = this.IMAGES_COIN;
        }else if (array == "health" ){
            this.arrayCache = this.IMAGES_HEALTH;
        }else if (array == "bottle"){
            this.arrayCache = this.IMAGES_BOTTLE;
        }
        this.persentage = persentage;
        this.y = y;
        this.loadImages(this.arrayCache);
        this.setPercentage(this.persentage);
    }

    setPercentage(persentage){
        console.log(this.persentage)
        this.persentage = persentage;
        let path = this.arrayCache[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if(this.persentage >= 100){
            return 5;
        }else if(this.persentage > 79 && this.persentage < 100){
            return 4;
        }else if(this.persentage > 59 && this.persentage < 80){
            return 3;
        }else if(this.persentage > 39 && this.persentage < 60){
            return 2;
        }else if(this.persentage > 19 && this.persentage < 40){
            return 1;
        }else{
            return 0;
        }
    }
}