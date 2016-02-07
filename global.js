var rtc = {
  server: {},
  client: {},
  connection: {
    cfg: {
      iceServers: []
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
