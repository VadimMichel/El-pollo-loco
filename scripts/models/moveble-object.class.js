class MovableObject extends DrawableObject{
    x = 100;
    y = 145;
    otherDirection = false;
    collided = false;
    energy = 100;
    lastHit = 0;
    path;
    interval = [];
    i = 0;
    j = 0;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity(){
        setStoppableInterval(() => this.gravitySettings(), 1000/25);
    }

    gravitySettings(){
        if((this.limitationYGround() || this.speedY > 0) && !this.collided){
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    limitationYGround(){
        if (this instanceof ThrowableObject){
            return true;
        } else{
            return this.y <= 130;
        }  
    }

   moveRight(){
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft(){
        this.x -= this.speed;
    }

    animateImage(IMAGES_ARRAY) {
        let index = this.getNextImageIndex(IMAGES_ARRAY);
        this.path = IMAGES_ARRAY[index];
        this.img = this.imageCache[this.path];
    }

    getNextImageIndex(array) {
        let loopingArrays = [
            this.IMAGES_ATTACK,
            this.IMAGES_IDLE,
            this.ImageCacheWalking,
            this.IMAGES_WALKING,
            this.IMAGES_HURT,
            this.IMAGES_LONG_IDLE,
            this.IMAGES_Coin,
            this.IMAGES_BOTTLE_ROTATION
        ];

        if (loopingArrays.includes(array)) {
            this.currentImage++;
            return this.currentImage % array.length;
        } else {
            if (this.j < array.length - 1) this.j++;
            return this.j;
        }
    }

    getHit(){
        if(!this.isHurt()){
        this.energy -= this.recievedDamage;
        if(this.energy <= 0){
            this.energy = 0;
        }else{
            this.lastHit = new Date().getTime();
        }}
    }

    isHurt(){
        let timePassed = new Date().getTime() - this.lastHit
        timePassed = timePassed / 1000;
        return timePassed < 0.6;
    }

    isDead(){
        return this.energy == 0;
    }

    jump(){
        this.j = 0;
        this.speedY = 25;
    }

    isCollading(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    }

    isCollidingFromTop(mo) {
        return this.y + this.height <= mo.y + mo.height / 2 && 
            this.y + this.height > mo.y + mo.offset.top &&  
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right
        ;
    }

    playAudio(url, volume, loop){
        let audio = new Audio(url);
        audio.volume = volume;
        audio.loop = loop;
        audio.play();
    }
}