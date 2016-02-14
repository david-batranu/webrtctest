 (function(){

  var game = {
    running: false,

    server: {
      events: {},
      notify: {}
    },
    client: {
      events: {},
      notify: {}
    },
    events: {},

    object: {},
    collision: {},

    draw: {}
  };

  game.server.events.start = new CustomEvent('game.server.start');
  game.server.events.stop = new CustomEvent('game.server.stop');

  game.client.events.update = new CustomEvent('game.client.update', {
    detail: {}
  });

  game.client.events.start = new CustomEvent('game.client.start');


  game.server.notify.start = function(){
    document.body.dispatchEvent(game.server.events.start);
  };

  game.server.notify.stop = function(){
    document.body.dispatchEvent(game.server.events.stop);
  };


  game.client.notify.start = function(){
    document.body.dispatchEvent(game.client.events.start);
  };

  game.client.notify.update = function(data){
    var evt = game.client.events.update;
    evt.detail.data = JSON.parse(data);
    document.body.dispatchEvent(evt);
  };


  game.draw.circle = function(ctx, circle){
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.stroke();
  };

  game.draw.paddle = function(ctx, paddle){
    ctx.fillStyle = '#000';
    var x = paddle.x - paddle.w / 2;
    var y = paddle.y - paddle.h / 2;
    ctx.fillRect(x, y, paddle.w, paddle.h);
  };

  game.draw.clear = function(ctx){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  game.update_paddle = function(ctx, paddle){
    var h = paddle.h / 2;
    var new_pos = paddle.y + paddle.direction * paddle.speed;
    if (new_pos - h > 0 && new_pos + h < ctx.canvas.height){
      paddle.y = new_pos;
    }
  };

  game.init_keyevents = function(ctx, paddle){
    window.addEventListener('keydown', function(evt){
      if (evt.keyCode === 38){
        paddle.direction = -1;
      } else if (evt.keyCode === 40) {
        paddle.direction = 1;
      }
    });
    window.addEventListener('keyup', function(evt){
      if (evt.keyCode === 38 || evt.keyCode === 40){
        paddle.direction = 0;
      }
    });
  };

  game.object.paddle = function(ctx){
    return {
      x: 0, y: ctx.canvas.height / 2,
      w: 20, h: ctx.canvas.height / 3,
      speed: 5,
      direction: 0
    };
  };

  game.object.ball = function(ctx){
    return {
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 2,
      r: 5,
      speed: 2,
      direction: {
        x: 0,
        y: 0
      }
    };
  };


  game.collision.box_ball = function(ball){
    return {
      x: ball.x - ball.r,
      y: ball.y - ball.r,
      w: 2 * ball.r,
      h: 2 * ball.r
    };
  };

  game.collision.box_paddle = function(paddle){
    return {
      x: paddle.x - paddle.w / 2,
      y: paddle.y - paddle.h / 2,
      w: paddle.w,
      h: paddle.h
    };
  };

  game.collision.check = function(box1, box2){
    return box1.x < box2.x + box2.w &&
      box1.x + box1.w > box2.x &&
      box1.y < box2.y + box2.h &&
      box1.h + box1.y > box2.y;

  };

  game.draw.collision_box = function(ctx, box){
    ctx.beginPath();

    ctx.moveTo(box.x, box.y);

    ctx.lineTo(box.x + box.w, box.y);
    ctx.lineTo(box.x + box.w, box.y + box.h);
    ctx.lineTo(box.x, box.y + box.h);
    ctx.lineTo(box.x, box.y);

    ctx.strokeStyle = '#f00';
    ctx.stroke();
  };

  window.game = game;

 })();


