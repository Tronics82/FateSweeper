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
      isEdgeTop: false,
      isEdgeBottom: false,
      isRevealed: false,
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
    cellsData[id].isEdgeLeft = true;
    //document.getElementById(`cell-${id}`).classList.add("edge");
  } else if ((id + 1) % 10 === 0) {
    cellsData[id].isEdgeRight = true;
    //document.getElementById(`cell-${id}`).classList.add("edge");
  }
  if (id < 10) {
    cellsData[id].isEdgeTop = true;
    //document.getElementById(`cell-${id}`).classList.add("edge");
  } else if (id >= 90) {
    cellsData[id].isEdgeBottom = true;
    //document.getElementById(`cell-${id}`).classList.add("edge");
  }
}

// place mines, happens after first reveal
function placeMines(id) {
  let minesLeft = 20;
  while (minesLeft > 0) {
    const rand = Math.floor(Math.random() * 100);
    if (rand != id && !cellsData[rand].hasMine) {
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
  // getElementsByClassName returns an array, we need 0th index
  const board = document.getElementsByClassName("board")[0];
  board.innerHTML = "";
  document.getElementById("titleScreen").style.display = "flex";
  cellsData = [];
  isFirstClick = true;
  isGameOver = false;
}

// checks if user wins or loses
function gameOver(id) {
  if (cellsData[id].hasMine) {
    alert("BOOM!\nGame Over");
  } else {
    alert("Congratulations!\nYou Won!");
  }
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
      gameOver(id);
      return;
    }
    console.log(`cell clicked ${id}`);   
    if (isFirstClick) {
      isFirstClick = false;
      placeMines(id);
    }
    checkAdjacent(id);
  } else if (mouseEvent.button === 2) {
    shouldFlag(id);
  }
}

// reveals adjacent tiles and numbers depending on user click
function checkAdjacent(id) { 
  if (cellsData[id].hasNumber) {
    revealCell(id);
    return;
  }

  if (cellsData[id].isRevealed) {
    return;
  }

  revealCell(id);
  
  const selectedArr = setSelectedArr(cellsData[id]);

  for (let index of selectedArr) {
    //console.log(index);
    checkAdjacent(id + index);  
  }
}

// helper function to checkAdjacent's adjacent tiles
function revealCell(id) {
  const cell = document.getElementById(`cell-${id}`);

  cell.classList.add("cell-clicked");
  cellsData[id].isRevealed = true;
  cell.classList.remove("flagged");
  cellsData[id].hasFlag = false;
}

//selects Edge Array
// takes current index, id
  // check each adjacent square by adding the indexes to the current id
  // ie id = 5, 5 + 1, 5 - 1, 5 + 10, ... 5 + 11
  // for each iteration of that adjacentPositionsArr, push that index into the new array if it passes,
  // return it
function setSelectedArr(cell) {
  
  if (!cell.isEdgeLeft && !cell.isEdgeRight && !cell.isEdgeTop && !cell.isEdgeBottom) {
    return [1, -9, 11, -10, 10, -1, 9, -11]
  } else if (cell.isEdgeLeft && cell.isEdgeTop) {
    return [1, 11, 10];
  } else if (cell.isEdgeLeft && cell.isEdgeBottom) {
    return [1, -9, -10];
  } else if (cell.isEdgeRight && cell.isEdgeTop) {
    return [-1, 9, 10];
  } else if (cell.isEdgeRight && cell.isEdgeBottom) {
    return [-1, -10, -11];
  } else if (cell.isEdgeLeft) {
    return [1, -9, 11, -10, 10];
  } else if (cell.isEdgeRight) {
    return [-1, 9, -11, -10, 10];
  } else if (cell.isEdgeTop) {
    return [1, -1, 9, 11, 10];
  } else if (cell.isEdgeBottom) {
    return [1, -1, -9, -11, -10]
  }
}

// marks the cleared tiles with numbers if there is adjacent mines
function placeNumbers() {
  //needs to check the 8 cells around itself. display num 0-8 based on num of mines.
  let x = 0;
  
  for (let id = 0; id < 100; id++) {
    const selectedArr = setSelectedArr(cellsData[id]);
    x = 0;
    if (!cellsData[id].hasMine) { 
      for (let index of selectedArr) {
        if (cellsData[id + index].hasMine) {
          x++;
        }
      }
      if (x > 0) {
        document.getElementById(`cell-${id}`).innerHTML = x;
        cellsData[id].hasNumber = true;
        document.getElementById(`cell-${id}`).classList.add("numbered");
      }
    }
  }
}

// place a flag on a tile
function shouldFlag(id) {
  const cell = document.getElementById(`cell-${id}`);
  if (!cellsData[id].isRevealed) {
    if (cellsData[id].hasFlag) {
      cellsData[id].hasFlag = false;
      cell.classList.remove("flagged");
    } else {
      cellsData[id].hasFlag = true;
      cell.classList.add("flagged");
    }
  }
}

// starts timer
function startTime() {}

// stops timer
function stopTime() {}

// reveals tiles
function revealTile() {}
