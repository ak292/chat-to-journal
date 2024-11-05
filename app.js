require("dotenv").config();

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

app.use(express.json()); // Add this line to parse JSON in req.body
// Serve static files (like CSS and JS)
app.use(express.static(path.join(__dirname, "public")));

// Route to render the HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const upload = multer({ storage });

// OpenAI API Key
const apiKey = process.env.API_KEY;

// The /upload endpoint to handle file uploads
// Route to handle file uploads and pass file contents to ChatGPT
app.post("/upload", upload.single("messageFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Step 1: Read the uploaded file
  const filePath = path.join(__dirname, "uploads", req.file.filename);
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return res.status(500).send("Error reading the file.");
    }

    try {
      // Step 2: Parse messages from the file (using your previous parseMessages function)
      const messages = parseMessages(data);

      // Step 3: Format messages to create a prompt for ChatGPT
      const formattedMessages = messages
        .map((msg) => `${msg.timestamp} ${msg.sender}: ${msg.content}`)
        .join("\n");

      const prompt = `Here are my messages for today:\n${formattedMessages}\n\nPlease identify which messages are about my day (from my perspective) and summarize them for my journal.`;

      // Step 4: Send the prompt to ChatGPT API
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
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

      // Step 5: Send ChatGPT's response back to the user
      const journalEntry = response.data.choices[0].message.content;
      res.send(journalEntry);
    } catch (error) {
      console.error(
        "Error with ChatGPT API:",
        error.response ? error.response.data : error.message
      );
      res.status(500).send("Error processing the file with ChatGPT.");
    }
  });
});

// Function to parse messages
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
