var rtc = {
  server: {},
  client: {},
  connection: {
    cfg: {
      iceServers: [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]
    },
    con: {
      optional: [
      {
        DtlsSrtpKeyAgreement: true
      }
      ]
    }
  }
};

rtc.peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
rtc.sessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
