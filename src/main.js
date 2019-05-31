/*****************************************************

                    Main.js

*****************************************************/

//===Alias shortcuts
let stage = new PIXI.Container();
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;
let TextureCache = PIXI.utils.TextureCache;
let tink; //used for mouse/touch events
let pointer;
let Graphics = PIXI.Graphics;
let Text = PIXI.Text;
let TextStyle = PIXI.TextStyle;
let ticker;


//===Spinner info
let spinnerCount = 5;
let spinners = [spinnerCount];
let spinnerWidth = 100;
let spinnerHeight = spinnerWidth * 3;
let spinnerBounceOffset = 40; //how far the spinner will stop before bouncing back to original position
let spinnerTotalImages = 8;

//===Value for joker used in checks
let jokerVal = 7; //taken from JSON in init()

//===Textures
let textureSlotImages = [8],
    texturePanel,
    textureButtonUp,
    textureButtonDown,
    textureButtonOver,
    textureButtonFrames = [],
    textureHighlighter,
    textureBetPointer;


//===Sprites
let sprLowerPanel,
    sprUpperPanel,
    sprBetPointer;

let SpinState = {
    START_SPINNING: 0,
    SPINNING: 1,
    STOP_SPINNING: 2
}



//===Buttons
let button20,
    button40,
    button100,
    button200,
    button400;

let balance = 1000; //load from JSON
let betValue = 100;
let displayedBalance = 1000;
let lastWin = 0;
let lastWinCount = 0;
let displayedLastWin = 0;

//===Labels
let lblBalanceNumber;
let lblBalanceText;
let lblLastWinNumber;
let lblLastWinText;
let lblMessage;
let lblLoading;

let strMessage; //what message to display

let RectangleGroups = []; //used for iterating through which ones to display
let rectangleToggler; //used for clearing rectangle display interval




//===Time stuff
const perfectFrameTime = 1000 / 60;
let lastTime = 0;
let deltaTime = 0;
let animationTimer = 0;
let date;

//===Sounds
let sndBet,
    sndLose,
    sndSpinStop,
    sndWin,
    sndMusic;



//===Other
let myFont = "Russo One";
let data; //JSON DATA
let canSpin = true;
let soundsLoaded = false;
let everythingLoaded = false;
let checkResultsTimeout; //used for clearing timeout

function init() {

    lblLoading = new Text("Loading...", balanceTextStyle);
    lblLoading.position.set(window.innerWidth / 2, window.innerHeight / 2);
    lblLoading.anchor.set(0.5, 0.5);

    stage.addChild(lblLoading);

    //===Basic responsiveness check, fit the screen
    //===Most draw sizes will later be based off spinnerWidth
    while (spinnerWidth > window.innerWidth * 0.1) {
        spinnerWidth *= 0.9;
    }
    while(spinnerWidth * 9 > window.innerHeight){
        spinnerWidth *= 0.9;
    }
    spinnerHeight = spinnerWidth * 3;


    //===Used for calculating deltaTime
    date = new Date();
    lastTime = date.getTime();


    //===Read JSON data
    readTextFile("../src/data.json", function (text) {
        data = JSON.parse(text)[0];
    });

    //===Allow delay for JSON to be loaded and then load assets
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


        //for catching pointer/mouse/touch actions
        tink = new Tink(PIXI, renderer.view);
        pointer = tink.makePointer();


    }, 500);


}

//===After assets have been loaded
function onLoad() {


    //Assign assets to variables to be used later
    textureSlotImages[0] = TextureCache[data.images.slot1];
    textureSlotImages[1] = TextureCache[data.images.slot2];
    textureSlotImages[2] = TextureCache[data.images.slot3];
    textureSlotImages[3] = TextureCache[data.images.slot4];
    textureSlotImages[4] = TextureCache[data.images.slot5];
    textureSlotImages[5] = TextureCache[data.images.slot6];
    textureSlotImages[6] = TextureCache[data.images.slot7];
    textureSlotImages[7] = TextureCache[data.images.joker];
    textureButtonUp = TextureCache[data.images.betButtonUp];
    textureButtonDown = TextureCache[data.images.betButtonDown];
    textureButtonOver = TextureCache[data.images.betButtonOver];
    texturePanel = TextureCache[data.images.panel];
    textureBetPointer = TextureCache[data.images.pointer];
    textureHighlighter = TextureCache[data.images.highlighter];

    sounds.load([
        data.sounds.bet,
        data.sounds.lose,
        data.sounds.music,
        data.sounds.spinstop,
        data.sounds.win
    ]);

    sounds.whenLoaded = () => {

        finishLoading();
    }


}

function finishLoading(){

    soundsLoaded = true;

    sndBet = sounds[data.sounds.bet];
    sndLose = sounds[data.sounds.lose];
    sndSpinStop = sounds[data.sounds.spinstop];
    sndWin = sounds[data.sounds.win];
    sndMusic = sounds[data.sounds.music];

    sndMusic.loop = true;
    //music.play();

    sndMusic.volume = 0.4;
    
    //===Button frames to be used for bet button creation
    textureButtonFrames = [
        textureButtonUp,
        textureButtonOver,
        textureButtonDown
    ]

    //===Calculate positions
    let spinnersX = window.innerWidth / 2 - spinnerWidth * 2.9;
    let spinnersY = 200;
    let spinnerOffset = spinnerWidth * 1.2;

    //===Draw panels for GUI
    sprLowerPanel = new Sprite(texturePanel, 0, 0);
    sprLowerPanel.position.set(spinnersX, spinnersY + spinnerHeight);
    sprLowerPanel.width = spinnerWidth * spinnerCount * 1.175;
    sprLowerPanel.height = spinnerHeight / 2;

    sprUpperPanel = new Sprite(texturePanel, 0, 0);
    sprUpperPanel.position.set(spinnersX, spinnersY - spinnerWidth * 1.5);
    sprUpperPanel.width = spinnerWidth * spinnerCount * 1.175;
    sprUpperPanel.height = spinnerHeight / 2;

    stage.addChild(sprLowerPanel);
    stage.addChild(sprUpperPanel);

    createButtons();
    createLabels();


    //Initiate spinners
    for (let i = 0; i < spinnerCount; i++) {
        spinners[i] = new Spinner(spinnersX, spinnersY);
        spinnersX += spinnerOffset;
    }

    //===Make a pointer to show what bet amount is active
    sprBetPointer = new Sprite(textureBetPointer, 0, 0);
    sprBetPointer.position.set(
        button100.btn.x + button100.btn.width / 2,
        button100.btn.y + button100.btn.height * 1.25
        );
    sprBetPointer.width = button100.btn.width / 3;
    sprBetPointer.height = button100.btn.width / 3;
    sprBetPointer.anchor.set(0.5, 0.5);

    stage.addChild(sprBetPointer);

    
    console.log("Assets Loaded");
    everythingLoaded = true;

    stage.removeChild(lblLoading);

    //===Initiate the main loop thread
    loop();
}


//===Update stuff
function loop() {

    if(!everythingLoaded){
        finishLoading();

        return;
    }

    requestAnimationFrame(loop);

    updateGUIOrder();

    renderer.render(stage);

    movePointer(betValue);

    //Update Tink
    tink.update();

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

//===Make 5 buttons for each bet option: 20, 40, 100, 200, 400
function createButtons() {

    let buttonsW = spinnerWidth;
    let buttonsH = spinnerWidth * 0.8;
    let buttonsY = sprLowerPanel.y + sprLowerPanel.height * 1.5;
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

    lblBalanceText = new Text("BALANCE", balanceTextStyle);
    lblBalanceText.position.set(window.innerWidth / 2, sprUpperPanel.y + sprUpperPanel.height * 0.1);
    lblBalanceText.anchor.set(0.5, 0.5);

    stage.addChild(lblBalanceText);

    lblBalanceNumber = new Text(balance + "", balanceDisplayStyle);
    lblBalanceNumber.position.set(window.innerWidth / 2, sprUpperPanel.y + sprUpperPanel.height / 2);
    lblBalanceNumber.anchor.set(0.5, 0.5);

    stage.addChild(lblBalanceNumber);

    lblLastWinText = new Text("LAST WIN", balanceTextStyle);
    lblLastWinText.position.set(window.innerWidth / 2, sprLowerPanel.y + sprLowerPanel.height * 0.1);
    lblLastWinText.anchor.set(0.5, 0.5);

    stage.addChild(lblLastWinText);

    lblLastWinNumber = new Text(lastWin + "", lastWinDisplayStyle);
    lblLastWinNumber.position.set(window.innerWidth / 2, sprLowerPanel.y + sprLowerPanel.height / 2);
    lblLastWinNumber.anchor.set(0.5, 0.5);

    stage.addChild(lblLastWinNumber);

    lblMessage = new Text(strMessage, messageNeutralStyle);
    lblMessage.position.set(window.innerWidth / 2, sprUpperPanel.y + sprUpperPanel.height * 0.87);
    lblMessage.anchor.set(0.5, 0.5);


    stage.addChild(lblMessage);


    placeBetText = new Text("Place your bet:", labelStyle);
    placeBetText.position.set(button100.btn.x + button100.btn.width / 2, button100.btn.y - button100.btn.height / 3);
    placeBetText.anchor.set(0.5, 0.5);

    stage.addChild(placeBetText);
}

//===It's running in the main loop because of the Smooth() function
function updateLabels() {

    
    displayedBalance = Smooth(displayedBalance, balance, 8);
    displayedLastWin = Smooth(displayedLastWin, lastWin, 8);

    lblBalanceNumber.text = Math.round(displayedBalance) + "";
    lblLastWinNumber.text = Math.round(displayedLastWin) + "";

    lblMessage.text = strMessage;
}


//===Take the bet amount and start spinning if the conditions are met
function initiateSpin(amount) {

    if (amount <= balance && canSpin) {
        betValue = amount;
        balance -= betValue;

        //===Avoid checking results if the next spin get initiated too quickly
        if (checkResultsTimeout) {
            clearTimeout(checkResultsTimeout);
        }

        sndBet.play();

        strMessage = "Spinning...";
        lblMessage.style = messageNeutralStyle;
    
        if (rectangleToggler) {
            clearInterval(rectangleToggler); //stop showing boxes
        }

        hideAllRects();

        //===Manage spinner states
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
    } else {
        if (amount > balance) {
            strMessage = "Not enough balance!";
            lblMessage.style = messageBadStyle;
        }
    }
}
