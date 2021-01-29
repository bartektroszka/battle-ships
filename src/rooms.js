class Room {
    constructor(id, name) {
        this.id = id
        this.players = []
        this.name = name
    }

    insertPlayer(player) {
        if (this.players.includes(player)) {
            return;
        }

        if (this.players.length == 2) {
            throw new Error('Room is full')
        }

        this.players.push(player)
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
