const SYMBOLS = {
  x:'X',
  o:'O'
}
const RESULT = {
  incomplete: 0,
  playerXWon: SYMBOLS.x,
  playerOWon: SYMBOLS.o,
  tie: 3
}
const VIEW = {
  question1: 1,
  question2: 2,
  game: 3,
  result: 4
}

function Board (options){
  model = {
    players: [
      {
        symbol: null,
        isComputer: false,
        score: 0
      },
      {
        symbol: null,
        isComputer: false,
        score: 0
      }
    ]
  }

  function initGame(){
    model.game= {
      _gameBoard: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ],
      result:{
        result: RESULT.incomplete,
        winningLine: null
      },
      turn: Math.round(Math.random()), //we set this var randomly for the first move.
    }
  }

    function getResult(board){
      // returns an object with the RESULT and an array of the winning line
      // console.log('getResult S')
      let winningLine
      let line
      let result = RESULT.tie

      // if (model.game.move<5){
      //   result=RESULT.incomplete
      //   return {result}
      // }

      //first we check row, then column, then diagonal
      for (var i = 0 ; i<3 ; i++){
        line = board[i].join('')
        if(line === 'XXX' || line === 'OOO'){
          result = (line[0] === SYMBOLS.x)? RESULT.playerXWon : RESULT.playerOWon;
          winningLine = [[i,0], [i,1], [i,2]]
          return {result, winningLine};
        }
      }

      for (var j=0 ; j<3; j++){
        let column = [board[0][j],board[1][j],board[2][j]]
        line = column.join('')
        if(line == 'XXX' || line === 'OOO'){
          result = (line[0] === SYMBOLS.x)? RESULT.playerXWon : RESULT.playerOWon;
          winningLine = [[0,j], [1,j], [2,j]]
          return {result, winningLine};
        }
      }

      let diag1 = [board[0][0],board[1][1],board[2][2]]
      line = diag1.join('')
      if(line == 'XXX' || line === 'OOO'){
        result = (line[0] === SYMBOLS.x)? RESULT.playerXWon : RESULT.playerOWon;
        winningLine = [[0,0], [1,1], [2,2]]
        return {result, winningLine};
      }

      let diag2 = [board[0][2],board[1][1],board[2][0]]
      line = diag2.join('')
      if(line == 'XXX' || line === 'OOO'){
        result = (line[0] === SYMBOLS.x)? RESULT.playerXWon : RESULT.playerOWon;
        winningLine = [[2,2], [1,1], [0,0]]
        return {result, winningLine};
      }

      //Check for Incomplete
      for (let row = 0 ; row<board.length ; row++){
        for (let column = 0 ; column<board[row].length ; column++){
          if (board[row][column]==""){
            result = RESULT.incomplete
            break;
          }
        }
      }
      
      return {result}
    }

// function didPlayer1Win (player1Symbol, result){
//   let player1Symbol = player1Symbol || model.symbols.player1
//   result = result || model.game.result
//   let option1 = (result.result==RESULT.playerXWon && player1Symbol==SYMBOLS.x)
//   let option2 = (result.result==RESULT.playerOWon && player1Symbol==SYMBOLS.o)
//   return option1||option2
// }

function copyBoard(board) {
  let copy = []
   for (let row = 0 ; row<3 ; row++){
    copy.push([])
    for (let column = 0 ; column<3 ; column++){
      copy[row][column] = board[row][column]
    }
  }
  return copy
}

function getComputerMove (board) {

  let availableMoves = []
  let computerSymbol = model.players[1].symbol
  let playerSymbol = model.players[0].symbol

  for (let row = 0 ; row<3 ; row++){
    for (let column = 0 ; column<3 ; column++){
      if (board[row][column]===""){
        availableMoves.push({row, column, symbol: computerSymbol})
      }
    }
  }

  let moveResults = availableMoves.map((move)=>{
    let boardCopy = copyBoard(board)
    boardCopy = applyMove(boardCopy,move)
    let result = getResult(boardCopy).result
    return {move,result}
  })

  moveResults = moveResults.sort((move)=>{
    if(move.result === computerSymbol)
      return -1
    else if(move.result === playerSymbol)
      return 1
    else
      return 0
  })

  console.log(moveResults)
  return moveResults[0].move

}


function htmlQ1(){
  // console.log('html1S')
  const html1 = `<div id="view1"><p>Which do you prefer?\n</p>
  <button class="buttons1" data="1player">Man Against computer</button>
  <button class="buttons1" data="2players">Man Against Man</button>
  </div>`
  return html1
}

function htmlQ2(){
  // console.log('html2S')
  const html2=`<div id="view2"><p>${!model.players[1].isComputer? "Player 1 - " : ""}Which symbols would you like to use?</p>
  <button class="buttons2" data='X'>X</button>
  <button class="buttons2" data='O'>O</button></div>`
  return html2
}

function htmlGame (){
  // console.log('html3S')
  //TODO: calculate moveNumber
  let moveNumber = 1

  let playerName = 'Computer'
  if(!model.players[model.game.turn].isComputer)
    playerName = model.game.turn === 0 ? 'Player1' : 'Player2'

  let htmlBefore = `<p>move: ${moveNumber} &emsp; &ensp; turn: ${playerName}</p>`
  let board = model.game._gameBoard.reduce(function(acc,curr,rowIndex){
      return acc + `<div class="row">${curr.map((str,itemIndex)=>`<div class="cell" data-row=${rowIndex} data-column=${itemIndex}>${str}</div>`).join('')}</div>`
    }, ``)
  let htmlAfter = `<p>Score: Player 1 - ${model.players[0].score} &emsp; &ensp; Player 2 - ${model.players[1].score}</p>`
  return `<div id='gameView'> ${htmlBefore} <div id="board">${board}</div> ${htmlAfter} </div>`
}

function getPlayerName(playerSymbol){
  if(playerSymbol === model.players[0].symbol)
    return model.players[0].isComputer ? 'Computer' : "Player1"
  else
    return model.players[1].isComputer ? 'Computer' : "Player2"
}

function htmlGameEnd (){
  // console.log('html4S')
  let {result, winningRow} = getResult(model.game._gameBoard)

  let resultText = "tie"
  if(result !== RESULT.tie)
    resultText = getPlayerName(result) + " won"


  let htmlBefore = `<p>${resultText} &emsp; &ensp; Click to restart game </p> `
  let board = model.game._gameBoard.reduce(function(acc,curr,rowIndex){
      return acc + `<div class="row">${curr.map((str,itemIndex)=>`<div class="cell" data-row=${rowIndex} data-column=${itemIndex}>${str}</div>`).join('')}</div>`
    }, ``)
  let htmlAfter = `<p>Score: Player 1 - ${model.players[0].score} &emsp; &ensp; Player 2 - ${model.players[1].score}</p>`
  return `<div id='resultView'> ${htmlBefore} <div id="board">${board}</id> ${htmlAfter} </div>`
}

function render(view){
  // console.log('renderS')
  let html = ''
  if (view == VIEW.question1) {html = htmlQ1()}
  else if (view == VIEW.question2) {html = htmlQ2()}
  else if (view == VIEW.result) {html=htmlGameEnd()}
  else {html=htmlGame()}
  // console.log(html)
  options.el.innerHTML = html
}


function question1Handler (ev){
  model.players[1].isComputer = !($(ev.currentTarget).attr('data')==="2players")
  render(VIEW.question2)
}

function question2Handler (ev){
  let player1Symbol = $(ev.currentTarget).attr('data')
  model.players[0].symbol=player1Symbol;
  model.players[1].symbol=(player1Symbol===SYMBOLS.x)? SYMBOLS.o: SYMBOLS.x;

  if(model.players[model.game.turn].isComputer)
    doComputerMove()
  
  beginGame()
}

function doComputerMove (){
  let move = getComputerMove(model.game._gameBoard)
  executeTurn(model.game._gameBoard, move)
}


function playerMoveHandler (ev){
  let symbol = model.players[model.game.turn].symbol
  let row = parseInt($(ev.currentTarget).attr('data-row'))
  let column = parseInt($(ev.currentTarget).attr('data-column')) 
  executeTurn(model.game._gameBoard, {row, column, symbol})
}

function applyMove(board,move) {
  if (board[move.row][move.column]!==""){
    return board
  }

  board[move.row][move.column]= move.symbol
  return board
}

function executeTurn(board, move) {
  // applyMove(model.game._gameBoard, row, column, symbol)
  applyMove(board,move)
  
  model.game.turn = (model.game.turn+1)%2
  
  let result = getResult(board).result

  if (result === RESULT.incomplete){
    render(VIEW.game)
  }

  else {
    //Increment score and show result
    //MAGIC - translate symbol to player index
    if(result !== RESULT.tie) {
      let winningPlayer = model.players.find((player)=>{return player.symbol == result})
      winningPlayer.score++
    }
    
    render(VIEW.result)
  }

  if (model.players[model.game.turn].isComputer){
    doComputerMove()
  }
}



function beginGame(){
  initGame()
  render(VIEW.game)

  if(model.game.turn === 1 && model.players[1].isComputer)
    doComputerMove();
}

  $(options.el).on('click', '.buttons1', question1Handler)
  $(options.el).on('click', '.buttons2', question2Handler)
  $(options.el).on('click', '#gameView .cell', playerMoveHandler)
  $(options.el).on('click', '#resultView', beginGame)

  initGame()
  render (VIEW.question1)
}



const board = new Board ({
  el : document.getElementById('root')
})
