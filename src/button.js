class Button {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        this.img = new Sprite(buttonImage);
        this.img.x = x;
        this.img.y = y;
        this.img.buttonMode = true;
        this.img.interactive = true;
        this.img.anchor.set(0.5);
        this.img.on('mousedown', mouseDown)
        stage.addChild(this.img);

    }

    


}
