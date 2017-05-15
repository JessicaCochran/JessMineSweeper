
var time = 0;
var timerInterval = null;

function whatIsTheTime() {
	return time;
}

function onPageLoad() {
	resetTimer();
	initializeMineFieldArray();
	
	// Set all right clicks
	for (var col = 1; col <= cols; col++) {
		for (var row = 1; row <= rows; row++) {
			var mineFieldAreaButton = document.getElementById('row' + row + 'col' + col);
			mineFieldAreaButton.addEventListener('contextmenu', function(ev) {
				mineFieldAreaRightClicked(ev.target.id)
				ev.preventDefault();
				return false;
			}, false);
		}
	}
}

/**
 * This function set's up an interval that will call a function
 * (incrementTimer) every 1000 milliseconds (which is 1 second).
 **/
function startTimer() {
  if(timerInterval == null) {
	timerInterval = setInterval(incrementTimer, 1000);
  }
}

function mineFieldAreaRightClicked(name) {
	// Make sure the timer has started.
	startTimer();

	// alert('success! name:' + name);
	var row = name.substring(3,4);
	var col = name.substring(7);
	
	// get the mine field area button that was clicked
	var mineFieldAreaButton = document.getElementById('row' + row + 'col' + col);
	
	// Is this button already flagged?
	if (mineFieldAreaButton.innerHTML == 'F') {
		// a flag has been removed
		flagRemoved();
		// set the button text to show a '?'
		mineFieldAreaButton.innerHTML = '?';
	} else if (mineFieldAreaButton.innerHTML == '?') {
		// set the button text to show a blank space
		mineFieldAreaButton.innerHTML = '&nbsp;';
	} else {
		// a flag has been placed
		flagPlaced();
		// set the button text to show the mineFieldArray
		mineFieldAreaButton.innerHTML = 'F';
	}
}

function flagPlaced() {
	flagCount = flagCount + 1;
	updateMineCounter();
}

function flagRemoved() {
	flagCount = flagCount - 1;
	updateMineCounter();
}

function updateMineCounter() {
	var flagSpan = document.getElementById('minecounter-span');
	flagSpan.innerHTML = (totalBombs - flagCount);
}

var loseMessages = [
	'Better luck next time. You lost.',
	'So close, you lost.',
	'You lost but don\'t give up! Try again!',
	'Beautiful, you are! Won, you have not!',
	'It\'s okay to lose.',
	'You can\'t win them all.',
	'You lost. Keep trying!',
	'Oops, just reset it before anyone notices.',
	'You lost! I love you! -Jess'
];

function bombClicked() {
	stopTimer();
	// show all bombs!
	showAllBombs();
	// show the notification
	var notificationH1 = document.getElementById('notification-h1');
	var message = loseMessages[Math.floor(Math.random() * loseMessages.length)];
	notificationH1.innerHTML = message;
	// update smiley face
	var resetButtonBtn = document.getElementById('reset-button');
	resetButtonBtn.style.background = 'url("img/smiley-face-xx.svg")';
	resetButtonBtn.style.backgroundColor = 'lightgray';
	resetButtonBtn.style.backgroundSize = 'contain';
}

var winMessages = [
	'Way to go, Mom! You won!',
	'You so smart. You won!',
	'Winner, winner! Veggie dinner!',
	'Beautiful, you are! Won, you have!',
	'Winning tastes good.',
	'The latest champion... Mom! You won!',
	'You won! Queen of Minesweeper',
	'You won! Majestical Mathmatical Mom',
	'You won! I love you! -Jess'
];

function gameWon() {
	stopTimer();
	// show all bombs!
	showAllBombs();
	// show the notification
	var notificationH1 = document.getElementById('notification-h1');
	var message = winMessages[Math.floor(Math.random() * winMessages.length)];
	notificationH1.innerHTML = message;
	// update smiley face
	var resetButtonBtn = document.getElementById('reset-button');
	resetButtonBtn.style.background = 'url("img/smiley-face-sunglasses.svg")';
	resetButtonBtn.style.backgroundColor = 'lightgray';
	resetButtonBtn.style.backgroundSize = 'contain';
}

function showAllBombs() {
	for(var col = 0; col < cols; col++) {
		for(var row = 0; row < rows; row++) {
			// get the mine field area button that was clicked
			var mineFieldAreaButton = document.getElementById('row' + (row + 1) + 'col' + (col + 1));
  
			// disable the button so it can't be clicked again
			mineFieldAreaButton.disabled = true;
			
			var isBomb = mineFieldArray[col][row] == 'B'
			
			if (mineFieldAreaButton.innerHTML == 'F') {
				// This spot was marked with an 'F'
				if (isBomb == true) {
					// This spot is a bomb and it was flagged as a bomb
					mineFieldAreaButton.innerHTML = '<strong>F</strong>';
				} else {
					// This spot is not a bomb, but it was flagged as a bomb
					mineFieldAreaButton.innerHTML = '<strike>F</strike>';
				}
			} else if (mineFieldAreaButton.innerHTML == '?') {
				// This spot was marked with an '?'
				if (isBomb == true) {
					// This spot is a bomb and it was had a '?' flag.
					mineFieldAreaButton.innerHTML = '<strong>?</strong>';
				} else {
					// This spot is not a bomb, but it was had a '?' flag.
					mineFieldAreaButton.innerHTML = '<strike>?</strike>';
				}
			} else if (isBomb == true) {
				// This spot is a bomb and it was not marked.
				mineFieldAreaButton.innerHTML = '<strong>B</strong>';
			}
		}
	}
}

/**
 * This function is called when a minefield area is clicked.
 **/
function mineFieldAreaClicked(row, col) {
  // Make sure the timer has started.
  startTimer();
  
  // get the mine field area button that was clicked
  var mineFieldAreaButton = document.getElementById('row' + row + 'col' + col);
  // if this button has already been disabled, there is no need to continue.
  if (mineFieldAreaButton.disabled == true) {
	  return;
  }
  // if this button has been flagged, then do nothing.
  if (mineFieldAreaButton.innerHTML == 'F') {
	  return;
  }
  // set the button text to show the mineFieldArray
  mineFieldAreaButton.innerHTML = mineFieldArray[col - 1][row - 1];
  
  // disable the button so it can't be clicked again
  mineFieldAreaButton.disabled = true;
  
  // if a bomb was clicked, show it.
  if (mineFieldArray[col - 1][row - 1] == 'B') {
	  bombClicked();
	  // there is nothing more to do
	  return;
  }
  
  // if the area we clicked is a 0, then click all spots around it.
  if(mineFieldArray[col - 1][row - 1] == 0) {
	//top left
	if(col > 1 && row > 1) {
		mineFieldAreaClicked(row - 1, col - 1);
	}
	//top middle
	if(row > 1) {
		mineFieldAreaClicked(row - 1, col);
	}
	//top right
	if(col < cols && row > 1) {
		mineFieldAreaClicked(row - 1, col + 1);
	}
	//center left
	if(col > 1) {
		mineFieldAreaClicked(row, col - 1);
	}
	//center right
	if(col < cols) {
		mineFieldAreaClicked(row, col + 1);
	}
	//bottom left
	if(col > 1 && row < rows) {
		mineFieldAreaClicked(row + 1, col - 1);
	}
	//bottom middle
	if(row < rows) {
		mineFieldAreaClicked(row + 1, col);
	}
	//bottom right
	if(col < cols && row < rows) {
		mineFieldAreaClicked(row + 1, col + 1);
	}
  }
	
	areasNeededToClear = areasNeededToClear - 1;
	if (areasNeededToClear == 0) {
		gameWon();
	}
}

function stopTimer() {
	clearInterval(timerInterval);
	timerInterval = null;
}

function resetTimer() {
	stopTimer();
	time = 0;
	var timerSpan = document.getElementById('timer-span');
	timerSpan.innerHTML = time;
  
  // Clear all of the mine field area buttons
  /**
   * This starts with a rowNumber of 1 and runs all of the code inside.
   * Then it adds 1 to the rowNumber and while the rowNumber <= 8, it will
   * run all of the code inside again with the new rowNumber.
   **/
  for(var rowNumber = 1; rowNumber <= 8; rowNumber++) {
    
    for(var colNumber = 1; colNumber <= 8; colNumber++) {
      
      // get the mine field area button that was clicked
      var mineFieldAreaButton = document.getElementById('row' + rowNumber + 'col' + colNumber);
      // set the button text to show a blank space (non-breaking space)
      mineFieldAreaButton.innerHTML = '&nbsp;';
      // enable the button so it can be clicked again
      mineFieldAreaButton.disabled = false;
    }
  }
  initializeMineFieldArray();
}

/**
 * This function will reset the timer and the mine field to start a new game.
 **/
function newGame() {
	resetTimer();
}

/**
 * This function will increment the timer by 1 and display the new time in the timer.
 **/
function incrementTimer() {
	time = time + 1;
	var timerSpan = document.getElementById('timer-span');
	timerSpan.innerHTML = time;
}




function initializeBombs() {
	var newBombCount = 0;
	
	while(newBombCount < totalBombs) {
		var randomCol = Math.floor(Math.random() * cols);
		var randomRow = Math.floor(Math.random() * rows);
		if(mineFieldArray[randomCol][randomRow] != 'B') {
			mineFieldArray[randomCol][randomRow] = 'B';
			newBombCount = newBombCount + 1;
		}
	}
	
	areasNeededToClear = (cols * rows) - totalBombs;
	flagCount = 0;
	updateMineCounter();
}

/**
 * The array to hold the data for each minefield area.
 **/
var mineFieldArray;
var cols = 8;
var rows = 8;
var totalBombs = 10;
var flagCount = 0;
var areasNeededToClear = 0;
function initializeMineFieldArray() {
	// Clear notification
	var notificationH1 = document.getElementById('notification-h1');
	notificationH1.innerHTML = '';
	// update smiley face
	var resetButtonBtn = document.getElementById('reset-button');
	resetButtonBtn.style.background = 'url("img/smiley-face.svg")';
	resetButtonBtn.style.backgroundColor = 'lightgray';
	resetButtonBtn.style.backgroundSize = 'contain';
	
	mineFieldArray = [];
	for (var col = 0; col < cols; col = col + 1) {
		mineFieldArray[col] = [];
		for (var row = 0; row < rows; row = row + 1) {
			mineFieldArray[col][row] = 'x';
		}
	}
	
	// Set some Bombs
	initializeBombs();
	
	for (var col = 0; col < cols; col = col + 1) {
		for (var row = 0; row < rows; row = row + 1) {
			// if this spot is a bomb, do nothing
			// if this spot is not a bomb, count how many bombs are beside it.
			if(mineFieldArray[col][row] != 'B') {
				var bombCount = 0;
				//top left
				if(col > 0 && row > 0 && mineFieldArray[col - 1][row - 1] == 'B') {
					bombCount = bombCount + 1;
				}
				//top middle
				if(row > 0 && mineFieldArray[col][row - 1] == 'B') {
					bombCount = bombCount + 1;
				}
				//top right
				if(col < cols - 1 && row > 0 && mineFieldArray[col + 1][row - 1] == 'B') {
					bombCount = bombCount + 1;
				}
				//center left
				if(col > 0 && mineFieldArray[col - 1][row] == 'B') {
					bombCount = bombCount + 1;
				}
				//center right
				if(col < cols - 1 && mineFieldArray[col + 1][row] == 'B') {
					bombCount = bombCount + 1;
				}
				//bottom left
				if(col > 0 && row < rows - 1 && mineFieldArray[col - 1][row + 1] == 'B') {
					bombCount = bombCount + 1;
				}
				//bottom middle
				if(row < rows - 1 && mineFieldArray[col][row + 1] == 'B') {
					bombCount = bombCount + 1;
				}
				//bottom right
				if(col < cols - 1 && row < rows - 1 && mineFieldArray[col + 1][row + 1] == 'B') {
					bombCount = bombCount + 1;
				}
				mineFieldArray[col][row] = bombCount;
			}
		}
	}
}













