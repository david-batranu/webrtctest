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


  game.reset_ball = function(ctx, ball) {
    var x = ball.direction.x;

    var default_ball = game.object.ball(ctx);
    for (var prop in default_ball){
      if (ball.hasOwnProperty(prop)){
        ball[prop] = default_ball[prop];
      }
    }

    ball.direction.x = -x;
  };

  game.collision.boxes = function(ctx, ball, paddle, r_paddle){
    var boxes = {};

    boxes.ball = game.collision.box_ball(ball);
    boxes.paddle = game.collision.box_paddle(paddle);
    boxes.r_paddle = game.collision.box_paddle(r_paddle);
    boxes.top_wall = {
      x: 0, y: 0,
      w: ctx.canvas.width,
      h: 0
    };
    boxes.bot_wall = {
      x: 0, y: ctx.canvas.height,
      w: ctx.canvas.width,
      h: 0
    };

    return boxes;
  };

  game.collision.check_all = function(ctx, paddle, r_paddle, ball, boxes, callback){
    var collided = false;
    if (game.collision.check(boxes.paddle, boxes.ball)){
      game.collision.paddle_collision(paddle, ball);
      collided = true;
    } else if (game.collision.check(boxes.r_paddle, boxes.ball)){
      game.collision.paddle_collision(r_paddle, ball);
      collided = true;
    } else if (game.collision.check(boxes.ball, boxes.top_wall)){
      ball.direction.y *= -1;
      collided = true;
    } else if (game.collision.check(boxes.ball, boxes.bot_wall)){
      ball.direction.y *= -1;
      collided = true;
    } else if (ball.x > ctx.canvas.width){
      game.reset_ball(ctx, ball);
      collided = true;
    } else if (ball.x < 0){
      game.reset_ball(ctx, ball);
      collided = true;
    }
    if (collided){
      callback();
    }
  };

  game.collision.paddle_collision = function(paddle, ball){
    ball.direction.x *= -1;
    ball.direction.y += (paddle.speed * paddle.direction * 0.1);
    if (ball.direction.y > 1){
      ball.direction.y = 1;
    } else if (ball.direction.y < -1){
      ball.direction.y = -1;
    }
    ball.speed = ball.speed + (ball.speed * 0.01);
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

  game.draw.net = function(ctx){
    ctx.beginPath();

    var center = ctx.canvas.width / 2;

    ctx.moveTo(center, 0);
    ctx.lineTo(center, ctx.canvas.height);

    ctx.strokeStyle = '#ccd';
    ctx.stroke();
  };

  game.draw.all = function(ctx, ball, paddle, r_paddle){
    game.draw.circle(ctx, ball);
    game.draw.paddle(ctx, paddle);
    game.draw.paddle(ctx, r_paddle);
    game.draw.net(ctx);
  };

  game.update_paddle = function(ctx, paddle, callback){
    if (paddle.direction !== 0){
      var h = paddle.h / 2;
      var new_pos = paddle.y + paddle.direction * paddle.speed;
      if (new_pos - h > 0 && new_pos + h < ctx.canvas.height){
        paddle.y = new_pos;
      }
      callback();
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
      speed: 5,
      direction: {
        x: 0,
        y: 0
      },
      move: function(){
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
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


