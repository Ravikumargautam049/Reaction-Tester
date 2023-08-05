// Get the box elements
const box1 = document.querySelector('.box1');
const box2 = document.querySelector('.box2');
const leftScoreElement = document.getElementById('leftScore');
const rightScoreElement = document.getElementById('rightScore');
const timerElement = document.getElementById('timer');
const scorecardElement = document.getElementById('scorecard');
const playBtn = document.getElementById('playBtn');
const click = document.getElementById('click');
const tikTikSound = document.getElementById('tikTikSound');
const gameOver = document.getElementById('gameOver');
const countdownElement = document.getElementById('countdown');
var highScore = 0;



// Initialize left and right scores
let leftScore = 0;
let rightScore = 0;

// Initialize the timer
let timer = 15;
timerElement.textContent = timer;

// Function to create and append a red square
function appendRedSquare(boxElement, delay, isLeftBox) {
  setTimeout(() => {

    const square = document.createElement('div');
    square.classList.add('square');
    boxElement.appendChild(square);

    // Add click event listener to the square
    square.addEventListener('click', () => {
      if (timer > 0) {
        const boxWidth = boxElement.clientWidth;
        const boxHeight = boxElement.clientHeight;
        const squareSize = square.offsetWidth;

        // Calculate random position within the box
        const randomLeft = Math.floor(Math.random() * (boxWidth - squareSize));
        const randomTop = Math.floor(Math.random() * (boxHeight - squareSize));

        square.style.left = randomLeft + 'px';
        square.style.top = randomTop + 'px';

        click.play();

        // Check if the square is in the left box
        if (isLeftBox) {
          // Increment left score
          leftScore++;
          leftScoreElement.textContent = leftScore;
        } else {
          // Increment right score
          rightScore++;
          rightScoreElement.textContent = rightScore;
        }

        // high score
        if (highScore < leftScore+rightScore) {
          highScore = leftScore + rightScore;
          storeHighscore();
        }
      }
    });

    square.style.display = 'block'; // Display the square initially
  }, delay);
}

//function to store highScore
function storeHighscore() {
  localStorage.setItem("highScore", highScore);
}

// Interval in milliseconds between adding squares
const interval = 1000;

// Play button click event listener
playBtn.addEventListener('click', () => {

  // Hide the play button
  playBtn.style.display = 'none';

  // Initialize countdown variables
  let countdown = 3;

  // Start the countdown
  const countdownInterval = setInterval(() => {
    if (countdown === 0) {
      clearInterval(countdownInterval);
      // countdownElement.textContent = 'Go!'; // Display "Go!" message
      countdownElement.style.display = 'none';

      // Add red squares to box1 and box2 one by one with a delay
      appendRedSquare(box1, interval * 1, true);
      appendRedSquare(box2, interval * 2, false);

      // Start the timer countdown
      const timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;

        // Play tik tik sound when timer reaches 10 seconds
        if (timer === 11) {
          tikTikSound.play();
        }

        // Check if the timer has reached 0
        if (timer === 0) {
          clearInterval(timerInterval);
          tikTikSound.pause(); // Pause the tik tik sound
          gameOver.play();
          tikTikSound.currentTime = 0; // Reset the sound to the beginning
          $(".box1").empty();
          $(".box2").empty();
          var $scorecard = generateScorecard();
          $(".container").append($scorecard);
        }
      }, 1000);

      return; // Exit the function
    }

    updateCountdownMessage(countdown); // Update the countdown message
    countdown--; // Decrement the countdown
  }, 1000);
});


// Function to update the countdown message
function updateCountdownMessage(message) {
  if(message === 3)
  countdownElement.textContent = 'Ready';
  if(message === 2)
  countdownElement.textContent = 'Set';
  if(message === 1)
  countdownElement.textContent = 'Go!';
}

function generateScorecard() {

  // load the high score from local storage
  if (localStorage.getItem("highScore")) {
    highScore = parseInt(localStorage.getItem("highScore"));
  }
  
  // Retrieve the name from localStorage
  var name = localStorage.getItem("name");  
  var $scorecard = $("<div class='scorecard'></div>");
  var $scoreDetails = $("<div class='score-details'></div>");

  $scoreDetails.append("<p id='displayText' >Player Name: " + name + "</p></br>");
  $scoreDetails.append("<p id='leftscore' class='mscore'>Left hand score: " + leftScore + "</p>");
  $scoreDetails.append("<p id='rightscore' class='mscore'>Right Hand Score: " + rightScore + "</p></br>");
  $scoreDetails.append("<p id='highscore' class='mscore'>High Score (Left + Right): " + highScore + "</p></br>");


  var $downloadButton = $("<button id='download'>Download Scorecard</button></br>");
  $downloadButton.click(downloadScorecard);

  var $playAgain = $("<button class='playAgain'>Play Again</button>");
  $playAgain.click(resetGame);

  var $Home = $("<button class='Home'>Home</button>");
  $Home.click(Home);

  $scorecard.append($scoreDetails);
  $scorecard.append($downloadButton);
  $scorecard.append($playAgain);
  $scorecard.append($Home);

  return $scorecard;
}

function downloadScorecard() {

  var name = localStorage.getItem("name");
  var csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Left-Hand Score, Right-Hand Score\n";
  csvContent += name + "," + leftScore +","+ rightScore + "\n";

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", name + "-LeftRight.csv");
  document.body.appendChild(link);

  link.click();
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  timer = 15;

  // Reset the score elements
  leftScoreElement.textContent = leftScore;
  rightScoreElement.textContent = rightScore;
  timerElement.textContent = timer;

  // Remove the scorecard
  localStorage.clear();
  const existingScorecard = document.querySelector('.scorecard');
  if (existingScorecard) {
    existingScorecard.remove();
  }

  // Show the play button
  playBtn.style.display = 'block';

  // Clear the boxes
  box1.innerHTML = '';
  box2.innerHTML = '';

}

function Home() {
  window.location.href = "../index_head.html";
}