function collectShips() {
  let classes = ["shortest", "short", "short2", "long", "longest"];
  let ships = [];
  for (let shipClass of classes) {
    let shipDiv = document.querySelector("." + shipClass);
    let length = parseInt(shipDiv.getAttribute("length"));
    ships.push({
      name: shipClass,
      ship: shipDiv,
      length: length,
      takenIds: [],
      deployed: false,
    });
  }
  return ships;
}

document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector(".your-ships");
  const displayGrid = document.querySelector(".deploy-ships");
  const ships = document.querySelectorAll(".ship");
  const userGameGrid = document.querySelector(".grid-user");
  const computerGameGrid = document.querySelector(".grid-computer");
  const rotateButton = document.querySelector("#rotate");
  const startButton = document.querySelector("#start");
  const whoseGo = document.querySelector("#whose-go");
  const width = 10;
  const fieldWidth = 40;
  let vertical = false;
  const userFields = [];
  const userGameFields = [];
  const computerGameFields = [];

  let shipsList = collectShips();

  const range = (start, end, step) => {
    if (start >= end) return [start];
    return [start, ...range(start + step, end, step)];
  };

  const rotateShips = () => {
    function rotateSingleShip(ship) {
      ship.ship.classList.toggle(ship.name + "-ver");
      ship.ship.classList.toggle(ship.name);
      vertical = !vertical;
    }

    for (let ship of shipsList) {
      rotateSingleShip(ship);
    }
  };
  rotateButton.addEventListener("click", rotateShips);

  const createBoard = (grid, fields) => {
    for (let i = 0; i < width * width; i++) {
      const field = document.createElement("div");
      field.id = i;
      grid.appendChild(field);
      fields.push(field);
    }
  };

  const neighDistance = (id1, id2) => {
    let x1 = Math.floor(id1 / width);
    let y1 = id1 % width;
    let x2 = Math.floor(id2 / width);
    let y2 = id2 % width;
    console.log("X");
    if (Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1) {
      return true;
    }
    return false;
  };
  const shipsCollide = (shipOne, shipTwo) => {
    for (let i = 0; i < shipOne.takenIds.length; i++) {
      for (let j = 0; j < shipTwo.takenIds.length; j++) {
        if (neighDistance(shipOne.takenIds[i], shipTwo.takenIds[j])) {
          return true;
        }
      }
    }
    return false;
  };

  const dragAllowed = (shipBeginId, shipLastId) => {
    if (shipBeginId < 0 || shipLastId > 99) {
      return false;
    }
    if (
      !vertical &&
      Math.floor(shipBeginId / 10) != Math.floor(shipLastId / 10)
    ) {
      return false;
    }
    let result = true;
    shipsList.forEach((ship) => {
      if (ship.deployed && shipsCollide(ship, draggedShipInList)) {
        result = false;
      }
    });
    return result;
  };

  const dragShip = (shipBeginId, shipLastId) => {
    if (!dragAllowed(shipBeginId, shipLastId)) {
      return;
    } else {
      draggedShipInList.deployed = true;
      let step = vertical ? 10 : 1;
      for (let i = 0; i < shipLength; i++) {
        userFields[parseInt(shipBeginId) + i * step].classList.add(
          "taken",
          draggedShipInList.name
        );
      }
      displayGrid.removeChild(draggedShip);
      if (!displayGrid.querySelector(".ship")) {
        startButton.disabled = false;
      }
    }
  };

  const dragStart = (e) => {
    draggedShip = e.target;
    shipName = draggedShip.className.slice(5);
    draggedShipInList = shipsList.filter(
      (ship) => ship.name == shipName || ship.name + "-ver" == shipName
    )[0];
    offset =
      shipName.slice(-3) == "ver"
        ? Math.floor(e.offsetY / fieldWidth)
        : Math.floor(e.offsetX / fieldWidth);
    shipLength = draggedShip.children.length;
  };

  const computeEdges = (e) => {
    if (shipName.slice(-3) == "ver") {
      shipLastId =
        width * (shipLength - 1) + parseInt(e.target.id) - width * offset;
      shipBeginId = parseInt(e.target.id) - width * offset;
    } else {
      shipBeginId = parseInt(e.target.id) - offset;
      shipLastId = shipLength - 1 + parseInt(e.target.id) - offset;
    }
    return [shipBeginId, shipLastId];
  };

  const dragDrop = (e) => {
    dragShip(...computeEdges(e));
    userGrid.childNodes.forEach((node) => {
      if (node.className == "" || node.className == "available") {
        node.removeAttribute("class");
      }
    });
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    [shipBeginId, shipLastId] = computeEdges(e);
    step = vertical ? 10 : 1;
    draggedShipInList.takenIds = range(shipBeginId, shipLastId, step);
    userGrid.childNodes.forEach((node) => {
      if (node.className == "" || node.className == "available") {
        node.removeAttribute("class");
      }
    });
    for (let i = 0; i < shipLength; i++) {
      let step = vertical ? 10 : 1;
      let index = shipBeginId + step * i;
      let node = userGrid.childNodes[index];
      if (node && node.className == "") {
        if (dragAllowed(shipBeginId, shipLastId)) {
          node.setAttribute("class", "available");
        }
      }
    }
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const dragEnd = (e) => {
    e.preventDefault();
  };

  const collectSetup = () => {
    let board = [];
    for (let row = 0; row < width; row++) {
      board.push([]);
      for (let col = 0; col < width; col++) {
        let target = userGrid.childNodes.item(`${row * 10 + col}`);
        let shipName = target.className.split(" ").pop();
        if (shipName != "") {
          let tile = { shipName, hit: false };
          board[row].push(tile);
        } else {
          board[row].push(null);
        }
      }
    }
    return board;
  };

  let myMove = false;
  let expectingSetup = false;
  let draggedShip;
  let draggedShipInList;
  let shipLength;
  let shipLastId;
  let shipBeginId;
  let offset;
  let shipName;

  let enemyBoard = document.getElementById("gamecontainer");

  createBoard(userGrid, userFields);

  const sendSetup = () => {
    if (expectingSetup) {
      socket.emit("setupDone", collectSetup());
      startButton.style.display = "none";
    }
  };

  socket.on("expectingSetup", () => {
    expectingSetup = true;
  });

  socket.on("waitForOtherPlayer", () => {
    whoseGo.innerHTML = "Waiting for the other player";
  });

  socket.on("bothPlayersReady", () => {
    const shootEnemy = (e) => {
      if (!myMove) {
        window.alert(
          "You can't make a move at this moment. It's your opponent's turn."
        );
        return;
      }

      myMove = false;
      let id = e.target.id;
      let row = Math.floor(id / 10);
      let col = id % 10;

      whoseGo.innerHTML = "Opponent's turn";
      socket.emit("shot", { row, col });
    };

    whoseGo.innerHTML = "Opponent's turn";
    window.alert("Your opponent is ready");
    enemyBoard.style.display = "flex";
    createBoard(computerGameGrid, computerGameFields);
    computerGameFields.forEach((field) =>
      field.addEventListener("click", shootEnemy)
    );
  });

  socket.on("makeMove", () => {
    whoseGo.innerHTML = "Your turn";
    myMove = true;
  });

  socket.on("hit", (hitInfo) => {
    // TODO: make use of hitInfo to mark the hit on the enemy board
    let id = hitInfo.row * 10 + hitInfo.col;
    computerGameGrid.childNodes.item(id).setAttribute("class", "shot");
    // TODO: set enemy board tile as hit
  });

  socket.on("miss", (shotInfo) => {
    let id = shotInfo.row * 10 + shotInfo.col;
    // TODO: czemu tu kurwa jest to samo co w hit?
    // TODO: display some miss animation?
    computerGameGrid.childNodes.item(id).setAttribute("class", "miss");
  });

  socket.on("opponentMiss", (shotInfo) => {
    // TODO: display some miss animation?
  });

  socket.on("opponentHit", (hitInfo) => {
    let row = hitInfo.row;
    let col = hitInfo.col;
    let target = userGrid.childNodes.item(`${row * 10 + col}`);
    if (target.className) {
      target.setAttribute("class", "shot");
    } else {
      target.setAttribute("class", "miss");
    }
    // TODO: do something cool when hitInfo.destroyed (meaning the ship was destroyed)
  });

  socket.on("gameWon", () => {
    window.alert("You have won!");
    // TODO: do something more
  });

  socket.on("gameLost", () => {
    window.alert("You have lost the game :(");
    // TODO: do something more
  });

  userFields.forEach((field) => field.addEventListener("dragstart", dragStart));
  userFields.forEach((field) => field.addEventListener("dragover", dragOver));
  userFields.forEach((field) => field.addEventListener("dragenter", dragEnter));
  userFields.forEach((field) => field.addEventListener("dragleave", dragLeave));
  userFields.forEach((field) => field.addEventListener("drop", dragDrop));
  userFields.forEach((field) => field.addEventListener("dragend", dragEnd));
  ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
  ships.forEach((ship) => {
    ship.addEventListener("mousedown", (e) => {
      selectedShipId = e.target.id;
    });
  });
  startButton.addEventListener("click", sendSetup);
  startButton.disabled = true;
});
