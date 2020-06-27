"use strict";
function pong() {
    const svg = document.getElementById("canvas"), rectPlayer = new Elem(svg, 'rect')
        .attr('x', Math.abs(svg.clientWidth - 50))
        .attr('y', Math.abs((svg.clientWidth / 2) - 10))
        .attr('width', 10)
        .attr('height', 40)
        .attr('fill', 'white'), rectAI = new Elem(svg, 'rect'), rectBall = new Elem(svg, 'rect');
    dragRectObservable();
    middFeild();
    ball();
    function middFeild() {
        const svgMidd = document.getElementById("canvas");
        const rect = new Elem(svgMidd, 'rect')
            .attr('x', (svg.clientWidth / 2))
            .attr('y', 0)
            .attr('width', 3)
            .attr('height', svg.clientWidth)
            .attr('fill', 'white');
    }
    function ball() {
        let scoreCountPlayer1 = 0;
        let scoreCountPlayer2 = 0;
        const score = document.getElementById("scorePlayer1");
        const score2 = document.getElementById("scorePlayer2");
        score.innerHTML = 'Player 1: ' + scoreCountPlayer1;
        score2.innerHTML = 'Player 2: ' + scoreCountPlayer2;
        let signY = '';
        let signX = '';
        resetGame();
        function resetGame() {
            rectAI.attr('x', 40)
                .attr('y', 290)
                .attr('width', 10)
                .attr('height', 40)
                .attr('fill', 'white');
            rectBall.attr('x', (svg.clientWidth / 2))
                .attr('y', (svg.clientHeight / 2))
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', 'white');
            signY = String((Math.floor(Math.random() * 2) - 1 || 1));
            signX = String((Math.floor(Math.random() * 2) - 1 || 1));
        }
        const o = Observable.interval(5)
            .takeUntil(Observable.interval(5)
            .map(() => ({ score1: Number(scoreCountPlayer1), score2: Number(scoreCountPlayer2) }))
            .filter(({ score1, score2 }) => score2 == 11 || score2 == 11));
        o.map(() => ({ scorePlayer1: scoreCountPlayer1 }))
            .filter(({ scorePlayer1 }) => scorePlayer1 == 11)
            .subscribe(() => document.getElementById('winner').innerHTML = 'Winner Player 1');
        o.map(() => ({ scorePlayer2: scoreCountPlayer2 }))
            .filter(({ scorePlayer2 }) => scorePlayer2 == 11)
            .subscribe(() => document.getElementById('winner').innerHTML = 'Winner Player 2');
        const u = Observable.interval(5)
            .takeUntil(Observable.interval(5)
            .map(() => ({ score1: Number(scoreCountPlayer1), score2: Number(scoreCountPlayer2) }))
            .filter(({ score1, score2 }) => 2 + score1 > 12 || 2 + score2 > 12));
        u.map(() => ({ ballY: rectBall.attr('y') }))
            .subscribe(({ ballY }) => rectAI.attr('y', Math.abs(Number(ballY)) - 1));
        u.map(() => ({ directionX: signY, directionY: signX }))
            .subscribe(({ directionX, directionY }) => rectBall.attr('y', Number(rectBall.attr('y')) - Number(signY))
            .attr('x', Number(rectBall.attr('x')) - Number(signX)));
        u.map(() => ({ y: Number(rectBall.attr('y')) }))
            .filter(({ y }) => Number(y) <= 0 || Number(y) >= 590)
            .map(() => String(signY) === '-1' ? signY = '1' : signY = '-1')
            .subscribe(() => signY);
        u.map(() => ({ BallX: Number(rectBall.attr('x')), BallY: Number(rectBall.attr('y')),
            AiPaddleX: Number(rectAI.attr('x')), AiPaddleY: Number(rectAI.attr('y')),
            playerPaddleX: Number(rectPlayer.attr('x')), playerPaddleY: Number(rectPlayer.attr('y')) }))
            .filter(({ BallX, BallY, AiPaddleX, AiPaddleY, playerPaddleX, playerPaddleY }) => AiPaddleY <= BallY && 10 - BallY <= (AiPaddleY + Number(rectAI.attr('height'))) && BallX == AiPaddleX
            || playerPaddleY <= BallY && BallY <= (playerPaddleY + Number(rectPlayer.attr('height'))) && BallX == playerPaddleX)
            .map(() => String(signX) === '-1' ? signX = '1' : signX = '-1')
            .subscribe(() => signX);
        u.map(() => ({ ballX: Number(rectBall.attr('x')) }))
            .filter(({ ballX }) => ballX == svg.clientWidth || ballX == 0)
            .map(({ ballX }) => ballX == svg.clientWidth ? score.innerHTML = 'Player 1: ' + Math.abs(scoreCountPlayer1 += 1)
            : score2.innerHTML = 'Player 2: ' + Math.abs(scoreCountPlayer2 += 1))
            .subscribe(() => setTimeout(() => { resetGame(); }, 1000));
    }
    function dragRectObservable() {
        const mousemove = Observable.fromEvent(svg, 'mousemove'), mouseup = Observable.fromEvent(svg, 'mouseup');
        rectPlayer.observe('mousedown')
            .map(({ clientX, clientY }) => ({ xOffset: Number(rectPlayer.attr('x')) - clientX,
            yOffset: Number(rectPlayer.attr('y')) - clientY }))
            .flatMap(({ xOffset, yOffset }) => mousemove
            .takeUntil(mouseup)
            .map(({ clientX, clientY }) => ({ x: clientX + xOffset, y: clientY + yOffset })))
            .subscribe(({ x, y }) => rectPlayer.attr('y', y));
    }
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map