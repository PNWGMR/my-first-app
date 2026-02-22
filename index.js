const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "What is JavaScript in one sentence?",
    });
    console.log(response.text);
}

main();