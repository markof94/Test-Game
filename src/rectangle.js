class Rectangle{
    constructor(x, y, w, h, color){
        this.rect = new Graphics();
        this.rect.lineStyle(4, color, 1);
        this.rect.beginFill(0x000000, 0);
        this.rect.drawRect(0, 0, w, h);
        this.rect.endFill();
        this.rect.x = x;
        this.rect.y = y;
        stage.addChild(this.rect);
    }

    
}