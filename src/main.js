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
let ticker;

let spinnerCount = 5;
let spinners = [spinnerCount];
let spinnerWidth = 100;
let spinnerHeight = spinnerWidth * 3;
let spinnerBounceOffset = 40; //how far will it snap when stopping the spin before bouncing back to original position


//===Value for joker
let jokerVal = 7; //taken from JSON in init()

//===Textures
let slotImages = [8];
let buttonImage;
let panelTexture;
let lowerPanel;
let upperPanel;
let buttonUp, buttonDown, buttonOver;
let buttonFrames;
let highlighterTexture;

let betPointerTexture;


let betPointerImg;

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

let balance = 1000; //taken from JSON in init()
let betValue = 100;
let displayedBalance = 1000;
let lastWin = 0;
let lastWinCount = 0;
let displayedLastWin = 0;

//===Labels
let balanceDisplayLabel;
let balanceLabel;
let lastWinDisplayLabel;
let lastWinLabel;
let messageLabel;

let messageString;

let RectangleGroups = [];

let toggler; //used for statrting and stopping timeout

let myFont = "Russo One";

let data; //JSON DATA

let animationTimer = 0;

//===Time stuff
const perfectFrameTime = 1000 / 60;
let lastTime = 0;
let deltaTime = 0;

let date;

let soundsLoaded = false;
let betSound, loseSound, spinStopSound, winSound, music;

let checkResultsTimeout;

function init() {

    

    //===Basic responsiveness
    if (spinnerWidth > window.innerWidth * 0.1) {
        spinnerWidth *= 0.5;
    }
    spinnerHeight = spinnerWidth * 3;

    date = new Date();

    lastTime = date.getTime();
    
    

    //usage:
    readTextFile("../src/data.json", function (text) {
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
                data.images.betButtonUp,
                data.images.betButtonDown,
                data.images.betButtonOver,
                data.images.panel,
                data.images.pointer,
                data.images.highlighter,
                data.sounds.bet,
                data.sounds.lose,
                data.sounds.music,
                data.sounds.spinstop,
                data.sounds.win
            ])
            .load(onLoad);



        balance = parseInt(data.settings.startingBalance);
        jokerVal = parseInt(data.settings.jokerValue);

        renderer.backgroundColor = 0x272727;
        renderer.render(stage);


        //TINK LIBRARY, needed for catching pointer/mouse/touch actions
        t = new Tink(PIXI, renderer.view); 

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
    buttonUp = TextureCache[data.images.betButtonUp];
    buttonDown = TextureCache[data.images.betButtonDown];
    buttonOver = TextureCache[data.images.betButtonOver];
    panelTexture = TextureCache[data.images.panel];
    betPointerTexture = TextureCache[data.images.pointer];
    highlighterTexture = TextureCache[data.images.highlighter];

    sounds.load([
        data.sounds.bet,
        data.sounds.lose,
        data.sounds.music,
        data.sounds.spinstop,
        data.sounds.win
    ]);

    sounds.whenLoaded = () => {
        
        soundsLoaded = true;

        betSound = sounds[data.sounds.bet];
        loseSound = sounds[data.sounds.lose];
        spinStopSound = sounds[data.sounds.spinstop];
        winSound = sounds[data.sounds.win];
        music = sounds[data.sounds.music];

        music.play();
        music.loop = true;
        music.volume = 0.4;
    }

    console.log("Assets Loaded");

    buttonFrames = [
        buttonUp,
        buttonOver,
        buttonDown
    ]



    //Initiate spinners
    let spinnersX = window.innerWidth / 2 - spinnerWidth * 2.9;
    let spinnersY = 200;
    let spinnerOffset = spinnerWidth * 1.2;

    lowerPanel = new Sprite(panelTexture, 0, 0);
    lowerPanel.position.set(spinnersX, spinnersY + spinnerHeight);
    lowerPanel.width = spinnerWidth * spinnerCount * 1.175;
    lowerPanel.height = spinnerHeight / 2;

    upperPanel = new Sprite(panelTexture, 0, 0);
    upperPanel.position.set(spinnersX, spinnersY - spinnerWidth * 1.5);
    upperPanel.width = spinnerWidth * spinnerCount * 1.175;
    upperPanel.height = spinnerHeight / 2;

    stage.addChild(lowerPanel);
    stage.addChild(upperPanel);

    createButtons();
    createLabels();

    for (let i = 0; i < spinnerCount; i++) {
        spinners[i] = new Spinner(spinnersX, spinnersY);
        spinnersX += spinnerOffset;
    }

    betPointerImg = new Sprite(betPointerTexture, 0, 0);
    betPointerImg.position.set(
        button100.btn.x + button100.btn.width / 2,
        button100.btn.y + button100.btn.height * 1.25);
    betPointerImg.width = button100.btn.width / 3;
    betPointerImg.height = button100.btn.width / 3;
    betPointerImg.anchor.set(0.5, 0.5);

    stage.addChild(betPointerImg);


    //let rect = new Rectangle(20, 20, 128, 128, 0xFFFFFF);

    loop();
}


function loop() {
    requestAnimationFrame(loop);

    updateGUIOrder();

    renderer.render(stage);

    movePointer(betValue);

    //Update Tink
    t.update();

    updateLabels();

    for (let i = 0; i < spinnerCount; i++) {
        spinners[i].update();
    }

    
    //===Calculate delta time
    deltaTime = (Date.now() - lastTime) / perfectFrameTime / 100;
    lastTime = Date.now();
    
    //console.log(deltaTime);

    animationTimer += deltaTime;
}

function createButtons() {

    let buttonsW = spinnerWidth;
    let buttonsH = spinnerWidth * 0.8;
    let buttonsY = window.innerHeight * 0.8;
    let buttonsX = window.innerWidth / 2 - buttonsW * 2.55;
    let buttonOffset = buttonsW * 1.05;

    button20 = new Button(buttonsX, buttonsY, buttonsW, buttonsH, "20");
    button20.btn.release = () => initiateSpin(20);

    buttonsX += buttonOffset;

    button40 = new Button(buttonsX, buttonsY, buttonsW, buttonsH, "40");
    button40.btn.release = () => initiateSpin(40);

    buttonsX += buttonOffset;

    button100 = new Button(buttonsX, buttonsY, buttonsW, buttonsH, "100");
    button100.btn.release = () => initiateSpin(100);

    buttonsX += buttonOffset;

    button200 = new Button(buttonsX, buttonsY, buttonsW, buttonsH, "200");
    button200.btn.release = () => initiateSpin(200);

    buttonsX += buttonOffset;

    button400 = new Button(buttonsX, buttonsY, buttonsW, buttonsH, "400");
    button400.btn.release = () => initiateSpin(400);



}

function createLabels() {
   //===Styles are defined in styles.js

    balanceLabel = new Text("BALANCE", balanceTextStyle);
    balanceLabel.position.set(window.innerWidth / 2, upperPanel.y + upperPanel.height * 0.1);
    balanceLabel.anchor.set(0.5, 0.5);

    stage.addChild(balanceLabel);

    balanceDisplayLabel = new Text(balance + "", balanceDisplayStyle);
    balanceDisplayLabel.position.set(window.innerWidth / 2, upperPanel.y + upperPanel.height / 2);
    balanceDisplayLabel.anchor.set(0.5, 0.5);

    stage.addChild(balanceDisplayLabel);

    lastWinLabel = new Text("LAST WIN", balanceTextStyle);
    lastWinLabel.position.set(window.innerWidth / 2, lowerPanel.y + lowerPanel.height * 0.1);
    lastWinLabel.anchor.set(0.5, 0.5);

    stage.addChild(lastWinLabel);

    lastWinDisplayLabel = new Text(lastWin + "", lastWinDisplayStyle);
    lastWinDisplayLabel.position.set(window.innerWidth / 2, lowerPanel.y + lowerPanel.height / 2);
    lastWinDisplayLabel.anchor.set(0.5, 0.5);

    stage.addChild(lastWinDisplayLabel);

    messageLabel = new Text(messageString, messageStyle);
    messageLabel.position.set(window.innerWidth / 2, upperPanel.y + upperPanel.height * 0.87);
    messageLabel.anchor.set(0.5, 0.5);


    stage.addChild(messageLabel);


    placeBetText = new Text("Place your bet:", labelStyle);
    placeBetText.position.set(button100.btn.x + button100.btn.width / 2, button100.btn.y - button100.btn.height / 3);
    placeBetText.anchor.set(0.5, 0.5);

    stage.addChild(placeBetText);
}

function updateLabels() {

    displayedBalance = Smooth(displayedBalance, balance, 8);
    displayedLastWin = Smooth(displayedLastWin, lastWin, 8);

    balanceDisplayLabel.text = Math.round(displayedBalance) + "";
    lastWinDisplayLabel.text = Math.round(displayedLastWin) + "";

    messageLabel.text = messageString;
}



function initiateSpin(amount) {


    if (amount <= balance && canSpin) {
        betValue = amount;
        balance -= betValue;

        if(checkResultsTimeout){
            clearTimeout(checkResultsTimeout);
        }
        

        betSound.play();

      
        messageString = "Spinning...";

        movePointer(amount);

        hideAllRects();
        animationTimer = 0;

        if (toggler) {
            clearInterval(toggler); //stop showing boxes
        }

        hideAllRects();

        if (canSpin) {
            for (let i = 0; i < spinnerCount; i++) {
                spinners[i].setState(SpinState.START_SPINNING);
                canSpin = false;
                setTimeout(function () {


                    spinners[i].setState(SpinState.STOP_SPINNING);
                    if (i == spinnerCount - 1) {
                        
                        checkResultsTimeout = setTimeout(() => {
                            checkResults();
                            
                        }, 250);

                    }

                }, 1500 + i * 500);
            }
        }
    } else {
        if (amount > balance) {
            messageString = "Not enough balance!";
        }
    }

}
