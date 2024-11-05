require("dotenv").config();

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/journal", (req, res) => {
  res.sendFile(path.join(__dirname, "public/journal", "journal.html"));
});

const upload = multer({ storage });

const apiKey = process.env.API_KEY;

app.post("/upload", upload.single("messageFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const filePath = path.join(__dirname, "uploads", req.file.filename);
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error reading the file." });
    }

    try {
      const analysisResult = await analyzeData(data);
      res
        .status(200)
        .json({ success: true, message: "File uploaded successfully!", results: analysisResult });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error analyzing the data." });
    }
  });
});

async function analyzeData(data) {
  const messages = parseMessages(data);
  const formattedMessages = messages
    .map((msg) => `${msg.timestamp} ${msg.sender}: ${msg.content}`)
    .join("\n");

  const prompt = `Here are my messages for today:\n${formattedMessages}\n\nSummarize messages reflecting my day (from my perspective) for my journal but seperate each journal entry by the day the message was sent. Use DD/MM/YYY to seperate each entry and return the results in an array only. No JSON, No object, ONLY AN ARRAY.`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

function parseMessages(input) {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const regex = /^\[(.*?)\] (.*?): (.*)$/;
      const match = line.match(regex);
      if (match) {
        return {
          timestamp: match[1],
          sender: match[2],
          content: match[3],
        };
      }
      return null;
    })
    .filter((msg) => msg !== null);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
