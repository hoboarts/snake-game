"use strict";
const borderLimitVec = [0, 475],
    cellSize = 25;

var autoTurn = null,
    curInterval = 350,
    gameOver = false;

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

const sound = new Sound();
const snake = new Snake();
const apples = new Apples();

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
        getObj("endScore").innerHTML = "Your Score : " + (snake.snakeSize - 1);
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


snake.setSnakeToPosition(genRanPD(1), genRanPD(1), genRanPD(2));
dirStDisplay();
apples.genApple();

function autoMove() {
    let allowChange = true;
    clearInterval(autoTurn);
    autoTurn = setInterval(frame, curInterval);// 350 250 200 150
    function frame() {
        if (gameOver) {
            clearInterval(autoTurn);
        } else {
            snake.moveTo(snake.currentDirect);
            switch (snake.snakeSize) {

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
        dirStDisplay();
    } else { var key = event; }//TOUCH
    if (gameOver === true) { return; }

    if (key === 37) {// LEFT
        if (direcLimiter("W")) { return; }
        snake.currentDirect = "W";
    }

    if (key === 38) {//UP
        if (direcLimiter("N")) { return; }
        snake.currentDirect = "N";
    }

    if (key === 39) {//RIGHT
        if (direcLimiter("E")) { return; }
        snake.currentDirect = "E";
    }

    if (key === 40) {//DOWN
        if (direcLimiter("S")) { return; }
        snake.currentDirect = "S";
    }
}

function getVecToCell(vecArr) {
    let posX = vecArr[0] / cellSize + 1,
        posY = vecArr[1] / cellSize + 1,
        cellVec = [];
    cellVec.push(posX);
    cellVec.push(posY);
    return cellVec;
}

function getLastPos() {// IMPORTANT CORE FUNC
    let vec = getVecToCell(snake.vector),
        str = "";
    str = vec[0] + "x" + vec[1];
    snake.positionsArr.push(str);
    if (snake.positionsArr.length > snake.snakeSize + 1) { snake.positionsArr.shift(); }
    snake.histDirArr.push(snake.direction);
    if (snake.histDirArr.length > snake.snakeSize + 1) { snake.histDirArr.shift(); }
    display();
    apples.appleDetect();
    apples.genApple();
    snake.bodyDetect();
    snake.bodyAnim();
}

function direcLimiter(direcTo) {// to not allow snake move inside itself CONTROLLER
    var stop = false;

    if (direcTo === "W") {
        if (snake.direction === "EW" || snake.direction === "ES" || snake.direction === "EN") { stop = true; }
    }
    if (direcTo === "N") {
        if (snake.direction === "SN" || snake.direction === "SE" || snake.direction === "SW") { stop = true; }
    }
    if (direcTo === "E") {
        if (snake.direction === "WE" || snake.direction === "WS" || snake.direction === "WN") { stop = true; }
    }
    if (direcTo === "S") {
        if (snake.direction === "NS" || snake.direction === "NE" || snake.direction === "NW") { stop = true; }
    }
    return stop
}

function display() {//EVERY TURN REFRESH
    getObj("scoreMenu").innerHTML = "SCORE : " + (snake.snakeSize - 1);
    getObj("score").innerHTML = "SCORE : " + (snake.snakeSize - 1);
}

function dirStDisplay() {
    switch (snake.currentDirect) {
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
    snake.vector = [];
    snake.snakeSize = 1;
    snake.positionsArr = [];
    apples.positionsArr = [];
    snake.fTailAp = true;
    gameOver = false;
    clearInterval(autoTurn);
    autoTurn = null;
    curInterval = 350;
    while (board.hasChildNodes()) {
        board.removeChild(board.firstChild);
    }
    snake.setSnakeToPosition(genRanPD(1), genRanPD(1), genRanPD(2));
    dirStDisplay();
    apples.genApple();
}