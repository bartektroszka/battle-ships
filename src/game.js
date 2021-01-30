export class GameState {
    constructor() {
        this.xd = "Xd"
    }
}

export function handleGame(socket, player, room) {
    console.log(`Handling ${player.name} joining room ${room.id}`)

    sendGameState(socket, player, room)
}

function sendGameState(socket, player, room) {
    socket.emit('gameState', room.getGameState(player))
}