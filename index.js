import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // handle big JSON

// Test endpoint
app.get("/", (req, res) => {
  res.send("📦 Inventory test server is running!");
});

// Main POST endpoint for your MAUI app
app.post("/upload-inventory", (req, res) => {
  console.log("✅ Received inventory JSON:");
  console.log(JSON.stringify(req.body, null, 2)); // pretty print

  res.json({
    status: "success",
    message: `Received ${Array.isArray(req.body) ? req.body.length : 1} records.`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
