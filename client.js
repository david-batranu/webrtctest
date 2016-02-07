// Client

rtc.client.init = function(remoteOffer, callback, iceCallback){

  var pc = new webkitRTCPeerConnection(rtc.connection.cfg, rtc.connection.con);

  var dc = pc.createDataChannel('test', {
    reliable: true
  });


  var offerDesc = new RTCSessionDescription(remoteOffer.offer);
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
    callback(answerDesc.toJSON());
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


  rtc.client.pc = pc;
  rtc.client.dc = dc;

};
