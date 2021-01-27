class Room {
    constructor(password) {
        this.players = []
        this.password = password
    }

    insertPlayer(player, password) {
        if (this.password && this.password != password) {
            throw new Error('Invalid password')
        }

        if (this.players.length == 2) {
            throw new Error('Room is full')
        }

        this.players.push(player)
    }
}

let rooms = []
