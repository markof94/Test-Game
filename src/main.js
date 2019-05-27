/*****************************************************

                    Main.js

*****************************************************/

let stage = new PIXI.Container();
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

let spinners = [5];

let slotImages = [8];

let SpinState = {
    START_SPINNING: 0,
    SPINNING: 1,
    STOP_SPINNING: 2
}



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
        "assets/scatter.png"
    ])
    .load(onLoad);

    renderer.backgroundColor = 0x1111F0;
    renderer.render(stage);
    
   
    

    
}

function onLoad(){
    slotImages[0] = new Sprite(resources["assets/apple.png"].texture);
    slotImages[1] = new Sprite(resources["assets/blueghost.png"].texture);
    slotImages[2] = new Sprite(resources["assets/greenghost.png"].texture);
    slotImages[3] = new Sprite(resources["assets/icecream.png"].texture);
    slotImages[4] = new Sprite(resources["assets/orangeghost.png"].texture);
    slotImages[5] = new Sprite(resources["assets/redghost.png"].texture);
    slotImages[6] = new Sprite(resources["assets/joker.png"].texture);
    slotImages[7] = new Sprite(resources["assets/scatter.png"].texture);

    console.log("Resources Loaded");

    for(let i = 0; i < 5; i++){
        spinners[i] = new Spinner();
    }

    loop();
}

function loop()
{
    requestAnimationFrame(loop);
    renderer.render(stage);

    
}
