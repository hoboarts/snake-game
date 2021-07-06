class Entity {
    constructor() {
        this.positionsArr = [];
    }

    static setElemToPos(obj, cellVec) {
        let a = Number(cellVec[1]),
            b = Number(cellVec[0]),
            conX = (a - 1) * cellSize,
            conY = (b - 1) * cellSize,
            objE = getObj(obj);
        objE.style.top = conX + "px";
        objE.style.left = conY + "px";
    }
}

class Snake extends Entity {// ROMOVE LAST LATTER "Z" - NAME CONFLICT
    constructor() {
        super();
        this.currentDirect = "S";
        this.vector = [];//snakeHead vector RAW not converted in cell   S
        this.snakeSize = 1;//        S
        this.positionsArr = [];//     S   this.positionsArr
        this.direction = "SN"; // default "SN" - meaning TO-*S*OUTH-FROM-*N*ORTH    S
        this.histDirArr = ["SN"];//      S
        this.fTailAp = true;//       S
    }

    moveTo(dir) {//MOVE SNAKE
        let snake = getObj("s1");
        switch (dir) {
            case "W":
                this.direcSwitch("W");
                if (this.vector[0] != borderLimitVec[0]) {
                    this.vector[0] -= cellSize;
                    snake.style.left = this.vector[0] + "px";
                } else {
                    this.vector[0] = borderLimitVec[1];
                    snake.style.left = this.vector[0] + "px";
                };
                getLastPos();
                break;
            case "N":
                this.direcSwitch("N");
                if (this.vector[1] != borderLimitVec[0]) {
                    this.vector[1] -= cellSize;
                    snake.style.top = this.vector[1] + "px";
                } else {
                    this.vector[1] = borderLimitVec[1];
                    snake.style.top = this.vector[1] + "px";
                }
                getLastPos();
                break;
            case "E":
                this.direcSwitch("E");
                if (this.vector[0] != borderLimitVec[1]) {
                    this.vector[0] += cellSize;
                    snake.style.left = this.vector[0] + "px";
                } else {
                    this.vector[0] = borderLimitVec[0];
                    snake.style.left = this.vector[0] + "px";
                }
                getLastPos();
                break;
            case "S":
                this.direcSwitch("S");
                if (this.vector[1] != borderLimitVec[1]) {
                    this.vector[1] += cellSize;
                    snake.style.top = this.vector[1] + "px";
                } else {
                    this.vector[1] = borderLimitVec[0];
                    snake.style.top = this.vector[1] + "px";
                }
                getLastPos();
                break;
        }
    }

    setSnakeToPosition(vecX, vecY, dirSpr) {//IN CELLS MEASUREMENT
        const parentE = getObj("board");
        let conX = (vecX - 1) * cellSize,
            conY = (vecY - 1) * cellSize,
            str = "",
            newSnake = document.createElement("div");
        newSnake.id = "s1";
        parentE.appendChild(newSnake);
        this.vector = [];
        this.vector.push(conX);
        this.vector.push(conY);
        str = vecX + "x" + vecY;
        this.positionsArr.push(str);//  this.positionsArr
        if (dirSpr === "W") {
            this.currentDirect = dirSpr;
            this.direction = "WE";
            this.histDirArr = ["WE"];
            newSnake.className = "slW";
        } else if (dirSpr === "N") {
            this.currentDirect = dirSpr;
            this.direction = "NS";
            this.histDirArr = ["NS"];
            newSnake.className = "slN";
        } else if (dirSpr === "E") {
            this.currentDirect = dirSpr;
            this.direction = "EW";
            this.histDirArr = ["EW"];
            newSnake.className = "slE";
        } else {
            this.currentDirect = dirSpr;
            this.direction = "SN";
            this.histDirArr = ["SN"];
            newSnake.className = "slS";
        }
        newSnake.style.left = this.vector[0] + "px";
        newSnake.style.top = this.vector[1] + "px";
        display();
    }

    direcSwitch(direcTo) {//direction switcher NAV

        if (direcTo === "W") {
            switch (this.direction) {
                case "SN":
                    this.direction = "WN";
                    break;
                case "WN":
                    this.direction = "WE";
                    break;
                case "NS":
                    this.direction = "WS";
                    break;
                case "WS":
                    this.direction = "WE";
                    break;
                case "SE":
                    this.direction = "WN";
                    break;
                case "NE":
                    this.direction = "WS";
                    break;
                case "SW":
                    this.direction = "WN";
                    break;
                case "NW":
                    this.direction = "WS";
                    break;
            }
        }
    
        if (direcTo === "N") {
            switch (this.direction) {
                case "WE":
                    this.direction = "NE";
                    break;
                case "NE":
                    this.direction = "NS";
                    break;
                case "EW":
                    this.direction = "NW";
                    break;
                case "NW":
                    this.direction = "NS";
                    break;
                case "WS":
                    this.direction = "NE";
                    break;
                case "ES":
                    this.direction = "NW";
                    break;
                case "WN":
                    this.direction = "NE";
                    break;
                case "EN":
                    this.direction = "NW";
                    break;
            }
        }
    
        if (direcTo === "E") {
            switch (this.direction) {
                case "NS":
                    this.direction = "ES";
                    break;
                case "ES":
                    this.direction = "EW";
                    break;
                case "SN":
                    this.direction = "EN";
                    break;
                case "EN":
                    this.direction = "EW";
                    break;
                case "NW":
                    this.direction = "ES";
                    break;
                case "SW":
                    this.direction = "EN";
                    break;
                case "NE":
                    this.direction = "ES";
                    break;
                case "SE":
                    this.direction = "EN";
                    break;
            }
        }
    
        if (direcTo === "S") {
            switch (this.direction) {
                case "EW":
                    this.direction = "SW";
                    break;
                case "SW":
                    this.direction = "SN";
                    break;
                case "WE":
                    this.direction = "SE";
                    break;
                case "SE":
                    this.direction = "SN";
                    break;
                case "WN":
                    this.direction = "SE";
                    break;
                case "EN":
                    this.direction = "SW";
                    break;
                case "ES":
                    this.direction = "SW";
                    break;
                case "WS":
                    this.direction = "SE";
                    break;
            }
        }
    }

    growBody() {// S
        const parentE = getObj("board");
        let newSnakePart = document.createElement("div"),
            partNum = this.snakeSize + 1;
        newSnakePart.id = "s" + partNum;
        if (partNum === 2) {
            newSnakePart.className = this.partNameCorr(this.histDirArr[1]);
        } else {
            newSnakePart.className = "empty";
        }
        this.snakeSize += 1;
        parentE.appendChild(newSnakePart);
    }

    bodyAnim() {
        let snake = getObj("s1"),
            tail = getObj("s2"),
            curTailDir = this.histDirArr[2],//NEED 2 FOR CORRECT TAIL SPRITE
            counter = 1;
    
        if (this.snakeSize < 2) {
            if (this.direction === "WN" || this.direction === "WE" || this.direction === "WS") {
                snake.className = "slW";
            } else if (this.direction === "NW" || this.direction === "NS" || this.direction === "NE") {
                snake.className = "slN";
            } else if (this.direction === "EN" || this.direction === "EW" || this.direction === "ES") {
                snake.className = "slE";
            } else if (this.direction === "SE" || this.direction === "SN" || this.direction === "SW") {
                snake.className = "slS";
            }
        } else {
            while (counter - 1 < this.snakeSize) {
                if (counter === 1) {
                    let curHeadDir = this.histDirArr[this.histDirArr.length - 1];
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
                    if (this.fTailAp) {
                        Snake.setElemToPos("s2", this.positionsArr[0].split("x"));//  this.positionsArr
                        this.fTailAp = false;// MAYBE MOD LATE
                    } else { Snake.setElemToPos("s2", this.positionsArr[1].split("x")); }// this.positionsArr
                    counter++;
                } else {
                    let bodyStr = "s" + counter,
                        bodyPart = getObj(bodyStr),
                        dirBodPar = this.histDirArr[counter];
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
                    if (this.positionsArr[counter - 1] !== undefined) {//FOR TIMING ISSUE APPLE EATING AT SHORT FRAME
                    Snake.setElemToPos(bodyStr, this.positionsArr[counter - 1].split("x"));
                    }
                    counter++;
                }
            }
        }
    }

    partNameCorr(dir) {//CHOOSE CORRECT NAME FOR NEW BODY PART
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

    bodyDetect() {//DETECT GAME OVER OR NOT
        let currPos = getVecToCell(this.vector),
            counter = 1;
        while (counter < this.positionsArr.length - 1) {//    this.positionsArr
            let exArr = this.positionsArr[counter].split("x"),//    this.positionsArr
                comX = Number(exArr[0]),
                comY = Number(exArr[1]);
            if (currPos[0] === comX && currPos[1] === comY) {
                gameOver = true;
                sound.playBoomSfx();
                this.addStop(currPos);
                showEndScore(1);
                break;
            }
            counter++;
        }
        if (this.snakeSize >= 390) {
            gameOver = true;
            showEndScore(2);
        }
    }

    addStop(pos) {
        const parentE = getObj("board");
        let stop = document.createElement("div");
        stop.id = "stop";
        stop.className = "stop";
        parentE.appendChild(stop);
        Snake.setElemToPos("stop", [pos[0], pos[1]]);
    }
}

class Apples extends Entity {
    constructor() {
        super();
    }

    genApple() {
        let min = 1,
            max = 20,
            genX = Math.floor(Math.random() * (max - min + 1)) + min,
            genY = Math.floor(Math.random() * (max - min + 1)) + min,
            strGen = genX + "x" + genY;
    
        for (let a in snake.histTurnArr) {//NOT ALLOW PLACING APPLE ON SNAKE CELL
            if (strGen === snake.histTurnArr[a]) {
                return ;//this.genApple();
            }
        }
        for (let j in apples.positionsArr) {//NOT ALLOW PLACING APPLE ON OCCUPIED CELL
            let tempDiv = apples.positionsArr[j],
                slicedArr = tempDiv.split("x"),
                strGen2 = slicedArr[1] + "x" + slicedArr[2];
            if (strGen2 === strGen) {
                return ;//this.genApple();
            }
        }
        if (apples.positionsArr.length < 5 && snake.snakeSize < 390) {//NOT ALLOW MORE THAN 5 APPLES ON BOARD
            const parentE = getObj("board");//APPLE PLACER START HERE
            let newApple = document.createElement("div");
            newApple.className = "apple";
            newApple.id = Apples.emptyIdFinder();
            parentE.appendChild(newApple);
            Snake.setElemToPos(newApple.id, [genX, genY]);
            apples.positionsArr.push(newApple.id + "x" + strGen);
        }
    }

    appleDetect() {//DETECTOR AND REMOVER APPLE
        let snPos;
        for (let a in snake.positionsArr) {// snakeZ.positionsArr
            snPos = snake.positionsArr[a];
            for (let b in apples.positionsArr) {// this.positionsArr
                let tempCom = apples.positionsArr[b],
                    tempSliceA = tempCom.split("x"),
                    rstStr = tempSliceA[1] + "x" + tempSliceA[2];
                if (rstStr === snPos) {//EATS APPLE FROM BOARD
                    getObj("board").removeChild(getObj(tempSliceA[0]));
                    delete apples.positionsArr[b];
                    apples.positionsArr.sort();
                    apples.positionsArr.pop();
                    sound.playEatSfx();
                    snake.growBody();
                }
            }
        }
    }

    static emptyIdFinder() {//GENERATE UNIQE ID NAME FOR APPLE
        if (apples.positionsArr.length === 0) {
            return "a1";
        }
        let tempAR = [];
        for (let a in apples.positionsArr) {
            let tempCom = apples.positionsArr[a],
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
}



/* "WE" - west-east, "EW" - east-west, "NS" - north-south, "SN" - south-north, "WN" - west-north, "NW" - north-west,
"NE" - north-east, "EN" - east-north, "ES" - east-south, "SE" - south-east, "SW" - south-west, "WS" - west-south.

["sH" - snake small horizontal,"sV" - snake small vertical,
"stW" - snake tail west, "stE" - snake tail east, "stN" - snake tail north, "stS" - snake tail south,
"sbH" - snake body horizontal, "sbV" - snake body vertical,
"scWN" - snake body corner west-north, "scNE" - snake body corner north-east, "scES" - snake body corner east-south,
"scSW" - snake body corner south-west]
["array of strings"]

37,38,39,40(left,up,right,down) */