import styles from '../styles/Chess.module.css';
import * as Chess from 'js-chess-engine';
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";

export default function ChessPage() {
    // Tell React to put a div down that is
    // controlled by the makeGame function
    return <div ref={makeGame}/>;
}

// maps js-chess-engine's codes to text chess pieces
const GLYPHS = {
    K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
    k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟︎",
};

function makeGame(div) {
  // make a new html <table> to render chess
    const board = document.createElement('table');
    board.className = styles.board;
    fillInBoard(board);

    // put that table into the div we control
    div.appendChild(board);

    // make a new chess game
    const game = new Chess.Game();
    let gameState = game.exportJson();

    // loop through and update all the squares with a piece on them
    Object.keys(gameState.pieces).forEach(square => {
        // square will be "A1" through "H8"

        // get the html element representing that square
    const el = document.getElementById(square);

        // take that piece and put its corresponding glyph into the square
    const piece = gameState.pieces[square];
    el.innerText = GLYPHS[piece];
  });

    // either null or the actively selected square
    let selected = null;

    // make an onClick function
    const onClick = event => {
      
    console.log("gamestat", gameState)
    const square = event.target.id;
    console.log('square ' + square);
    console.log('selected ' + selected);

    addStyle(square,gameState)

    // Scan if moving piece
    if (selected && gameState.moves[selected].includes(square)) {
      
      console.log("Here")

      removeStyle(selected,gameState)

      // Move Piece
      game.move(selected, square);
      gameState = game.exportJson();

      // Refresh text by emptying old square
      document.getElementById(selected).innerText = "";

      // Place piece on its new square
      document.getElementById(square).innerText = GLYPHS[gameState.pieces[square]];

      // Reset the selection state to unselected
      selected = null;

      checkTurn(gameState)

      // Move AI
      setTimeout(function () {

      const [movedFrom, movedTo] = Object.entries(game.aiMove())[0];
      console.log("movedFrom", movedFrom)
      console.log("movedTo", movedTo)

      // Move the piece
        gameState = game.exportJson();

     // update the text by clearing out the old square
        document.getElementById(movedFrom).innerText = "";
      // and putting the piece on the new square
        document.getElementById(movedTo).innerText = GLYPHS[gameState.pieces[movedTo]];

        checkTurn(gameState)
      
      }, 500);
    
    
    } else if (gameState.moves[square]) {
      
      // selected piece that can move,
      // sets the selection to that piece
      console.log(" 2 selected", selected)
      console.log("2 square", square)

      removeStyle(selected,gameState)
      selected = square;
      addStyle(square,gameState)
    
    } else if (selected) {
      
      // user attempted to move piece randomly to a spot on the board
      console.log(" 3 selected", selected)
      console.log("3 square", square)
      
      return;
    
    }
    
    if (selected != null) {
      
      console.log('selected' + gameState.moves[selected]);
    
    }
  
  }
  
    // put that onClick function on every square
    Array.from(
      
      board.getElementsByClassName(styles.square)
      ).forEach(el => {
        el.onclick = onClick;
      });
    
    }
    
function addStyle(tile,gameState){
  if (tile != null) {
    if (gameState.moves[tile] != null) {
      gameState.moves[tile].forEach((element) => {
        const el = document.getElementById(element);
        el.classList.add(styles.isMoveOption);
      });
    
    }
  }
}

function removeStyle(tile,gameState){
  if (tile != null) {
    if (gameState.moves[tile] != null) {
      gameState.moves[tile].forEach((element) => {
        const el = document.getElementById(element);
        el.classList.remove(styles.isMoveOption);
      });
    }
  }
}

  function checkTurn(gameState) {
    // turn label
    const turn_header = document.getElementById("turn_header");
    if (gameState.turn === 'white') {
      turn_header.innerText = "Turn : Vincent"
    } else {
      turn_header.innerText = "Turn : AI"
    }
}

// makes a chess board out of an html table
  function fillInBoard(board) {
    const COLNAMES = " ABCDEFGH";

    const body = document.createElement('tbody');

    const turn_header = document.createElement('caption');
    turn_header.className = styles.turn_header
    turn_header.id = "turn_header"
    turn_header.innerText = "Turn : You"
    
    // make each row in the table
    for (let r = 8; r >= 1; r--) {
      const row = document.createElement('tr');

      // number each row
      const rowLabel = document.createElement('td');
      rowLabel.innerText = r.toString();
      row.appendChild(rowLabel);
      
      // add the board squares
      
      for (let c = 1; c <= 8; c++) {
        const colName = COLNAMES[c];
        const square = document.createElement('td');
        square.id = colName + r;

      // color alternating squares
        const color = (r + c) % 2 ? styles.white : styles.black;
        square.className = styles.square + ' ' + color;

        row.appendChild(square);
      }
      
      body.appendChild(row);
    }

    // put column numbers on the bottom
    
    const footer = document.createElement('tr');
    for (let c = 0; c <= 8; c++) {
      const label = document.createElement('td');
      label.innerText = COLNAMES[c];

      footer.appendChild(label);
    }

    body.appendChild(footer);
    board.appendChild(turn_header);
    board.appendChild(body);
}
