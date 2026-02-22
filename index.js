const { GoogleGenAI } = require("@google/genai");
const readline = require("readline");
const fs = require("fs");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function askGemini(topic) {
    const prompt = `
You are a research assistant. A user wants to research this topic: "${topic}"

Respond ONLY with a valid JSON object using this exact structure, no other text:
{
  "topic": "the topic entered",
  "summary": "one sentence summary",
  "sub_questions": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "research_plan": [
    { "step": 1, "action": "first research step" },
    { "step": 2, "action": "second research step" },
    { "step": 3, "action": "third research step" }
  ],
  "follow_up_questions": ["follow up 1", "follow up 2", "follow up 3"]
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const raw = response.text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(raw);

    console.log("\n--- RESEARCH BRIEF ---\n");
    console.log("TOPIC:", data.topic);
    console.log("\nSUMMARY:", data.summary);
    console.log("\nSUB-QUESTIONS:");
    data.sub_questions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
    console.log("\nRESEARCH PLAN:");
    data.research_plan.forEach((s) => console.log(`  Step ${s.step}: ${s.action}`));
    console.log("\nFOLLOW-UP QUESTIONS:");
    data.follow_up_questions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
    console.log("\n--- END ---\n");

    fs.writeFileSync(`${topic.replace(/\s+/g, "-")}-research.md`,
        `# Research Brief: ${data.topic}\n\n` +
        `## Summary\n${data.summary}\n\n` +
        `## Sub-Questions\n${data.sub_questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\n` +
        `## Research Plan\n${data.research_plan.map((s) => `**Step ${s.step}:** ${s.action}`).join("\n\n")}\n\n` +
        `## Follow-Up Questions\n${data.follow_up_questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n`
    );

    console.log(`Saved to: ${topic.replace(/\s+/g, "-")}-research.md`);
}

rl.question("Enter a topic to research: ", async (topic) => {
    await askGemini(topic);
    rl.close();
});