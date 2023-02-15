// starts the game, calls create board and call time
function start() {
    constructBoard();
}

// creates the board
function constructBoard() {
    document.getElementById("titleScreen").style.display = "none";
    const board = document.getElementsByClassName("board")[0];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const grid = `<span class="cell"></span>`;
            board.innerHTML += grid;
        }
        //board.innerHTML += `<br />`;
    }
}

// place mines, happens after first reveal
function placeMines() {}

// chooses game difficulity
function selectMode() {}

// pauses game
function pause() {}

// restart the game if game is over
function restart() {}

// checks if user wins or loses
function gameOver() {}

// reveals the tile that the user clicked
function clickTile() {}

// reveals adjacent tiles and numbers depending on user click
function checkAdjacent() {}

// helper function to check adjacent tiles
function checkAdjacentHelper() {}

// marks the cleared tiles with numbers if there is adjacent mines
function placeNumber() {}

// place a flag on a tile
function flag() {}

// starts timer
function startTime() {}

// stops timer
function stopTime() {}

// reveals tiles
function revealTile() {}
