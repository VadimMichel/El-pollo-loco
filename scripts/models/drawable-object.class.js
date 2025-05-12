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
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        
    }

    //drawFrame(ctx){
    //    if(this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof CollectableObject){
     //   ctx.beginPath();
    //    ctx.lineWidth = "6";
    //    ctx.strokeStyle = "red";
    //    ctx.rect(this.x, this.y, this.width, this.height);
    //    ctx.stroke();
    //    }
    //}

    //drawFrameOfset(ctx) {
      //ctx.save();
       // ctx.strokeStyle = 'blue';
        //ctx.lineWidth = 2;
        //if(this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof CollectableObject){
        //    ctx.strokeRect(
        //        this.x + this.offset.left,
        //        this.y + this.offset.top,
        //        this.width - this.offset.left - this.offset.right,
        //        this.height - this.offset.top - this.offset.bottom
        //    );
        //}
        //ctx.restore();
    //}

    randomZerroOrOne(){
        let rndNummber = Math.random() * 10
        if(rndNummber > 5){
            return 1;
        }else{
            return 0;
        }
    }
}