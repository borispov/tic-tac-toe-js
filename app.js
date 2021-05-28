const rl = require('readline-sync');

const combos = [
  // diagonal
  [0,4,8], [2,4,6],
  // horizontal
  [0,1,2], [3,4,5], [6,7,8],
  // vertical
  [0,3,6], [1,4,7], [2,5,8]
]

// can add time-travel features, i.e. store previous moves etc..
const initState = {
  board: [ " ", " ", " ", " ", " ", " ", " ", " " ," " ],
}

const countVals = ar => v => ar.filter(x => x === v).length
const countXs = board => countVals(board)("X")
const countOs = board => countVals(board)("O")
const mapXOs    = v => (x,i) => x == v ? i : ""
const filterXOs = arr => arr.filter(a=>a)
const getPoints = board => val =>
  val === "X"
    ? board.map(mapXOs("X")).filter(a => typeof a == 'number')
    : board.map(mapXOs("O")).filter(a => typeof a == 'number')

// IF There are more X's than O's -- then it is Player's 2 (O) turn.
const nextTurn = ({ board }) => countXs(board) > countOs(board) ? "O" : "X";
// Basic Validators
const validTypeMove = move => parseInt(move) >= 1 && parseInt(move) <= 9
const validMove = ({ board }) => move =>  validTypeMove(move) && board[(move -1)] === " "
  
// Messages i.e. console.logs
const showBoard = board => {
// Board Printing {{{
  console.log(" ");
  console.log(" " + board[0] + " | " + board[1] + " | " + board[2]);
  console.log("-------------");
  console.log(" " + board[3] + " | " + board[4] + " | " + board[5]);
  console.log("-------------");
  console.log(" " + board[6] + " | " + board[7] + " | " + board[8]);
  console.log(" ");
// " }}}
};
const showRefBoard = () => {
  // Reference Board For Player {{{
  console.log("\n\n---------------------------------------------------------------");
  console.log("TIC TAC TOE: Enter the numbered square to occupy. X goes first.\n");
  console.log("Square numbers:\n");
  console.log("\t0|1|2");
  console.log("\t-----");
  console.log("\t3|4|5");
  console.log("\t-----");
  console.log("\t6|7|8");
  console.log("\n---------------------------------------------------------------\n\n");
  // }}}
};
const invalidMoveMsg = () => {
  console.log("INVALID MOVE! Try Again..")
  console.log("------- ------- ------")
}
const gameoverMsg = (winner) => { console.log("GAME OVER! \n"  + "Player: "  + winner  + " Has Won!" ) }

const getMove = state => {
  let answer = parseInt(rl.question("Pick a square, from 1 to 9: "));
  if (!validMove(state)(answer)) {
    invalidMoveMsg();
    getMove(state);
  };
  return answer;
};

const isWinning = position =>  combos.some(combo =>  combo.every(n =>  position.includes(n)));

const checkWinner = xos => {
  const xs = getPoints(xos)("X")
  const os = getPoints(xos)("O")
  return isWinning(xs) ? "X" : isWinning(os) ? "O" : false
};

const nextState = oldState => nextMove => ({
  board: oldState.board.map((x, i) => i === (nextMove -1)  ? x = nextTurn(oldState)  : x),
  ...oldState,
});

// recursive
const run = (state, next, endFun, err) => {
  if (!err) showBoard(state.board);
  if ( checkWinner(state.board) ) {
    return endFun(checkWinner(state.board));
  };
  let move = getMove(state);

  run(next(state)(move), next, endFun);
};

const initiate = () => {
  showRefBoard(initState.board);
  run(initState, nextState, gameoverMsg)
};

initiate();
