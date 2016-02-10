document.addEventListener("DOMContentLoaded", function(event) {

  var game = window.game;

  document.body.addEventListener('game.client.update', function(evt){

    var circle = evt.detail.data;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    game.draw.clear(ctx);

    if (circle.x - circle.r < 0 || circle.x + circle.r > canvas.width){
      circle.direction *= -1;
    }

    circle.x += circle.direction * circle.speed;

    game.draw.circle(ctx, circle);

  });

});

