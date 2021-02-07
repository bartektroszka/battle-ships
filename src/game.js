export function handleGame(socket, player, room) {
    socket.emit('expectingSetup')

    socket.on('disconnect', () => {
        console.log(`${player.prettyPrint()} left the room ${room}.`)
        room.removePlayer(player)
    })

    socket.on('setupDone', (setup) => {
        console.log(`Received setup from player ${player.prettyPrint()} for room ${room}`)

        room.setBoard(player, setup)
        room.makePlayerReady(player)

        if (room.areAllPlayersReady()) {
            console.log(`Both players in room ${room} are ready. Starting the game.`)
            let otherSocket = room.getSocketForPlayer(room.getOtherPlayer(player))
            otherSocket.emit('bothPlayersReady')
            socket.emit('bothPlayersReady')
            playGame(room)
        } else {
            console.log(`Waiting for another player to join room ${room}`)
            socket.emit('waitForOtherPlayer')
        }
    })
}

function playGame(room) {
    let [[playerA, socketA], [playerB, socketB]] = room.getPlayersWithSockets()
    let whoseTurn = playerA.token

    const setHandlersForPlayer = (socket, player, otherSocket, otherPlayer) => {
        const shotHandler = (coordinates) => {
            if (whoseTurn != player.token) {
                console.log(`Rejected unexpected move from ${player} in room ${room}`)
            }

            let hit = room.shootPlayer(otherPlayer, coordinates)

            if (hit == null) {
                console.log(`Player ${player} missed in room ${room}`)
                socket.emit('miss', coordinates)
                otherSocket.emit('opponentMiss', coordinates)
                whoseTurn = otherPlayer.token
                otherSocket.emit('makeMove')
            } else {
                console.log(`Player ${player} hit in room ${room}`)
                socket.emit('hit', hit)
                otherSocket.emit('opponentHit', hit)

                if (room.hasPlayerWon(player)) {
                    socket.removeAllListeners('disconnect')
                    otherSocket.removeAllListeners('disconnect')
                    console.log(`Player ${player} has won the game in room ${room}`)
                    otherSocket.emit('gameLost')
                    socket.emit('gameWon')
                    room.endGame()
                } else {
                    socket.emit('makeMove')
                }
            }
        }

        socket.on('shot', shotHandler)

        socket.on('disconnect', () => {
            console.log(`${player.prettyPrint()} surrendered the match in room ${room}.'`)
            otherSocket.emit('gameWon', {reason: 'Opponent surrendered the game.'})
            socket.emit('gameLost', {reason: 'You left the game.'})
        })
    }

    setHandlersForPlayer(socketA, playerA, socketB, playerB)
    setHandlersForPlayer(socketB, playerB, socketA, playerA)
    socketA.emit('makeMove')
    console.log(`Game between ${playerA} and ${playerB} in room ${room} was set up`)
}