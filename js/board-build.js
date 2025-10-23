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
var gHints = {
   hintsLeft: 3,
   isHintOn: false
}

var gBoard
var gTotalCells
var gCellsReveled
var isFirstCellClicked = false
var gLivesLeft
var gTimerInterval
var gBestScoreBeginner = Infinity
var gBestScoreMedium = Infinity
var gBestScoreExpert = Infinity
var gStartTime


function onInitGame() {
   resetTimer()
   resetVariants()
   renderLives()
   renderHints()
   gBoard = buildBoard()
   renderBoard(gBoard)
   const bestScore = localStorage.getItem('BestTime-' + gLevel.SIZE)
   console.log(bestScore);
   if (+bestScore) { setBestScore(gLevel.SIZE, bestScore) }

}
function resetVariants() {
   gCellsReveled = 0
   gTotalCells = gLevel.SIZE ** 2
   gLivesLeft = 3
   gHints.hintsLeft = 3
   gGame.isGameOn = true
   gGame.markedCount = 0
   isFirstCellClicked = false
   const elSmileyButton = document.querySelector('.smiley-button')
   elSmileyButton.innerText = '😀'
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

           strHTML += `<td class="hidden cell ${cellClass}" onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(this, ${i}, ${j}, event)"><span class="content">`

            currCell.isMine
                ? (strHTML += MINE)
                : (strHTML += gBoard[i][j].minesAroundCount)
            strHTML += '</span> <span class="flag"></span></td>'
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
           if( gBoard[i][j].minesAroundCount === 0) gBoard[i][j].minesAroundCount = ' '
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
   console.log('counter:', counter)
    return counter
}

function setMinesRandomly(amountOfMines) {
   // gBoard[0][1].isMine = true
   // gBoard[1][3].isMine = true
    for (var i = 0; i < amountOfMines; i++) {
        var currMine = getRandomCell(gBoard) //returns an obj with its location {i:i, j:j}
        gBoard[currMine.i][currMine.j].isMine = true
    }
}


function renderLives() {
   var livesStr = ''
   for (var i = 0; i < gLivesLeft; i++){
      livesStr += '❤️'
   }
   const elLives = document.querySelector('.lives')
   elLives.innerText = livesStr
}

function renderHints() {
   var hintsStrHtml = ''
   for (var i = 0; i < gHints.hintsLeft; i++){
      hintsStrHtml += `<span class="hint" onclick="markHint(this)">💡</span>`
   }
   const elHints = document.querySelector('.hints')
   elHints.innerHTML = hintsStrHtml
}


function setDifficulty(difficulty) {
   switch (difficulty) {
      case 'Beginner':
         gLevel.SIZE = 4
         gLevel.MINES = 2
         break
         case 'Medium':
         gLevel.SIZE = 8
         gLevel.MINES = 14
         break
      case 'Expert':
         gLevel.SIZE = 12
         gLevel.MINES = 32
         break

   }
   onInitGame()
   
}

function startTimer() {
    const elTimer = document.querySelector('.timer')
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
       var diff = Date.now() - gStartTime
       elTimer.innerText = (diff / 1000).toFixed(2)
    }, 10)
}
function resetTimer() {
   //  bestScore(gTimer)
    clearInterval(gTimerInterval)
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = '0.00'
}

