let cellsData = [];
let isFirstClick = true;
let isGamePaused = false;
let isGameOver = false;
let isDisplayClear = false;
let timeElapsed = 0;
let timerId;
const gameConfig = {
  easy: {
    rows: 10,
    cols: 10,
    cellSizeStyle: 50,
    mineCount: 12,
  },
  normal: {
    rows: 16,
    cols: 16,
    cellSizeStyle: 35,
    mineCount: 40,
  },
  hard: {
    rows: 30,
    cols: 16,
    cellSizeStyle: 35,
    mineCount: 99,
  }
};
let gameMode = "easy";

// starts the game, calls create board and call time
function start() {
  selectMode();
}

// chooses game difficulity
function selectMode() {
  gameMode = document.getElementById("difficulty").value;
  boardSizeStyle();
  constructBoard();
}

function boardSizeStyle() {
  const board = document.getElementsByClassName("board")[0];
  const gameHeader = document.getElementsByClassName("game-header")[0];
  const rows = gameConfig[gameMode].rows;
  const cols = gameConfig[gameMode].cols;
  const cellSize = gameConfig[gameMode].cellSizeStyle;

  board.style.width = `${rows * cellSize}px`;
  gameHeader.style.width = `${rows * cellSize}px`;
  board.style.backgroundSize = `${rows * cellSize}px ${cols * cellSize}px`;
}

// pauses game
function pause() {
  if (!isGamePaused) {
    isGamePaused = true;
    document.getElementsByClassName("pause-button")[0].innerHTML = "Resume";
    document.getElementsByClassName("board")[0].style.display = "None";
    stopTime();
  } else {
    document.getElementsByClassName("pause-button")[0].innerHTML = "Pause";
    document.getElementsByClassName("board")[0].style.display = "flex";
    isGamePaused = false;
    startTime();
  }
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

// function to generate background image
function generateBackground() {
  let backgroundImages;
  if (gameMode === "hard") {
    backgroundImages = [
      "url('./assets/hard-background-images/image_01.png')",
      "url('./assets/hard-background-images/image_02.png')",
      "url('./assets/hard-background-images/image_03.png')",
      "url('./assets/hard-background-images/image_04.png')",
      "url('./assets/hard-background-images/image_05.png')",
      "url('./assets/hard-background-images/image_06.png')",
      "url('./assets/hard-background-images/image_07.png')",
      "url('./assets/hard-background-images/image_08.png')",
      "url('./assets/hard-background-images/image_09.png')",
      "url('./assets/hard-background-images/image_10.png')",
      "url('./assets/hard-background-images/image_11.png')",
      "url('./assets/hard-background-images/image_12.png')",
      "url('./assets/hard-background-images/image_13.jpg')",
      "url('./assets/hard-background-images/image_14.png')",
      "url('./assets/hard-background-images/image_15.png')",
      "url('./assets/hard-background-images/image_16.png')",
      "url('./assets/hard-background-images/image_17.jpg')",
      "url('./assets/hard-background-images/image_18.jpg')",
    ];
  } else {
    backgroundImages = [
      "url('./assets/background-images/image_01.png')",
      "url('./assets/background-images/image_02.png')",
      "url('./assets/background-images/image_03.png')",
      "url('./assets/background-images/image_04.png')",
      "url('./assets/background-images/image_05.png')",
      "url('./assets/background-images/image_06.png')",
      "url('./assets/background-images/image_07.png')",
      "url('./assets/background-images/image_08.jpg')",
      "url('./assets/background-images/image_09.jpg')",
      "url('./assets/background-images/image_10.jpg')",
      "url('./assets/background-images/image_11.jpg')",
      "url('./assets/background-images/image_12.jpg')",
      "url('./assets/background-images/image_13.jpg')",
      "url('./assets/background-images/image_14.png')",
      "url('./assets/background-images/image_15.png')",
      "url('./assets/background-images/image_16.png')",
      "url('./assets/background-images/image_17.png')",
      "url('./assets/background-images/image_18.jpg')",
      "url('./assets/background-images/image_19.png')",
      "url('./assets/background-images/image_20.png')",
      "url('./assets/background-images/image_21.png')",
      "url('./assets/background-images/image_22.png')",
      "url('./assets/background-images/image_23.png')",
      "url('./assets/background-images/image_24.png')",
      "url('./assets/background-images/image_25.png')",
      "url('./assets/background-images/image_26.png')",
      "url('./assets/background-images/image_27.png')",
      "url('./assets/background-images/image_28.png')",
      "url('./assets/background-images/gif_01.gif')",
      "url('./assets/background-images/gif_02.gif')",
    ];
  }
  
  const rand = Math.floor(Math.random() * backgroundImages.length);
  const board = document.getElementsByClassName("board")[0];
  board.style.backgroundImage = backgroundImages[rand];
}

//Returns to Main Menu
function goHome() {
  reset();
  document.getElementById("titleScreen").style.display = "flex";
}

//Restarts game
function restart() {
  reset();
  constructBoard();
}

// resets neccessary values
function reset() {
  const board = document.getElementsByClassName("board")[0];
  const gameHeader = document.getElementsByClassName("game-header")[0];
  gameHeader.style.display = "None";
  board.innerHTML = "";
  board.style.display = "flex";
  board.style.cursor = "pointer";
  document.getElementsByClassName("game-timer")[0].innerHTML = "Timer: 0";
  document.getElementsByClassName("pause-button")[0].style.display = "initial";
  document.getElementsByClassName("pause-button")[0].style.visibility = "hidden";
  document.getElementsByClassName("pause-button")[0].innerHTML = "Pause";
  document.getElementsByClassName("restart-button")[0].style.visibility = "hidden";
  document.getElementsByClassName("display-button")[0].style.display = "none";
  cellsData = [];
  isFirstClick = true;
  isGameOver = false;
  isDisplayClear = false;
  isGamePaused = false;
  timeElapsed = 0;
  stopTime();
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
    document.querySelectorAll(".mine").forEach((cell) => {
      cell.style.backgroundColor = "rgba(255,0,0,1)";
    });
  } else {
    alert("Congratulations!\nYou Won!");
    document.querySelectorAll(".flagged").forEach((cell) => {
      cell.classList.remove("flagged");
    });
    document.getElementsByClassName("display-button")[0].style.display = "initial";
    document.getElementsByClassName("flags-left")[0].innerHTML = "Congratulations!";
    displaySwitch();
  }
}

function displaySwitch() {
  if (isDisplayClear) {
    document.querySelectorAll(`.cell-${gameMode}`).forEach((cell) => {
      cell.style.backgroundColor = "rgba(197, 197, 194, 0.8)";
      cell.style.border = "1px solid whitesmoke";
      cell.style.color = "rgba(0,0,0,1)";
      cell.style.textShadow = "1px 1px 2px rgba(255,255,255,1)";
    });
    document.querySelectorAll(".mine").forEach((cell) => {
      cell.style.backgroundColor = "rgba(255,0,0,1)";
    });
    isDisplayClear = false;
  } else {
    document.querySelectorAll(`.cell-${gameMode}`).forEach((cell) => {
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
  document.getElementsByClassName("game-header")[0].style.display = "flex";
  flagCounter();
  const board = document.getElementsByClassName("board")[0];
  generateBackground();
  const rows = gameConfig[gameMode].rows;
  const cols = gameConfig[gameMode].cols;
  for (let i = 0; i < rows * cols; i++) {
    const grid = `
        <span
          id="cell-${i}"
          class="cell-${gameMode}"
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
  const rows = gameConfig[gameMode].rows;
  const cols = gameConfig[gameMode].cols;
  let minesLeft = gameConfig[gameMode].mineCount;
  while (minesLeft > 0) {
    const selectedArr = setSelectedArr(id);
    const rand = Math.floor(Math.random() * (rows * cols));
    if (
      rand !== id &&
      !cellsData[rand].hasMine &&
      selectedArr.every((index) => index + id !== rand)
    ) {
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
  const rows = gameConfig[gameMode].rows;
  const cols = gameConfig[gameMode].cols;

  for (let id = 0; id < rows * cols; id++) {
    const selectedArr = setSelectedArr(id);
    let x = 0;
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
  // left click, and it doesn't have a flag, and game isn't over
  if (mouseEvent.button === 0 && !cellsData[id].hasFlag && !isGameOver) {
    if (cellsData[id].hasMine) {
      gameOver(id);
      return;
    }
    console.log(`cell clicked ${id}`);
    if (isFirstClick) {
      isFirstClick = false;
      document.getElementsByClassName("pause-button")[0].style.visibility = "visible";
      document.getElementsByClassName("restart-button")[0].style.visibility = "visible";
      startTime();
      placeMines(id);
    }
    checkAdjacent(id);
    // right click and game isn't over
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

  document.getElementsByClassName(`cell-${gameMode}`)[id].style.color = "rgba(0,0,0,1)"; // black
  document.getElementsByClassName(`cell-${gameMode}`)[id].style.textShadow =
    "1px 1px 2px rgba(255,255,255,1)"; // white

  winChecker(id);
}

//gameOvers when all non-mine cells are revealed
function winChecker(id) {
  const revealedTileCount = cellsData.filter((cell) => cell.isRevealed).length;
  const mineCount = cellsData.filter((cell) => cell.hasMine).length;

  if (revealedTileCount + mineCount === cellsData.length) {
    gameOver(id);
  }
}

//returns Array based on Edge Conditions
function setSelectedArr(id) {
  const row = gameConfig[gameMode].rows;
  const col = gameConfig[gameMode].cols;
  // const selectedArr = [1, -9, 11, -10, 10, -1, 9, -11];
  const selectedArr = [1, -row + 1, row + 1, -row, row, -1, row - 1, -row - 1];
  const elementsToRemove = [];
  if (id >= row * col - row) {
    elementsToRemove.push(row - 1, row, row + 1);
  }
  if (id < row) {
    elementsToRemove.push(-row + 1, -row, -row - 1);
  }
  if (id % row === 0) {
    elementsToRemove.push(-1, row - 1, -row - 1);
  }
  if ((id + 1) % row === 0) {
    elementsToRemove.push(1, -row + 1, row + 1);
  }

  return selectedArr.filter((number) => !elementsToRemove.includes(number));
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
  const mineCount = cellsData.filter((cell) => cell.hasMine).length;
  const flagCount = cellsData.filter((cell) => cell.hasFlag).length;
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
