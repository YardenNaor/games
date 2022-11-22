// DONE: render the board in table
// DONE: add class 'occupied'
// DONE: add toggle game btn
// DONE: click on a TD with LIFE upgrade to SUPER_LIFE and never dies
// TODO: click on LIFE blows up the negs around

const GAME_FREQ = 700
const LIFE = '🎃'
const SUPER_LIFE = '😈'


// The Model
var gBoard
var gGameInterval


function onInit() {
    gBoard = createBoard()
    renderBoard(gBoard)

}


function play() {
    gBoard = runGeneration(gBoard)
    renderBoard(gBoard)
}


function createBoard() {
    const board = []
    for (var i = 0; i < 8; i++) {
        board.push([])
        for (var j = 0; j < 8; j++) {
            board[i][j] = (Math.random() > 0.5) ? LIFE : ''
            // board[i][j] = (i === 0 || i === 7 || j === 0 || j === 7) ? LIFE : ''
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = cell ? 'occupied' : ''
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})" class="${className} ">${cell}</td>`
        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML


}

function onToggleGame(elToggleBtn) {
    console.log('gGameInterval:', gGameInterval)
    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null
        elToggleBtn.innerText = 'Play'
    } else {
        elToggleBtn.innerText = 'Pause'
        gGameInterval = setInterval(play, GAME_FREQ)
    }
}


function onCellClicked(elCell, cellI, cellJ) {
    if (gBoard[cellI][cellJ] === LIFE) {

        // Model
        gBoard[cellI][cellJ] = SUPER_LIFE

        // DOM 
        elCell.innerText = SUPER_LIFE

        blowUpNegs(cellI, cellJ)

    }
    console.table(gBoard)
}


function blowUpNegs(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            
            // Model
            gBoard[i][j] = ''
            // DOM
            const elCell = renderCell(i, j, '')
            elCell.classList.remove('occupied')


        }
    }

}

function renderCell(i, j, value) {
    const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerText = value
    const elH3 = document.querySelector('h3')
    elH3.innerText = `balls around you:${gNeighborBalls}`
    return elCell

}

function runGeneration(board) {

    var newBoard = copyMat(board)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var numOfNeighbors = countNeighbors(i, j, board)
            if ((numOfNeighbors > 2) && (numOfNeighbors < 6)) {
                if (board[i][j] === '') newBoard[i][j] = LIFE
            }
            else if (board[i][j] === LIFE) newBoard[i][j] = ''
        }
    }
    return newBoard
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue

            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++
        }
    }
    return neighborsCount
}
