'use strict'


// Start with the given ball-board project, add the following features:

//

// /

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'
// const GlUED_GAMER='GLUED_GAMER'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '💩'
// const GLUED_GAMER='🤢'

// Model:
var gBoard
var gGamerPos
var gIntervalId
var gCollectedBalls = 0
var gBallsCount = 2
var gNeighborBalls = 0
var isGlued = false

function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gIntervalId = setInterval(addBall, 5000)
    // setInterval(addGlue, 5000)

}

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    // DONE: Place the gamer and two balls
    // / • Add passages that take the gamer from left/right or
    // // top/bottom:
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR
    board[0][5].type = FLOOR
    board[9][5].type = FLOOR



    // console.log(board)
    return board
}

// Render the board to an HTML table
function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
    // console.log(i, j)
    const targetCell = gBoard[i][j]


    if (!isGlued) {
        if (targetCell.type === WALL) return


        // Calculate distance to make sure we are moving to a neighbor cell
        const iAbsDiff = Math.abs(i - gGamerPos.i)
        const jAbsDiff = Math.abs(j - gGamerPos.j)

        // If the clicked Cell is one of the four allowed
        if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
            // כדי שבאמת הוא יכנס לתוך המעברים גם עם העכבר אפשר להגדיר בתנאי למעלה שגם אם המרחק בין המשבצות באורך הלוח פחות אחד הוא יאפשר מעבר

          
            if (i === 5 && j === 0) {
                // i = 5
                j = 11
            } else if (i === 5 && j === 11) {
                // i = 5
                j = 0
            } else if (i === 0 && j === 5) {
                i = 9
                // j = 5
            } else if (i === 9 && j === 5) {
                i = 0
                // j = 5
            }
            // מספיק לשנות את הערך שמשתנה
            // גם יותר חכם לשים את ה-LENGTH כדי שיתאים לעוד מקרים

            // while (targetCell.gameElement===GLUE) {
            //     gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
            //     targetCell.gameElement = GAMER

            // }


            if (targetCell.gameElement === BALL) {
                console.log('Collecting!')
                // • Show how many balls were collected
                collectBall()

            }
  if (targetCell.gameElement === GLUE) {

                isGlued = true
                setTimeout(() => { isGlued = false }, 3000)
            }

            // DONE: Move the gamer
            // REMOVING FROM
            // update Model
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = null

            // update DOM
            renderCell(gGamerPos, '')

            // ADD TO
            // update Model
            targetCell.gameElement = GAMER
            gGamerPos = { i, j }
            const gNeighborBalls = countNeighborBalls(i, j, gBoard)
            console.log('negballs:', gNeighborBalls)
            // update DOM
            renderCell(gGamerPos, GAMER_IMG)
            const elH3 = document.querySelector('h3')
            elH3.innerText = `balls around you:${gNeighborBalls}`

        }
    }

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    console.log('event.key:', event.key)


    // board[5][0].type = FLOOR
    // board[5][11].type = FLOOR
    // board[0][5].type = FLOOR
    // board[9][5].type = FLOOR

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break
    }
    // }

}


// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

// • Every few seconds a new ball is added in a random empty cell

function addBall() {
    const emptyCells = getEmptyCells(gBoard)
    // console.log('cells:', emptyCells)
    const randomEmptyCell = drawItem(emptyCells)
    console.log('random:', randomEmptyCell)
    gBoard[randomEmptyCell.i][randomEmptyCell.j].gameElement = BALL
    gNeighborBalls = countNeighborBalls(gGamerPos.i, gGamerPos.j, gBoard)
    const elH3 = document.querySelector('h3')
    elH3.innerText = `balls around you:${gNeighborBalls}`
    gBallsCount++
    console.log('balls:', gBallsCount)
    renderCell(randomEmptyCell, BALL_IMG)
}

function getEmptyCells(board) {
    const emptyCells = []
    for (var i = 1; i < board.length - 1; i++) {

        for (var j = 1; j < board[i].length - 1; j++) {
            const cell = board[i][j]
            if (cell.gameElement === null && cell.type === FLOOR) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}

function drawItem(items) {
    var randIdx = getRandomInt(0, items.length)
    var item = items[randIdx]
    items.splice(randIdx, 1)
    return item
}

function collectBall() {
    // • Play sound when collecting a ball
    playAudio('eatBall.wav')
    gCollectedBalls++
    // console.log('collect:', gCollectedBalls)
    gBallsCount--
    // console.log('balls:', gBallsCount)
    const elH2 = document.querySelector('h2')
    elH2.innerText = `You have collected ${gCollectedBalls} balls`
    if (!gBallsCount) gameOver()

}

// • When gamer collects all balls – game over - let the user
// // restart the game by clicking a Restart button

function gameOver() {
    const elmodal = document.querySelector('.gameover')
    removeHidden(elmodal)
    clearInterval(gIntervalId)
}

function removeHidden(el) {
    el.classList.remove('hidden')
}

function playAudio(file) {
    const audio = new Audio(file)
    audio.play()
}

// • Count and present in the header the balls-count around the
// player (note that it changes when moving the player or when
// adding a ball near the player)

function countNeighborBalls(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue

            if (mat[i][j].gameElement === BALL) neighborsCount++
        }
    }
    console.log('neibors:', neighborsCount)
    return neighborsCount
}


// • Add support for gameElement GLUE, when user steps on
// GLUE he cannot move for 3 seconds. GLUE is added to board
// every 5 seconds and gone after 3 sec

function addGlue() {
    var glueOff
    const emptyCells = getEmptyCells(gBoard)
    const randomEmptyCell = drawItem(emptyCells)
    gBoard[randomEmptyCell.i][randomEmptyCell.j].gameElement = GLUE
    renderCell(randomEmptyCell, GLUE_IMG)

   glueOff= setTimeout(removeGlue, 3000, randomEmptyCell)
}

function removeGlue(cell) {
    if (gBoard[cell.i][cell.j].gameElement === GLUE) renderCell(cell, null)
    clearTimeout(glueOff)
}

// function glueGamer(gGamerPos){
//     if (gBoard[i][j]==GLUE) gBoard[i][j].gameElement===GlUED_GAMER

// }