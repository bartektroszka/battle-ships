class Room {
    constructor(id, name) {
        this.id = id
        this.players = []
        this.name = name
        this.sockets = {}
        this.isReady = {}
        this.boards = {}
    }

    insertPlayer(player) {
        if (this.hasPlayer(player)) {
            return;
        }

        if (this.players.length == 2) {
            throw new Error('Room is full')
        }

        this.players.push(player)
        this.isReady[player] = false
        this.boards[player] = null
    }

    assignSocketForPlayer(player, socket) {
        this.sockets[player] = socket
    }

    getPlayersWithSockets() {
        return this.players.map(player => [player, this.sockets[player]])
    }

    shootPlayer(player, {row, col}) {
        let board = this.getBoard(player)
        let tile = board[row][col]

        if (tile == null) {
            return null
        }

        tile.hit = true
        let ship = tile.shipName
        let destroyed = board.every(row =>
            row.every(tile => !tile || tile.shipName != ship || tile.hit)
        )

        return { row, col, destroyed }
    }

    getOtherPlayer(player) {
        return this.players.find(p => p != player)
    }

    getSocketForPlayer(player) {
        return this.sockets[player]
    }

    hasPlayerWon(player) {
        let opponentsBoard = this.getBoard(this.getOtherPlayer(player))
        return opponentsBoard.every(row => row.every(tile => !tile || tile.hit))
    }

    getBoard(player) {
        return this.boards[player]
    }

    setBoard(player, board) {
        this.boards[player] = board
    }

    hasPlayer(player) {
        return this.players.includes(player)
    }

    makePlayerReady(player) {
        this.isReady[player] = true
    }

    areAllPlayersReady() {
        return this.players.length == 2 && Object.values(this.isReady).every(Boolean)
    }

    members() {
        return this.players.map((player) => player.name).join(", ")
    }

    toString() {
        return `#${this.id}`
    }
}

let rooms = {}
let nextRoomId = 0

export function createRoom(name) {
    let id = nextRoomId++
    let room = new Room(id, name)
    rooms[id] = room
    return room
}

export function getRooms() {
    return Object.values(rooms)
}

export function getRoomById(id) {
    return rooms[id]
}