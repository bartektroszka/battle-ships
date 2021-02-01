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

  const shipsCollide = (shipOne, shipTwo) => {
    return (
      shipOne.takenIds.filter((value) => shipTwo.takenIds.includes(value)) != 0
    );
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
      if (!displayGrid.querySelector(".ship")) allShipsPlaced = true;
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

  const game = () => {
    const shootEnemy = (e) => {
      let id = e.target.id;
      // "wysylam ci wspolrzedne";
      let row = Math.floor(id / 10);
      let col = id % 10;
      if ("trafilem statek") {
        computerGameGrid.childNodes
          .item(`${row * 10 + col}`)
          .setAttribute("class", "shot");
      } else {
        computerGameGrid.childNodes
          .item(`${row * 10 + col}`)
          .setAttribute("class", "shot");
      }
    };

    const getMove = (row, col) => {
      if (ourboard[row][col]) {
        ourboard[row][col] = [ourboard[row][col][0], true];
      }
      let target = userGrid.childNodes.item(`${row * 10 + col}`);
      if (target.className) {
        target.setAttribute("class", "shot");
      } else {
        target.setAttribute("class", "miss");
      }
    };
    const startGame = () => {
      let ourboard = [];
      for (let row = 0; row < width; row++) {
        ourboard.push([]);
        for (let col = 0; col < width; col++) {
          let target = userGrid.childNodes
            .item(`${row * 10 + col}`)
            .className.split(" ")
            .pop();
          ourboard[row].push([target, false]);
        }
      }

      //tu wysylam ci ourboard
      let gameBoard = document.getElementById("gamecontainer");
      gameBoard.style.display = "flex";
      createBoard(computerGameGrid, computerGameFields);
      computerGameFields.forEach((field) =>
        field.addEventListener("click", shootEnemy)
      );
    };
    startGame();
    while (true) {
      //tu wysylam i odbieram te requesty az nie wyslesz ze koniec gry
    }
    console.log("End of the game");
  };

  let allShipsPlaced = false;
  let draggedShip;
  let draggedShipInList;
  let shipLength;
  let shipLastId;
  let shipBeginId;
  let offset;
  let shipName;

  createBoard(userGrid, userFields);

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
  startButton.addEventListener("click", game);
});
