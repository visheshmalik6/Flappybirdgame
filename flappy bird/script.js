let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird ={
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight

}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.2;

let gameOver = false
let score = 0
let highScore = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //context.fillStyle = "green";
    //context.fillRect(bird.x,bird.y,bird.width,bird.height);

    birdImg = new Image()
    birdImg.src="./bird.png";
    birdImg.onload = function(){
            context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg = new Image()
    topPipeImg.src="./uperpipe.png"

    bottomPipeImg = new Image()
    bottomPipeImg.src="./lowerpipe.png"

    requestAnimationFrame(update)

    setInterval(placePipes, 1500);

    document.addEventListener("keydown",moveBird)
}

    function update(){
    requestAnimationFrame(update)
    if(gameOver){
        return
    }
    context.clearRect(0,0,board.width, board.height)

    velocityY += gravity;
    bird.y=Math.max(bird.y + velocityY , 0);
    
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)
    if (bird.y > board.height){
            gameOver = true
        }
    
    for (let i = 0; i < pipeArray.length ; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true
        }

        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    // High score logic
    if (score > highScore) {
        highScore = score;
    }

    // Score display
    context.fillStyle = "#FFD700";
    context.font = "bold 45px 'Comic Sans MS', cursive, sans-serif";
    context.fillText("Score: " + Math.floor(score), 10, 50);
    context.fillStyle = "#00FFFF";
    context.font = "bold 30px 'Comic Sans MS', cursive, sans-serif";
    context.fillText("High Score: " + Math.floor(highScore), 10, 90);

    if(gameOver){
        context.fillStyle = "#FF3333";
        context.font = "bold 50px 'Comic Sans MS', cursive, sans-serif";
        context.fillText("Game Over!", 30, board.height/2 - 50);
        context.font = "bold 26px 'Comic Sans MS', cursive, sans-serif";
        context.fillText("Press Space to Restart", 30, board.height/2);
    }
}
 function placePipes(){
    if(gameOver){
        return
    }

    let gap = 150;
    let randomPipeY = Math.floor(Math.random() * (boardHeight - gap - 100)) + 50;

    // Top pipe
    let topPipe = {
        img : topPipeImg,
        x: pipeX,
        y: randomPipeY - pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        passed : false
    };

    // Bottom pipe
    let bottomPipe = {
        img : bottomPipeImg,
        x: pipeX,
        y: randomPipeY + gap,
        width: pipeWidth,
        height: pipeHeight,
        passed : false
    };

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code == "Space"|| e.code == "ArrowUp"|| e.code == "keyX"){
        velocityY = -4;

        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score= 0
            gameOver = false
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height&&
           a.y + a.height > b.y;
}