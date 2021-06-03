"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector("#grid");
    const startBtn = document.querySelector("#startBtn");
    const restartBtn = document.querySelector("#restartBtn");
    const scoreElement = document.querySelector(".score");
    const miniGrid = document.querySelector(".nextTetromino");
    const themeMusic = document.querySelector(".themeMusic");
    const clearBlockAudio = document.querySelector(".clearBlock");
    const gameOverAudio = document.querySelector(".gameOverAudio");
    let score = 0;
    function generateGrid() {
        for (let i = 0; i < 210; i++) {
            const divElement = document.createElement("div");
            if (i >= 200) {
                divElement.classList.add("taken");
            }
            grid?.appendChild(divElement);
        }
    }
    function generateMiniGrid() {
        for (let i = 0; i < 25; i++) {
            const divElement = document.createElement("div");
            miniGrid?.appendChild(divElement);
        }
    }
    generateGrid();
    generateMiniGrid();
    const squareWidth = 10;
    const lTeromino = [
        [1, squareWidth + 1, squareWidth * 2 + 1, 2],
        [squareWidth, squareWidth + 1, squareWidth + 2, squareWidth * 2 + 2],
        [1, squareWidth + 1, squareWidth * 2 + 1, squareWidth * 2],
        [
            squareWidth * 2,
            squareWidth + 2,
            squareWidth * 2 + 1,
            squareWidth * 2 + 2,
        ],
    ];
    const zTetromino = [
        [0, squareWidth, squareWidth + 1, squareWidth * 2 + 1],
        [
            squareWidth + 1,
            squareWidth + 2,
            squareWidth * 2,
            squareWidth * 2 + 1,
        ],
        [0, squareWidth, squareWidth + 1, squareWidth * 2 + 1],
        [
            squareWidth + 1,
            squareWidth + 2,
            squareWidth * 2,
            squareWidth * 2 + 1,
        ],
    ];
    const tTetromino = [
        [1, squareWidth, squareWidth + 1, squareWidth + 2],
        [1, squareWidth + 1, squareWidth + 2, squareWidth * 2 + 1],
        [squareWidth, squareWidth + 1, squareWidth + 2, squareWidth * 2 + 1],
        [1, squareWidth, squareWidth + 1, squareWidth * 2 + 1],
    ];
    const oTetromino = [
        [0, 1, squareWidth, squareWidth + 1],
        [0, 1, squareWidth, squareWidth + 1],
        [0, 1, squareWidth, squareWidth + 1],
        [0, 1, squareWidth, squareWidth + 1],
    ];
    const iTetromino = [
        [1, squareWidth + 1, squareWidth * 2 + 1, squareWidth * 3 + 1],
        [squareWidth, squareWidth + 1, squareWidth + 2, squareWidth + 3],
        [1, squareWidth + 1, squareWidth * 2 + 1, squareWidth * 3 + 1],
        [squareWidth, squareWidth + 1, squareWidth + 2, squareWidth + 3],
    ];
    const TetrominoShapes = [
        lTeromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino,
    ];
    // green -> purple -> yellow -> blue -> red
    const colors = [
        "hsl(126, 55%, 37%)",
        "hsl(276, 91%, 38%)",
        "hsl(60, 92%, 55%)",
        "hsl(229, 83%, 55%)",
        "hsl(345, 100%, 55%)",
    ];
    let currentPosition = 3;
    let rotateTetromino = 0;
    let randomTetromino = Math.floor(Math.random() * TetrominoShapes.length);
    let nextRandom = Math.floor(Math.random() * TetrominoShapes.length);
    let currentTetromino = TetrominoShapes[randomTetromino][rotateTetromino];
    let timeSet;
    const gridSquares = document.querySelectorAll("#grid div");
    function controls(e) {
        if (e.keyCode === 40) {
            moveDown();
        }
        else if (e.keyCode === 39) {
            // console.log("right");
            moveRight();
        }
        else if (e.keyCode === 38) {
            // console.log("up");
            rotate();
        }
        else if (e.keyCode === 37) {
            // console.log("left");
            moveLeft();
        }
        else if (e.keyCode === 32) {
            // moveFaster();
            // console.log("space");
        }
    }
    document.addEventListener("keyup", controls);
    function drawTetromino() {
        currentTetromino.forEach((index) => {
            gridSquares[index + currentPosition].classList.add("tetromino");
            gridSquares[index + currentPosition].style.backgroundColor =
                colors[randomTetromino];
        });
    }
    drawTetromino();
    function undrawTetromino() {
        currentTetromino.forEach((index) => {
            gridSquares[index + currentPosition].classList.remove("tetromino");
            gridSquares[index + currentPosition].style.backgroundColor = "";
        });
    }
    function moveDown() {
        undrawTetromino();
        currentPosition += squareWidth;
        drawTetromino();
        freezeTetromino();
    }
    function moveRight() {
        undrawTetromino();
        const isAtRightEdge = currentTetromino.some((index) => {
            return (index + currentPosition) % squareWidth == squareWidth - 1;
        });
        const isTaken = currentTetromino.some((index) => {
            return gridSquares[currentPosition + 1 + index + squareWidth].classList.contains("taken");
        });
        if (!isAtRightEdge && !isTaken)
            currentPosition += 1;
        clearInterval(timeSet);
        timeSet = setInterval(() => moveDown(), 800);
        drawTetromino();
    }
    function moveFaster() {
        clearInterval(timeSet);
        timeSet = setInterval(() => moveDown(), 100);
    }
    function moveLeft() {
        undrawTetromino();
        const isAtLeftEdge = currentTetromino.some((index) => (currentPosition + index) % squareWidth === 0);
        const isTaken = currentTetromino.some((index) => {
            return gridSquares[currentPosition - 1 + index + squareWidth].classList.contains("taken");
        });
        if (!isAtLeftEdge && !isTaken)
            currentPosition -= 1;
        drawTetromino();
    }
    function rotate() {
        rotateTetromino += 1;
        if (rotateTetromino === 4) {
            rotateTetromino = 0;
        }
        const nextRotatePosition = TetrominoShapes[randomTetromino][rotateTetromino];
        const isAtLeftEdge = nextRotatePosition.some((index) => {
            return (currentPosition + index) % squareWidth === 0;
        });
        let tetrominoPos = currentPosition;
        const isAtRightEdge = currentTetromino.some((index) => {
            tetrominoPos = (index + currentPosition) % squareWidth;
            return tetrominoPos % squareWidth === squareWidth - 1;
        });
        if (tetrominoPos <= 3) {
            if (!isAtLeftEdge) {
                undrawTetromino();
                currentTetromino =
                    TetrominoShapes[randomTetromino][rotateTetromino];
                drawTetromino();
            }
        }
        else if (tetrominoPos >= 4) {
            if (!isAtRightEdge) {
                undrawTetromino();
                currentTetromino =
                    TetrominoShapes[randomTetromino][rotateTetromino];
                drawTetromino();
            }
        }
    }
    function freezeTetromino() {
        currentTetromino.forEach((index) => {
            const nextRow = index + currentPosition + squareWidth;
            const row = index + currentPosition;
            const isNextRowTaken = gridSquares[row].classList.contains("taken");
            if (isNextRowTaken) {
                return GenerateNextTetromino();
            }
            const isNextRowTetrominoAndTaken = ["taken", "tetromino"].every((className) => {
                return gridSquares[nextRow].classList.contains(className);
            });
            if (isNextRowTetrominoAndTaken) {
                return GenerateNextTetromino();
            }
            function GenerateNextTetromino() {
                currentTetromino.forEach((index) => {
                    gridSquares[index + currentPosition].classList.add("taken");
                });
                score += 10;
                scoreElement.textContent = `${score}`;
                gameOver(currentPosition);
                currentPosition = 3;
                randomTetromino = nextRandom;
                nextRandom = Math.floor(Math.random() * TetrominoShapes.length);
                currentTetromino = TetrominoShapes[randomTetromino][0];
                findCompleteRow();
                drawTetromino();
                miniGridTetromino();
            }
        });
    }
    const miniGridSquares = document.querySelectorAll(".minigrid div");
    const displayWidth = 5;
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    ];
    function miniGridTetromino() {
        miniGridSquares.forEach((square) => {
            square.classList.remove("tetromino");
            square.style.backgroundColor = "";
        });
        const miniGridStartPos = currentPosition - 1;
        upNextTetrominoes[nextRandom].forEach((index) => {
            const tetrominoPos = displayWidth + index + miniGridStartPos;
            miniGridSquares[tetrominoPos].classList.add("tetromino");
            miniGridSquares[tetrominoPos].style.backgroundColor =
                colors[nextRandom];
        });
    }
    miniGridTetromino();
    let gridlength = gridSquares.length;
    let numOfTetrominoBlock = 0;
    let cacheBlockPosition = {};
    let startRow = 0;
    let endRow = 0;
    function findCompleteRow() {
        for (let index = gridSquares.length - 1; index >= 0; index--) {
            const hasTetromino = gridSquares[index].classList.contains("tetromino");
            if (hasTetromino) {
                numOfTetrominoBlock += 1;
                if (numOfTetrominoBlock === 1) {
                    endRow = index;
                }
            }
            if (gridlength - 10 === index) {
                // we are starting from the end of the grid
                // so we use the end of row as the start
                startRow = index;
                if (numOfTetrominoBlock === 10) {
                    removeBlocks(startRow, endRow);
                    numOfTetrominoBlock = 0;
                    // return findCompleteRow();
                    endRow = 0;
                    startRow = 0;
                    gridlength = gridSquares.length;
                    return findCompleteRow();
                }
                // if row is has no tetromino  break the loop
                if (numOfTetrominoBlock == 0) {
                    gridlength = gridSquares.length;
                    break;
                }
                gridlength = index;
                numOfTetrominoBlock = 0;
            }
        }
    }
    function removeBlocks(startRow, endRow) {
        console.log(startRow, endRow);
        for (let index = startRow; index <= endRow; index++) {
            if (startRow < 200) {
                gridSquares[index].classList.remove("taken");
            }
            gridSquares[index].classList.remove("tetromino");
            gridSquares[index].style.backgroundColor = "";
        }
        undrawAllTetromino();
        drawAllTetromino();
        score += 100;
        scoreElement.textContent = `${score}`;
    }
    function undrawAllTetromino() {
        for (let index = gridlength - 1; index >= 0; index--) {
            const hasTetromino = gridSquares[index].classList.contains("tetromino");
            if (index < 200 && hasTetromino) {
                cacheBlockPosition[index] =
                    gridSquares[index].style.backgroundColor;
                gridSquares[index].classList.remove("tetromino");
                gridSquares[index].classList.remove("taken");
                gridSquares[index].style.backgroundColor = "";
            }
        }
        clearBlockAudio.play();
    }
    function drawAllTetromino() {
        let pos;
        for (pos in cacheBlockPosition) {
            const nextPos = parseInt(pos) + squareWidth;
            gridSquares[nextPos].classList.add("tetromino");
            gridSquares[nextPos].classList.add("taken");
            gridSquares[nextPos].style.backgroundColor =
                cacheBlockPosition[pos];
        }
        cacheBlockPosition = {};
    }
    function gameOver(currentPosition) {
        if (currentPosition <= 30) {
            themeMusic.pause();
            gameOverAudio.play();
            clearInterval(timeSet);
        }
    }
    startBtn.addEventListener("click", () => {
        if (timeSet == undefined) {
            themeMusic.play();
            timeSet = setInterval(() => moveDown(), 800);
        }
        else {
            themeMusic.pause();
            clearInterval(timeSet);
            timeSet = undefined;
        }
    });
    restartBtn.addEventListener("click", () => {
        score = 0;
        scoreElement.textContent = `${score}`;
        currentPosition = 4;
        randomTetromino = Math.floor(Math.random() * TetrominoShapes.length);
        currentTetromino = TetrominoShapes[randomTetromino][0];
        gridSquares.forEach((block, index) => {
            if (index < 200) {
                block.classList.remove("tetromino");
                block.classList.remove("taken");
            }
            else {
                block.classList.remove("tetromino");
            }
            block.style.backgroundColor = "";
        });
        startBtn.click();
        startBtn.click();
    });
});
// issues
// needs work on rotation of tetromino at edge @
// some of the tetromino that should rotate at the edge wont rotate @
// updates
// tetromino moves faster when sapce bar is click  ###
// see the next current tetromino position on grid ##
// save high score to local storage ####
//#########################
//   COMPLETED TODOLIST
//#########################
// when multiple row are complete only one is remove until the next round #####
// when row complete some block still left with taken #####
// add mini map functionality  ###
//# sourceMappingURL=app.js.map