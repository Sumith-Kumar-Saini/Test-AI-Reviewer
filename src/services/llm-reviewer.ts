import { GoogleGenAI } from "@google/genai";
import { promptReviewParser, responseParser } from "../utils/parser";
import { systemInstruction } from "../contents/system-instructions";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const llmReviewer = async (prompt: string, file?: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: promptReviewParser({ prompt, file }),
    config: {
      systemInstruction,
    },
  });

  // return responseParser(response);
  return response.text;
};
