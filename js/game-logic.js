'use strict'

function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!isFirstCellClicked) {
        setMinesRandomly(2)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        const elNewCell = document.querySelector(`.cell-${i}-${j}`)
        elNewCell.classList.remove('hidden')
       isFirstCellClicked = true
    }
    // modal
    currCell.isRevealed = true
    // DOM
    elCell.classList.remove('hidden')

   if (currCell.isMine) {
      gLivesLeft--
      setTimeout(() => {
         console.log('boom')
         currCell.isRevealed = false
         elCell.classList.add('hidden')
      }, 2000)
   }
   else {gCellsReveled++}
    checkGameOver()
}

function onCellMarked(elCell, i, j, event) {
   
   event.preventDefault()

}

function checkGameOver() {
   const elSmileyButton = document.querySelector('.smiley-button')
   if (gLivesLeft === 0) {
      elSmileyButton.innerText = '😵'
   }
   //todo if all mines are marked and the rest of the cells are revealed, victory
   else if (gGame.markedCount === gLevel.MINES && gCellsReveled === gTotalCells - gLevel.MINES) {
      console.log('you won');
      elSmileyButton.innerText = '😎'
   }
}

function expandReveal(board, elCell, i, j) {}
