document.addEventListener("DOMContentLoaded", function(event) {
  (function(){

    var circle = {};
    circle.x = 20;
    circle.y = 25;
    circle.r = 20;

    circle.direction = 1;
    circle.speed = 2;


    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');


    function draw_circle(ctx, circle){
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.stroke();
    }

    function clear_canvas(ctx){
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function gameloop() {

      clear_canvas(ctx);

      if (circle.x - circle.r < 0 || circle.x + circle.r > canvas.width){
        circle.direction *= -1;
      }

      circle.x += circle.direction * circle.speed;

      draw_circle(ctx, circle);

      requestAnimationFrame(gameloop);

    }

    requestAnimationFrame(gameloop);

  })();
});
