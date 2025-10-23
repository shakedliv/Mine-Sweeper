'use strict'

function onCellClicked(elCell, i, j) {
    if (gBoard[i][j].isMarked) return
    if (!gGame.isGameOn) return
    var currCell = gBoard[i][j]
    if (!isFirstCellClicked) {
        currCell.isRevealed = true
        startTimer()
        setMinesRandomly(gLevel.MINES)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        const elNewCell = document.querySelector(`.cell-${i}-${j}`)
        elNewCell.classList.remove('hidden')
        isFirstCellClicked = true
    }
    //  if (gHints.isHintOn) { // use hint
    //      if (currCell.isRevealed) return
    //      useHint(i, j, true)
    //      setTimeout(() => {
    //          useHint(i, j, false)
    //      }, 1500)
   //  } else { // actually click it
   
   expandReveal(gBoard, elCell, i, j)
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
            if (!gGame.isGameOn) return
            elSmileyButton.innerText = '😀'
            currCell.isRevealed = false
            elCell.classList.add('hidden')
        }, 2000)
    } else {
        gCellsReveled++
        gBoard[i][j].isMarked = true
    }
    checkGameOver()
}
// }

function onCellMarked(elCell, i, j, event) {
    event.preventDefault()
    if (gCellsReveled === 0) return
    if (gBoard[i][j].isRevealed) return
    //Model
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    //DOM
    const elFlag = elCell.querySelector('.flag')
    if (gBoard[i][j].isMarked) {
        elFlag.innerText = FLAG
        gGame.markedCount++
        checkGameOver()
        console.log('mark')
    } else {
        elFlag.innerText = ' '
        gGame.markedCount--
        console.log('unmark')
    }
}

function checkGameOver() {
   console.log('gGame.markedCount:', gGame.markedCount)
   console.log('gCellsReveled:', gCellsReveled)
   const elSmileyButton = document.querySelector('.smiley-button')
   if (gLivesLeft === 0) {
      showAllBombs()
      elSmileyButton.innerText = '😵'
      gGame.isGameOn = false
      clearInterval(gTimerInterval)
   } else if (
      gGame.markedCount === gLevel.MINES &&
      gCellsReveled === gTotalCells - gLevel.MINES
   ) {
      console.log('you won')
      const totalTime = (Date.now() - gStartTime) / 1000
        checkBestScore(totalTime, gLevel.SIZE)
        //   if (totalTime < gBestScore) setBestScore(totalTime)
        elSmileyButton.innerText = '😎'
        gGame.isGameOn = false
        clearInterval(gTimerInterval)
    }
}

function showAllBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                const elMineCell = document.querySelector(`.cell-${i}-${j}`)
                elMineCell.classList.remove('hidden')
                elMineCell.style.backgroundColor = 'rgb(255, 74, 74)'
            }
        }
    }
}
function useHint(cellI, cellJ, show) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            if (show) {
                elCurrCell.classList.remove('hidden')
            } else elCurrCell.classList.add('hidden')
        }
    }
    if (show && gHints.isGameOn) gHints.hintsLeft--
    renderHints()
}

function markHint(elHint) {
    if (gHints.isHintOn) return
    changeBackgroundColor(elHint, 'yellow')
    gHints.isHintOn = true
}

function setBestScore(level, totalTime) {
    //local storage
    localStorage.setItem('BestTime-' + level, totalTime)
   // DOM
   const elBestScore = document.querySelector('.best-score')
   const bestScore = localStorage.getItem('BestTime-' + level)
   console.log(bestScore);
   elBestScore.innerText = 'Best Score: ' + bestScore
}

function checkBestScore(totalTime, level) {
    switch (level) {
        case 4:
          if (totalTime < gBestScoreBeginner) {
             setBestScore(level, totalTime)
             // Modal
             gBestScoreBeginner = totalTime
          }
            break
        case 8:
          if (totalTime < gBestScoreMedium) {
             setBestScore(level, totalTime)
             gBestScoreMedium = totalTime
          }
            break
        case 12:
          if (totalTime < gBestScoreExpert) {
             setBestScore(level, totalTime)
             gBestScoreExpert = totalTime
          }
                break
    }
}

