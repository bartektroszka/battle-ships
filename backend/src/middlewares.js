import { isUsernameValid, createTokenForPlayer, getPlayerByToken } from './player.js'
import { getRooms, createRoom, getRoomById } from './rooms.js'


const playerTokenCookieName = 'player-token'

export function root(req, res) {
    res.render('login', {'invalidUsername': false})
}

export function login(req, res) {
    let userName = req.body.userName
    console.log(userName + ' tries to log in.')
    if (isUsernameValid(userName)) {
        let token = createTokenForPlayer(userName)
        console.log('Generated token "' + token + '" for ' + userName)
        res.cookie(playerTokenCookieName, token)
        res.redirect('/rooms')
    } else {
        res.render('login', {'invalidUsername': true})
    }
}

export function makeRoom(req, res) {
    let roomName = req.body.roomName
    let room = createRoom(roomName)
    console.log('Room #' + room.id + ' "' + roomName + '" was created')

    res.redirect('/join-room?id=' + room.id)
}

export function joinRoom(req, res) {
    let playerToken = req.cookies[playerTokenCookieName]
    let player = getPlayerByToken(playerToken)
    let roomId = req.query.id

    let room = getRoomById(roomId)
    room.insertPlayer(player)

    console.log('Player "' + player.name + '" (' + player.token + ') joined room #' + roomId)
    res.redirect('/room?id=' + room.id)
}

export function room(req, res) {
    let roomId = req.query.id
    let room = getRoomById(roomId)
    res.render('game', {room})
}

export function rooms(req, res) {
    res.render('rooms', {rooms: getRooms()})
}
