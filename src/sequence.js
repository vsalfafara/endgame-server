let sequence = []
let pointer = -1

function resetSequence() {
  sequence = []
  pointer = -1
}

function getSequence() {
  return sequence
}

function incrementPointer() {
  pointer++
}

function getTurn() {
  if (pointer < sequence.length)
    return sequence[pointer]
  return false
}

function determineSequence(mode, players) {
  switch (mode) {
    case '1v1':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[0],
          selection: 1
        },
        {
          turn: 4,
          player: players[1],
          selection: 1
        }
      ]
      break
    case '2v2':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[0],
          selection: 1
        },
        {
          turn: 4,
          player: players[1],
          selection: 1
        },
        {
          turn: 5,
          player: players[1],
          selection: 0
        },
        {
          turn: 6,
          player: players[0],
          selection: 0
        },
        {
          turn: 7,
          player: players[1],
          selection: 1
        },
        {
          turn: 8,
          player: players[0],
          selection: 1
        }
      ]
      break
    case '3v3':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[0],
          selection: 0
        },
        {
          turn: 4,
          player: players[1],
          selection: 0
        },
        {
          turn: 5,
          player: players[0],
          selection: 1
        },
        {
          turn: 6,
          player: players[1],
          selection: 1
        },
        {
          turn: 7,
          player: players[0],
          selection: 1
        },
        {
          turn: 8,
          player: players[1],
          selection: 1
        },
        {
          turn: 9,
          player: players[1],
          selection: 0
        },
        {
          turn: 10,
          player: players[0],
          selection: 0
        },
        {
          turn: 11,
          player: players[1],
          selection: 1
        },
        {
          turn: 12,
          player: players[0],
          selection: 1
        }
      ]
      break
    case '4v4':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[0],
          selection: 0
        },
        {
          turn: 4,
          player: players[1],
          selection: 0
        },
        {
          turn: 5,
          player: players[0],
          selection: 1
        },
        {
          turn: 6,
          player: players[1],
          selection: 1
        },
        {
          turn: 7,
          player: players[0],
          selection: 1
        },
        {
          turn: 8,
          player: players[1],
          selection: 1
        },
        {
          turn: 9,
          player: players[1],
          selection: 0
        },
        {
          turn: 10,
          player: players[0],
          selection: 0
        },
        {
          turn: 11,
          player: players[1],
          selection: 0
        },
        {
          turn: 12,
          player: players[0],
          selection: 0
        },
        {
          turn: 13,
          player: players[1],
          selection: 1
        },
        {
          turn: 14,
          player: players[0],
          selection: 1
        },
        {
          turn: 15,
          player: players[1],
          selection: 1
        },
        {
          turn: 16,
          player: players[0],
          selection: 1
        }
      ]
      break
  }
}

module.exports = {
  resetSequence,
  getSequence,
  incrementPointer,
  getTurn,
  determineSequence
}