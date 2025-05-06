class MovableObject extends DrawableObject{
    x = 100;
    y = 125;
    otherDirection = false;
    collided = false;
    energy = 100;
    lastHit = 0;
    i = 0;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity(){
        setInterval(() =>{
            if((this.limitationYGround() || this.speedY > 0) && !this.collided){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    limitationYGround(){
        if (this instanceof ThrowableObject){
            return true;
        } else{
            return this.y <= 125;
        }  
    }

   moveRight(){
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft(){
        this.x -= this.speed;
    }

    animateImage(IMAGES_ARRAY){
        if(IMAGES_ARRAY == this.IMAGES_WALKING || IMAGES_ARRAY == this.IMAGES_HURT || IMAGES_ARRAY == this.IMAGES_LONG_IDLE || IMAGES_ARRAY == this.IMAGES_Coin || IMAGES_ARRAY == this.IMAGES_BOTTLE_ROTATION){
            this.currentImage ++;
            this.i = this.currentImage % IMAGES_ARRAY.length;
        }else{
            if (this.i < IMAGES_ARRAY.length - 1) {
                this.i++;
            }
        } 
        let path = IMAGES_ARRAY[this.i];
        this.img = this.imageCache[path];
        
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
        this.speedY = 25;
    }

    isCollading(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    }

    
}