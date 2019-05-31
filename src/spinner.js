//===Each spinner holds arrays of 3 values and 3 images which determine output

class Spinner {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.spinState = SpinState.STOP_SPINNING;
        this.value = [3]; //===ID determining which image to draw and result calculation
        this.imgs = [3];
        this.placeholderCount = 4; //===Random images used for drawing the slots while spinning
        this.placeholderImgs = [this.placeholderCount];
        this.imgSize = spinnerWidth;
        this.speed = 0;
        this.maxSpeed = spinnerWidth/2;

        this.assignValues();

        this.highlightedSlots = [false, false, false]; //===Used for assigning which slots will be animated

    }


    assignValues() {

        for (let i = 0; i < this.placeholderCount; i++) {
            this.value[i] = Math.floor(Math.random() * spinnerTotalImages);

            if (i < 3) {
                stage.removeChild(this.imgs[i]);
                this.imgs[i] = new Sprite(textureSlotImages[this.value[i]]);

                this.imgs[i].position.set(this.x + this.imgSize / 2, this.y + this.imgSize * i + this.imgSize / 2);
                this.imgs[i].width = this.imgSize;
                this.imgs[i].height = this.imgSize;
                this.imgs[i].anchor.set(0.5);

                stage.addChild(this.imgs[i]);
            }

            stage.removeChild(this.placeholderImgs[i]);

            this.placeholderImgs[i] = new Sprite(textureSlotImages[this.value[i]]);
            this.placeholderImgs[i].position.set(this.x + this.imgSize / 2, this.y + this.imgSize * (i) + this.imgSize / 2);
            this.placeholderImgs[i].width = this.imgSize;
            this.placeholderImgs[i].height = this.imgSize;
            this.placeholderImgs[i].anchor.set(0.5);
            stage.addChild(this.placeholderImgs[i]);
 
        }

    }

    update() {
        for (let i = 0; i < this.placeholderCount; i++) {
            this.placeholderImgs[i].y += this.speed;
            if (this.placeholderImgs[i].y >= this.y + spinnerHeight + spinnerWidth / 2) {
                this.placeholderImgs[i].y = this.y - spinnerWidth / 2;
                let val = Math.floor(Math.random() * spinnerTotalImages);
                this.placeholderImgs[i].texture = textureSlotImages[val];
            }
        }

        if (this.spinState == SpinState.START_SPINNING && this.speed <= this.maxSpeed) {
            this.speed = Smooth(this.speed, this.maxSpeed, 50);
        } else {
            if (this.spinState == SpinState.START_SPINNING) {
                this.setState(SpinState.SPINNING);
            }

        }


        if (this.spinState == SpinState.STOP_SPINNING) {

            //Move it to starting position
            for (let i = 0; i < 3; i++) {

                if (this.imgs[i].y > this.y + spinnerWidth * i + this.imgSize / 2) {
                    this.imgs[i].y = Smooth(this.imgs[i].y, this.y + spinnerWidth * i + this.imgSize / 2, 8);
                    
                }
            }
        }

        //===Clamp value
        if (this.speed <= 0) {
            this.speed = 0;
        }

        //===Animate highlighted slots
        for (let i = 0; i < this.highlightedSlots.length; i++) {
            if (this.highlightedSlots[i]) {
                this.imgs[i].width = Sinusoid(this.imgs[i].width, 1000, 1);
                this.imgs[i].height = this.imgs[i].width;
            }
        }

    }

    //===Change state to passed state and act accordingly
    setState(state) {
        this.spinState = state;

        if (this.spinState == SpinState.START_SPINNING) {
            for (let i = 0; i < 3; i++) {
                this.imgs[i].visible = false;
            }
            for (let i = 0; i < this.placeholderCount; i++) {
                this.placeholderImgs[i].visible = true;
            }

            this.clearHighlights();
        }

        if (this.spinState == SpinState.STOP_SPINNING) {
            this.assignValues();

            sndSpinStop.play();

            this.speed = 0;
            for (let i = 0; i < 3; i++) {
                this.imgs[i].y = this.y + spinnerWidth * i + this.imgSize / 2 + spinnerBounceOffset;
                this.imgs[i].visible = true;
            }
            for (let i = 0; i < this.placeholderCount; i++) {
                this.placeholderImgs[i].visible = false;
            }
        }
    }



    clearHighlights() {
        this.highlightedSlots = [false, false, false];

        for (let i = 0; i < this.imgs.length; i++) {
            this.imgs[i].width = spinnerWidth;
            this.imgs[i].height = spinnerWidth;
        }
    }


}
