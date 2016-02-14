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
