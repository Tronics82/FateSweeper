let cellsData = [];
let isFirstClick = true;
let isGameOver = false;

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
      const id = i.toString() + j.toString();
      const grid = `
        <span
          onmousedown="clickTile(event, ${Number(id)})" 
          id="cell-${id}" 
          oncontextmenu="return false;"
          class="cell">
        </span>
      `;
      board.innerHTML += grid;
      cellsData.push({
        id: i.toString() + j.toString(),
        revealed: false,
        hasMine: false,
        hasFlag: false,
      });
    }
  }
}

// place mines, happens after first reveal
function placeMines() {
  let minesLeft = 20;
  while (minesLeft > 0) {
    const rand = Math.floor(Math.random() * 100);
    let stringID = rand;
    // to account for digits less than 10 as they have 0 in their ID
    if (rand < 10) {
      stringID = "0" + rand;
    }
    if (!cellsData[rand].revealed && !cellsData[rand].hasMine) {
      cellsData[rand].hasMine = true;
      document.getElementById(`cell-${stringID}`).classList.add("mine");
      minesLeft--;
    }
  }
}

// chooses game difficulity
function selectMode() {}

// pauses game
function pause() {}

// restart the game if game is over
function restart() {}

// checks if user wins or loses
function gameOver() {
  const board = document.getElementsByClassName("board")[0];
  board.innerHTML = "";
  alert("Game is over, now what?");
}

// reveals the tile that the user clicked
function clickTile(mouseEvent, id) {
  // click a tile by adding onclick to the cell, capture click event and use the event to determine if mouse was right or left clicked
  // replace or mark the cell as clicked
  // then mark the cell programmatically as hasBeenClicked
  // if it's first clicked tile, place mines
  // check adjacent and place numbers
  const cell = document.getElementById(`cell-${id}`);
  if (mouseEvent.button === 0 && !cellsData[id].hasFlag) {
    if (cellsData[id].hasMine) {
      isGameOver = true;
      gameOver();
      return;
    }
    cell.classList.add("cell-clicked");
    cellsData[id].revealed = true;
    if (isFirstClick) {
      placeMines();
      isFirstClick = false;
    }
  } else if (mouseEvent.button === 2) {
    console.log(cellsData[id].hasFlag);
    if (cellsData[id].hasFlag) {
      cellsData[id].hasFlag = false;
      cell.classList.remove("flagged");
    } else {
      cellsData[id].hasFlag = true;
      cell.classList.add("flagged");
    }
  }
}

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
