'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function getRandomCell(board) {
	const emptyCells = []
   for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
         if(!board[i][j].isMine)
            emptyCells.push({ i, j })// creates an object array {i: i, j: j}
      }
   }
	const randomIdx = getRandomInt(0, emptyCells.length)
	return emptyCells[randomIdx] // returns obj - {i, j}
}