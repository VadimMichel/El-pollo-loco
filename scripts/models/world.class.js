class World{
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    coinAmount = 0;
    bottleAmount = 0;
    bossHealthAmount = 100;
    healthBar = new StatusBar("health", 0, 20, 100);
    coinBar = new StatusBar("coin", 45, 20, 0);
    bottleBar = new StatusBar("bottle", 90, 20, 0);
    bossHealthBar = new StatusBar("boss", 6, 400, 100);
    bottleThrow = [];
    bottle = [
        new CollectableObject("bottle", 330),
        new CollectableObject("bottle", 330),
        new CollectableObject("bottle", 330),
        new CollectableObject("bottle", 330),
        new CollectableObject("bottle", 330)
    ];
    coins = [
        new CollectableObject("coin", 100),
        new CollectableObject("coin", 100),
        new CollectableObject("coin", 100),
        new CollectableObject("coin", 100),
        new CollectableObject("coin", 100)
    ]

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld(){
        this.character.world = this;
    }

    checkCollisions(array){
        array.forEach((object, i) => {
            if (this.character.isCollading(object) && array == this.level.enemies && !this.character.isCollidingFromTop(object) && !object.isDead()){
                if(!this.character.isHurt() && !this.character.isDead()){
                    this.character.playAudio(this.character.characterHurtAudioUrl, 0.2, false)
                }
                this.character.getHit();
                this.healthBar.setPercentage(this.character.energy);
            }else if(this.character.isCollidingFromTop(object) && array == this.level.enemies && !object.isDead()){
                this.level.enemies[i].playAudio(this.level.enemies[i].chichenHurtAudioUrl, 0.1, false)
                object.getHit();
                this.character.jump();
            }else if (this.character.isCollading(object) && array == this.coins){
                this.coins[i].playAudio(this.coins[i].coinAudioUrl, 0.2, false)
                this.coinAmount += 20;
                this.coinBar.setPercentage(this.coinAmount);
                this.coins.splice(i, 1);
            }else if (this.character.isCollading(object) && array == this.bottle){
                this.bottle[i].playAudio(this.bottle[i].bottleCollectAudioUrl, 0.2, false)
                this.bottleAmount += 20;
                this.bottleBar.setPercentage(this.bottleAmount);
                this.bottle.splice(i, 1);
            }
            this.bottleThrow.forEach((throwObj, j) => {
                if (throwObj.isCollading(object)  && array == this.level.enemies) {
                    object.getHit()
                    if(!this.bottleThrow[j].collided){
                        this.bottleThrow[j].playAudio(this.bottleThrow[j].bottleBreaksAudioUrl, 0.1)
                    }
                    this.bottleThrow[j].collided = true;
                    this.deleteImage(j);
                    if(object == this.level.enemies[3]){
                        this.bossHealthBar.setPercentage(this.level.enemies[3].energy)
                    }
                }else if(this.bottleThrow[j].y > 300){
                    if(!this.bottleThrow[j].collided){
                        this.bottleThrow[j].playAudio(this.bottleThrow[j].bottleBreaksAudioUrl, 0.1)
                    }
                    this.bottleThrow[j].collided = true;
                    this.deleteImage(j); 
                }
            });
        })
    }

    run(){
        setInterval(() => {
            this.checkCollisions(this.level.enemies); 
            this.checkCollisions(this.coins);
            this.checkCollisions(this.bottle);
            this.checkThrow();
        }, 10);
    }

    deleteImage(i){
        if(this.bottleThrow[i].j == 6){
            this.bottleThrow.splice(i, 1) 
       }
    }

    checkThrow(){
        if(this.keyboard.D && this.bottleAmount > 0 && this.bottleThrow.length < 1){
            let bottleThrow = new ThrowableObject(this.character.x + 70, this.character.y + 100);
            this.bottleThrow.push(bottleThrow);
            this.bottleAmount -= 20;
            this.bottleBar.setPercentage(this.bottleAmount)
            this.bottleThrow.lastHit = new Date().getTime()
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.bottle);
        this.addObjectsToMap(this.bottleThrow);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.bossHealthBar);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function ()   {
            self.draw();
        });
    } 

    addObjectsToMap(objectArray){
        objectArray.forEach(object => {
            this.addToMap(object)
        })
    }

    addToMap(mo){
        if(mo.otherDirection){
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if(mo.otherDirection){
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore(); 
    }

    bottleBreak(){
        
    }
}