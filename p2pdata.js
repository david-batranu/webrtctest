// Server


(function(){

  var cfg = {
    iceServers: []
  };

  var con = {
    optional: [
      {
        DtlsSrtpKeyAgreement: true
      }
    ]
  };

  var pc1 = new webkitRTCPeerConnection(cfg, con);

  var dc1 = pc1.createDataChannel('test', {
    reliable: true
  });


  var offer;

  pc1 = createOffer(function(desc){
    offer = desc;
    console.log(offer);
  });



})();
