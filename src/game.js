export class Board {
    constructor() {
        this.ready = false
        this.board = null
    }
}

export function handleGame(socket, player, room) {
    console.log(`Handling ${player.name} joining room ${room.id}`)
    sendGameState(socket, player, room)
}

function sendGameState(socket, player, room) {
    socket.emit('boardState', room.getBoardState(player))
}