const { GoogleGenAI } = require("@google/genai");
const readline = require("readline");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function askGemini(topic) {
    const prompt = `
You are a research assistant. A user wants to research this topic: "${topic}"

Please provide:
1. A one sentence summary of the topic
2. Five key sub-questions worth investigating
3. A suggested research plan with three steps

Format your response clearly with headers for each section.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log("\n--- RESEARCH BRIEF ---\n");
    console.log(response.text);
    console.log("--- END ---\n");
}

rl.question("Enter a topic to research: ", async (topic) => {
    await askGemini(topic);
    rl.close();
});