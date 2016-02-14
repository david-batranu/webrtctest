document.addEventListener("DOMContentLoaded", function(event) {

  var game = window.game;


  document.body.addEventListener('game.server.stop', function(){
    game.running = false;
  });

  document.body.addEventListener('game.server.start', function(){

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    game.running = true;

    var circle = {};
    circle.x = ctx.canvas.width / 2 ;
    circle.y = ctx.canvas.height / 2;
    circle.r = 5;

    circle.direction = 1;
    circle.speed = 2;

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

      if (circle.x - circle.r < 0 || circle.x + circle.r > canvas.width){
        circle.direction *= -1;
      }

      circle.x += circle.direction * circle.speed;

      rtc.server.dc.send(JSON.stringify({
        ball: circle,
        paddle: paddle
      }));

      game.draw.circle(ctx, circle);
      game.draw.paddle(ctx, paddle);
      game.draw.paddle(ctx, r_paddle);

      if (game.running){
        requestAnimationFrame(gameloop);
      }

    }

    requestAnimationFrame(gameloop);

  });

});

