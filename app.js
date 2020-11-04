document.addEventListener('DOMContentLoaded', () => {

    // Create grid
    
    document.body.onload = {
        first: createBase(210, "grid", "square"), 
        second: createBase(16, "scoreTable", "scoreSquare")
    };

    function addElement (num, id, other) { 
        const newDiv = document.createElement("div");
        newDiv.classList.add(other); 

        document.getElementById(id).appendChild(newDiv);
      }

      for(let i = 0; i<10; i++){
          let child = 200;
          document.getElementsByClassName("square")[child + i].classList.add("taken");
      }

      function createBase(num, id, other){
          for(let i = 0; i<num; i++){
              addElement(num, id, other);
          }
      }
    
      //
    let squares = Array.from(document.querySelectorAll('.square'));
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#start');
    const width = 10;
    let nextRandom = 0;
    let score = 0;

    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
    
    //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select tetormino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation];

    //drawn the tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }
    
    // undrawn tetromino
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    //assign functions to keycodes
    function control (e){
        if(e.keyCode === 37){
            moveLeft();
        } else if(e.keyCode === 38){
            rotate();
        } else if(e.keyCode === 39){
            moveRight();
        } else if(e.keyCode === 40){
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    function moveDown(){
        undraw();
        currentPosition+=width;
        draw();
        freeze();
    }

    //freeze function
    function freeze () {
        if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
            current.forEach(index => squares[currentPosition + index].classList.add("taken"))

            //start a new tetromino
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    //more tetromino

    function moveLeft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken') )){
            currentPosition += 1;
        }

        draw();
    }

    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);

        if(!isAtRightEdge) currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken') )){
            currentPosition -= 1;
        }

        draw();
    }

    // rotate the tetromino
    function rotate(){
        undraw();
        currentRotation++;
        if(currentRotation == current.length) currentRotation = 0; 
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // display in side square
    const displaySquares = document.querySelectorAll('.scoreSquare');
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetromino = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0,displayWidth,displayWidth+1,displayWidth*2+1],
        [1,displayWidth,displayWidth+1,displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]
    ]

    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        upNextTetromino[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[random];
        })
    }


    //make the tetormino move
    let timerId;

    //add functionality to the button
    startButton.addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId);
            timerId = null;
        }else{
            draw();
            timerId = setInterval(moveDown, 600);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    })


    // add score
    function addScore(){
        for(let i = 0; i<199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))){
                score+=10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


    // game over function

    function gameOver () {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }

})

// https://www.youtube.com/watch?v=rAUn1Lom6dw&ab_channel=freeCodeCamp.org