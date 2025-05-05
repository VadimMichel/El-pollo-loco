class World{
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    coinAmount = 0;
    healthBar = new StatusBar("health", 0, 100);
    coinBar = new StatusBar("coin", 45, 0);
    bottleBar = new StatusBar("bottle", 90, 0);
    bottle = [];
    coins = [
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin()
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
            if (this.character.isCollading(object) && array == this.level.enemies){
                this.character.getHit();
                this.healthBar.setPercentage(this.character.energy);
                console.log("character is colliding!! Enery is", this.character.energy)
            }else if (this.character.isCollading(object) && array == this.coins){
                this.coinAmount += 20;
                this.coinBar.setPercentage(this.coinAmount);
                this.coins.splice(i, 1);
            }
        })
    }

    run(){
        setInterval(() => {
            this.checkCollisions(this.level.enemies); 
            this.checkCollisions(this.coins) 
            this.checkThrow();
        }, 100);
    }

    checkThrow(){
        if(this.keyboard.D){
            let bottle = new ThrowableObject(this.character.x + 70, this.character.y + 100);
            this.bottle.push(bottle);
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
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar)
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
        if(mo.collectet){
            if(mo.otherDirection){
            this.flipImage(mo);
            }
            mo.draw(this.ctx);
            mo.drawFrame(this.ctx);
            if(mo.otherDirection){
            this.flipImageBack(mo);
            }}
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
}