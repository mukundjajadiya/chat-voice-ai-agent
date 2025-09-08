import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse, Content } from "@google/genai";
import { type ChatMessage, type Source, MessageRole } from "../types";
import { env } from "../config/env";

// Ensure the API key is available
const API_KEY = env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface AIResponse {
  text: string;
  sources?: Source[];
}

export const sendMessageToAI = async (
  history: ChatMessage[],
  context: string
): Promise<AIResponse> => {
  try {
    const systemInstruction = `You are a friendly and helpful AI assistant. You can perform web searches to find up-to-date information. Always cite your sources when using web search results. ${
      context
        ? `\n\nAlso, prioritize information from the following context when it is relevant.\n---CONTEXT---\n${context}\n---END CONTEXT---`
        : ""
    }`;

    const contents: Content[] = history
      .filter((msg) => msg.text !== "...") // Don't send temporary loading messages to the API
      .map((msg) => ({
        role: msg.role === MessageRole.USER ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    if (contents.length === 0) {
      return {
        text: "I'm sorry, there was an issue with the message history.",
      };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: Source[] | undefined = groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web): web is Source => web && web.uri && web.title);

    return { text: response.text || "", sources };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error) {
      return { text: `Sorry, I encountered an error: ${error.message}` };
    }
    return { text: "Sorry, I encountered an unknown error." };
  }
};
