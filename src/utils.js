/*
    These are some helper functions

    I separated them into this file to make main.js more organized

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
    rawFile.onreadystatechange = function () {
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


function Smooth(current, goal, factor) {
    return ((current * (factor - 1)) + goal) / factor;
}


//===Remove and re-add the GUI sprites so that they will be drawn on top of everything and in this order
function updateGUIOrder() {
    stage.removeChild(lowerPanel);
    stage.removeChild(upperPanel);
    stage.removeChild(balanceDisplayLabel);
    stage.removeChild(balanceLabel);
    stage.removeChild(lastWinLabel);
    stage.removeChild(lastWinDisplayLabel);
    stage.removeChild(messageLabel);
    stage.removeChild(pointerImg);

    stage.addChild(lowerPanel);
    stage.addChild(upperPanel);
    stage.addChild(balanceDisplayLabel);
    stage.addChild(balanceLabel);
    stage.addChild(lastWinLabel);
    stage.addChild(lastWinDisplayLabel);
    stage.addChild(messageLabel);
    stage.addChild(pointerImg);
}


function movePointer(value) {
    let goalX = button100.btn.x + button100.btn.width / 2;

    if (pointerImg) {

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

    pointerImg.x = Smooth(pointerImg.x, goalX, 8);
}