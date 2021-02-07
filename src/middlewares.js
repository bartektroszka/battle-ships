import { isUsernameValid, createTokenForPlayer, getPlayerByToken, playerExists } from './player.js'
import { getRooms, createRoom, getRoomById } from './rooms.js'


export const playerTokenCookieName = 'player-token'

export function root(req, res) {
    let playerToken = req.cookies[playerTokenCookieName]
    if (playerToken) {
        res.redirect('/rooms')
    } else {
        res.render('login', {'errorMessage': ''})
    }

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
        let errorMessage = 'Invalid username. Name can only contain letters and digits.'
        res.render('login', {errorMessage})
    }
}

export function logAgain(req, res) {
    res.render('login', {errorMessage: ''})
}

export function makeRoom(req, res) {
    let playerToken = req.cookies[playerTokenCookieName]
    if (!assertSessionIsValid(res, playerToken)) {
        return
    }

    let roomName = req.body.roomName
    let room = createRoom(roomName)
    console.log(`Room ${room} ("${roomName}") was created`)

    res.redirect('/join-room?id=' + room.id)
}

export function joinRoom(req, res) {
    let playerToken = req.cookies[playerTokenCookieName]
    if (!assertSessionIsValid(res, playerToken)) {
        return
    }

    let player = getPlayerByToken(playerToken)
    let roomId = req.query.id
    let room = getRoomById(roomId)

    console.log(`Player ${player.prettyPrint()} attempts to join room ${room}`)
    try {
        room.insertPlayer(player)
        console.log(`Player ${player.prettyPrint()} joined room ${room}`)
        res.redirect('/room?id=' + room.id)
    } catch (err) {
        console.log(`${player.prettyPrint()} failed to join with error "${err.message}"`)
        res.redirect('/rooms')
    }
}

export function room(req, res) {
    let token = req.cookies[playerTokenCookieName]
    if (!assertSessionIsValid(res, token)){
        return
    }

    let room = getRoomById(req.query.id)
    let player = getPlayerByToken(token)
    if (!room.hasPlayer(player)) {
        res.redirect('/rooms')
    }

    res.render('../frontend/index', {roomId: room.id})
}

export function rooms(req, res) {
    res.render('rooms', {rooms: getRooms()})
}

function assertSessionIsValid(response, playerToken) {
    if (!playerToken || !playerExists(playerToken)) {
        console.log(`Detected an invalid session with token "${playerToken}"`)
        let errorMessage = 'Your session has expired. Please choose your name again'
        response.render('login', {errorMessage})
        return false
    }
    return true
}