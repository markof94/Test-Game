/*****************************************************

                    Main.js

*****************************************************/

let stage = new PIXI.Container();
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;
let TextureCache = PIXI.utils.TextureCache;
let t;
let pointer;
let Graphics = PIXI.Graphics;
let Text = PIXI.Text;
let TextStyle = PIXI.TextStyle;

let spinners = [5];
let spinnerWidth = 128;
let spinnerHeight = 384;

//===Value for joker
let jokerVal = 7;

let slotImages = [8];
let buttonImage;

let buttonUp, buttonDown, buttonOver;
let buttonFrames;

let SpinState = {
    START_SPINNING: 0,
    SPINNING: 1,
    STOP_SPINNING: 2
}

let canSpin = true;

let button20;
let button40;
let button100;
let button200;
let button400;

let balance = 1000;
let betValue = 100;
let displayedBalance = 1000;
let balanceLabel; //GUI

let RectangleGroups = [];

let toggler; //used for statrting and stopping timeout


let data; //JSON DATA

function init() {

    console.log("aaaa");

    //usage:
    readTextFile("../src/data.json", function(text){
        data = JSON.parse(text)[0];
        //console.log(data.images);
    });

    setTimeout(() => {
        console.log(data);
        loader
        .add([
            data.images.slot1,
            data.images.slot2,
            data.images.slot3,
            data.images.slot4,
            data.images.joker,
            data.images.slot5,
            data.images.slot6,
            data.images.slot7,
            "assets/buttonUp.png",
            "assets/buttonDown.png",
            "assets/buttonOver.png"
        ])
        .load(onLoad);

    renderer.backgroundColor = 0x1111F0;
    renderer.render(stage);

    t = new Tink(PIXI, renderer.view); //TINK LIBRARY

    pointer = t.makePointer();
        
    }, 200);

   


}

function onLoad() {
    //Assign assets to textures to be used later for sprites
    slotImages[0] = TextureCache[data.images.slot1];
    slotImages[1] = TextureCache[data.images.slot2];
    slotImages[2] = TextureCache[data.images.slot3];
    slotImages[3] = TextureCache[data.images.slot4];
    slotImages[4] = TextureCache[data.images.slot5];
    slotImages[5] = TextureCache[data.images.slot6];
    slotImages[6] = TextureCache[data.images.slot7];
    slotImages[7] = TextureCache[data.images.joker];
    buttonUp = TextureCache["assets/buttonUp.png"];
    buttonDown = TextureCache["assets/buttonDown.png"];
    buttonOver = TextureCache["assets/buttonOver.png"];
    console.log("Resources Loaded");

    buttonFrames = [
        buttonUp,
        buttonOver,
        buttonDown
    ]

    createButtons();
    createLabels();

    //Initiate spinners
    for (let i = 0; i < 5; i++) {
        spinners[i] = new Spinner(200 + spinnerWidth * i, 200);
    }

    //let rect = new Rectangle(20, 20, 128, 128, 0xFFFFFF);

    loop();
}


function loop() {
    requestAnimationFrame(loop);
    renderer.render(stage);

    //Update Tink
    t.update();

    updateLabels();

    for (let i = 0; i < 5; i++) {
        spinners[i].update();
    }

}

function createButtons(){
    button20 = new Button(200, 600, 125, 100, "20");
    button20.btn.release = () => initiateSpin(20);

    button40 = new Button(350, 600, 125, 100, "40");
    button40.btn.release = () => initiateSpin(40);

    button100 = new Button(500, 600, 125, 100, "100");
    button100.btn.release = () => initiateSpin(100);

    button200 = new Button(650, 600, 125, 100, "200");
    button200.btn.release = () => initiateSpin(200);

    button400 = new Button(800, 600, 125, 100, "400");
    button400.btn.release = () => initiateSpin(400);


    
}

function createLabels(){
    let labelStyle = new TextStyle({
        fontFamily: "Verdana",
        fontSize: 36,
        fill: "white",
        stroke: '#ff3300',
        strokeThickness: 0,
        fontWeight: "bold"
    

      });

    balanceLabel = new Text(balance + "", labelStyle);
    balanceLabel.position.set(window.innerWidth/2, 50);
    balanceLabel.anchor.set(0.5, 0.5);
   
    stage.addChild(balanceLabel);
}

function updateLabels(){

    displayedBalance = Smooth(displayedBalance, balance, 8);

    balanceLabel.text = Math.round(displayedBalance) + "";
}



function initiateSpin(amount) {
    if(amount <= balance){
        betValue = amount;
        balance -= betValue;

        if (toggler) {
            clearInterval(toggler); //stop showing boxes
        }

        hideAllRects();

        if (canSpin) {
            for (let i = 0; i < 5; i++) {
                spinners[i].setState(SpinState.START_SPINNING);
                canSpin = false;
                setTimeout(function () {


                    spinners[i].setState(SpinState.STOP_SPINNING);
                    if (i == 4) {
                        canSpin = true;
                        setTimeout(() => {
                            checkResults();
                        }, 250);

                    }

                }, 1500 + i * 500);
            }
        }
    }else{
        console.log("Not enough balance!");
    }

}

function resetSpinnerAnimations() {

    for (let i = 0; i < 3; i++) {

        for (let j = 1; j < 5; j++) {
            spinners[j].highlightedSlots[i] = false;
            spinners[j].highlight = false;
        }


    }


}

function toggleRectanglesVisibility() {
    let id = 0;
    toggler = setInterval(() => {
        hideAllRects();

        setRectGroupVisibility(id, true);

        id++;
        if (id > RectangleGroups.length - 1) {
            id = 0;
        }

    }, 1000);

}

function setRectGroupVisibility(id, visibility) {
    for (let i = 0; i < RectangleGroups[id].length; i++) {
        RectangleGroups[id][i].rect.visible = visibility;

    }
}

function hideAllRects() {
    for (let i = 0; i < RectangleGroups.length; i++) {
        for (let j = 0; j < RectangleGroups[i].length; j++) {
            RectangleGroups[i][j].rect.visible = false;
        }
    }
}


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


/*
     * v = ((v * (N - 1)) + w) / N; 
     * 
     * where v is the current value, w is the value towards which we want to move, 
     * and N is the slowdown factor. The higher N, the slower v approaches w.
     * */


    function Smooth(current, goal, factor)
    {
        return ((current * (factor - 1)) + goal) / factor;
    }