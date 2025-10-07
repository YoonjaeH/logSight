class logSight {
  constructor(projectId) {
    this.projectId = projectId;
    this.ingestUrl = 'http://localhost:8000/ingest';
  }

  track(eventType, data) {
    this.send({ eventType, data });
  }

  send(payload) {
    const dataToSend = {
      projectId: this.projectId,
      ...payload,
    };
    
    navigator.sendBeacon(this.ingestUrl, JSON.stringify(dataToSend));
  }
}

window.onerror = function (message, source, lineno, colno, error) {
  logSight.send({
    eventType: 'error',
    data: { message, source, lineno, colno, stack: error.stack }
  });
};

const logSight = new logSight('YOUR_PROJECT_ID');