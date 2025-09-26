
import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const explainCode = async (code: string): Promise<string> => {
  if (!API_KEY) return "API Key not configured.";
  try {
    const prompt = `You are an expert code reviewer. Explain the following code snippet clearly and concisely, as if for a mobile screen. Use markdown for formatting.\n\n\`\`\`\n${code}\n\`\`\``;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error explaining code:", error);
    return "Sorry, I couldn't explain the code at this time.";
  }
};

export const summarizeText = async (text: string): Promise<string> => {
    if (!API_KEY) return "API Key not configured.";
    try {
        const prompt = `Summarize the following text for a quick overview on a mobile device. Use markdown bullet points.\n\n---\n\n${text}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        return "Sorry, I couldn't summarize this at the time.";
    }
};

let chat: Chat | null = null;

export const startRepoChat = (repoDescription: string) => {
    if (!API_KEY) return;
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are an AI assistant for CodePod. You are helping a user understand a software repository. The repository description is: "${repoDescription}". Be helpful and provide answers formatted for a mobile chat screen.`,
        },
    });
};

export const sendChatMessage = async (message: string) => {
    if (!chat) {
        return { text: "Chat not initialized. Please start a new chat." };
    }
    try {
        const response = await chat.sendMessage({ message });
        return { text: response.text };
    } catch(error) {
        console.error("Error sending chat message:", error);
        return { text: "Sorry, I encountered an error." };
    }
};
