document.addEventListener("DOMContentLoaded", function(event) {

  var game = window.game;


  document.body.addEventListener('game.server.stop', function(){
    game.running = false;
  });

  document.body.addEventListener('game.server.start', function(){

    game.running = true;

    var circle = {};
    circle.x = 20;
    circle.y = 25;
    circle.r = 20;

    circle.direction = 1;
    circle.speed = 2;


    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    function gameloop() {

      game.draw.clear(ctx);

      if (circle.x - circle.r < 0 || circle.x + circle.r > canvas.width){
        circle.direction *= -1;
      }

      circle.x += circle.direction * circle.speed;

      rtc.server.dc.send(JSON.stringify(circle));

      game.draw.circle(ctx, circle);

      if (game.running){
        requestAnimationFrame(gameloop);
      }

    }

    requestAnimationFrame(gameloop);

  });

});

