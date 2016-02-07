document.addEventListener("DOMContentLoaded", function(event) {
  (function(){

    var server = {offer: {}, recv: {}, ice: {}};
    var client = {offer: {}, send: {}, ice: {}};


    server.offer.data = document.getElementById('serverOffer');
    server.offer.btn = document.getElementById('serverOfferBtn');

    server.recv.data = document.getElementById('serverRemoteAnswer');
    server.recv.btn = document.getElementById('serverRemoteAnswerBtn');

    server.ice.send = document.getElementById('serverICE');
    server.ice.recv = document.getElementById('serverRemoteICE');


    client.offer.data = document.getElementById('clientRemoteOffer');
    client.offer.btn = document.getElementById('clientRemoteOfferBtn');

    client.send.data = document.getElementById('clientAnswer');
    client.send.btn = document.getElementById('clientAnswerBtn');

    client.ice.recv = document.getElementById('clientRemoteICE');
    client.ice.send = document.getElementById('clientICE');



    server.offer.btn.onclick = function(evt){
      rtc.server.start(function(offer){
        server.offer.data.value = JSON.stringify(offer.toJSON());
      }, function(icecandidate){
        var value;
        if (icecandidate.candidate === null) { return; }
        if (server.ice.send.value === '') {
          value = [];
          value.push(icecandidate.candidate);
          server.ice.send.value = JSON.stringify(value);
        } else {
          value = JSON.parse(server.ice.send.value);
          value.push(icecandidate.candidate);
          server.ice.send.value = JSON.stringify(value);
        }
      });
    };


    server.recv.btn.onclick = function(evt){
      var answer = JSON.parse(server.recv.data.value);
      var ice = JSON.parse(server.ice.recv.value);

      var data = {answer: answer, ice: ice};
      rtc.server.client(data);
    };



    client.offer.btn.onclick = function(evt){
      var offer = JSON.parse(client.offer.data.value);
      var ice = JSON.parse(client.ice.recv.value);

      var data = {offer: offer, ice: ice};

      rtc.client.init(data, function(answer){
        client.send.data.value = JSON.stringify(answer);
      }, function(icecandidate){
        var value;
        if (icecandidate.candidate === null) { return; }
        if (client.ice.send.value === '') {
          value = [];
          value.push(icecandidate.candidate);
          client.ice.send.value = JSON.stringify(value);
        } else {
          value = JSON.parse(server.ice.send.value);
          value.push(icecandidate.candidate);
          client.ice.send.value = JSON.stringify(value);
        }
      });
    };


  })();
});
