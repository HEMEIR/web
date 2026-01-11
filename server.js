// server.js
const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/calc", (req, res) => {
  const { a, b, op } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "a 和 b 必须是数字" });
  }

  let result;
  if (op === "+") {
    result = a + b;
  } else if (op === "-") {
    result = a - b;
  } else {
    return res.status(400).json({ error: "只支持 + 或 -" });
  }

  if (a > 10 || b > 10) {
    return res.status(400).json({ error: "数字必须 ≤ 10" });
  }

  res.json({ result });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`后端已启动: http://localhost:${PORT}`);
});
