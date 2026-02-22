const { GoogleGenAI } = require("@google/genai");
const readline = require("readline");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function askGemini(topic) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Tell me about this topic in 3 sentences: ${topic}`,
    });
    console.log("\nGemini says:\n");
    console.log(response.text);
}

rl.question("Enter a topic to research: ", async (topic) => {
    await askGemini(topic);
    rl.close();
});