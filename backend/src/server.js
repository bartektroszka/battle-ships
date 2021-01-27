import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import * as socketIO from 'socket.io'

const app = express()
const server = http.Server(app)
const io = new socketIO.Server(http);

const portNumber = 3000

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    let userName = req.body.userName
    console.log(userName + " connected")
    res.render('rooms', {userName})
})

io.on('connection', (socket) => {
    console.log("new socket connection")
})

server.listen(portNumber, () => {
    console.log('listening on port ' + portNumber)
})

