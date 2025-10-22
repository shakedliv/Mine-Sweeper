'use strict'

function onCellClicked(elCell, i, j) { 
   // modal
   gBoard[i][j].isRevealed = true
   // DOM
   elCell.classList.remove('hidden')
}

function onCellMarked(elCell, i, j) {}

function checkGameOver() { }

function expandReveal(board, elCell, i, j) {}
