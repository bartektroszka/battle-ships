import { playerTokenCookieName } from './middlewares.js'
import { getPlayerByToken } from './player.js'
import { handleGame } from './game.js'
import { getRoomById } from './rooms.js'
import cookie from 'cookie'


export function socketHandler(socket) {
    let player = getPlayerFromSocket(socket)

    if (!player) {
        console.log('Invalid user tried to connect via socket.')
        return
    }

    let roomId = null

    socket.on('roomId', (id, token) => {
        roomId = id
        let room = getRoomById(roomId)
        if (!room) {
            return
        }
        console.log(`${player.prettyPrint()} connected via socket to room #${roomId}`)

        if (room.hasPlayer(player)) {
            room.assignSocketForPlayer(player, socket)
            handleGame(socket, player, room)
        } else {
            console.log("Rejected the connection. User was not in the target room")
        }
    })
}

function getPlayerFromSocket(socket) {
    try {
        let cookies = cookie.parse(socket.handshake.headers.cookie)
        let token = cookies['player-token']
        return getPlayerByToken(token)
    } catch (err) {
        console.log(`Unable to extract user token from socket connection.`)
        return null
    }
}