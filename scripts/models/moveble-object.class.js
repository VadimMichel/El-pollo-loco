class MovableObject extends DrawableObject{
    x = 100;
    y= 125;
    otherDirection = false;
    energy = 100;
    lastHit = 0;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity(){
        setInterval(() =>{
            if(this.limitationYGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    limitationYGround(){
        return this.y <= 125;
    }

   moveRight(){
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft(){
        this.x -= this.speed;
    }

    animateImage(IMAGES_ARRAY){
        let i = this.currentImage % IMAGES_ARRAY.length;
        let path = IMAGES_ARRAY[i];
        this.img = this.imageCache[path];
        this.currentImage ++;
    }

    getHit(){
        this.energy -= this.recievedDamage;
        if(this.energy <= 0){
            this.energy = 0;
        }else{
            this.lastHit = new Date().getTime();
        }
    }

    isHurt(){
        let timePassed = new Date().getTime() - this.lastHit
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
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