const express = require('express');
const doTask = require('./utils');
const promClient = require('prom-client'); //metrcs collection
const responseTime = require('response-time');

const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
      labels: {
        appName: "exp",
      },
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);

const app = express();
const port = process.env.PORT || 8000;

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({});

const reqResTime = new promClient.Histogram({
  name:"some_name",
  help:"this shows the req and res time",
  labelNames: ["method", "route", "status_code"],
  buckets: [1,50,100,200,400,500,800,1000,2000]
})

app.use(
  responseTime((req,res,time)=>{
     reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
      }).observe(time);
  }));


app.get("/", (req, res) => {
  logger.info("req came on root");
  return res.json("Hello from fast api");
});

app.get('/metrics', async(req,res)=>{
  res.setHeader("content-type",promClient.register.contentType);
  const metrics = await promClient.register.metrics();
  res.send(metrics);
});

app.get("/slow", async (req, res) => {
  try {
  logger.info("req came on slow");
    const timeTaken = await doTask();
    return res.json({
      status: "success",
      message: `task completed in ${timeTaken}ms`
    });
  } catch (err) {
  logger.error(err.message)
    return res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`running server at ${port}`);
});
