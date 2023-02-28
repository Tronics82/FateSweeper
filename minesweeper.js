let cellsData = [];
let isFirstClick = true;
let isGameOver = false;
const adjacentPositionArr = [1, -9, 11, -10, 10, -1, 9, -11];
const adjacentPositionArrEdgeLeft = adjacentPositionArr.slice(0, 5);
const adjacentPositionArrEdgeRight = adjacentPositionArr.slice(3);

// starts the game, calls create board and call time
function start() {
  constructBoard();
}

// creates the board
function constructBoard() {
  document.getElementById("titleScreen").style.display = "none";
  const board = document.getElementsByClassName("board")[0];
  for (let i = 0; i < 100; i++) {
    const grid = `
        <span
          id="cell-${i}"
          class="cell"
          onclick="clickTile(event, ${i})"  
          oncontextmenu="event.preventDefault(); clickTile(event, ${i});">
        </span>
      `;
    board.innerHTML += grid;
    cellsData.push({
      id: i,
      isEdgeLeft: false,
      isEdgeRight: false,
      revealed: false,
      hasMine: false,
      hasNumber: false,
      hasFlag: false,
    });
    checkEdges(i);
  }
}

//check edges
function checkEdges(id) {
  if (id % 10 === 0) {
    cellsData[Number(id)].isEdgeLeft = true;
    //document.getElementById(`cell-${id}`).classList.add("edge");
  } else if ((id + 1) % 10 === 0) {
    cellsData[Number(id)].isEdgeRight = true;
    //document.getElementById(`cell-${id}`).classList.add("edge");
  }
}

// place mines, happens after first reveal
function placeMines() {
  let minesLeft = 15;
  while (minesLeft > 0) {
    const rand = Math.floor(Math.random() * 100);
    if (!cellsData[rand].revealed && !cellsData[rand].hasMine) {
      cellsData[rand].hasMine = true;
      document.getElementById(`cell-${rand}`).classList.add("mine");
      minesLeft--;
    }
  }
  placeNumbers();
}

// chooses game difficulity
function selectMode() {}

// pauses game
function pause() {}

// restart the game if game is over
function restart() {
  document.getElementById("titleScreen").style.display = "flex";
  cellsData = [];
  isFirstClick = true;
  isGameOver = false;
}

// checks if user wins or loses
function gameOver() {
  // getElementsByClassName returns an array, we need 0th index
  const board = document.getElementsByClassName("board")[0];
  board.innerHTML = "";
  alert("Game is over, now what?");
  restart();
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
      isFirstClick = false;
      placeMines();
    }
    checkAdjacent(id);
  } else if (mouseEvent.button === 2) {
    shouldFlag(id);
  }
}

// reveals adjacent tiles and numbers depending on user click
function checkAdjacent(id) {
  if (cellsData[id].hasNumber) {
    return;
  }

  let selectedArr;
  if (cellsData[id].isEdgeLeft) {
    selectedArr = adjacentPositionArrEdgeLeft;
  } else if (cellsData[id].isEdgeRight) {
    selectedArr = adjacentPositionArrEdgeRight;
  } else {
    selectedArr = adjacentPositionArr;
  }

  for (let num of selectedArr) {
    if (id + selectedArr[num] >= 0 && id + selectedArr[num] <= 99) {
      document
        .getElementById(`cell-${id + selectedArr[num]}`)
        .classList.add("cell-clicked");
      cellsData[id + selectedArr[num]].revealed = true;
    }
    checkAdjacent(id + selectedArr[num]);
  }
}

// helper function to checkAdjacent's adjacent tiles
function checkAdjacentHelper(id) {}

//selects Edge Array
function setSelectedArr(cell) {
  let selectedArr;
  if (cell.isEdgeLeft) {
    selectedArr = adjacentPositionArrEdgeLeft;
  } else if (cell.isEdgeRight) {
    selectedArr = adjacentPositionArrEdgeRight;
  } else {
    selectedArr = adjacentPositionArr;
  }
}

// marks the cleared tiles with numbers if there is adjacent mines
function placeNumbers() {
  //needs to check the 8 cells around itself. display num 0-8 based on num of mines.
  //Left: cell id + [1, -9, 11, -10, 10]
  //Right: cell id +[-1, 9, -11, -10, 10]
  //All: cell id +[1, -9, 11, -10, 10, -1, 9, -11]
  //array in array? swap out the 4? .shift and .pop? i just chose slice.
  let x = 0;

  for (let i = 0; i < 100; i++) {
    x = 0;
    if (!cellsData[i].hasMine) {
      if (cellsData[i].isEdgeLeft) {
        for (let num in adjacentPositionArrEdgeLeft) {
          if (
            i + adjacentPositionArrEdgeLeft[num] < 0 ||
            i + adjacentPositionArrEdgeLeft[num] > 99
          ) {
          } else if (cellsData[i + adjacentPositionArrEdgeLeft[num]].hasMine) {
            x++;
          }
        }
      } else if (cellsData[i].isEdgeRight) {
        for (let num in adjacentPositionArrEdgeRight) {
          if (
            i + adjacentPositionArrEdgeRight[num] < 0 ||
            i + adjacentPositionArrEdgeRight[num] > 99
          ) {
          } else if (cellsData[i + adjacentPositionArrEdgeRight[num]].hasMine) {
            x++;
          }
        }
      } else {
        for (let num in adjacentPositionArr) {
          if (
            i + adjacentPositionArr[num] < 0 ||
            i + adjacentPositionArr[num] > 99
          ) {
          } else if (cellsData[i + adjacentPositionArr[num]].hasMine) {
            x++;
          }
        }
      }
      if (x > 0) {
        document.getElementById(`cell-${i}`).innerHTML = x;
        cellsData[i].hasNumber = true;
        document.getElementById(`cell-${i}`).classList.add("numbered");
      }
    }
  }
}

// place a flag on a tile
function shouldFlag(id) {
  const cell = document.getElementById(`cell-${id}`);
  if (cellsData[id].hasFlag) {
    cellsData[id].hasFlag = false;
    cell.classList.remove("flagged");
  } else {
    cellsData[id].hasFlag = true;
    cell.classList.add("flagged");
  }
}

// starts timer
function startTime() {}

// stops timer
function stopTime() {}

// reveals tiles
function revealTile() {}
