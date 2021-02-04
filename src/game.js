export function handleGame(socket, player, room) {
    console.log(`Handling ${player.prettyPrint()} joining room ${room.id}`)
    expectSetup(socket, player, room)

}

function expectSetup(socket, player, room) {
    socket.emit('expectingSetup')

    socket.on('setupDone', (setup) => {
        console.log(`Received setup from player ${player.prettyPrint()} for room ${room}`)

        room.setBoard(player, setup)
        room.makePlayerReady(player)

        if (room.areAllPlayersReady()) {
            console.log(`Both players in room ${room} are ready. Starting the game.`)
            let otherSocket = room.getSocketForPlayer(room.getOtherPlayer(player))
            otherSocket.emit('bothPlayersReady')
            socket.emit('bothPlayersReady')
            // TODO: start game
        } else {
            console.log(`Waiting for another player to join room ${room}`)
            socket.emit('waitForOtherPlayer')
        }
    })
}