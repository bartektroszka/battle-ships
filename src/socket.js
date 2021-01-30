import { playerTokenCookieName } from './middlewares.js'
import { getPlayerByToken } from './player.js'
import { handleGame } from './game.js'
import { getRoomById } from './rooms.js'


export function socketHandler(socket) {
    let player = getPlayerFromSocket(socket)

    if (!player) {
        console.log('Invalid user tried to connect via socket.')
        return
    }

    let roomId = null

    socket.on('roomId', (id) => {
        roomId = id
        console.log(`User "${player.name}" (${player.token}) connected via socket to room #${roomId}`)
        let room = getRoomById(roomId)
        handleGame(socket, player, room)
    })

    socket.on('disconnect', () => {
        console.log(`User "${player.name}" (${player.token}) disconnected via socket from room ${roomId}.'`)
    })

}

function getPlayerFromSocket(socket) {
    try {
        let cookies = socket.handshake.headers.cookie
        let token = cookies.split('=')[1]
        return getPlayerByToken(token)
    } catch (err) {
        return null
    }
}