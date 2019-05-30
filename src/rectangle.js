//===Used for highlighting winning combinations
class Rectangle{
    constructor(x, y, w, h, color){
        this.rect = new Sprite(textureHighlighter, 0, 0);
        this.rect.x = x;
        this.rect.y = y;
        this.rect.width = w;
        this.rect.height = h;
        stage.addChild(this.rect);
       
       
    }

}