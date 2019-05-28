
function checkResults() {


    //===Store all values in a 3x5 matrix so it's easier to check all combinations and find their corresponding places

    let values = new Array(3); //values

    for (let i = 0; i < 3; i++) {
        values[i] = new Array(5); //spinners
    }


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            values[i][j] = spinners[j].value[i];
        }
    }

    RectangleGroups = [];

    //console.log(values);
    //===

    resetSpinnerAnimations();

    checkStraight();



    //===Count zigzag

    /*
    x   0   0   0   x
    0   x   0   x   0
    0   0   x   0   0
    */
    checkCombination(0, 1, 2, 1, 0, 0xFF00FF);

    /*
    0   0   x   0   0
    0   x   0   x   0
    x   0   0   0   x
    */
    checkCombination(2, 1, 0, 1, 2, 0x00FF00);

    /*
    x   x   0   0   0
    0   0   x   0   0
    0   0   0   x   x
    */
    checkCombination(0, 0, 1, 2, 2, 0xFF0000);

    /*
    0   0   0   x   x
    0   0   x   0   0
    x   x   0   0   0
    */
    checkCombination(2, 2, 1, 0, 0, 0xA00000);

    /*
    0   x   x   x   0
    x   0   0   0   x
    0   0   0   0   0
    */
    checkCombination(1, 0, 0, 0, 1, 0x0000FF);

    /*
    0   0   0   0   0
    x   0   0   0   x
    0   x   x   x   0
    */
    checkCombination(1, 2, 2, 2, 1, 0x0F0F0F);

    /*
    x   0   0   0   x
    0   x   x   x   0
    0   0   0   0   0
    */
    checkCombination(0, 1, 1, 1, 0, 0xF0F0F0);

    /*
    0   0   0   0   0
    0   x   x   x   0
    x   0   0   0   x
    */
    checkCombination(2, 1, 1, 1, 2, 0xAA0052);

    /*
    0   x   0   0   0
    x   0   x   0   x
    0   0   0   x   0
    */
    checkCombination(1, 0, 1, 2, 1, 0xBABABA);

    /*
    0   0   0   x   0
    x   0   x   0   x
    0   x   0   0   0
    */
    checkCombination(1, 2, 1, 0, 1, 0xC4C4C4);

    /*
     0   0   0   x   0
     x   0   x   0   x
     0   x   0   0   0
     */
    checkCombination(1, 2, 1, 0, 1);

    /*
     x   0   x   0   x
     0   x   0   x   0
     0   0   0   0   0
     */
    checkCombination(0, 1, 0, 1, 0);

    /*
     0   0   0   0   0
     0   x   0   x   0
     x   0   x   0   x
     */
    checkCombination(2, 1, 2, 1, 2);

    if(RectangleGroups.length > 0){
        hideAllRects();

        toggleRectanglesVisibility();
    }

   
    console.log("Balance: " + balance);
    

}

function checkStraight() {
    //===Count all straights
    
    for (let i = 0; i < 3; i++) {
        let rectangles = [];
        let straightCount = 0;
        for (let j = 1; j < 5; j++) {
            
            if (spinners[j].value[i] == spinners[j - 1].value[i]
                || spinners[j - 1].value[i] == jokerVal) {
                straightCount++;
            } else {
                break;
            }
        
            

            
        }

        //activate animations for all eligible slots
        if (straightCount >= 2) {
               
            for (let j = 0; j <= straightCount; j++) {
                spinners[j].highlightedSlots[i] = true;
                spinners[j].highlight = true;

                rectangles.push(new Rectangle(
                    spinners[j].imgs[i].x - spinnerWidth/2,
                    spinners[j].imgs[i].y - spinnerWidth/2,
                    spinnerWidth,
                    spinnerWidth,
                    0xFFFFFF));
            }
            
            //===Avoid using the joker value unless all winning are jokers.
            let val = spinners[0].value[i];
            if(val == jokerVal){
                for(let j = 0; j <= straightCount; j++){
                    if(spinners[j].value[i] != jokerVal){
                        val = spinners[j].value[i];
                    }
                }
            }
            //===

            let profit = calculateProfit(straightCount + 1, val);
            balance += profit;
            console.log("Profit: " + profit);
            
        }

        
        //console.log("Row " + i + ": " + (straightCount + 1));
        if(rectangles.length > 0){
            RectangleGroups.push(rectangles);
            //console.log("Length: " + RectangleGroups.length);
        }
    }

    
}



//===Arguments represent the slot for each spinner (0, 1, 2)
/*
    If we want to check a combination like

            1   2   3   4   5

    0:      0   0   x   0   0
    1:      0   x   0   x   0
    2:      x   0   0   0   x

    and give it a white rectangle

    We would use checkCombination(2, 1, 0, 1, 2, 0xFFFFFF);

*/
function checkCombination(int1, int2, int3, int4, int5, color) {
    let rectColor = 0xFFFFFF;
    if (color) {
        rectColor = color;
    }

    let combination = [int1, int2, int3, int4, int5];


    let comboCount = 0;
    for (let j = 1; j < 5; j++) {
    
        if (spinners[j].value[combination[j]] == spinners[j - 1].value[combination[j - 1]]
            || spinners[j - 1].value[combination[j - 1]] == jokerVal) {
            comboCount++;
        } else {
            break;
        }
        

    }

     //activate animations for all eligible slots
     if (comboCount >= 2) {

        let rectangles = [];
        for (let j = 0; j <= comboCount; j++) {
            spinners[j].highlightedSlots[combination[j]] = true;
            spinners[j].highlight = true;

            rectangles.push(new Rectangle(
                spinners[j].x,
                spinners[j].imgs[combination[j]].y - spinnerWidth/2,
                spinnerWidth,
                spinnerWidth,
                rectColor));
        }

          //===Avoid using the joker value unless all winning are jokers.
          let val = spinners[0].value[combination[0]];
          if(val == jokerVal){
              for(let j = 0; j <= comboCount; j++){
                  if(spinners[j].value[combination[j]] != jokerVal){
                      val = spinners[j].value[combination[j]];
                  }
              }
          }
          //===

        let profit = calculateProfit(comboCount + 1, val);
        balance += profit;
        //console.log("Profit: " + profit);

        if(rectangles.length > 0){
            RectangleGroups.push(rectangles);
        }
        
        //console.log(RectangleGroups.length);
    }
}

function calculateProfit(comboCount, id){
    let profit = 0;
    
    if(comboCount == 3){
        profit = data.valuesThree[id] * betValue;
    }else if(comboCount == 4){
        profit = data.valuesFour[id] * betValue;
    }else if(comboCount == 5){
        profit = data.valuesFive[id] * betValue;
    }
    console.log("Profit for matched: " + comboCount + ", id: " + id + ", Bet: " + betValue + ": " + profit);

    
    return profit;
    //let profit = combo * betValue * 
}
