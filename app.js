const express = require('express');
const { rollTheDice } = require('./dice.js');
const { trace, metrics, ValueType } = require('@opentelemetry/api');
const winston = require('winston');

const logger = winston.createLogger({ 
    level: 'info',
    format: winston.format.json(),
    transports: [ new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }) ]
});

const tracer = trace.getTracer("dice-roll-app","1.0");
const meter = metrics.getMeter("dice-roll-app","1.0");

const PORT = parseInt(process.env.PORT || '8070');
const app = express();

app.get('/rolldice', (req, res) => {
  const serverDurationHistogram = meter.createHistogram('http_server_duration_ms', {
    description: 'Measures the duration of inbound HTTP requests in milliseconds.',
  });
  
  const startTime =  new Date().getTime();
  const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;
  if (isNaN(rolls)) {
    res
      .status(400)
      .send("Request parameter 'rolls' is missing or not a number.");
    return;
  }
  const endTime = new Date().getTime();
  const executionTime = endTime -  startTime;

  serverDurationHistogram.record(executionTime);

  res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
});

app.listen(PORT, () => {
  logger.info(`Listening for requests on http://localhost:${PORT}`);
});
