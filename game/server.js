document.addEventListener("DOMContentLoaded", function(event) {

  var game = window.game;


  document.body.addEventListener('game.server.stop', function(){
    game.running = false;
  });

  document.body.addEventListener('game.server.start', function(){

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    game.running = true;

    var ball = game.object.ball(ctx);
    ball.speed = 5;
    ball.direction.x = 1;

    var paddle = game.object.paddle(ctx);
    paddle.x = ctx.canvas.width - 15;

    var r_paddle = {};

    game.server.network_update = function(data){
      var j_data = JSON.parse(data);
      r_paddle = j_data.paddle;
    };

    game.init_keyevents(ctx, paddle);


    var collision = function(paddle, ball){
      var y_diff = paddle.y - ball.y;
      ball.direction.x *= -1;
      ball.direction.y = Math.sin(y_diff) * Math.random();
    };

    var reset_ball = function(ctx, ball) {
      ball.x = ctx.canvas.width / 2;
      ball.y = ctx.canvas.height / 2;
      ball.direction.x *= -1;
      ball.direction.y = 0;
    };

    function gameloop() {

      game.draw.clear(ctx);


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

      if (game.collision.check(boxes.paddle, boxes.ball)){
        collision(paddle, ball);
      } else if (game.collision.check(boxes.r_paddle, boxes.ball)){
        collision(r_paddle, ball);
      } else if (game.collision.check(boxes.ball, boxes.top_wall)){
        ball.direction.y *= -1;
      } else if (game.collision.check(boxes.ball, boxes.bot_wall)){
        ball.direction.y *= -1;
      } else if (ball.x > ctx.canvas.width){
        reset_ball(ctx, ball);
      } else if (ball.x < 0){
        reset_ball(ctx, ball);
      }


      ball.x += ball.direction.x * ball.speed;
      ball.y += ball.direction.y * ball.speed;

      game.update_paddle(ctx, paddle);

      rtc.server.dc.send(JSON.stringify({
        ball: ball,
        paddle: paddle
      }));

      game.draw.circle(ctx, ball);
      game.draw.paddle(ctx, paddle);
      game.draw.paddle(ctx, r_paddle);
      game.draw.net(ctx);

      //game.draw.collision_box(ctx, game.collision.box_paddle(paddle));
      //game.draw.collision_box(ctx, game.collision.box_paddle(r_paddle));
      //game.draw.collision_box(ctx, game.collision.box_ball(ball));

      if (game.running){
        requestAnimationFrame(gameloop);
      }

    }

    requestAnimationFrame(gameloop);

  });

});

