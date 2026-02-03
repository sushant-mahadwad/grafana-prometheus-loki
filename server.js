const express = require('express');
const doTask = require('./utils');
const promClient = require('prom-client'); //metrcs collection

const app = express();
const port = process.env.PORT || 8000;

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({});
app.get("/", (req, res) => {
  return res.json("Hello from fast api");
});

app.get('/metrics', async(req,res)=>{
  res.setHeader("content-type",promClient.register.contentType);
  const metrics = await promClient.register.metrics();
  res.send(metrics);
});

app.get("/slow", async (req, res) => {
  try {
    const timeTaken = await doTask();
    return res.json({
      status: "success",
      message: `task completed in ${timeTaken}ms`
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`running server at ${port}`);
});
