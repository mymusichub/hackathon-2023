const express = require("express");
const app = express();
const port = 8081;
const fullData = require("./mock-values/full-data.json");
const missingResizedCover = require("./mock-values/missing-resized-cover.json");
const emptyData = require("./mock-values/empty-data.json");

app.get(`/:dynamicRoute`, (req, res) => {
  const response = mockData[req.params.dynamicRoute];
  res.status(response ? 200 : 404).send(response);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mockData = {
  [fullData.dynamicRoute]: fullData,
  [emptyData.dynamicRoute]: emptyData,
  [missingResizedCover.dynamicRoute]: missingResizedCover,
};
