const { trace, SpanStatusCode, metrics } = require("@opentelemetry/api");

const tracer = trace.getTracer("dice-lib")
const meter = metrics.getMeter("dice-lib")

const counter = meter.createCounter("dice-lib.rolls.counter")

function rollOnce(i, min, max) {
    return tracer.startActiveSpan(`rollDice:${i}`, (span) => {
       const result = Math.floor(Math.random() * (max - min + 1) + min);
       span.setAttribute("dicelab.rolled",result.toString());
       span.end();
       return result;
    });
  }
  
  function rollTheDice(rolls, min, max) {
    return tracer.startActiveSpan('rollTheDice',
        { attributes: {"dicelib.rolls": rolls.toString() }}, (span) => {
        const result = [];
        for (let i = 0; i < rolls; i++) {
          counter.add(1)
          result.push(rollOnce(i, min, max));
        }
        // Be sure to end the span!
        span.addEvent("Hello im the span event",{
            "log.severity": "error"
        });
        
        try{
            throw "Error"
        } catch(e) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: "an error happened"
            })    
            span.recordException(e)
        }

        span.end();
        return result;
      });
  }
  
  module.exports = { rollTheDice };
  