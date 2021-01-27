import { isUsernameValid, createTokenForPlayer } from './player.js'


export function login(req, res) {
    let userName = req.body.userName
    console.log(userName + ' tries to log in.')
    if (isUsernameValid(userName)) {
        let token = createTokenForPlayer(userName)
        console.log('Generated token "' + token + '" for ' + userName)
        res.cookie('player-token', token)
        res.render('rooms', {userName})
    } else {
        res.render('login', {'invalidUsername': true})
    }
}