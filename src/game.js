export class Board {
    constructor() {
        this.ready = false
        this.board = null
    }
}

export function handleGame(socket, player, room) {
    console.log(`Handling ${player.name} joining room ${room.id}`)
    expectSetup(socket, player, room)

}

function expectSetup(socket, player, room) {
    socket.emit('expectingSetup')

    socket.on('setupDone', (setup) => {
        // TODO: update setup
        console.log(
            `Received setup from player "${player.name}" (${player.token}) for room #${room.id}`
        )

        room.makePlayerReady(player)

        if (room.areAllPlayersReady()) {
            let otherSocket = room.getSocketForPlayer(room.getOtherPlayer(player))
            otherSocket.emit('otherPlayerReady')
            // TODO: start game
        } else {
            socket.emit('waitForOtherPlayer')
        }
    })
}