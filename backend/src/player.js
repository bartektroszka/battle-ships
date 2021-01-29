import crypto from 'crypto-js'

let playersByToken = {}

class Player {
    constructor (name, token) {
        this.name = name
        this.token = token
    }
}

export function isUsernameValid(name) {
    // TODO: handle unicode like "żółw"
    return name.match(/^[A-Za-z0-9]+$/)
}

export function createTokenForPlayer(name) {
    let token = null
    do {
        let randomNumber = Math.random() * 1000000
        token = crypto.MD5(name + randomNumber).toString()
    } while (token in playersByToken)

    playersByToken[token] = new Player(name, token)

    return token
}

export function getPlayerByToken(token) {
    if (token in playersByToken) {
        return playersByToken[token]
    } else {
        throw new Error('Player token is not valid (' + token + ')')
    }
}