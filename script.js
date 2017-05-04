function Board (options){
  let model = {
    currentView: 1, //1-question 1, 2 - question 2, 3 - game
    player2IsHuman: false,  //determines if player 2 is the computer or the user
    symbolOptions: {x:'X', o:'O'},
    symbols: {
      player1: '',
      player2: ''
    },
    totalscore: {
      player1: 0,
      player2: 0
    }
  }

  console.log(model)
  function initGame(){
    model.game= {
      _gameBoard: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ],
        move: 1, //between 1 and 9
        isPlayer1Next: Boolean(Math.round(Math.random())), //we set this var randomly for the first move.
      result: {
        gameEnd: false,
        player1Won: false,
        player2Won: false,
        tie: false,
        winningLine:[]
      }
    }
  }
console.log(model)

  function nextView(){
    model.currentView ++
  }

  function setSymbols(char){
    //We can receive only x or 0. The input char will be used for player1, the other char by player2.
    if (!char.match(/[XO]/)){
      return ("The chosen char can only be X or O")
    }
    model.symbols.player1=char;
    if (char==='X'){
      model.symbols.player2='O'
    } else {
      model.symbols.player2='X'
    }
  }

  function setGameBoard(row, column){
    if (!(model.game._gameBoard[row][column]==="")){
      return
    } else {
      let symbol = (model.game.isPlayer1Next) ? model.symbols.player1 : model.symbols.player2;
      model.game._gameBoard[row][column]= symbol
    }
  }

  function setNextMove(){
    model.game.move ++
    model.game.isPlayer1Next= !(model.game.isPlayer1Next)
  }

  function checkResult(){
    if (model.game.move<5){
      return
    }
    console.log('check results')
    let board= model.game._gameBoard
    let result=model.game.result

    function setResults (winningChar, winningArr){
      result.gameEnd=true
      if (winningChar===""){
        result.tie=true
        return
      }
      console.log('we have a winner')
      result.winningLine=winningArr
      if (model.symbols.player1===winningChar){
        result.player1Won=true
        model.totalscore.player1++
      } else {
        result.player2Won=true;
        model.totalscore.player2++
      }
      return
    }
    function checkLines(char){
      //checks for a winning line, and calls setResults

      //first we check row, then column, then diagonal
      for (var i = 0 ; i<board.length ; i++){
        for (var j=0 ; j<3; j++){
          if (char!=board[i][j]){
            break
          } else if (j===2) {
            setResults(char, [[i,0],[i,1],[i,2]])
            return
          }
        }
      }
      for (var i = 0 ; i<3 ; i++){
        for (var j=0 ; j<board.length; j++){
          if (char!=board[j][i]){
            break
          } else if (j===2) {
            setResults([0,j],[1,j],[2,j])
            return
          }
        }
      }
      if (board[2,2]=char){
        if ((board[1,1]===char)&&(board[3,3])===char){
          setResults([1,1],[2,2],[3,3])
          return
        } else if ((board[3,1]===char)&&(board[1,3])) {
          setResults ([3,1],[2,2],[1,3])
        }
      }
    }
    checkLines (model.symbols.player1)
    if (!model.game.result.gameEnd){checkLines (model.symbols.player2)}
    if (!model.game.result.gameEnd && model.game.Move===9){setResults("",[])}
  }

  function computerMove (){

  }
  function html1(){
    console.log('html1S')
    const html1 = `<div id="view1"><p>Which do you prefer?\n</p>
    <button class="buttons1" data="1player">Man Against computer</button>
    <button class="buttons1" data="2players">Man Against Man</button>
    </div>`
    return html1
  }
  function html2(){
    console.log('html2S')
    const html2=`<div id="view2"><p>${model.player2IsHuman? "Player 1 - " : ""}Which symbols would you like to use?</p>
    <button class="buttons2" data='X'>X</button>
    <button class="buttons2" data='O'>O</button></div>`
    return html2
  }
  function html3 (){
    console.log('html3S')
    let board = ""
    result = model.game.result
    if (result.gameEnd){
      board = model.game._gameBoard.reduce(function(acc,curr,rowIndex){
        return acc + `<div class="row">${curr.map((str,itemIndex)=>`<div class="cell" data-row=${rowIndex} data-column=${itemIndex}>${str}</div>`).join('')}</div>`
      }, `${(result.tie)? "TIE" : (result.player1Won)? "Player 1 Won" : (model.player2IsHuman)? "Player 2 Won" : "Computer Won"  }`)
    } else {
      board = model.game._gameBoard.reduce(function(acc,curr,rowIndex){
        return acc + `<div class="row">${curr.map((str,itemIndex)=>`<div class="cell" data-row=${rowIndex} data-column=${itemIndex}>${str}</div>`).join('')}</div>`
      },`move: ${model.game.move} &emsp turn: ${model.game.isPlayer1Next? 'Player 1' : model.player2IsHuman? 'Player2' : 'Computer'}`)
    }
    return `<div class="board"> ${board} Score: Player 1 - ${model.totalscore.player1}, Player2 - ${model.totalscore.player2}</div>`
  }

  function render(){
    console.log('renderS')
    let html = ''
    if (model.currentView == 1) {html = html1()}
    else if (model.currentView ==2) {html = html2()}
    else {
      html=html3()
    }
    console.log(html)
    options.el.innerHTML = html
  }


  $(options.el).on('click', '.buttons1', function(ev){
    if ($(ev.currentTarget).attr('data')==="2players"){
      model.player2IsHuman=true
    }
    console.log(model)
    nextView()
    render()
  })
  $(options.el).on('click', '.buttons2', function(ev){
    setSymbols($(ev.currentTarget).attr('data'))
    nextView()
    render()
  })
  $(options.el).on('click', '.cell', function(ev){
    setGameBoard($(ev.currentTarget).attr('data-row'),$(ev.currentTarget).attr('data-column'))
    checkResult()
    if (model.game.result.gameEnd){
      render()
      //stole for 5 seconds
      initGame()
    } else {
      setNextMove()
    }
    render()
  })

  initGame()
  render()
}

const board = new Board ({
  el : document.getElementById('root')
})
