class DrawableObject{
    img;
    imageCache = {};
    currentImage = 0;
    arrayCache;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx){
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken){
        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    }

    randomZerroOrOne(){
        let rndNummber = Math.random() * 10
        if(rndNummber > 5){
            return 1;
        }else{
            return 0;
        }
    }
}