class Spinner {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.spinState = SpinState.STOP_SPINNING;
        this.value = [3];
        this.imgs = [3];
        this.placeholderCount = 4;
        this.placeholderImgs = [this.placeholderCount];
        this.imgSize = spinnerWidth;
        this.speed = 0;
        this.acceleration = 1;
        this.maxSpeed = 50;
        

        this.assignValues();

        this.highlightedSlots = [false, false, false];
        this.highlight = false;

        /*
        for(let i = 0; i < this.imgs.length; i++){
            stage.addChild(this.imgs[i]);
        }
        */
    }

    assignValues = function(){

       
        for(let i = 0; i < this.placeholderCount; i++){
            this.value[i] = Math.floor(Math.random() * 8);
            
            if(i < 3){
                stage.removeChild(this.imgs[i]);
                this.imgs[i] = new Sprite(slotImages[this.value[i]]);
                    
                this.imgs[i].position.set(this.x + this.imgSize/2, this.y + this.imgSize * i + this.imgSize/2);
                this.imgs[i].width = this.imgSize;
                this.imgs[i].height = this.imgSize;
                this.imgs[i].anchor.set(0.5);
              
                stage.addChild(this.imgs[i]);
            }
        
            stage.removeChild(this.placeholderImgs[i]);
            
            this.placeholderImgs[i] = new Sprite(slotImages[this.value[i]]);
            this.placeholderImgs[i].position.set(this.x + this.imgSize/2, this.y + this.imgSize * (i) + this.imgSize/2);
            this.placeholderImgs[i].width = this.imgSize;
            this.placeholderImgs[i].height = this.imgSize;
            this.placeholderImgs[i].anchor.set(0.5);
            stage.addChild(this.placeholderImgs[i]);
            
            

           //this.imgs[i].visible = false;
        }

       
    }


    update = function(){
       for(let i = 0; i < this.placeholderCount; i++){
           this.placeholderImgs[i].y += this.speed;
           if(this.placeholderImgs[i].y >= this.y + spinnerHeight + spinnerWidth/2){
               this.placeholderImgs[i].y = this.y - spinnerWidth/2;
           }
       }

       if(this.spinState == SpinState.START_SPINNING && this.speed <= this.maxSpeed){
            this.speed = Smooth(this.speed, this.maxSpeed, 50);
       }else{
           if(this.spinState == SpinState.START_SPINNING){
                this.setState(SpinState.SPINNING);
           }
           
       }
       

       if(this.spinState == SpinState.STOP_SPINNING){
           
            //Move it to starting position
            for(let i = 0; i < 3; i++){
                
                if(this.imgs[i].y > this.y + spinnerWidth * i + this.imgSize/2){
                    this.imgs[i].y = Smooth(this.imgs[i].y, this.y + spinnerWidth * i + this.imgSize/2, 8);
                    
                }
            }
       }


       //clamp value
       if(this.speed <= 0){
           this.speed = 0;
       }

       if(this.highlight){
        for(let i = 0; i < this.highlightedSlots.length; i++){
            if(this.highlightedSlots[i]){

                //animation

                //this.imgs[i].y -= 10;
            }
        }
        
       }
       

    }

    setState = function(state){
        this.spinState = state;

        if(this.spinState == SpinState.START_SPINNING){
            for(let i = 0; i < 3; i++){
                this.imgs[i].visible = false;
            }
            for(let i = 0; i < this.placeholderCount; i++){
                this.placeholderImgs[i].visible = true;
            }

            this.reset();
        }

        if(this.spinState == SpinState.STOP_SPINNING){
            this.assignValues();
            this.speed = 0;
            for(let i = 0; i < 3; i++){
                this.imgs[i].y = this.y + spinnerWidth * i + this.imgSize/2 + spinnerBounceOffset;
                this.imgs[i].visible = true;
            }
            for(let i = 0; i < this.placeholderCount; i++){
                this.placeholderImgs[i].visible = false;
            }
        }
    }


    reset = function(){
        this.highlight = false;
        for(let i = 0; i < this.highlightedSlots.length; i++){
            this.highlightedSlots[i] = false;
        }
    }
    

}
