function Board (options){
  model = {
    currentView: 1, //1-question 1, 2 - question 2, 3 - game
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
    game: {
      _gameBoard: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ],
        move: 1
        player1Next: Boolean(Math.round(Math.random())),
  }

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

  function controlQuestion1 (ev){
    if ($(ev.currentTarget).attr('data')==="2players"){
      model.player2IsHuman=true
    }
    console.log(model)
    nextView()
    render()
  }

  function controlQuetion2 (ev){
    setSymbols($(ev.currentTarget).attr('data'))
    nextView()
    render()
  }

  function controlGame (ev){
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
  }

  $(options.el).on('click', '.buttons1', controlQuetion1(ev))
  $(options.el).on('click', '.buttons2', controlQuetion2(ev))
  $(options.el).on('click', '.cell', controlGame(ev))
}



const board = new Board ({
  el : document.getElementById('root')
})
