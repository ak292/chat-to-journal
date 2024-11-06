# Chat to Journal Web App

A web app that allows you to upload your WhatsApp and Messenger messages in text format and convert them into timestamped journal entries using the power of LLMs! Simply select your message file, and we’ll help you document your thoughts and conversations!

# Try it out

This project was deployed at https://chat-to-journal.onrender.com (Backend uses free-tier hosting so the website may take some time to load initially (~30 seconds).

# How to Run

**Note**: If you want to run it locally, you will need an OpenAPI key to be able to make requests to certain LLMs, which requires you to buy credits as there is no free API option. It may be easier to just test it out through the deployed version.

1) Create a .env file in the root directory and add an "API_KEY" variable with your OpenAPI key
2) Run ```npm install```
3) Run ```node app.js```

