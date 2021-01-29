document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector(".your-ships");
  const displayGrid = document.querySelector(".deploy-ships");
  const ships = document.querySelectorAll(".ship");
  const shortest = document.querySelector(".shortest");
  const short = document.querySelector(".short");
  const short2 = document.querySelector(".short2");
  const long = document.querySelector(".long");
  const longest = document.querySelector(".longest");
  const rotateButton = document.querySelector("#rotate");
  const width = 10;
  const fieldWidth = 40;
  let vertical = false;
  const userFields = [];
  let shipsList = [
    {
      name: "shortest",
      length: 2,
      takenIds: [],
      deployed: false,
    },
    {
      name: "short",
      length: 3,
      takenIds: [],
      deployed: false,
    },
    {
      name: "short2",
      length: 3,
      takenIds: [],
      deployed: false,
    },
    {
      name: "long",
      length: 4,
      takenIds: [],
      deployed: false,
    },
    {
      name: "longest",
      length: 5,
      takenIds: [],
      deployed: false,
    },
  ];
  const range = (start, end, step) => {
    if (start >= end) return [start];
    return [start, ...range(start + step, end, step)];
  };
  const rotateShips = () => {
    if (vertical) {
      shortest.classList.toggle("shortest-ver");
      shortest.classList.toggle("shortest");
      short.classList.toggle("short");
      short.classList.toggle("short-ver");
      short2.classList.toggle("short2");
      short2.classList.toggle("short2-ver");
      long.classList.toggle("long");
      long.classList.toggle("long-ver");
      longest.classList.toggle("longest");
      longest.classList.toggle("longest-ver");
      vertical = false;
    } else {
      shortest.classList.remove("shortest");
      shortest.classList.toggle("shortest-ver");
      short.classList.remove("short");
      short.classList.toggle("short-ver");
      short2.classList.remove("short2");
      short2.classList.toggle("short2-ver");
      long.classList.remove("long");
      long.classList.toggle("long-ver");
      longest.classList.remove("longest");
      longest.classList.toggle("longest-ver");
      vertical = true;
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

  const distanceLessThanOne = (id1, id2) => {
    let x1 = Math.floor(id1 / 10);
    let y1 = id1 % 10;
    let x2 = Math.floor(id2 / 10);
    let y2 = id2 % 10;

    if (Math.abs(x2 - x1) <= 1 && Math.abs(y2 - y1) <= 1) return true;
    return false;
  };

  const shipsCollide = (shipOne, shipTwo) => {
    let result = false;
    shipOne.takenIds.forEach((value1) => {
      shipTwo.takenIds.forEach((value2) => {
        if (distanceLessThanOne(value1, value2)) {
          result = true;
        }
      });
    });
    return result;
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
    if (draggedShip.className.slice(0, 4) != "ship") {
      return;
    }
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
    if (draggedShip.className.slice(0, 4) != "ship") {
      return;
    }
    dragShip(...computeEdges(e));
    userGrid.childNodes.forEach((node) => {
      if (node.className == "" || node.className == "available") {
        node.removeAttribute("class");
      }
    });
  };

  const dragOver = (e) => {
    if (draggedShip.className.slice(0, 4) != "ship") {
      return;
    }
    e.preventDefault();
  };

  const dragEnter = (e) => {
    if (draggedShip.className.slice(0, 4) != "ship") {
      return;
    }
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
      let node = userGrid.childNodes[index + 1];
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
});
