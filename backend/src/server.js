import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import * as socketIO from 'socket.io'

import config from '../config.json'

import {} from './rooms.js'
import { login } from './middlewares.js'

const app = express()
const server = http.Server(app)
const io = new socketIO.Server(http);

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('login', {'invalidUsername': false})
})

app.post('/login', login)

io.on('connection', (socket) => {
    console.log("new socket connection")
})

server.listen(config.port, () => {
    console.log('listening on port ' + config.port)
})





