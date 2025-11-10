import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// store last received JSON in memory
let lastInventory = null;

// POST endpoint for uploads
app.post("/upload-inventory", (req, res) => {
  console.log("✅ Received inventory JSON:");
  console.log(JSON.stringify(req.body, null, 2));
  lastInventory = req.body; // save it
  res.json({
    status: "success",
    message: "JSON received successfully",
    count: Array.isArray(req.body) ? req.body.length : 1,
  });
});

// GET endpoint to show last uploaded data
app.get("/", (req, res) => {
  if (lastInventory) {
    // Pretty-print the last received JSON
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(lastInventory, null, 2));
  } else {
    res.send("📦 Inventory test server is running! (no data received yet)");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
