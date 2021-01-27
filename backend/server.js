const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')

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

http.listen(portNumber, () => {
    console.log('listening on port ' + portNumber)
})

