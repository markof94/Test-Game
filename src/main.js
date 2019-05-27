/*****************************************************

                    Main.js

*****************************************************/

let stage = new PIXI.Container();
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;
let TextureCache = PIXI.utils.TextureCache;

let spinners = [5];
let spinnerWidth = 128;
let spinnerHeight = 384;

let slotImages = [8];
let buttonImage;

let button;

let SpinState = {
    START_SPINNING: 0,
    SPINNING: 1,
    STOP_SPINNING: 2
}

let canSpin = true;



function init()
{

    console.log("aaaa");

    loader
    .add([
        "assets/apple.png",
        "assets/blueghost.png",
        "assets/greenghost.png",
        "assets/icecream.png",
        "assets/joker.png",
        "assets/orangeghost.png",
        "assets/redghost.png",
        "assets/scatter.png",
        "assets/button.png"
    ])
    .load(onLoad);

    renderer.backgroundColor = 0x1111F0;
    renderer.render(stage);
    
   
    

    
}

function onLoad(){
    //Assign assets to textures to be used later for sprites
    slotImages[0] = TextureCache["assets/apple.png"];
    slotImages[1] = TextureCache["assets/blueghost.png"];
    slotImages[2] = TextureCache["assets/greenghost.png"];
    slotImages[3] = TextureCache["assets/icecream.png"];
    slotImages[4] = TextureCache["assets/orangeghost.png"];
    slotImages[5] = TextureCache["assets/redghost.png"];
    slotImages[6] = TextureCache["assets/joker.png"];
    slotImages[7] = TextureCache["assets/scatter.png"];
    buttonImage = TextureCache["assets/button.png"];
    console.log("Resources Loaded");

    //Initiate spinners
    for(let i = 0; i < 5; i++){
        spinners[i] = new Spinner(200 + spinnerWidth * i, 200);
    }

    button = new Button(100, 100);
    

    loop();
}

function loop()
{
    requestAnimationFrame(loop);
    renderer.render(stage);

    for(let i = 0; i < 5; i++){
        spinners[i].update();
    }
}

function mouseDown(){
    initiateSpin();
}

function initiateSpin(){
    if(canSpin){
        for(let i = 0; i < 5; i++){
            //spinners[i].spinSate = SpinState.START_SPINNING;
            spinners[i].setState(SpinState.START_SPINNING);
            canSpin = false;
            setTimeout(function(){
                
                if(i == 4){
                    canSpin = true;
                }
                spinners[i].setState(SpinState.STOP_SPINNING);
               
            }, 1500 + i * 500);
        }
    }
   
}
