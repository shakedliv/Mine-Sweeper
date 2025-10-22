'use strict'

function onCellClicked(elCell, i, j) {
   if (gBoard[i][j].isMarked) return
   if(!gGame.isGameOn) return
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
      const elSmileyButton = document.querySelector('.smiley-button')
      gLivesLeft--
      renderLives()
      elSmileyButton.innerText = '🤕'
      setTimeout(() => {
         if(gGame.isGameOn) elSmileyButton.innerText = '😀'
         currCell.isRevealed = false
         elCell.classList.add('hidden')
      }, 2000)
   }
   else {
      gCellsReveled++ 
      gBoard[i][j].isMarked = true
   }
   console.log(gCellsReveled);
   checkGameOver()
}

function onCellMarked(elCell, i, j, event) {
   event.preventDefault()
   if(gCellsReveled === 0) return
   if(gBoard[i][j].isRevealed) return
   //Model
   gBoard[i][j].isMarked = !gBoard[i][j].isMarked
   //DOM
   const elFlag = elCell.querySelector('.flag')
   if (gBoard[i][j].isMarked) {
      elFlag.innerText = FLAG
      gGame.markedCount++
   }
   else {
      elFlag.innerText = ' ' 
      gGame.markedCount--
   }
}

function checkGameOver() {
   console.log('gGame.markedCount:', gGame.markedCount)
   const elSmileyButton = document.querySelector('.smiley-button')
   if (gLivesLeft === 0) {
      elSmileyButton.innerText = '😵'
      gGame.isGameOn = false
   }
   //todo if all mines are marked and the rest of the cells are revealed, victory
   else if (gGame.markedCount === gLevel.MINES && gCellsReveled === gTotalCells - gLevel.MINES) {
      console.log('you won');
      elSmileyButton.innerText = '😎'
      gGame.isGameOn = false
   }
   
}

function expandReveal(board, elCell, i, j) {}
