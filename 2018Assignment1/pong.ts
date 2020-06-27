// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

function pong() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in pong.html, animate them, and make them interactive.
  // Study and complete the tasks in basicexamples.ts first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.

    const

        svg = document.getElementById("canvas")!, // I'm creating a paddle for the player
        rectPlayer = new Elem(svg, 'rect')
            .attr('x', Math.abs(svg.clientWidth-50))
            .attr('y', Math.abs((svg.clientWidth/2)-10))
            .attr('width', 10)
            .attr('height', 40)
            .attr('fill', 'white'),

        rectAI = new Elem(svg, 'rect'), // paddle for the Computer
        rectBall = new Elem(svg, 'rect');  // Ball specs




    dragRectObservable(); // Creates a movable observable for the player
    middFeild(); // Just a straight line to define the middle
    ball(); //


    function middFeild(){
        const
            svgMidd = document.getElementById("canvas")!;
            const rect = new Elem(svgMidd, 'rect')
                .attr('x', (svg.clientWidth/2))
                .attr('y', 0)
                .attr('width', 3)
                .attr('height', svg.clientWidth)
                .attr('fill', 'white');
            
    }


    function ball(){

        let scoreCountPlayer1 =0; // Indicates counting scores starts at 0 for both players
        let scoreCountPlayer2 =0;
        const score =  document.getElementById("scorePlayer1")!; // Creates an instance to the score attribute
        const score2 =  document.getElementById("scorePlayer2")!;
        score.innerHTML ='Player 1: ' +scoreCountPlayer1;  // Setting the score
        score2.innerHTML ='Player 2: ' +scoreCountPlayer2;
        let signY='';
        let signX='';
        resetGame(); // Starts and resets the game

        function resetGame(){

            rectAI.attr('x', 40) // Giving values to the paddle
                .attr('y', 290)
                .attr('width', 10)
                .attr('height', 40)
                .attr('fill', 'white');

            rectBall.attr('x', (svg.clientWidth/2)) // Giving values to the ball
                .attr('y', (svg.clientHeight/2))
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', 'white');

             signY = String((Math.floor(Math.random() * 2)-1 || 1)); // Crate a random starting point
             signX = String((Math.floor(Math.random() * 2)-1 || 1));
        }


        const
            o=Observable.interval(5)// Observes every 5 milliseconds
            .takeUntil(Observable.interval(5)
                    .map(() => ({score1: Number(scoreCountPlayer1), score2: Number(scoreCountPlayer2)})) // Maps scores of player1 and 2
                    .filter(({score1, score2}) => score2 == 11 || score2 == 11));// Creats an interval observable, that will run until score == 11

            o.map(()=> ({scorePlayer1: scoreCountPlayer1})) // Prints winner player 1 if score is 11
                .filter(({scorePlayer1}) => scorePlayer1 == 11)
                .subscribe(()=> document.getElementById('winner')!.innerHTML = 'Winner Player 1');

             o.map(()=> ({ scorePlayer2: scoreCountPlayer2})) // Prints winner player 2 if score is 11
                .filter(({scorePlayer2 }) => scorePlayer2 == 11)
                .subscribe(()=> document.getElementById('winner')!.innerHTML = 'Winner Player 2');

        const
            u=Observable.interval(5)// Creats an interval observable, that will run until score == 11
                .takeUntil(Observable.interval(5) // Observes every 5 milliseconds
                    .map(() => ({score1: Number(scoreCountPlayer1), score2: Number(scoreCountPlayer2)})) // Maps scores of player1 and 2
                    .filter(({score1, score2}) => 2+score1 >12 || 2+score2 >12)); // If score is greather then 11 it returns true and the interval stops


            u.map(() => ({ ballY: rectBall.attr('y')})) //      Giving the balls Y-Coordinate to the AI
                .subscribe(({ballY}) => rectAI.attr('y',Math.abs(Number(ballY))-1));

             u.map(() => ({directionX: signY, directionY: signX})) // Subscribing the ball
                  .subscribe(({directionX,directionY }) =>
                      rectBall.attr('y', Number(rectBall.attr('y'))- Number(signY)) // Giving the ball new x, y Coordinates so that it moves
                         .attr('x', Number(rectBall.attr('x'))- Number(signX)));


             u.map(() => ({y:Number(rectBall.attr('y'))})) //  Filter for the Y-Coordinate
                 .filter(({y}) => Number(y) <= 0 || Number(y) >= 590) // Checks if ball hits roof or floor
                 .map(() => String(signY) === '-1' ? signY='1' : signY = '-1') // changes direction the opposite
                                                                               // You could do something more fun with this like checking where on the paddle the ball hits
                                                                                 //and then change the coordinates according to that, or even implement speed that the paddle is moving in x
                                                                                // to give the ball extra speed back
                 .subscribe(() => signY);


            u.map(() => ({BallX: Number(rectBall.attr('x')),BallY: Number(rectBall.attr('y')), //  Retriving x, y  Coordinates values from ball, playerPaddle and CoputerPaddle
                AiPaddleX: Number(rectAI.attr('x')), AiPaddleY: Number(rectAI.attr('y')), //
                    playerPaddleX: Number(rectPlayer.attr('x')), playerPaddleY: Number(rectPlayer.attr('y'))}))
                .filter(({BallX, BallY, AiPaddleX, AiPaddleY, playerPaddleX, playerPaddleY}) =>
                    AiPaddleY<=BallY && 10-BallY<=(AiPaddleY + Number(rectAI.attr('height'))) && BallX == AiPaddleX // If the ball hits either player paddle or computer paddle
                                                                                                                        // direction of ball is changed
                        || playerPaddleY <= BallY && BallY <= (playerPaddleY+Number(rectPlayer.attr('height'))) && BallX == playerPaddleX)
                .map(() => String(signX) === '-1' ? signX='1' : signX = '-1')
                .subscribe(() => signX);


            u.map(() => ({ballX: Number(rectBall.attr('x'))}))  // If ball hitts X-Coordinate 0 or 600 (winner of that round)
                .filter(({ballX}) => ballX == svg.clientWidth || ballX == 0)
                .map(({ballX}) => ballX==svg.clientWidth ? score.innerHTML ='Player 1: ' + Math.abs(scoreCountPlayer1+=1) // Checks witch side of the field the ball is on and adds the score
                                                    : score2.innerHTML ='Player 2: ' + Math.abs(scoreCountPlayer2+=1))
                .subscribe(() => setTimeout(()=>{ resetGame(); }, 1000)); // call reset function after 1 second


    }

    function dragRectObservable() {
        const
            mousemove = Observable.fromEvent<MouseEvent>(svg, 'mousemove'), // Observable of mousemove
            mouseup = Observable.fromEvent<MouseEvent>(svg, 'mouseup'); // Observable of mouse up
        
        rectPlayer.observe<MouseEvent>('mousedown')
            .map(({clientX, clientY}) => ({ xOffset: Number(rectPlayer.attr('x')) - clientX,
                yOffset: Number(rectPlayer.attr('y')) - clientY }))
            .flatMap(({xOffset, yOffset}) =>
                mousemove
                    .takeUntil(mouseup)
                    .map(({clientX, clientY}) => ({ x: clientX + xOffset, y: clientY + yOffset })))
            .subscribe(({x, y}) =>
                rectPlayer.attr('y', y));
    }
}

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();
  };

 

 