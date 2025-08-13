import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  prompt: {
    "id": "pmpt_6898ef1524b48190abd6141c143534e70a12348215c2bd28",
    "version": "2",
    "variables": {
      "topic": "example topic"
    }
  }
});

console.log("Response:", response);