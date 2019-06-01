/*
    Some helper functions

    I moved them to this file to make main.js less cluttered

*/


function resetSpinnerAnimations() {

    for (let i = 0; i < 3; i++) {
        for (let j = 1; j < spinnerCount; j++) {
            spinners[j].highlightedSlots[i] = false;
            spinners[j].highlight = false;
        }
    }

}


function toggleRectanglesVisibility() {
    let id = 0;

    rectangleToggler = setInterval(() => {
        hideAllRects();

        animationTimer = 0;

        for (let i = 0; i < spinnerCount; i++) {
            spinners[i].clearHighlights();
        }

        setRectGroupVisibility(id, true);

        //===Determine which slots to highlight as winning
        for (let i = 0; i < RectangleGroups[id].length; i++) {
            let currentRectangle = RectangleGroups[id][i].rect;
            let spinnerID = Math.floor((currentRectangle.x - spinners[0].x) / spinnerWidth);
            let imageID = Math.floor((currentRectangle.y - spinners[0].y) / spinnerWidth);
            //console.log("Spinner: " + spinnerID + " Image: " + imageID);

            spinners[spinnerID].highlightedSlots[imageID] = true;
        }

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
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


/*
    Basic smoothing function
    v = ((v * (N - 1)) + w) / N; 

    v - current value
    w - goal value
    The higher factor, the slower v approaches w.
*/
function Smooth(current, goal, factor) {
    return ((current * (factor - 1)) + goal) / factor;
}


//===Remove and re-add the GUI sprites so that they will be drawn on top of everything and in this order
function updateGUIOrder() {
    stage.removeChild(sprLowerPanel);
    stage.removeChild(sprUpperPanel);
    stage.removeChild(lblBalanceNumber);
    stage.removeChild(lblBalanceText);
    stage.removeChild(lblLastWinText);
    stage.removeChild(lblLastWinNumber);
    stage.removeChild(lblMessage);
    stage.removeChild(sprBetPointer);

    stage.addChild(sprLowerPanel);
    stage.addChild(sprUpperPanel);
    stage.addChild(lblBalanceNumber);
    stage.addChild(lblBalanceText);
    stage.addChild(lblLastWinText);
    stage.addChild(lblLastWinNumber);
    stage.addChild(lblMessage);
    stage.addChild(sprBetPointer);
}

//===Called in main loop
function movePointer(value) {
    let goalX = button100.btn.x + button100.btn.width / 2;

    if (sprBetPointer) {

        if (value >= 20) {

            goalX = button20.btn.x + button20.btn.width / 2;

        }

        if (value >= 40) {
            goalX = button40.btn.x + button40.btn.width / 2;

        }


        if (value >= 100) {
            goalX = button100.btn.x + button100.btn.width / 2;

        }

        if (value >= 200) {
            goalX = button200.btn.x + button200.btn.width / 2;

        }

        if (value >= 400) {
            goalX = button400.btn.x + button400.btn.width / 2;

        }


    }

    sprBetPointer.x = Smooth(sprBetPointer.x, goalX, 8);
}

//===Sine function, used for oscillations
function Sinusoid(value, frequency, amplitude) {

    let val = value + (amplitude * Math.sin(animationTimer * frequency * deltaTime));

    return val;
}