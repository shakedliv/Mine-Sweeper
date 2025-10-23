'use strict'

function onCellClicked(elCell, i, j) {
   var currCell = gBoard[i][j]
   if (currCell.isMarked) return
   if (currCell.isRevealed) return
   if (gIsSafeClickOn) return
   if (!gGame.isGameOn) return
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
      //not working :/
      //  if (gHints.isHintOn) { // use hint
      //      if (currCell.isRevealed) return
      //      useHint(i, j, true)
      //      setTimeout(() => {
         //          useHint(i, j, false)
         //      }, 1500)
         //  } else { // actually click it
         
         expandReveal(gBoard, elCell, i, j)
         //modal
         gCellsReveled++
         currCell.isRevealed = true
         // DOM
         elCell.classList.remove('hidden')
         if (currCell.isMine) {
            const elSmileyButton = document.querySelector('.smiley-button')
            gLivesLeft--
            renderLives()
            const explosionSound = new Audio('sounds/explosion.mp3')
            explosionSound.play()
            elSmileyButton.innerText = '🤕'
            
            setTimeout(() => {
               if (!gGame.isGameOn) return
               elSmileyButton.innerText = '😀'
               gCellsReveled--
               currCell.isRevealed = false
               elCell.classList.add('hidden')
            }, 2000)
         }
         else {
            const tubSound = new Audio('sounds/tub.mp3')
            tubSound.play() 
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
    } else {
        elFlag.innerText = ' '
        gGame.markedCount--
    }
}

function checkGameOver() {
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
// not working :/
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

function markSafeCell() {
    if (!gGame.isGameOn) return
    if (gSafeClicksLeft === 0) return
    gSafeClicksLeft--
    const elSafeClickCounter = document.querySelector('.safe-click-counter')
    elSafeClickCounter.innerText = gSafeClicksLeft + ' clicks available'
    gIsSafeClickOn = true
    const safeCell = getRandomEmptyCell(gBoard) // obj{i, j}
    const elSafeCell = document.querySelector(
        `.cell-${safeCell.i}-${safeCell.j}`
    )
    elSafeCell.style.backgroundColor = 'yellow'
    setTimeout(() => {
        elSafeCell.style.backgroundColor = ''
        gIsSafeClickOn = false
    }, 1500)
}

function toggleDarkMode() {
    const elBody = document.querySelector('body')
    const elDarkModeBtn = document.querySelector('.dark-mode')

    const elBtns = document.querySelectorAll('button')
    if (!gIsDarkMode) {
        elDarkModeBtn.innerText = 'Dark mode'
        elBody.style.backgroundColor = 'whitesmoke'
        elBody.style.color = 'rgb(32, 32, 32)'
        elBtns.forEach((btn) => {
            btn.style.backgroundColor = '#296577'
            btn.style.color = 'rgba(255, 254, 254, 1)'
        })

        gIsDarkMode = !gIsDarkMode
    } else {
        elDarkModeBtn.innerText = 'light mode'
        elBody.style.backgroundColor = 'rgb(32, 32, 32)'
        elBody.style.color = 'rgba(43, 110, 100, 1)'
        elBtns.forEach((btn) => {
            btn.style.backgroundColor = '#141c1fff'
            btn.style.color = 'rgba(43, 110, 100, 1)'
        })
        gIsDarkMode = !gIsDarkMode
    }
}
