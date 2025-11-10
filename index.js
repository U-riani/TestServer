import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" })); // supports large batches

// In-memory storage (reset when server restarts)
let lastInventory = [];

// ✅ Upload inventory chunks
app.post("/upload-inventory", (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: "Expected JSON array of products" });
  }

  // Append incoming batch instead of overwriting previous ones
  lastInventory.push(...req.body);

  console.log(
    `✅ Received batch: ${req.body.length} items | Total stored: ${lastInventory.length}`
  );

  res.json({
    message: "Batch received successfully",
    batchSize: req.body.length,
    totalStored: lastInventory.length,
  });
});

// ✅ Download all stored inventory
app.get("/download-inventory", (req, res) => {
  if (!lastInventory.length) {
    return res.status(404).json({ error: "No inventory data stored yet" });
  }

  console.log(`📤 Sending ${lastInventory.length} items to client`);
  res.json(lastInventory);
});

// ✅ Optional: clear all stored inventory (for testing)
app.delete("/clear-inventory", (req, res) => {
  const count = lastInventory.length;
  lastInventory = [];
  console.log(`🧹 Cleared ${count} stored items`);
  res.json({ message: `Cleared ${count} items` });
});

// ✅ Health check / info endpoint
app.get("/", (req, res) => {
  res.send(
    "📦 Inventory test server is running!<br>Endpoints:<br>" +
      "<ul>" +
      "<li>POST /upload-inventory — receive data</li>" +
      "<li>GET /download-inventory — return last uploaded data</li>" +
      "<li>DELETE /clear-inventory — clear stored data</li>" +
      "</ul>"
  );
});

// Start server (Vercel ignores this locally but runs it in dev)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app; // required for Vercel deployments
