//Display expression on calculator
function updateDisplay(cell) {
        var display = document.getElementById('display-box');

        if(display.value == "" && isNaN(cell.innerHTML) && cell.innerHTML !== ".") {
            return false;
        }
    
        if(isNaN(display.value[display.value.length-1]) && isNaN(cell.innerHTML) && display.value.length > 0) {
            return false;
        } else {
            display.value+= cell.innerHTML;
        }
        
}

//Find the largest value in the array od operations
function findMax(posArray) {
    switch(posArray.length) {
        case 2: Math.max(posArray[0], posArray[1]);
            break;
        case 3: Math.max(posArray[0], posArray[1], posArray[2]);
            break;
        case 4: Math.max(posArray[0], posArray[1], posArray[2], posArray[3]);
            break;
        default: return posArray[0];
    }
}

//Clear recent entry
function clearEntry() {
    var display = document.getElementById('display-box');
    var lastIndex;
    //Array of operator index positions
    var pos = [];
    //If entry is a number, clear display
    if (!isNaN(display.value)) {
        display.value = "";
    }
    //If the last character is an operator, do nothing, otherwise continue procedures
    if (isNaN(display.value[display.value.length-1]) && display.value[display.value.length-1] !== ".") {
        return false;
    } else {
        if (display.value.includes("*")) {
            pos.push(display.value.lastIndexOf("*"));
        }
        if (display.value.includes("/")) {
            pos.push(display.value.lastIndexOf("/"));
        }
        if (display.value.includes("-")) {
            pos.push(display.value.lastIndexOf("-"));
        }
        if (display.value.includes("+")) {
            pos.push(display.value.lastIndexOf("+"));
        }
        //Get the last index of operator
        lastIndex = findMax(pos);
        //Display everything up to the last operator
        display.value = display.value.slice(0, lastIndex);
    }
    
}

//Clear all 
function clearAll() {
    var display = document.getElementById('display-box');
    display.value = "";
}
//Negate the value (Multiply by -1)
function negate() {
    var display = document.getElementById('display-box');
    if (isNaN(display.value)) {
        return false;
    } else {
        display.value = Number(display.value) * -1;
    }
}
//Square the value
function squareRoot() {
    var display = document.getElementById('display-box');
    if (display.value == "") {
        return false;
    }
    display.value = Math.sqrt(display.value);
}

function calculate() {
    //Create variables
    var finalAnswer;
    var display = document.getElementById('display-box');
        
    //Array of numbers to be computed
    var numbers = [];

    //Array of operators in computation
    var operators = [];
    
    //Array of index positions of every operator
    var indexPositions = [];
    
    //Loop through display string to find individual numeric values
    for (var i = 0; i < display.value.length; i++) {
        if (display.value[i] == "/" || display.value[i] == "*" || display.value[i] == "-" || display.value[i] == "+") {
            //Store the operator character into the array
            operators.push(display.value[i]);
            //Store the index postion of last occurrence of an operator
            indexPositions.push(i);
            
            //If there is one operator, store that one into operators array
            if (operators.length < 2) {
                numbers.push(Number(display.value.substring(0, i)));
            } else {
                //Store the numbers between each operator character
                numbers.push(Number(display.value.substring(indexPositions[indexPositions.length-2] + 1, i)));
            }
        }   
        //Store the last value of the display string into numbers array once we reach the end of the loop
        if (i == (display.value.length-1)) {
            numbers.push(Number(display.value.substring(indexPositions[indexPositions.length-1] + 1, display.value.length)));
        }
    }
    //Set finalAnswer to first numeric entry before beginning calculation
    finalAnswer = numbers[0];
    //Calculate based on operator(s)
    for (var i = 0; i < numbers.length; i++) {
        if(operators[i] == "/") {
            finalAnswer = finalAnswer / numbers[i+1];
        }
        if(operators[i] == "*") {
            finalAnswer = finalAnswer * numbers[i+1];
        }
        if(operators[i] == "-") {
            finalAnswer = finalAnswer - numbers[i+1];
        }
        if(operators[i] == "+") {
            finalAnswer = finalAnswer + numbers[i+1];
        }
    }
    //Display final answer to output box    
    display.value = finalAnswer.toString();
}

function getImage() {
    alert(document.body.style.backgroundImage);
}