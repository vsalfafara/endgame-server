let sequence = []
let captains = []
let hasRerolled = false
let pointer = -1

function resetSequence(reroll = true) {
  sequence = []
  pointer = -1

  if (reroll) {
    captains = captains.map(captain => {
      captain.voteReroll = 0
      return captain
    })
  }
}

function setRerollStatus (status) {
  return hasRerolled = status
}

function getRerollStatus () {
  return hasRerolled
}
function setCaptains (data) {
  captains = data
}

function getCaptains () {
  return captains
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

function determineSequence(mode, captains) {
  switch (mode) {
    case '1v1':
      sequence = [
        {
          turn: 1,
          player: captains[0],
          selection: 0
        },
        {
          turn: 2,
          player: captains[1],
          selection: 0
        },
        {
          turn: 3,
          player: captains[0],
          selection: 1
        },
        {
          turn: 4,
          player: captains[1],
          selection: 1
        }
      ]
      break
    case '2v2':
      sequence = [
        {
          turn: 1,
          player: captains[0],
          selection: 0
        },
        {
          turn: 2,
          player: captains[1],
          selection: 0
        },
        {
          turn: 3,
          player: captains[0],
          selection: 1
        },
        {
          turn: 4,
          player: captains[1],
          selection: 1
        },
        {
          turn: 5,
          player: captains[1],
          selection: 0
        },
        {
          turn: 6,
          player: captains[0],
          selection: 0
        },
        {
          turn: 7,
          player: captains[1],
          selection: 1
        },
        {
          turn: 8,
          player: captains[0],
          selection: 1
        }
      ]
      break
    case '3v3':
      sequence = [
        {
          turn: 1,
          player: captains[0],
          selection: 0
        },
        {
          turn: 2,
          player: captains[1],
          selection: 0
        },
        {
          turn: 3,
          player: captains[0],
          selection: 0
        },
        {
          turn: 4,
          player: captains[1],
          selection: 0
        },
        {
          turn: 5,
          player: captains[0],
          selection: 1
        },
        {
          turn: 6,
          player: captains[1],
          selection: 1
        },
        {
          turn: 7,
          player: captains[0],
          selection: 1
        },
        {
          turn: 8,
          player: captains[1],
          selection: 1
        },
        {
          turn: 9,
          player: captains[1],
          selection: 0
        },
        {
          turn: 10,
          player: captains[0],
          selection: 0
        },
        {
          turn: 11,
          player: captains[1],
          selection: 1
        },
        {
          turn: 12,
          player: captains[0],
          selection: 1
        }
      ]
      break
    case '4v4':
      sequence = [
        {
          turn: 1,
          player: captains[0],
          selection: 0
        },
        {
          turn: 2,
          player: captains[1],
          selection: 0
        },
        {
          turn: 3,
          player: captains[0],
          selection: 0
        },
        {
          turn: 4,
          player: captains[1],
          selection: 0
        },
        {
          turn: 5,
          player: captains[0],
          selection: 1
        },
        {
          turn: 6,
          player: captains[1],
          selection: 1
        },
        {
          turn: 7,
          player: captains[0],
          selection: 1
        },
        {
          turn: 8,
          player: captains[1],
          selection: 1
        },
        {
          turn: 9,
          player: captains[1],
          selection: 0
        },
        {
          turn: 10,
          player: captains[0],
          selection: 0
        },
        {
          turn: 11,
          player: captains[1],
          selection: 0
        },
        {
          turn: 12,
          player: captains[0],
          selection: 0
        },
        {
          turn: 13,
          player: captains[1],
          selection: 1
        },
        {
          turn: 14,
          player: captains[0],
          selection: 1
        },
        {
          turn: 15,
          player: captains[1],
          selection: 1
        },
        {
          turn: 16,
          player: captains[0],
          selection: 1
        }
      ]
      break
  }
}

module.exports = {
  resetSequence,
  setRerollStatus,
  getRerollStatus,
  setCaptains,
  getCaptains,
  getSequence,
  incrementPointer,
  getTurn,
  determineSequence
}