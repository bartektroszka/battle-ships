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

    getOtherPlayer(player) {
        return this.players.find(p => p != player)
    }

    getSocketForPlayer(player) {
        return this.sockets[player]
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