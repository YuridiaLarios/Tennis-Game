var canvas; //empty canvas
var canvasContext;
var ballX = 50;
var ballSpeedX = 5;
var ballY = 50;
var ballSpeedY = 4;
var paddle1Y = 250;
const PADDLE_HEIGHT = 100;

// event that fires everytime the mouse moves
function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect(); // black rectangle area
  var root = document.documentElement;
  // taking position of mouse within playing space.
  var mouseX = evt.clientX -rect.left -root.scrollLeft;
  var mouseY = evt.clientY -rect.top - root.scrollTop;
  // returning a pair of variables
  return {
    x:mouseX,
    y:mouseY
  };
}


window.onload = function() { // as soon as page loads run this code
  console.log("Hello World");
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function(){
      moveEverything();
      drawEverything();
  }, 1000/framesPerSecond); // use to calculate our frame rates.
}

/*
function callBoth(){
  moveEverything();
  drawEverything();
}
*/

function moveEverything(){
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if(ballY >= canvas.height || ballY <= 2){
    ballSpeedY = -ballSpeedX; // flipping vertical direction to bounce inside canvas
  }
  if(ballX >= canvas.width || ballX <= 2){
    ballSpeedX = -ballSpeedX; // flipping horizontal direction to bounce inside canvas
  }
}

function drawEverything(){
  // gives the canvas screen a black color
  colorRect(0,0, canvas.width, canvas.height, 'black');
  // left player paddle
  colorRect(10,210,10,PADDLE_HEIGHT,'white');
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
  canvasContext.fillRect(leftX, topY, width, height); // (x-coor,y-coor,html width,html height)
}
