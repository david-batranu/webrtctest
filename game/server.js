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
    ball.direction.x = 1;

    var paddle = game.object.paddle(ctx);
    paddle.x = ctx.canvas.width - 15;

    var r_paddle = game.object.paddle(ctx);
    r_paddle.x = 15;

    game.server.network_update = function(data){
      var j_data = JSON.parse(data);
      r_paddle = j_data.paddle;
    };

    game.init_keyevents(ctx, paddle);

    function gameloop() {

      game.draw.clear(ctx);

      var boxes = game.collision.boxes(ctx, ball, paddle, r_paddle);

      game.collision.check_all(ctx, paddle, r_paddle, ball, boxes, function(){
        rtc.server.dc.send(JSON.stringify({
          ball: ball
        }));
      });

      ball.move();

      game.update_paddle(ctx, paddle, function(){
        rtc.server.dc.send(JSON.stringify({
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

