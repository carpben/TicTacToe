const RESULT = {
  incomplete: 0,
  player1Won: 1,
  player2Won: 2,
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
    player2IsHuman:false,
    symbolOptions: {x:'X', o:'O'},
    symbols: {
      player1: '',
      player2: ''
    },
    totalscore: {
      player1: 0,
      player2: 0
    },
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
      move: 1, //between 1 and 9
      isPlayer1Next: Boolean(Math.round(Math.random())), //we set this var randomly for the first move.
    }
  }

  function setSymbols(char){
      //We can receive only x or 0. The input char will be used for player1, the other char by player2.
      if (!char.match(/[XO]/)){
        return ("The chosen char can only be X or O")
      }
      model.symbols.player1=char;
      model.symbols.player2=(char==='X')? 'O': 'X';
    }

  function applyMove(row, column, symbol){
      if (!(model.game._gameBoard[row][column]==="")){
        return
      }
      model.game._gameBoard[row][column]= symbol
    }

    function setNextMove(){
      model.game.move ++
      model.game.isPlayer1Next= !(model.game.isPlayer1Next)
    }

    function getComputerMove (){
      console.log('getComputerMove S')
      let row = 0
      let column = 0;
      do {
        row = Math.floor( Math.random() * 3)
        //let Math.floor(Math.random() * this.length)
        column = Math.floor( Math.random() * 3)
      } while (model.game._gameBoard[row][column]!="")
      return {row,column}
    }


    function getResult(){
      // returns an object with the RESULT and an array of the winning line
      console.log('getResult S')
      let board= model.game._gameBoard
      let winningLine
      let line
      let result

      if (model.game.move<5){
        result=RESULT.incomplete
        return {result}
      }

      //first we check row, then column, then diagonal
      for (var i = 0 ; i<3 ; i++){
        line = board[i].join('')
        if(line == 'XXX' || line == 'OOO'){
          result = (line[0] === model.symbols.player1)? RESULT.player1Won : RESULT.player2Won;
          winningLine = [[i,0], [i,1], [i,2]]
          return {result, winningLine};
        }
      }

      for (var j=0 ; j<3; j++){
        let column = [board[0][j],board[1][j],board[2][j]]
        line = column.join('')
        if(line == 'XXX' || line == 'OOO'){
          result = (line[0] === model.symbols.player1)? RESULT.player1Won : RESULT.player2Won;
          winningLine = [[0,j], [1,j], [2,j]]
          return {result, winningLine};
        }
      }

      let diag1 = [board[0][0],board[1][1],board[2][2]]
      line = diag1.join('')
      if(line == 'XXX' || line == 'OOO'){
        result = (line[0] === model.symbols.player1)? RESULT.player1Won : RESULT.player2Won;
        winningLine = [[0,0], [1,1], [2,2]]
        return {result, winningLine};
      }
      let diag2 = [board[0][2],board[1][1],board[2][0]]
      line = diag2.join('')
      if(line == 'XXX' || line == 'OOO'){
        result = (line[0] === model.symbols.player1)? RESULT.player1Won : RESULT.player2Won;
        winningLine = [[0,0], [1,1], [2,2]]
        return {result, winningLine};
      }

      if (model.game.move==9){
        result=RESULT.tie
        return {result}
      }

      result=RESULT.incomplete
      return {result}
    }

    function htmlQ1(){
      console.log('html1S')
      const html1 = `<div id="view1"><p>Which do you prefer?\n</p>
      <button class="buttons1" data="1player">Man Against computer</button>
      <button class="buttons1" data="2players">Man Against Man</button>
      </div>`
      return html1
    }
    function htmlQ2(){
      console.log('html2S')
      const html2=`<div id="view2"><p>${model.player2IsHuman? "Player 1 - " : ""}Which symbols would you like to use?</p>
      <button class="buttons2" data='X'>X</button>
      <button class="buttons2" data='O'>O</button></div>`
      return html2
    }
    function htmlGame (){
      console.log('html3S')
      let htmlBefore = `<p>move: ${model.game.move} &emsp; &ensp; turn: ${model.game.isPlayer1Next? 'Player 1' : model.player2IsHuman? 'Player2' : 'Computer'}</p>`
      let board = model.game._gameBoard.reduce(function(acc,curr,rowIndex){
          return acc + `<div class="row">${curr.map((str,itemIndex)=>`<div class="cell" data-row=${rowIndex} data-column=${itemIndex}>${str}</div>`).join('')}</div>`
        }, ``)
      let htmlAfter = `<p>Score: Player 1 - ${model.totalscore.player1} &emsp; &ensp; Player 2 - ${model.totalscore.player2}</p>`
      return `<div id='gameView'> ${htmlBefore} <div id="board">${board}</div> ${htmlAfter} </div>`
    }

    function htmlResult (){
      console.log('html4S')
      let resultText = "TIE"
      if (model.game.result.result==RESULT.tie){
        resultText = "TIE"
      } else if (model.game.result.result==RESULT.player1Won){
        resultText = "player 1 Won"
      } else {
        resultText =  model.player2IsHuman? "Player 2 Won" : "Computer Won"
      }
      let htmlBefore = `<p>${resultText} &emsp; &ensp; Click to restart game </p> `
      let board = model.game._gameBoard.reduce(function(acc,curr,rowIndex){
          return acc + `<div class="row">${curr.map((str,itemIndex)=>`<div class="cell" data-row=${rowIndex} data-column=${itemIndex}>${str}</div>`).join('')}</div>`
        }, ``)
      let htmlAfter = `<p>Score: Player 1 - ${model.totalscore.player1} &emsp; &ensp; Player 2 - ${model.totalscore.player2}</p>`
      return `<div id='resultView'> ${htmlBefore} <div id="board">${board}</id> ${htmlAfter} </div>`
    }

    function render(view){
      console.log('renderS')
      let html = ''
      if (view == VIEW.question1) {html = htmlQ1()}
      else if (view == VIEW.question2) {html = htmlQ2()}
      else if (view == VIEW.result) {html=htmlResult()}
      else {html=htmlGame()}
      console.log(html)
      options.el.innerHTML = html
    }


  function controlQuestion1 (ev){
    model.player2IsHuman = ($(ev.currentTarget).attr('data')==="2players")
    console.log(model)
    render(VIEW.question2)
  }

  function controlQuestion2 (ev){
    setSymbols($(ev.currentTarget).attr('data'))
    render(VIEW.game)
    if (!model.game.isPlayer1Next && !model.player2IsHuman){
      controlComputerMove()
    }
  }

  function controlComputerMove (){
    let cell = getComputerMove()
    let symbol = (model.game.isPlayer1Next) ? model.symbols.player1 : model.symbols.player2;
    applyMove(cell.row, cell.column, symbol)
    model.game.result = getResult()

    if (model.game.result.result ==RESULT.incomplete){
      setNextMove()
      render(VIEW.game)
    }
    else {
      if (model.game.result.result==RESULT.player2Won) {model.totalscore.player2++}
      render(VIEW.result)
    }
  }


  function controlGame (ev){
    let symbol = (model.game.isPlayer1Next) ? model.symbols.player1 : model.symbols.player2;
    applyMove($(ev.currentTarget).attr('data-row'),$(ev.currentTarget).attr('data-column'), symbol)
    model.game.result = getResult()

    if (model.game.result.result ==RESULT.incomplete){
      setNextMove()
      render(VIEW.game)
    }
    else {
      if (model.game.result.result==RESULT.player1Won) {model.totalscore.player1++}
      if (model.game.result.result==RESULT.player2Won) {model.totalscore.player2++}
      render(VIEW.result)
    }
    if (!model.game.isPlayer1Next && !model.player2IsHuman){
      controlComputerMove()
    }
  }

  function controlNewGame (){
    initGame()
    render(VIEW.game)
  }

  $(options.el).on('click', '.buttons1', controlQuestion1)
  $(options.el).on('click', '.buttons2', controlQuestion2)
  $(options.el).on('click', '#gameView .cell', controlGame)
  $(options.el).on('click', '#resultView', controlNewGame)

  initGame()
  render (VIEW.question1)
}



const board = new Board ({
  el : document.getElementById('root')
})
