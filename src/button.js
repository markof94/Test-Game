
class Button{
    constructor(x, y, w, h, label){
        this.btn = tink.button(textureButtonFrames, x, y);
        this.btn.width = w;
        this.btn.height = h;
    

        this.labelStyle = new TextStyle({
            fontFamily: myFont,
            fontSize: Math.floor(w/3),
            fill: "white",
            fontWeight: "bold"
          });

        this.label = new Text(label, this.labelStyle);
        this.label.position.set(x + w/2, y + h/2);
        this.label.anchor.set(0.5, 0.5);
        stage.addChild(this.btn);
        stage.addChild(this.label);

    }
}