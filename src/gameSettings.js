const gameBoard = document.getElementById('can');
const gameBoardDimentions = {
    height: 600,
    width: 800,
    backgroundColor: "#292F36"
};

// Setting the game board ---------------
gameBoard.height = gameBoardDimentions.height;
gameBoard.width = gameBoardDimentions.width;
gameBoard.style.backgroundColor = gameBoardDimentions.backgroundColor;
// --------------------------------------

const ctx = gameBoard.getContext('2d'); // game rendering context;

export {ctx, gameBoardDimentions};