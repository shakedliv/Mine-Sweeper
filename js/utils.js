'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function getRandomEmptyCell(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine && !board[i][j].isRevealed)
                emptyCells.push({ i, j }) // creates an object array {i: i, j: j}
        }
    }
    const randomIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randomIdx] // returns obj - {i, j}
}

function changeBackgroundColor(element, color) {
    element.style.backgroundColor = color
}

function expandReveal(board, elCell, cellI, cellJ) {
    if (countNeighbors(cellI, cellJ) !== 0) return

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var currCell = board[i][j]
            if (j < 0 || j >= board[i].length) continue
           if (countNeighbors(i, j) !== 0) continue // if not empty skip it
            if(j === cellJ && i === cellI) continue
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            // modal
            if(!currCell.isRevealed)gCellsReveled++
            currCell.isRevealed = true
            // DOM
           elCurrCell.classList.remove('hidden')
            // the recursion part not working :/
            // expandReveal(gBoard, elCurrCell, i,j)
        }
   }
}
