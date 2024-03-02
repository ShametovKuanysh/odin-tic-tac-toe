const gameboard = (function (){
    const board = []
    const row = 3
    const col = 3

    for (i = 0; i < row; i++){
        board[i] = []
        for (j = 0; j < col; j++){
            board[i].push(Cell(i, j))
        }
    }

    const takeCell = (player, cell) => {
        board.map(row => {
            row.map(c => {
                if (c.getIndex() == cell) {
                    if (c.getValue() == ""){
                        c.setValue(player.value)
                    }
                }
            })
        })
    }

    const clearBoard = () => {
        for (i = 0; i < row; i++){
            board[i] = []
            for (j = 0; j < col; j++){
                board[i].push(Cell(i, j))
            }
        }
    }

    const getBoard = () => board

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    }

    return {takeCell, printBoard, getBoard, clearBoard}
})()

function Cell(x, y){
    let value = ""
    const index = x*3+y

    const setValue = (val) => value = val
    const getValue = () => value

    const getIndex = () => index
    return {getIndex, setValue, getValue}
}

const Player = (name, value) => {
    return {name, value}
}

function Game(){
    const players = []

    let gameOver = false

    let activePlayer

    const getGameOver = () => gameOver

    const setGameOver = (go) => gameOver = go

    const getActivePlayer = () => activePlayer

    const setActivePlayer = () => {
        if (getActivePlayer() == players[0]){
            activePlayer = players[1]
        } else activePlayer = players[0]
    }

    const playRound = (index) => {
        setActivePlayer()
        gameboard.takeCell(getActivePlayer(), index)
    }

    const restart = () => {
        gameboard.clearBoard()
        setGameOver(false) 
        players.splice(0, 2)
        activePlayer = null
        players.push(Player(document.getElementById("player1").value || "player1", "X"))
        players.push(Player(document.getElementById("player2").value || "player2", "O"))
    }

    return {
        playRound,
        getGameOver,
        setGameOver,
        getActivePlayer,
        restart
    }
}

const screen = (function(){
    const game = Game()
    const drawBoard = () => {
        const board = document.getElementById("board")

        board.textContent = ""
        const bb = gameboard.getBoard()
        bb.map(row => {
            row.map(cel => {
                const div = document.createElement("div")
                div.dataset.index = cel.getIndex()
                div.textContent = cel.getValue()
                div.addEventListener("click", (e) => {
                    if (game.getGameOver()) return
                    game.playRound(cel.getIndex())
                    drawBoard()
                    if (checkForWin(gameboard.getBoard())){
                        game.setGameOver(true)
                        document.getElementById("result").innerHTML = game.getActivePlayer().name + " - Win"
                    } else if (checkForTie(gameboard.getBoard())){
                        game.setGameOver(true)
                        document.getElementById("result").innerHTML = "Draw"
                    }
                })

                board.appendChild(div)
            })
        })
    }

    const restart = () => {
        game.restart()
        drawBoard()
        document.getElementById("result").innerHTML = ""
    }

    return {drawBoard, restart}
})()

function checkForWin(board) {
    const winningCombinations = [
      [[0, 0], [0,1], [0,2]],
      [[1, 0], [1,1], [1,2]],
      [[2, 0], [2,1], [2,2]],
      [[0, 0], [1,0], [2,0]],
      [[0, 1], [1,1], [2,1]],
      [[0, 2], [1,2], [2,2]],
      [[0, 0], [1,1], [2,2]],
      [[0, 2], [1,1], [2,0]],
    ];
  
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a[0]][a[1]].getValue() 
            && board[a[0]][a[1]].getValue() === board[b[0]][b[1]].getValue() 
            && board[a[0]][a[1]].getValue() === board[c[0]][c[1]].getValue()) {
        return true;
      }
    }
    return false;
  }
  
  function checkForTie(board) {
    return board.every((row) => row.every(cell => cell.getValue() !== ""));
  }

screen.drawBoard()

document.getElementById("restart").addEventListener("click", (e) => screen.restart())