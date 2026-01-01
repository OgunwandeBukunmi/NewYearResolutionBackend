import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



export async function getGroqGenerate(message) {
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY missing");
}

  const chatCompletion = await getGroqChatCompletion(message);
  // Print the completion returned by the LLM.

    const raw =chatCompletion.choices[0]?.message?.content || ""

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw,
      });
    }

  console.log(parsed);
  return parsed;
}

export async function getGroqChatCompletion(message) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: "openai/gpt-oss-120b",
  });
}




