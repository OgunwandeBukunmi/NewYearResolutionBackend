import { getGroqGenerate } from "../utils/groqClient.js";
import { buildResolutionPrompt } from "../prompts/groqResolutionAiPrompt.js"
import clientPromise from "../libs/mongodb.js";
import { Timestamp } from "mongodb";
export const generateAIResponse = async (req, res) => {
  try {
    const { message } = req.body;
    console.log(message)
    if (!message) return res.status(400).json({ error: "Prompt is required" });

    let AiPrompt = buildResolutionPrompt(message)
    console.log(AiPrompt)
    const client = await clientPromise;
    const db = client.db("newyearresolutionguide");
    const collection = await db.collection("questions");
    const doc = await collection.insertOne({
      question: message,
      createdAt: new Date()
    });
    const aiText = await getGroqGenerate(AiPrompt);
    res.json({ response: aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
