import crypto from 'crypto-js'

let playersByToken = {}

class Player {
    constructor (name, token) {
        this.name = name
        this.token = token
    }
}

export function createTokenForPlayer(name) {
    let token = null
    do {
        let randomNumber = Math.random() * 1000000
        token = crypto.MD5(name + randomNumber)
    } while (token in playersByToken)

    playersByToken[token] = new Player(name, token)

    return token
}
