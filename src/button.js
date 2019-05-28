class Button{
    constructor(x, y, w, h, label){
        this.btn = t.button(buttonFrames, x, y);
        this.btn.width = w;
        this.btn.height = h;
    

        this.labelStyle = new TextStyle({
            fontFamily: "Verdana",
            fontSize: 36,
            fill: "white",
            stroke: '#ff3300',
            strokeThickness: 0,
            fontWeight: "bold"
        
 
          });

        this.label = new Text(label, this.labelStyle);
        this.label.position.set(x + w/2, y + h/2);
        this.label.anchor.set(0.5, 0.5);
        stage.addChild(this.btn);
        stage.addChild(this.label);
        
    }
}