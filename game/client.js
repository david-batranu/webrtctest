document.addEventListener("DOMContentLoaded", function(event) {

  var game = window.game;

  document.body.addEventListener('game.client.stop', function(){

    game.running = false;

  });

  document.body.addEventListener('game.client.start', function(){

    game.running = true;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var paddle = game.object.paddle(ctx);
    paddle.x = 15;

    var ball = game.object.ball(ctx);
    ball.direction.x = 1;

    var r_paddle = game.object.paddle(ctx);
    r_paddle.x = ctx.canvas.width - 15;

    game.client.network_update = function(data){
      var j_data = JSON.parse(data);
      if (j_data.ball){
        var r_ball = j_data.ball;
        ball.x = r_ball.x;
        ball.y = r_ball.y;
        ball.direction = r_ball.direction;
        ball.speed = r_ball.speed;
      }
      if (j_data.paddle){
        r_paddle = j_data.paddle;
      }
    };

    game.init_keyevents(ctx, paddle);

    function gameloop() {
      game.draw.clear(ctx);

      var boxes = game.collision.boxes(ctx, ball, paddle, r_paddle);

      game.collision.check_all(ctx, paddle, r_paddle, ball, boxes, function(){});

      ball.move();

      game.update_paddle(ctx, paddle, function(){
        rtc.client.dc.send(JSON.stringify({
          paddle: paddle
        }));
      });

      game.draw.all(ctx, ball, paddle, r_paddle);

      if (game.running){
        requestAnimationFrame(gameloop);
      }
    }

    requestAnimationFrame(gameloop);

  });

});

