// Game Variables
var score = 0;
var time = 60;
var level = 1;
var intervalId;
var timeoutIds = [];
var gameStarted = false;
var genShape = 0;
var percentage = 0;
const highScore = [0,0,0];

// Game Levels
var levels = [
  {
    numSquares: 45,
    interval: 1334,
    colors: ["green"],
  },
  {
    numSquares: 60,
    interval: 999,
    colors: ["green"],
  },
  {
    numSquares: 80,
    interval: 750,
    colors: ["green"],
  }
];

// Game Functions
function startGame() {

  gameStarted = true;
  time = 60;
  score = 0;
  genShape = 0;
  percentage = 0;
  intervalId = setInterval(countdown, 1000);
  spawnSquares();
}

function countdown() {
  if (time == 0) {
    endGame();
    return;
  }
  time--;
  $("#time").text(time);
}

function spawnSquares() {
  for (var i = 0; i < levels[level - 1].numSquares; i++) {
    var timeoutId = setTimeout(spawnSquare, i * levels[level - 1].interval);
    timeoutIds.push(timeoutId);
  }
}

function spawnSquare() {

  var existingShapes = [];
  var shapes = ["square", "triangle", "circle"];
  var shape = shapes[Math.floor(Math.random() * shapes.length)];
  var color = levels[level - 1].colors[Math.floor(Math.random() * levels[level - 1].colors.length)];
  var size = 80;
  var x = Math.floor(Math.random() * ($("#game").width() - size) - 10);
  var y = Math.floor(Math.random() * ($("#game").height() - size) - 10);
  var $shape;

  switch (shape) {
    case "square":
      $shape = $("<div class='square'></div>");
      break;
    case "triangle":
      $shape = $("<div class='triangle'></div>");
      break;
    case "circle":
      $shape = $("<div class='circle'></div>");
      break;
  }

  $shape.css(
  {
    "background-color": color,
    "left": x,
    "top": y
  });

  // counting the colour wise shape generated by code
  if($shape.css("background-color") === "green") {
    genShape++;
  }

  // to avoid overlappping 
  var overlapsExistingShape = true;
  while (overlapsExistingShape) {
    overlapsExistingShape = false;
    for (var i = 0; i < existingShapes.length; i++) {
      var existingShape = existingShapes[i];
      if (x + size > existingShape.x && x < existingShape.x + existingShape.size &&
          y + size > existingShape.y && y < existingShape.y + existingShape.size) {
        overlapsExistingShape = true;
        x = Math.floor(Math.random() * ($("#game").width() - size) - 10);
        y = Math.floor(Math.random() * ($("#game").height() - size) - 10);
        $shape.css({
          "left": x,
          "top": y
        });
        break;
      }
    }
  }

  // click function
  $shape.click(function() {
    if ($(this).css("background-color") == "rgb(255, 0, 0)") {
      score--;
    } else {
      score++;
    }

    // high score storation
    if(highScore[level-1] < score) {
      highScore[level-1] = score;
      storeHighscore();
    }
    $("#high-score").text(highScore);
    $("#score").text(score);
    $(this).fadeOut(200);
  });
  $("#game").append($shape);
  setTimeout(function() {
    $shape.fadeOut(200);
  }, 1000);

  // store current position
  existingShapes.push({
    "x": x,
    "y": y,
    "size": size
  });

}

//function to store highScore
function storeHighscore() {
  if(level==1)
  localStorage.setItem("highScore1",highScore[level-1]);
  else if(level==2)
  localStorage.setItem("highScore2",highScore[level-1]);
  else
  localStorage.setItem("highScore3",highScore[level-1]);

}


// function for End game
function endGame() {

  percentage = score/genShape * 100;
  percentage = parseFloat(percentage);
  clearInterval(intervalId);
  gameStarted = false;
  $("#level-buttons button").css('background', '#81adee');
  
  for (var i = 0; i < timeoutIds.length; i++) {
    clearTimeout(timeoutIds[i]); // use the stored IDs to clear the timeouts
  }

  $("#game").empty();
  var $scorecard = generateScorecard();
  $("#game").append($scorecard);
}

// reset Game
function resetGame() {
  // Stop game and clear timeouts
  clearInterval(intervalId);
  for (var i = 0; i < timeoutIds.length; i++) {
    clearTimeout(timeoutIds[i]);
  }

  // Reset game variables and UI
  gameStarted = false;
  score = 0;
  time = 60;
  level = 0;
  percentage = 0;
  genShape = 0;
  timeoutIds = [];
  $("#score").text(score);
  $("#time").text(time);
  $("#game").empty();

  // Reset level buttons
  $("#level-buttons button").css('background', '#81adee');
}


// Game Setup
$(document).ready(function() {

// load the high score from local storage
if(level==1 && localStorage.getItem("highScore1")) {
  highScore[0] = parseInt(localStorage.getItem("highScore1"));
}
if(level==2 && localStorage.getItem("highScore2")) {
  highScore[1] = parseInt(localStorage.getItem("highScore2"));
}
if(level==3 && localStorage.getItem("highScore1")) {
  highScore[2] = parseInt(localStorage.getItem("highScore3"));
}

  // reset button
  $("#reset").click(function() {
    resetGame();
  });

  $("#level1").click(function() {
    if (gameStarted) return;
    else {
      resetGame();
      $("#level1").css('background', '#43e555');
      level = 1;
      startGame();
    }
  });
  $("#level2").click(function() {
    if (gameStarted) return;
    else {
      resetGame();
      $("#level2").css('background', '#43e555');
      level = 2;
      startGame();
    }
  });
  $("#level3").click(function() {
    if (gameStarted) return;
    else {
      resetGame();
      $("#level3").css('background', '#43e555');
      level = 3;
      startGame();
    }
  });
});

// Reset game on page load
$(window).on("load", function() {
  resetGame();
});


function generateScorecard() {

  // Retrieve the name from localStorage
  var name = localStorage.getItem("name");  
  var $scorecard = $("<div class='scorecard'></div>");
  var $scoreDetails = $("<div class='score-details'></div>");

  $scoreDetails.append("<p id='title'> --Scorecard--"+"</p><br/>")
  $scoreDetails.append("<p id='displayText' >" + name + "</p></br>");
  $scoreDetails.append("<p id='lvl'>For Level : " + level + "</p>");
  $scoreDetails.append("<p id='final'>Your score is: " + score + "</p>");
  $scoreDetails.append("<p id='percent' class='mscore'> Percentage Score is: " + percentage.toFixed(2) + "%</p></br>");
  $scoreDetails.append("<p id='total'>High score for level " + level + " is: " + highScore[level-1] + "</p><br/>");

  var $downloadButton = $("<button id='download'>Download Scorecard</button>");
  $downloadButton.click(downloadScorecard);

  $scorecard.append($scoreDetails);
  $scorecard.append($downloadButton);

  return $scorecard;
}

function downloadScorecard() {

  var name = localStorage.getItem("name");
  var csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Player Name,Level ,Score,Gen-shape,%\n";
  csvContent += name + "," + level + "," + score +"," + genShape + "," + percentage +"\n";

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", name + "-Hand-Eye-1.csv");
  document.body.appendChild(link);

  link.click();
}
