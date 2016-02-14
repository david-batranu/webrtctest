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

    var ball = {};
    var r_paddle = {};

    game.client.network_update = function(data){
      var j_data = JSON.parse(data);
      ball = j_data.ball;
      r_paddle = j_data.paddle;
    };

    game.init_keyevents(ctx, paddle);

    function gameloop() {
      game.draw.clear(ctx);

      rtc.client.dc.send(JSON.stringify({
        paddle: paddle
      }));

      game.update_paddle(ctx, paddle);

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

