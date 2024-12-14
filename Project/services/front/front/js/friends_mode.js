// friends_mode.js
export function initFriendsModeGame() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const netWidth = 4;
  const paddleWidth = 10;
  const paddleHeight = 100;
  const ballSize = 10;

  let ballX = canvas.width / 2 - ballSize / 2;
  let ballY = canvas.height / 2 - ballSize / 2;
  let player1Y = canvas.height / 2 - paddleHeight / 2;
  let player2Y = canvas.height / 2 - paddleHeight / 2;
  let player1Score = 0;
  let player2Score = 0;
  let myPaddle = null;
  let gameStarted = false;
  let paddleVelocity = 0;


  const keydownHandler = (e) => {
    if (myPaddle === 'paddle1') {
      if (e.key === 'w') paddleVelocity = -400;
      if (e.key === 's') paddleVelocity = 400;
    } else if (myPaddle === 'paddle2') {
      if (e.key === 'ArrowUp') paddleVelocity = -400;
      if (e.key === 'ArrowDown') paddleVelocity = 400;
    }
    ws.send(JSON.stringify({ velocity: paddleVelocity }));
  };

  const keyupHandler = (e) => {
    if (myPaddle === 'paddle1' && (e.key === 'w' || e.key === 's')) {
      paddleVelocity = 0;
    } else if (myPaddle === 'paddle2' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      paddleVelocity = 0;
    }
    ws.send(JSON.stringify({ velocity: paddleVelocity }));
  };

  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);

  function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawCircle(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  function drawNet() {
    for (let i = window.innerHeight / 10; i <= canvas.height - window.innerHeight / 10; i += 30) {
      drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 15, '#fff');
    }
  }

  function drawScore() {
    ctx.font = '35px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(player1Score, canvas.width / 2 - 475, 200);
    ctx.fillText(player2Score, canvas.width / 2 + 450, 200);
  }

  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawScore();
    drawRect(window.innerWidth / 10 + 5, player1Y, paddleWidth, paddleHeight, '#ffffff');
    drawRect(window.innerWidth - window.innerWidth / 10 - paddleWidth - 5, player2Y, paddleWidth, paddleHeight, '#ffffff');
    drawCircle(ballX, ballY, ballSize, '#00ff80');
  }

  function gameLoop(timestamp) {
    drawGame();
    requestAnimationFrame(gameLoop);
  }

  alert('hello');
  const state = history.state;
  const roomName = state ? state.roomName : null;

  if (!roomName) {
    alert('mochkila');
    return;
  }
  const ws = new WebSocket(`ws://localhost:8000/ws/game/${roomName}/`);

  ws.onopen = () => {
    console.log('Connected to the server');
    // getRoomName();
    try {
      ws.send(JSON.stringify({
        type: 'screen_dimensions',
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    } catch (error) {
      console.error('Failed to send data:', error);
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.paddle) {
      myPaddle = data.paddle;
      console.log("Assigned to:", myPaddle);
    }

    if (data.start_game !== undefined) {
      gameStarted = data.start_game;
      ballX = data.ballX;
      ballY = data.ballY;
      player1Y = data.player1Y;
      player2Y = data.player2Y;
    }

    if (data.player1Y !== undefined && data.player2Y !== undefined) {
      player1Y = data.player1Y;
      player2Y = data.player2Y;
      ballX = data.ballX;
      ballY = data.ballY;
      player1Score = data.player1Score;
      player2Score = data.player2Score;
    }
  };

  ws.onclose = () => console.log('Disconnected from the server');
  ws.onerror = (error) => console.error(error);

  const velocityInterval = setInterval(() => {
    if (myPaddle && gameStarted) {
      ws.send(JSON.stringify({ velocity: paddleVelocity }));
    }
  }, 30);

  requestAnimationFrame(gameLoop);

  return () => {

    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('keyup', keyupHandler);
    
    clearInterval(velocityInterval);
    
    ws.close();
  };
}