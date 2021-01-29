import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import * as socketIO from 'socket.io'

import config from '../config.json'

import {} from './rooms.js'
import { root, login, makeRoom, room, rooms, joinRoom } from './middlewares.js'

const app = express()
const server = http.Server(app)
const io = new socketIO.Server(http);

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.get('/', root)
app.post('/login', login)
app.post('/make-room', makeRoom)
app.get('/room', room)
app.get('/rooms', rooms)
app.post('/join-room', joinRoom)
app.get('/join-room', joinRoom)

io.on('connection', (socket) => {
    console.log("new socket connection")
})

server.listen(config.port, () => {
    console.log('listening on port ' + config.port)
})
