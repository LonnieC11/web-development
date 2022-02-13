//grab canvas from HTML page and add 2d context
var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");

//Parameters for the ball that'll be drawn later
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

//Parameters for the paddle that will be user-controlled
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

//variables needed to add key listeners later
var rightPressed = false;
var leftPressed = false;

//Creating parameters for the bricks that the user will attempt to destroy
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//structure that will hold the bricks
var bricks = [];
for(var c=0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(var r=0; r < brickRowCount; r++){
        bricks[c][r] = {    x: 0, y: 0, status: 1   };
    }
    
}

//Keeping score using this var
var score = 0;

//Player life counter. You get three lives to destroy all of the bricks
var lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//key pressed down listener
function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}

//key released listener
function keyUpHandler(e){
    if(e.key == "Right" || e.key =="ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key =="ArrowLeft"){
        leftPressed = false;
    }
}


//helper function to render the ball, using the variables initialized above
function drawBall(){
    context.beginPath();
    context.arc(x,y,ballRadius,0,Math.PI*2);
    context.fillStyle="#5Dbb63";
    context.fill();
    context.closePath();
}
//helper function to render the scoreboard, using the variables initialized above
function drawScore(){
    context.font = "18px Garamond";
    context.fillStyle = "white";
    context.fillText("SCORE: " + score, 8, 20);
}
//helper function to render the ball, using the variables initialized above
function drawPaddle(){
    context.beginPath();
    context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
}
//helper function to render the brick field, using the variables initialized above
function drawBricks(){
    for(var c=0; c < brickColumnCount; c++){
        for(var r=0; r < brickRowCount; r++){
            if(bricks[c][r].status == 1){
                var brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight+brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#0047AB";
                context.fill();
                context.closePath();
            }
        }
    }
}
function drawLives(){
    context.font = "18px Garamond";
    context.fillStyle = "white";
    context.filltext("LIVES: "+lives, canvas.width-65, 20);
}
function collisionDetection(){
    for(var c=0; c < brickColumnCount; c++){
        for(var r=0; r < brickRowCount; r++){
            var b = bricks[c][r];
            //calculations
            if(b.status == 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    //if the score matches the number of bricks, the game ends
                    if(score == brickRowCount * brickColumnCount){
                        alert("YOU HAVE ESCAPED THE DEPTHS OF HELL!! CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}




function draw(){
    //this line clears out all of the assets drawn onto the canvas in order to redraw them for the next frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //renders the assets we need for the game - brick field, ball, paddle, etc.
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    //drawLives(); couldnt get this to work without breaking the game
    collisionDetection();
    
    //x += dx;
    //y += dy;

    if(x + dx < ballRadius || x + dx > canvas.width-ballRadius){
        dx = -dx;
    }
    if(y + dy < ballRadius){
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }
        else{
            lives--;
            if(!lives){
                alert("YOU WILL FACE ETERNAL DAMNATION. Try Again!!");
                document.location.reload();
                clearInterval(interval); //Needed for browser to end game
            }
            else{
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2
                dy = -2
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }    
    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    x += dx;
    y += dy;
    
}

//the draw() function will be called every 10ms forever or until it's stopped, whichever comes first
var interval = setInterval(draw,10); 