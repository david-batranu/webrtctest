document.addEventListener("DOMContentLoaded", function(event) {

  var game = window.game;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  function gameloop() {
    if (game.client.circle){
      game.draw.clear(ctx);
      game.draw.circle(ctx, game.client.circle);
    }

    requestAnimationFrame(gameloop);
  }
  requestAnimationFrame(gameloop);

  document.body.addEventListener('game.client.update', function(evt){

    game.running = true;
    game.client.circle = evt.detail.data;

  });

});

