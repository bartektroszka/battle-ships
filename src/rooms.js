import { Board } from './game.js'


class Room {
    constructor(id, name) {
        this.id = id
        this.players = []
        this.name = name
        this.boards = {}
    }

    insertPlayer(player) {
        if (this.players.includes(player)) {
            return;
        }

        if (this.players.length == 2) {
            throw new Error('Room is full')
        }

        this.players.push(player)
        this.boards[player] = new Board()
    }

    getBoardState(player) {
        return this.boards[player]
    }

    removePlayer(player) {
        if (!this.players.includes(player)) {
            throw new Error('Player "' + player.name + '" is not in the room #' + this.id)
        }

        this.players = this.players.filter((p) => p != player)
    }

    members() {
        return this.players.map((player) => player.name).join(", ")
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