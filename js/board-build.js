'use strict'

const MINE = '💣'
const FLAG = '🚩'
var gLevel = {
    SIZE: 4,
    MINES: 2,
}
var gGame = {
    isGameOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gBoard
var gTotalCells = gLevel.SIZE ** 2
var gCellsReveled
var isFirstCellClicked = false
var gLivesLeft
console.log('gTotalCells:', gTotalCells)


function onInitGame() {
   gCellsReveled = 0
   gGame.isGameOn = true
   gLivesLeft = 3
   isFirstCellClicked = false
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log(gBoard)
}

function buildBoard() {
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        const row = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            row.push({
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            })
        }
        board.push(row)
    }
    
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j] // {Cell object}

            var cellClass = getClassName({ i: i, j: j }) // cell-0-0

            if (currCell.isMine) cellClass += ' mine'

            // strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n'
           strHTML += `<td class="hidden cell ${cellClass}" onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(this, ${i}, ${j}, event)">`

            currCell.isMine
                ? (strHTML += MINE)
                : (strHTML += gBoard[i][j].minesAroundCount)
            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = countNeighbors(i, j)
        }
    }
}

// checks how many cells around currCell contains mine
function countNeighbors(cellI, cellJ) {
    var counter = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (gBoard[i][j].isMine) counter++
        }
    }
    return counter
}

function setMinesRandomly(amountOfMines) {
   gBoard[0][1].isMine = true
   gBoard[1][3].isMine = true
   //  for (var i = 0; i < amountOfMines; i++) {
   //      var currMine = getRandomCell(gBoard) //returns an obj with its location {i:i, j:j}
   //      gBoard[currMine.i][currMine.j].isMine = true
   //  }
}
