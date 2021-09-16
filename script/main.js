"use strict";
const borderLimitVec = [0, 475],
    // borderLimitCell = [1, 20],
    cellSize = 25;

var autoTurn = null,
    curInterval = 350,
    currentDirect = "S",//"W","N","E","S"
    vector = [],//snakeHead vector RAW not converted in cell
    snakeSize = 1,
    histTurnArr = [],
    direction = "SN", // default "SN" - meaning TO-*S*OUTH-FROM-*N*ORTH
    histDirArr = ["SN"],
    applesArrPos = [],
    fTailAp = true,
    gameOver = false,
    sfxOn = true;

const getObj = id => document.getElementById(id);
const pauseSw = () => { if (gameOver) { gameOver = false; autoMove(); } else { gameOver = true; } }
const hideShowMenu = () => {
    let menuSd = getObj("menu");
    if (menuSd.style.display !== "none") {
        menuSd.style.display = "none";
    } else {
        menuSd.style.display = "flex";
    }
}

const pauseMenu = (opt) => {
    if (opt === 1) {
        gameOver = true;
        getObj("startButton").style.display = "none";
        getObj("resumeButton").style.display = "block";
        hideShowMenu();
    } else {
        gameOver = false;
        getObj("startButton").style.display = "block";
        getObj("resumeButton").style.display = "none";
        hideShowMenu();
        autoMove();
    }
}

const showEndScore = (opt) => {
    if (opt === 1) {
        getObj("endScore").innerHTML = "Your Score : " + (snakeSize - 1);
    } else { getObj("endScore").innerHTML = "Your Score is OVER 9000!"; }
    getObj("transition").style.display = "block";
    getObj("endScore").style.display = "block";
    getObj("hideScoreBut").style.display = "block";
}

const hideEndScore = () => {
    getObj("transition").style.display = "none";
    getObj("endScore").style.display = "none";
    getObj("hideScoreBut").style.display = "none";
    softReset();
    hideShowMenu();
}

const toggleMenu = () => {
    let menuF = getObj("firstMenuSection"),
        menuS = getObj("secondMenuSection");
    if (menuF.style.display !== "none") {
        menuF.style.display = "none";
        menuS.style.display = "block";
    } else {
        menuS.style.display = "none";
        menuF.style.display = "block";
    }
}

const toggleTutorial = () => {
    let menuS = getObj("secondMenuSection"),
        menuT = getObj("thirdMenuSection");
    if (menuS.style.display !== "none") {
        menuS.style.display = "none";
        menuT.style.display = "block";
    } else {
        menuT.style.display = "none";
        menuS.style.display = "block";
    }
}

const intSound = (() => {
    let parE = getObj("soundcont"),
        bgm = new Audio("./sound/snake.ogg"),
        sfxEat = new Audio("./sound/eat.ogg"),
        sfxBoom = new Audio("./sound/boom.ogg");
    parE.appendChild(bgm);
    parE.appendChild(sfxEat);
    parE.appendChild(sfxBoom);
    bgm.id = "bgm";
    bgm.loop = true;
    sfxEat.id = "sfxEat";
    sfxBoom.id = "sfxBoom";
    bgm.play();
})();

function toggleMusic() {
    let bgm = getObj("bgm");
    if (bgm.paused) {
        bgm.play();
    } else {
        bgm.pause();
    }
}

const toggleSfx = () => { if (sfxOn) { sfxOn = false; } else { sfxOn = true; } }


setSnakeToPosition(genRanPD(1), genRanPD(1), genRanPD(2));
dirStDisplay();
genApple();

function autoMove() {
    let allowChange = true;
    clearInterval(autoTurn);
    autoTurn = setInterval(frame, curInterval);// 350 250 200 150
    function frame() {
        if (gameOver) {
            clearInterval(autoTurn);
        } else {
            moveTo(currentDirect);
            switch (snakeSize) {

                case 100:
                    if (allowChange) {
                        curInterval = 250;
                        clearInterval(autoTurn);
                        autoTurn = setInterval(frame, curInterval);
                        allowChange = false;
                    }
                    break;

                case 101:
                    allowChange = true;
                    break;

                case 200:
                    if (allowChange) {
                        curInterval = 200;
                        clearInterval(autoTurn);
                        autoTurn = setInterval(frame, curInterval);
                        allowChange = false;
                    }
                    break;

                case 201:
                    allowChange = true;
                    break;

                case 300:
                    if (allowChange) {
                        curInterval = 150;
                        clearInterval(autoTurn);
                        autoTurn = setInterval(frame, curInterval);
                        allowChange = false;
                    }
                    break;
            }

        }
    }
}

function keyButDown(event, state) {//CONTROLLER
    if (state === '1') {//KEYBOARD
        var key = event.keyCode;
        keyDisplay(key);
    } else { var key = event; }//TOUCH
    if (gameOver === true) { return; }

    if (key === 37) {// LEFT
        if (direcLimiter("W")) { return; }
        currentDirect = "W";
    }

    if (key === 38) {//UP
        if (direcLimiter("N")) { return; }
        currentDirect = "N";
    }

    if (key === 39) {//RIGHT
        if (direcLimiter("E")) { return; }
        currentDirect = "E";
    }

    if (key === 40) {//DOWN
        if (direcLimiter("S")) { return; }
        currentDirect = "S";
    }
}

function moveTo(dir) {//MOVE SNAKE
    let snake = getObj("s1");
    switch (dir) {

        case "W":
            direcSwitch("W");
            if (vector[0] != borderLimitVec[0]) {
                vector[0] -= cellSize;
                snake.style.left = vector[0] + "px";
            } else {
                vector[0] = borderLimitVec[1];
                snake.style.left = vector[0] + "px";
            };
            getLastPos();
            break;

        case "N":
            direcSwitch("N");
            if (vector[1] != borderLimitVec[0]) {
                vector[1] -= cellSize;
                snake.style.top = vector[1] + "px";
            } else {
                vector[1] = borderLimitVec[1];
                snake.style.top = vector[1] + "px";
            }
            getLastPos();
            break;

        case "E":
            direcSwitch("E");
            if (vector[0] != borderLimitVec[1]) {
                vector[0] += cellSize;
                snake.style.left = vector[0] + "px";
            } else {
                vector[0] = borderLimitVec[0];
                snake.style.left = vector[0] + "px";
            }
            getLastPos();
            break;

        case "S":
            direcSwitch("S");
            if (vector[1] != borderLimitVec[1]) {
                vector[1] += cellSize;
                snake.style.top = vector[1] + "px";
            } else {
                vector[1] = borderLimitVec[0];
                snake.style.top = vector[1] + "px";
            }
            getLastPos();
            break;
    }
}

function setSnakeToPosition(vecX, vecY, dirSpr) {//IN CELLS MEASUREMENT
    const parentE = getObj("board");
    let conX = (vecX - 1) * cellSize,
        conY = (vecY - 1) * cellSize,
        str = "",
        //snake = getObj("s1"),
        newSnake = document.createElement("div");
    newSnake.id = "s1";
    parentE.appendChild(newSnake);
    //--------
    vector = [];
    vector.push(conX);
    vector.push(conY);
    //--------
    str = vecX + "x" + vecY;
    histTurnArr.push(str);
    //--------
    if (dirSpr === "W") {
        currentDirect = dirSpr;
        direction = "WE";
        histDirArr = ["WE"];
        newSnake.className = "slW";
    } else if (dirSpr === "N") {
        currentDirect = dirSpr;
        direction = "NS";
        histDirArr = ["NS"];
        newSnake.className = "slN";
    } else if (dirSpr === "E") {
        currentDirect = dirSpr;
        direction = "EW";
        histDirArr = ["EW"];
        newSnake.className = "slE";
    } else {
        currentDirect = dirSpr;
        direction = "SN";
        histDirArr = ["SN"];
        newSnake.className = "slS";
    }
    //--------
    newSnake.style.left = vector[0] + "px";
    newSnake.style.top = vector[1] + "px";
    display();
}

function getVecToCell(vecArr) {
    let posX = vecArr[0] / cellSize + 1,
        posY = vecArr[1] / cellSize + 1,
        cellVec = [];
    cellVec.push(posX);
    cellVec.push(posY);
    return cellVec;
}

function setElemToPos(obj, cellVec) {
    let a = Number(cellVec[1]),
        b = Number(cellVec[0]),
        conX = (a - 1) * cellSize,
        conY = (b - 1) * cellSize,
        objE = getObj(obj);
    objE.style.top = conX + "px";
    objE.style.left = conY + "px";
}

function getLastPos() {// IMPORTANT CORE FUNC
    let vec = getVecToCell(vector),
        str = "";
    str = vec[0] + "x" + vec[1];
    histTurnArr.push(str);
    if (histTurnArr.length > snakeSize + 1) { histTurnArr.shift(); }
    histDirArr.push(direction);
    if (histDirArr.length > snakeSize + 1) { histDirArr.shift(); }
    display();
    appleDetect();
    genApple();
    bodyDetect();
    bodyAnim();
}

function direcSwitch(direcTo) {//direction changer

    if (direcTo === "W") {
        switch (direction) {
            case "SN":
                direction = "WN";
                break;
            case "WN":
                direction = "WE";
                break;
            case "NS":
                direction = "WS";
                break;
            case "WS":
                direction = "WE";
                break;
            case "SE":
                direction = "WN";
                break;
            case "NE":
                direction = "WS";
                break;
            case "SW":
                direction = "WN";
                break;
            case "NW":
                direction = "WS";
                break;
        }
    }

    if (direcTo === "N") {
        switch (direction) {
            case "WE":
                direction = "NE";
                break;
            case "NE":
                direction = "NS";
                break;
            case "EW":
                direction = "NW";
                break;
            case "NW":
                direction = "NS";
                break;
            case "WS":
                direction = "NE";
                break;
            case "ES":
                direction = "NW";
                break;
            case "WN":
                direction = "NE";
                break;
            case "EN":
                direction = "NW";
                break;
        }
    }

    if (direcTo === "E") {
        switch (direction) {
            case "NS":
                direction = "ES";
                break;
            case "ES":
                direction = "EW";
                break;
            case "SN":
                direction = "EN";
                break;
            case "EN":
                direction = "EW";
                break;
            case "NW":
                direction = "ES";
                break;
            case "SW":
                direction = "EN";
                break;
            case "NE":
                direction = "ES";
                break;
            case "SE":
                direction = "EN";
                break;
        }
    }

    if (direcTo === "S") {
        switch (direction) {
            case "EW":
                direction = "SW";
                break;
            case "SW":
                direction = "SN";
                break;
            case "WE":
                direction = "SE";
                break;
            case "SE":
                direction = "SN";
                break;
            case "WN":
                direction = "SE";
                break;
            case "EN":
                direction = "SW";
                break;
            case "ES":
                direction = "SW";
                break;
            case "WS":
                direction = "SE";
                break;
        }
    }
}

function direcLimiter(direcTo) {// to not allow snake move inside itself
    var stop = false;

    if (direcTo === "W") {
        if (direction === "EW" || direction === "ES" || direction === "EN") { stop = true; }
    }
    if (direcTo === "N") {
        if (direction === "SN" || direction === "SE" || direction === "SW") { stop = true; }
    }
    if (direcTo === "E") {
        if (direction === "WE" || direction === "WS" || direction === "WN") { stop = true; }
    }
    if (direcTo === "S") {
        if (direction === "NS" || direction === "NE" || direction === "NW") { stop = true; }
    }
    return stop
}

function display() {//EVERY TURN REFRESH
    getObj("scoreMenu").innerHTML = "SCORE : " + (snakeSize - 1);
    getObj("score").innerHTML = "SCORE : " + (snakeSize - 1);
}

function dirStDisplay () {
    switch (currentDirect) {
        case "W":
            getObj("directOut").innerHTML = "LEFT";
            break;
        case "N":
            getObj("directOut").innerHTML = "UP";
            break;
        case "E":
            getObj("directOut").innerHTML = "RIGHT";
            break;
        case "S":
            getObj("directOut").innerHTML = "DOWN";
            break;
        }
    }

function keyDisplay(keyCode) {
    switch (keyCode) {
        case 37:
            getObj("directOut").innerHTML = "LEFT";
            break;
        case 38:
            getObj("directOut").innerHTML = "UP";
            break;
        case 39:
            getObj("directOut").innerHTML = "RIGHT";
            break;
        case 40:
            getObj("directOut").innerHTML = "DOWN";
            break;
    }
}

function genApple() {
    let min = 1,
        max = 20,
        genX = Math.floor(Math.random() * (max - min + 1)) + min,
        genY = Math.floor(Math.random() * (max - min + 1)) + min,
        strGen = genX + "x" + genY;

    for (let a in histTurnArr) {//NOT ALLOW PLACING APPLE ON SNAKE CELL
        if (strGen === histTurnArr[a]) {
            return genApple();
        }
    }
    for (let j in applesArrPos) {//NOT ALLOW PLACING APPLE ON OCCUPIED CELL
        let tempDiv = applesArrPos[j],
            slicedArr = tempDiv.split("x"),
            strGen2 = slicedArr[1] + "x" + slicedArr[2];
        if (strGen2 === strGen) {
            return genApple();
        }
    }
    if (applesArrPos.length < 5 && snakeSize < 390) {//NOT ALLOW MORE THAN 10 APPLES ON BOARD
        const parentE = getObj("board");//APPLE PLACER START HERE
        let newApple = document.createElement("div");
        newApple.className = "apple";
        newApple.id = emptyIdFinder();
        parentE.appendChild(newApple);
        setElemToPos(newApple.id, [genX, genY]);
        applesArrPos.push(newApple.id + "x" + strGen);
    }
}

function appleDetect() {//DETECTOR AND REMOVER APPLE
    let snPos;
    for (let a in histTurnArr) {
        snPos = histTurnArr[a];
        for (let b in applesArrPos) {
            let tempCom = applesArrPos[b],
                tempSliceA = tempCom.split("x"),
                rstStr = tempSliceA[1] + "x" + tempSliceA[2];
            if (rstStr === snPos) {//EATS APPLE FROM BOARD
                getObj("board").removeChild(getObj(tempSliceA[0]));
                delete applesArrPos[b];
                applesArrPos.sort();
                applesArrPos.pop();
                if (sfxOn) { getObj("sfxEat").play() };
                growBody();
            }
        }
    }
}

function emptyIdFinder() {//GENERATE UNIQE ID NAME FOR APPLE
    if (applesArrPos.length === 0) {
        return "a1";
    }
    let tempAR = [];
    for (let a in applesArrPos) {
        let tempCom = applesArrPos[a],
            tempSliceA = tempCom.split("x"),
            tempId = tempSliceA[0],
            extrId = Number(tempId.replace("a", ""));
        tempAR.push(extrId);
    }
    let counter = 1,
        comparator = tempAR.some(function (value) { return value === counter; });
    while (comparator) {
        counter += 1;
        comparator = tempAR.some(function (value) { return value === counter; });
    }
    return "a" + counter;
}

function growBody() {
    const parentE = getObj("board");
    let newSnakePart = document.createElement("div"),
        partNum = snakeSize + 1;
    newSnakePart.id = "s" + partNum;
    if (partNum === 2) {
        newSnakePart.className = partNameCorr(histDirArr[1]);
    } else {
        newSnakePart.className = "empty";
    }
    snakeSize += 1;
    parentE.appendChild(newSnakePart);
}

function bodyAnim() {
    let snake = getObj("s1"),
        tail = getObj("s2"),
        curTailDir = histDirArr[2],//NEED 2 FOR CORRECT TAIL SPRITE
        counter = 1;

    if (snakeSize < 2) {
        if (direction === "WN" || direction === "WE" || direction === "WS") {
            snake.className = "slW";
        } else if (direction === "NW" || direction === "NS" || direction === "NE") {
            snake.className = "slN";
        } else if (direction === "EN" || direction === "EW" || direction === "ES") {
            snake.className = "slE";
        } else if (direction === "SE" || direction === "SN" || direction === "SW") {
            snake.className = "slS";
        }
    } else {
        while (counter - 1 < snakeSize) {
            if (counter === 1) {
                let curHeadDir = histDirArr[histDirArr.length - 1];
                //-----SNAKE HEAD----
                if (curHeadDir === "WE" || curHeadDir === "WN" || curHeadDir === "WS") {
                    snake.className = "shW";
                } else if (curHeadDir === "EW" || curHeadDir === "EN" || curHeadDir === "ES") {
                    snake.className = "shE";
                } else if (curHeadDir === "NS" || curHeadDir === "NW" || curHeadDir === "NE") {
                    snake.className = "shN";
                } else if (curHeadDir === "SN" || curHeadDir === "SE" || curHeadDir === "SW") {
                    snake.className = "shS";
                }
                counter++;
            } else if (counter === 2) {
                //-----SNAKE TAIL----
                if (curTailDir === "WE" || curTailDir === "WN" || curTailDir === "WS") {
                    tail.className = "stW";
                } else if (curTailDir === "EW" || curTailDir === "EN" || curTailDir === "ES") {
                    tail.className = "stE";
                } else if (curTailDir === "NS" || curTailDir === "NW" || curTailDir === "NE") {
                    tail.className = "stN";
                } else if (curTailDir === "SN" || curTailDir === "SE" || curTailDir === "SW") {
                    tail.className = "stS";
                }
                if (fTailAp) {
                    setElemToPos("s2", histTurnArr[0].split("x"));
                    fTailAp = false;// MAYBE MOD LATE
                } else { setElemToPos("s2", histTurnArr[1].split("x")); }
                counter++;
            } else {
                let bodyStr = "s" + counter,
                    bodyPart = getObj(bodyStr),
                    dirBodPar = histDirArr[counter];
                //-----SNAKE INNER BODY---
                if (dirBodPar === "WE" || dirBodPar === "EW") {
                    bodyPart.className = "sbH";
                } else if (dirBodPar === "NS" || dirBodPar === "SN") {
                    bodyPart.className = "sbV";
                } else if (dirBodPar === "WN" || dirBodPar === "NW") {
                    bodyPart.className = "scWN";
                } else if (dirBodPar === "NE" || dirBodPar === "EN") {
                    bodyPart.className = "scNE";
                } else if (dirBodPar === "ES" || dirBodPar === "SE") {
                    bodyPart.className = "scES";
                } else if (dirBodPar === "SW" || dirBodPar === "WS") {
                    bodyPart.className = "scSW";
                }
                setElemToPos(bodyStr, histTurnArr[counter - 1].split("x"));
                counter++;
            }
        }
    }
}

function partNameCorr(dir) {//CHOSE CORRECT NAME FOR NEW BODY PART
    if (dir === "WE" || dir === "WN" || dir === "WS") {
        return "stW";
    } else if (dir === "EW" || dir === "EN" || dir === "ES") {
        return "stE";
    } else if (dir === "NS" || dir === "NW" || dir === "NE") {
        return "stN";
    } else if (dir === "SN" || dir === "SE" || dir === "SW") {
        return "stS";
    }
}

function bodyDetect() {//DETECT GAME OVER OR NOT
    let currPos = getVecToCell(vector),
        counter = 1;
    while (counter < histTurnArr.length - 1) {
        let exArr = histTurnArr[counter].split("x"),
            comX = Number(exArr[0]),
            comY = Number(exArr[1]);
        if (currPos[0] === comX && currPos[1] === comY) {
            gameOver = true;
            if (sfxOn) { getObj("sfxBoom").play(); }
            addStop(currPos);
            showEndScore(1);
            break;
        }
        counter++;
    }
    if (snakeSize >= 390) {
        gameOver = true;
        showEndScore(2);
    }
}

function addStop(pos) {
    const parentE = getObj("board");
    let stop = document.createElement("div");
    stop.id = "stop";
    stop.className = "stop";
    parentE.appendChild(stop);
    setElemToPos("stop", [pos[0], pos[1]]);
}

function genRanPD(op) {
    if (op === 1) {
        let gen = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
        return gen;
    } else {
        let gen = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        switch (gen) {
            case 1:
                return "W";
            case 2:
                return "N";
            case 3:
                return "E";
            case 4:
                return "S";
            default:
                return "S";
        }
    }
}

function softReset() {
    let board = getObj("board");
    vector = [];
    snakeSize = 1;
    histTurnArr = [];
    applesArrPos = [];
    fTailAp = true;
    gameOver = false;
    clearInterval(autoTurn);
    autoTurn = null;
    curInterval = 350;
    getObj("scoreMenu").innerHTML = "SCORE : 0";
    while (board.hasChildNodes()) {
        board.removeChild(board.firstChild);
    }
    setSnakeToPosition(genRanPD(1), genRanPD(1), genRanPD(2));
    dirStDisplay();
    genApple();
}

/* const snakeZi = new snakeZ();

snakeZi.eatApple();
snakeZi.eatApple();
snakeZi.eatApple();
snakeZi.eatApple();
console.log(snakeZi.size); */