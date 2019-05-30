class Rectangle{
    constructor(x, y, w, h, color){
        this.rect = new Sprite(highlighterTexture, 0, 0);
        this.rect.x = x;
        this.rect.y = y;
        this.rect.width = w;
        this.rect.height = h;
        stage.addChild(this.rect);
       
       
       /*
        this.rect = new Graphics();
        this.rect.lineStyle(3, color, 1);
        this.rect.beginFill(0x000000, 0);
        this.rect.drawRoundedRect(0, 0, w, h, 8);
        this.rect.endFill();
        this.rect.x = x;
        this.rect.y = y;
        stage.addChild(this.rect);
        */
    }

    
}