let cellsData = [];
let isFirstClick = true;
let isGamePaused = false;
let isGameOver = false;
let isDisplayClear = false;
let timeElapsed = 0;
let timerId;

// starts the game, calls create board and call time
function start() {
  constructBoard();
}

// chooses game difficulity
function selectMode() {}

// pauses game
function pause() {
  if (!isGamePaused) {
    isGamePaused = true;
    document.getElementsByClassName("pause-button")[0].innerHTML = "Resume";
    document.getElementsByClassName("board")[0].style.display = "None";
    clearInterval(timerId);
  } else {
    document.getElementsByClassName("pause-button")[0].innerHTML = "Pause";
    document.getElementsByClassName("board")[0].style.display = "flex";
    isGamePaused = false;
    startTime();
  }
  // stop timer
  // hide board and only show button
}

// starts timer
function startTime() {
  timerId = setInterval(() => {
    timeElapsed++;
    const timer = document.getElementsByClassName("game-timer")[0];
    timer.innerHTML = `Timer: ${timeElapsed}`; 
  }, 1000);
}

// stops timer
function stopTime() {
  clearInterval(timerId);
}

// start/stop/mute music player
function musicPlayer() {}
 
// throw image uris (string path) into an array, generate random number and grab the index of the image uri using the random number
// i.e "../assets/...image"
function generateBackground() {}

// restart the game if game is over
function restart() {
  // getElementsByClassName returns an array, we need 0th index
  const board = document.getElementsByClassName("board")[0];
  const gameHeader = document.getElementsByClassName("game-header")[0];
  gameHeader.style.display = "None";
  board.innerHTML = "";
  document.getElementsByClassName("game-timer")[0].innerHTML = "Timer: 0";
  document.getElementById("titleScreen").style.display = "flex";
  document.getElementsByClassName("pause-button")[0].style.display = "initial";
  document.getElementsByClassName("display-button")[0].style.display = "none";
  cellsData = [];
  isFirstClick = true;
  isGameOver = false;
  isDisplayClear = false;
  timeElapsed = 0;
  stopTime();
  flagCounter();
}

// Determines Win or Loss, Disable onClick, and Hide Pause Button.
function gameOver(id) {
  isGameOver = true;
  stopTime();
  document.getElementsByClassName("pause-button")[0].style.display = "none";
  document.getElementsByClassName("board")[0].style.cursor = "default";

  //On Loss: Reveal Mines, On Win: Reveal Image and add Switch Display Button.
  if (cellsData[id].hasMine) {
    alert("BOOM!\nGame Over");
    document.querySelectorAll(".mine").forEach(cell => {
      cell.style.backgroundColor = "rgba(255,0,0,1)";
    });
  } else {
    alert("Congratulations!\nYou Won!");
    document.querySelectorAll(".flagged").forEach(cell => {
      cell.classList.remove("flagged");
    });
    document.getElementsByClassName("display-button")[0].style.display = "initial";
    displaySwitch();
  }
}

function displaySwitch() {
  if (isDisplayClear) {
    document.querySelectorAll(".cell").forEach(cell => {
      cell.style.backgroundColor = "rgba(197, 197, 194, 0.8)";
      cell.style.border = "1px solid whitesmoke";
      cell.style.color = "rgba(0,0,0,1)";
      cell.style.textShadow = "1px 1px 2px rgba(255,255,255,1)";
    });
    document.querySelectorAll(".mine").forEach(cell => {
      cell.style.backgroundColor = "rgba(255,0,0,1)";
    });
    isDisplayClear = false;
  } else {
    document.querySelectorAll(".cell").forEach(cell => {
      cell.style.backgroundColor = "rgba(0,0,0,0)";
      cell.style.border = "none";
      cell.style.color = "rgba(0,0,0,0)";
      cell.style.textShadow = "1px 1px 2px rgba(0,0,0,0)";
    });
    isDisplayClear = true;
  } 
}

// creates the board
function constructBoard() {
  document.getElementById("titleScreen").style.display = "none";
  const game = document.getElementsByClassName("game-header")[0];
  game.style.display = "flex";
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
      isRevealed: false,
      hasMine: false,
      hasNumber: false,
      hasFlag: false,
    });
  }
}

// place mines, happens after first reveal
function placeMines(id) {
  let minesLeft = 20;
  while (minesLeft > 0) {
    const selectedArr = setSelectedArr(id);
    const rand = Math.floor(Math.random() * 100);
    if (rand !== id && !cellsData[rand].hasMine &&rand!==id+selectedArr[0]&&rand!==id+selectedArr[1]&&rand!==id+selectedArr[2]&&rand!==id+selectedArr[3]&&rand!==id+selectedArr[4]&&rand!==id+selectedArr[5]&&rand!==id+selectedArr[6]&&rand!==id+selectedArr[7]) {
      cellsData[rand].hasMine = true;
      document.getElementById(`cell-${rand}`).classList.add("mine");
      minesLeft--;
    }
  }
  flagCounter();
  placeNumbers();
}

// marks the cleared tiles with numbers if there is adjacent mines
function placeNumbers() {
  //needs to check the 8 cells around itself. display num 0-8 based on num of mines.
  let x = 0;
  
  for (let id = 0; id < 100; id++) {
    const selectedArr = setSelectedArr(id);
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
      }
    }
  }
}

// reveals the tile that the user clicked
function clickTile(mouseEvent, id) {
  // click a tile by adding onclick to the cell, capture click event and use the event to determine if mouse was right or left clicked
  // replace or mark the cell as clicked
  // then mark the cell programmatically as hasBeenClicked
  // if it's first clicked tile, place mines
  // check adjacent and place numbers
  const cell = document.getElementById(`cell-${id}`);
  if (mouseEvent.button === 0 && !cellsData[id].hasFlag && !isGameOver) {
    if (cellsData[id].hasMine) {
      gameOver(id);
      return;
    }
    console.log(`cell clicked ${id}`);   
    if (isFirstClick) {
      isFirstClick = false;
      startTime();
      placeMines(id);
    }
    checkAdjacent(id);
  } else if (mouseEvent.button === 2 && !isGameOver) {
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
  
  const selectedArr = setSelectedArr(id);

  for (let index of selectedArr) {
    //console.log(index);
    checkAdjacent(id + index);  
  }
}

// reveals cells and removes flags
function revealCell(id) {
  const cell = document.getElementById(`cell-${id}`);
  
  cell.classList.add("cell-clicked");
  cellsData[id].isRevealed = true;
  cell.classList.remove("flagged");
  cellsData[id].hasFlag = false;
  flagCounter();

  //if (cellsData[id].hasNumber) {
    document.getElementsByClassName("cell")[id].style.color = "rgba(0,0,0,1)";
    document.getElementsByClassName("cell")[id].style.textShadow = "1px 1px 2px rgba(255,255,255,1)";
  //}
  
  winChecker(id);
}

//gameOvers when all non-mine cells are revealed
function winChecker(id) {
  const revealedTileCount = cellsData.filter(cell => cell.isRevealed).length;
  const mineCount = cellsData.filter(cell => cell.hasMine).length;

  if (revealedTileCount + mineCount === cellsData.length) {
    gameOver(id);
  }
}

//returns Array based on Edge Conditions
function setSelectedArr(id) {
  const selectedArr = [1, -9, 11, -10, 10, -1, 9, -11];
  const elementsToRemove = [];
  if (id >= 90) {
    elementsToRemove.push(9, 10, 11);
  } if (id < 10) {
    elementsToRemove.push(-9, -10, -11);
  } if (id % 10 === 0) {
    elementsToRemove.push(-1, 9, -11);
  } if ((id + 1) % 10 === 0) {
    elementsToRemove.push(1, -9, 11);
  }

  return selectedArr.filter(number => !elementsToRemove.includes(number));
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
    flagCounter();
  }
}

// Displays the number of flags left. Display turns red when below zero.
function flagCounter() {
  let flagsLeft = document.getElementsByClassName("flags-left")[0];
  const mineCount = cellsData.filter(cell => cell.hasMine).length;
  const flagCount = cellsData.filter(cell => cell.hasFlag).length;
  if (mineCount <= 0) {
    flagsLeft.innerHTML = "Flags: ";
    flagsLeft.style.color = "black";
  } else {
    flagsLeft.innerHTML = `Flags: ${mineCount - flagCount}`;
    if (mineCount - flagCount < 0) {
      flagsLeft.style.color = "red";
    } else {
      flagsLeft.style.color = "black";
    }
  }
}