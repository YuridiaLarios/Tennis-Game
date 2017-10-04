var canvas; //empty canvas
var canvasContext;
var ballX = 50;
var ballSpeedX = 5;
var ballY = 50;
var ballSpeedY = 4;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

// event that fires everytime the mouse moves
function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect(); // black rectangle area
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


window.onload = function() { // as soon as page loads run this code
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d'); // necessary to draw on canvas

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

}


function ballReset(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}


function computerMovement(){
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY - 35){
    paddle2Y += 5;
  } else if(paddle2YCenter < ballY + 35){
    paddle2Y -= 5;
  }
}

function moveEverything(){
  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if(ballX < 0){
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
    }
  }
  if(ballY >= canvas.height || ballY <= 0){
    ballSpeedY = -ballSpeedY; // flipping vertical direction to bounce inside canvas
  }

  if(ballX > canvas.width) {
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
    }
  }

}

function drawEverything(){
  // gives the canvas screen a black color
  colorRect(0,0, canvas.width, canvas.height, 'black');
  // left player paddle
  colorRect(2,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // right computer paddle
  colorRect(canvas.width -12,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // draws a circular ball
  colorCircle(ballX,ballY,10,'red');

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
