const express = require("express");
const { seats } = require("./src/seats");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.json({
    message: "API is running"
  });
});

app.get("/api/seats", (req, res) => {
  res.json(seats);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
