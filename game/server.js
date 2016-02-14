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
    ball.direction = 1;

    var paddle = game.object.paddle(ctx);
    paddle.x = ctx.canvas.width - 15;

    var r_paddle = {};

    game.server.network_update = function(data){
      var j_data = JSON.parse(data);
      r_paddle = j_data.paddle;
    };

    game.init_keyevents(paddle);

    function gameloop() {

      game.draw.clear(ctx);


      var boxes = {};
      boxes.ball = game.collision.box_ball(ball);
      boxes.paddle = game.collision.box_paddle(paddle);
      boxes.r_paddle = game.collision.box_paddle(r_paddle);


      if (game.collision.check(boxes.paddle, boxes.ball) ||
          game.collision.check(boxes.r_paddle, boxes.ball)){
        ball.direction *= -1;
      }

      ball.x += ball.direction * ball.speed;

      rtc.server.dc.send(JSON.stringify({
        ball: ball,
        paddle: paddle
      }));

      game.draw.circle(ctx, ball);
      game.draw.paddle(ctx, paddle);
      game.draw.paddle(ctx, r_paddle);

      game.draw.collision_box(ctx, boxes.ball);
      game.draw.collision_box(ctx, boxes.paddle);
      game.draw.collision_box(ctx, boxes.r_paddle);

      if (game.running){
        requestAnimationFrame(gameloop);
      }

    }

    requestAnimationFrame(gameloop);

  });

});

