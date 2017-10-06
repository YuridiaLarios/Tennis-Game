var canvas; //empty canvas
var canvasContext;
var ballX = 50;
var ballSpeedX = 8;
var ballY = 50;
var ballSpeedY = 3;
var paddle1Y = 250;
var paddle2Y = 250;
var player1Score = 0;
var player2Score = 0;
var showingWelScreen = true;
var showingWinScreen = false;
var mySoundBounce;
var mySoundMissed;
var mySoundWin;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3;





// event that fires everytime the mouse moves
function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect(); // black game area
  var root = document.documentElement;
  // taking position of mouse within playing space.
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  // returning a pair of variables
  return {
    x:mouseX,
    y:mouseY
  };
}





// event that fires when the mouse is click at the pause screen
function handleMouseClick(evt){
  if(showingWinScreen){
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
  if(showingWelScreen){
    ballReset();
    showingWelScreen = false;
  }
}





// function to reset the ball's position back to center
function ballReset(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = -ballSpeedX; // flipping horizontal direction of ball movement
}





//  function for the AI movement of the computer's paddle2Y
//  It ignores chasing the ball while it's within 34 pixels above or
//  below the paddle center position (68 pixel span)
function computerMovement(){
  // calculate paddle center
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY - 34){
    paddle2Y += 7.5;
  } else if(paddle2YCenter > ballY + 34){
    paddle2Y -= 7.5;
  }
}

// function to move left paddle, ball, and call for computer movement as well.
function moveEverything(){
  // welcoming screen
  if(showingWelScreen){
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('WELCOME!... Click to start!', 100, 100);
    return;
  }
  // if winning score is reach, game comes to a pause screen
  if(showingWinScreen){
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('GAME OVER, click to play again...', 100, 100);
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // left wall
  if(ballX > 0 && ballX < PADDLE_THICKNESS + 10){
    // if left paddle hits the ball change its direction of movement
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
      mySoundBounce.play();
      ballSpeedX = -ballSpeedX;
    // vertical velocity of ball is faster if it hits either corner of left paddle.
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.25;
    } else {
      mySoundMissed.play();
      // if ball hits left wall, right player gets a point.
      player2Score++;
      // check to see if either player has reach a winning score,
      // if so, enter a pause screen.
      if(player2Score >= WINNING_SCORE || player1Score >= WINNING_SCORE){
        showingWinScreen = true;
      }
      ballReset();
    }
  }

  // flipping vertical direction to bounce inside canvas
  if(ballY >= canvas.height-10 || ballY <= 0 +10){
    ballSpeedY = -ballSpeedY;
  }


// right wall
  if(ballX > canvas.width- PADDLE_THICKNESS -10) {
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      mySoundBounce.play();
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.25;
    } else if(ballX > canvas.width) {
      mySoundMissed.play();
      player1Score++;
      if(player2Score >= WINNING_SCORE || player1Score >= WINNING_SCORE){
        showingWinScreen = true;
      }
      ballReset();
    }
  }

}





function drawNet(){
  for(var i=4; i<canvas.height; i += 40){
    colorRect(canvas.width/2+10, i, 2,20,"white"); // middle of canvas, topY, width, height, color
  }
}





function drawEverything(){
  // gives the canvas screen a black color
  colorRect(0,0, canvas.width, canvas.height, 'black');

  // welcome screen
    // welcome screen
  if(showingWelScreen){
    canvasContext.font = "30px Monospace";
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('WELCOME!... Click to PLAY!', 150, canvas.height/2);
    return;
  }
  // if winning score game comes to a pause and declare winner.
  if(showingWinScreen){
    canvasContext.fillStyle = 'white';
    if(player1Score >= WINNING_SCORE){
      canvasContext.fillText("Left player wins!", 230, canvas.height/2);
    } else {
      canvasContext.fillText("Computer  wins!", 230, canvas.height/2);
    }
    canvasContext.fillText("Click to play again...", 190, canvas.height/2 +30);
    return;
    // writes the scores to canvas
    canvasContext.fillStyle = 'yellow';
    canvasContext.fillText(player1Score, 100,100);
    canvasContext.fillText(player2Score, canvas.width-100,100);
    return;
  }

  // net
  drawNet();
  // left player paddle
  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // right computer paddle
  colorRect(canvas.width-10,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // draws a circular ball
  colorCircle(ballX,ballY,10,'red');

  // writes the label "score" to canvas
  canvasContext.fillStyle = 'yellow';
  canvasContext.fillText(player1Score, 100,100);
  canvasContext.fillText(player2Score, canvas.width-100,100);


}





// helper function to draw a circle
function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true); // center-Xcoor,center-Ycoor, radius, initial Radiant, final radiant, counterclockwise
  canvasContext.fill();
}





// helper function to draw a rectangle
function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height); // (x-coor,y-coor,width,height)
}




// function to build sound objects
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}





// MAIN METHOD
window.onload = function() { // as soon as page loads run this code
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d'); // necessary to draw on canvas
  mySoundBounce = new sound("sounds/bounce_effect.wav");
  mySoundMissed = new sound("sounds/missed_effect2.wav");
  mySoundWin = new sound("sounds/winning_effect.wav");

  var framesPerSecond = 30;
  setInterval(function(){

      moveEverything();
      drawEverything();
  }, 1000/framesPerSecond); // use to calculate our frame rates.

  // event listener to detect mouse movement and assigning y position to left paddle
  canvas.addEventListener('mousemove',
    function(evt){
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
  });

  canvas.addEventListener('touchmove', function(evt){
    var myGameArea = canvas.getBoundingClientRect();
    paddle1Y = myGameArea.y = evt.touches[0].screenY;
  });

  canvas.addEventListener('mousedown',handleMouseClick);

}
// END OF SCRIPT
