// Server

rtc.server.start = function(callback, iceCallback){

  var pc = new webkitRTCPeerConnection(rtc.connection.cfg, rtc.connection.con);

  var dc = pc.createDataChannel('test', {
    reliable: true
  });

  dc.onopen = function(e){
    console.log('server: data channel open!');
  };

  dc.onmessage = function(e){
    console.log('message: ', e);
  };


  pc.createOffer(function(desc){
    pc.setLocalDescription(desc, function(){}, function(){});
    console.log(desc);
    callback(desc);
  }, function(){
    console.log('server error');
  });

  pc.onicecandidate = function(e){
    console.log('ice candidate', e);
    iceCallback(e);
  };

  pc.onconnection = function(){
    console.log('server connected');
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

  rtc.server.pc = pc;
  rtc.server.dc = dc;

};


rtc.server.client = function(remoteAnswer){
  var answerDesc = new RTCSessionDescription(remoteAnswer.answer);
  rtc.server.pc.setRemoteDescription(answerDesc, function(){
    console.log('set remote success!');
    for (var idx in remoteAnswer.ice) {
      var ice = remoteAnswer.ice[idx];
      var candidate = new RTCIceCandidate(ice);
      rtc.server.pc.addIceCandidate(candidate);
    }
  });
};
