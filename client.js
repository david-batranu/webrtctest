// Client

rtc.client.init = function(remoteOffer, callback, iceCallback){

  var pc = new rtc.peerConnection(rtc.connection.cfg, rtc.connection.con);

  var dc;

  var offerDesc = new rtc.sessionDescription(remoteOffer.offer);
  pc.setRemoteDescription(offerDesc, function(){
    console.log('set remote success!');
    for (var idx in remoteOffer.ice) {
      var ice = remoteOffer.ice[idx];
      var candidate = new RTCIceCandidate(ice);
      pc.addIceCandidate(candidate);
    }
  });

  pc.createAnswer(function(answerDesc){
    pc.setLocalDescription(answerDesc);
    console.log('client answer ready!');
    callback(answerDesc);
  }, function(){
    console.log('client error');
  });

  pc.onicecandidate = function(e){
    console.log('ice candidate', e);
    iceCallback(e);
  };

  pc.onconnection = function(){
    console.log('client connected');
  };

  pc.onsignalingstatechange = function(state) {
    console.info('signaling state change:', state);
  };

  pc.oniceconnectionstatechange = function(state) {
    console.info('ice connection state change:', state);
  };

  pc.onicegatheringstatechange = function(state) {
    console.info('ice gathering state change:', state);
  };

  pc.ondatachannel = function(e){
    console.log('client: received data channel');
    dc = e.channel;
    rtc.client.dc = dc;

    dc.onopen = function(e){
      console.log('client: data channel connected!');
      game.client.notify.start();
    };

    dc.onmessage = function(e){
      game.client.network_update(e.data);
      //game.client.notify.update(e.data);
    };

  };


  rtc.client.pc = pc;

};
