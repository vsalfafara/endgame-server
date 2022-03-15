const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { userJoin, getUser, getAllUsersInRoom, getHostInRoom, getAllPlayersInRoom, removeUser } = require('./users.js')
const { resetSequence, setRerollStatus, getRerollStatus, setCaptains, getCaptains, incrementPointer, getTurn, determineSequence } = require('./sequence.js')
const crypto = require("crypto")
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send(200)
})

io.on('connection', (socket) => {

  socket.on('createRoom', ({username, avatar}) => {
    var room = crypto.randomBytes(10).toString('hex')
    const user = userJoin(socket.id, username, avatar, room, true)
    socket.join(user.room)
    socket.emit('getRoomId', room)
  })
  
  socket.on('joinRoom', ({username, avatar}, room) => {
    const user = userJoin(socket.id, username, avatar, room, false)
    socket.join(user.room)
    const users = getAllUsersInRoom(room)
    socket.broadcast.to(user.room).emit('getAllUsersInRoom', users)
    socket.emit('getRoomId', room)
    socket.emit('getUser', user)
  })

  socket.on('getUser', () => {
    const user = getUser(socket.id)
    socket.emit('getUser', user)
  })

  socket.on('getAllUsersInRoom', (room) => {
    const users = getAllUsersInRoom(room)
    socket.emit('getAllUsersInRoom', users)
  })

  socket.on('getAllPlayersInRoom', (room) => {
    const players = getAllPlayersInRoom(room)
    io.sockets.in(room).emit('getAllPlayersInRoom', players)
  })

  socket.on('boss', (data) => {
    const rerollStatus = getRerollStatus()
    io.in(data.room).emit('showBoss', {boss: data.boss, rerollStatus: rerollStatus})
  })

  socket.on('getAllCaptainsInRoom', (room) => {
    const captains = getCaptains()
    io.sockets.in(room).emit('getAllCaptainsInRoom', captains)
  })

  socket.on('startPhase', (data) => {
    if (data.firstPick) {
      data.captains = [data.captains[1], data.captains[0]]
    }
    data.captains = data.captains.map(captain => {
      captain.voteReroll = 0
      return captain
    })
    setCaptains(data.captains)
    io.to(data.host).emit('startPhase', data.mode)
    data.captains.forEach(captain => {
      io.to(captain.id).emit('startPhase', data.mode)
    })
  })

  socket.on('showPanel', (room) => {
    io.sockets.in(room).emit('showPanel')
  })

  socket.on('determineSequence', (data) => {
    const captains = getCaptains()
    determineSequence(data.mode, captains)
  })

  socket.on('nextTurn', (room) => {
    clearInterval(selectTimer)
    incrementPointer()
    const turn = getTurn()
    const host = getHostInRoom(room)
    if (turn) {
      io.sockets.in(turn.player.room).emit('announceSelect', { id: turn.player.id, name: turn.player.username, type: turn.selection})
      io.to(turn.player.id).emit('select', turn.selection)
      io.to(host.id).emit('startTimeSelect')
    } else {
      io.to(host.id).emit('showSwitchBtn')
    }
  })

  socket.on('enter', data => {
    io.in(data.room).emit('removeCharacterFromPanel', data)
    const host = getHostInRoom(data.room)
    io.to(host.id).emit('nextTurn')
  })

  let counter = null
  let selectTimer = null
  let rerollTimer = null

  socket.on('countdownToSelect', (room) => {
    counter = 4
    selectTimer = setInterval( () => {
      counter--
      io.sockets.in(room).emit('counter', counter)
      if (counter === 0) {
        const host = getHostInRoom(room)
        io.to(host.id).emit('startSelect')
        clearInterval(selectTimer)
      }
    }, 1000)
  })

  socket.on('startTimeSelect', () => {
    counter = 31
    const turn = getTurn()
    selectTimer = setInterval( () => {
      counter--
      io.sockets.in(turn.player.room).emit('counter', counter)
      if (counter === 0) {
        io.to(turn.player.id).emit('pickDefault', turn)
        clearInterval(selectTimer)
      }
    }, 1000)
  })

  socket.on('startTimeReroll', (room) => {
    counter = 11
    rerollTimer = setInterval( () => {
      counter--
      io.sockets.in(room).emit('counter', counter)
      if (counter === 0) {
        const host = getHostInRoom(room)
        const captains = getCaptains()
        const rerollStatus = getRerollStatus()
        io.to(host.id).emit('determineReroll', {reroll: captains, rerollStatus: rerollStatus})
        io.sockets.in(room).emit('showReroll', {captains: captains, rerollStatus: rerollStatus})
        clearInterval(rerollTimer)
      }
    }, 1000)
  })

  socket.on('rerolled', () => {
    setRerollStatus(true)
  })

  socket.on('reroll', (data) => {
    let captains = getCaptains()
    if (data.reroll) {
      captains = captains.map(captain => {
        if (captain.id === data.id)
          captain.voteReroll = data.reroll
        return captain
      })
    }
    setCaptains(captains)
  })

  socket.on('switchCaptain', (room) => {
    let captains = getCaptains()
    captains = [captains[1], captains[0]]
    setCaptains(captains)
    clearInterval(selectTimer)
    clearInterval(rerollTimer)
    resetSequence(false)
    io.sockets.in(room).emit('reset')
  })

  socket.on('reset', (data) => {
    counter = null
    clearInterval(selectTimer)
    clearInterval(rerollTimer)
    resetSequence()
    setRerollStatus(false)
    if (!data.type) {
      io.sockets.in(data.room).emit('reset')
    }
    else if (data.type === 1) {
      io.sockets.in(data.room).emit('returnToRoom')
    }
  })

  socket.on('disconnect', () => {
    const user = getUser(socket.id)
    if (user) {
      removeUser(user.id)
      const players = getAllPlayersInRoom(user.room)
      socket.broadcast.to(user.room).emit('getAllPlayersInRoom', players)
      if (!players.length) {  
        resetSequence()
        clearInterval(selectTimer)
        clearInterval(rerollTimer)
        timer = null
        console.log('reset initialized')
      }
    }
    console.log('user disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})