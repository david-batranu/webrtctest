 (function(){

  var game = {
    running: false,

    server: {
      events: {},
      notify: {}
    },
    client: {
      events: {},
      notify: {}
    },
    events: {},

    draw: {}
  };

  game.server.events.start = new CustomEvent('game.server.start');
  game.server.events.stop = new CustomEvent('game.server.stop');

  game.client.events.update = new CustomEvent('game.client.update', {
    detail: {}
  });

  game.client.events.start = new CustomEvent('game.client.start');


  game.server.notify.start = function(){
    document.body.dispatchEvent(game.server.events.start);
  };

  game.server.notify.stop = function(){
    document.body.dispatchEvent(game.server.events.stop);
  };


  game.client.notify.start = function(){
    document.body.dispatchEvent(game.client.events.start);
  };

  game.client.notify.update = function(data){
    var evt = game.client.events.update;
    evt.detail.data = JSON.parse(data);
    document.body.dispatchEvent(evt);
  };


  game.draw.circle = function(ctx, circle){
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.stroke();
  };

  game.draw.paddle = function(ctx, paddle){
    ctx.fillStyle = '#000';
    var x = paddle.x - paddle.w / 2;
    var y = paddle.y - paddle.h / 2;
    ctx.fillRect(x, y, paddle.w, paddle.h);
  };

  game.draw.clear = function(ctx){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };




  window.game = game;

 })();


