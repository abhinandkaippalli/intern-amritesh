const express = require("express");
const app = express();


app.use(express.json());


app.get("/", (req, res) => {
  res.json({ data: "hlo" });
});

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});

module.exports = app;
