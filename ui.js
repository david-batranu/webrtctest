document.addEventListener("DOMContentLoaded", function(event) {
  (function(){

    var server = {offer: {}, recv: {}, ice: {}};
    var client = {offer: {}, send: {}, ice: {}};


    server.offer.data = document.getElementById('serverOffer');
    server.offer.btn = document.getElementById('serverOfferBtn');

    server.recv.data = document.getElementById('serverRemoteAnswer');
    server.recv.btn = document.getElementById('serverRemoteAnswerBtn');

    client.offer.data = document.getElementById('clientRemoteOffer');
    client.offer.btn = document.getElementById('clientRemoteOfferBtn');

    client.send.data = document.getElementById('clientAnswer');


    server.offer.btn.onclick = function(evt){
      var output = {offer: '', ice: []};
      rtc.server.start(function(offer){
        output.offer = offer.toJSON();
      }, function(icecandidate){
        if (icecandidate.candidate !== null) {
          output.ice.push(icecandidate.candidate);
        }
        server.offer.data.value = JSON.stringify(output);
      });
    };


    server.recv.btn.onclick = function(evt){
      var input = JSON.parse(server.recv.data.value);
      var data = {answer: input.answer, ice: input.ice};
      rtc.server.client(data);
    };



    client.offer.btn.onclick = function(evt){
      var input = JSON.parse(client.offer.data.value);
      var data = {offer: input.offer, ice: input.ice};

      var output = {answer: '', ice: []};

      rtc.client.init(data, function(answer){
        output.answer = answer.toJSON();
      }, function(icecandidate){
        if (icecandidate.candidate !== null) {
          output.ice.push(icecandidate.candidate);
        }
        client.send.data.value = JSON.stringify(output);
      });
    };


  })();
});
