import { GoogleGenAI } from "@google/genai";
import { promptParser, responseParser } from "../utils/parser";
import { systemInstruction } from "../contents/system-instructions";

const ai = new GoogleGenAI({});

export const llmReviewer = async (prompt: string, file?: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: promptParser({ prompt, file }),
    config: {
      systemInstruction,
    },
  });

  return responseParser(response);
};
