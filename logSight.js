class logSight {
  constructor(projectId) {
    this.projectId = projectId;
    this.ingestUrl = 'http://localhost:8000/ingest'; // Your ingestor URL
  }

  // A function to send custom events
  track(eventType, data) {
    this.send({ eventType, data });
  }

  // Private send method
  send(payload) {
    const dataToSend = {
      projectId: this.projectId,
      ...payload,
    };
    
    navigator.sendBeacon(this.ingestUrl, JSON.stringify(dataToSend));
  }
}

// Global error handler
window.onerror = function (message, source, lineno, colno, error) {
  logSight.send({
    eventType: 'error',
    data: { message, source, lineno, colno, stack: error.stack }
  });
};

// Initialize for the user
const logSight = new logSight('YOUR_PROJECT_ID');