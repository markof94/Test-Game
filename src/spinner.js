class Spinner {

    

    constructor() {
        this.spinState = SpinState.STOP_SPINNING;
        this.value = [3];
        this.imgs = [3];
        this.imgSize = 128;
        

        this.assignValues();

        /*
        for(let i = 0; i < this.imgs.length; i++){
            stage.addChild(this.imgs[i]);
        }
        */
    }

    assignValues = function(){
        for(let i = 0; i < 3; i++){
            this.value[i] = Math.floor(Math.random() * 8);
            
            this.imgs[i] = slotImages[this.value[i]];
            stage.addChild(this.imgs[i]);
           //this.imgs[i].visible = false;
        }
    }


    render = function(){
        console.log("aads");
    }


}
