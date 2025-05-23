const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('reset');
const winLine = document.getElementById('win-line');
let currentPlayer = 'X';
let gameActive = true;

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];


function handleClick(e) {
  const cell = e.target;


  if (cell.textContent !== '' || !gameActive) return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

const winningCombo = getWinningCombination();
  if (winningCombo) {
    gameActive = false;
    showWinLine(winningCombo);

    setTimeout(() => {
      showPopup(`${currentPlayer} Wins!`);
    }, 600); 
    return;
  }

  if (isDraw()) {
    gameActive = false;
    setTimeout(() => {
      showPopup("It's a Draw!");
    }, 100);
    return;
  }



  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
}


function checkWin() {
  return winConditions.some(combination => {
    return combination.every(index => {
      return cells[index].textContent === currentPlayer;
    });
  });
}

function isDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}
function showWinLine(combination) {
  const firstCell = cells[combination[0]];
  const lastCell = cells[combination[2]];

  const firstRect = firstCell.getBoundingClientRect();
  const lastRect = lastCell.getBoundingClientRect();
  const gameRect = document.getElementById('game').getBoundingClientRect();

  let startX = firstRect.left + firstRect.width / 2 - gameRect.left;
  let startY = firstRect.top + firstRect.height / 2 - gameRect.top;
  let endX = lastRect.left + lastRect.width / 2 - gameRect.left;
  let endY = lastRect.top + lastRect.height / 2 - gameRect.top;

  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.hypot(dx, dy);
  const offset = 20;

  const offsetX = (dx / distance) * offset;
  const offsetY = (dy / distance) * offset;

  startX -= offsetX;
  startY -= offsetY;
  endX += offsetX;
  endY += offsetY;

  const length = Math.hypot(endX - startX, endY - startY);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  winLine.style.width = '0';
  winLine.style.opacity = '1';
  winLine.style.top = `${startY}px`;
  winLine.style.left = `${startX}px`;
  winLine.style.transform = `rotate(${angle}deg)`;

  setTimeout(() => {
    winLine.style.width = `${length}px`;
  }, 10);
}
function getWinningCombination() {
  for (const combination of winConditions) {
    if (combination.every(index => cells[index].textContent === currentPlayer)) {
      return combination;
    }
  }
  return null;
}
function showPopup(message) {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  
  popupMessage.innerHTML = message + '<br><button id="play-again-btn">Play Again</button>';
  popup.classList.remove('hidden');


  const playAgainBtn = document.getElementById('play-again-btn');
  playAgainBtn.addEventListener('click', () => {
    hidePopup();
    reset(); 
  });
}

function reset(){
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x');
    cell.classList.remove('o');
    winLine.style.opacity = '0';
    winLine.style.width = '0';
  });
  currentPlayer = 'X';
  document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
  gameActive = true;
}
resetBtn.addEventListener('click', () => {
  reset();
});
function hidePopup() {
  const popup = document.getElementById('popup');
  popup.classList.add('hidden');
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
const playAgainBtn = document.getElementById('play-again-btn');
playAgainBtn.addEventListener('click', () => {
  hidePopup();
  reset(); 
});
