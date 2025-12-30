import { GenerateContentResponse } from "@google/genai";

interface PromptParserArguments {
  prompt: string;
  file?: string;
  system?: string;
}

export const promptParser = ({
  prompt,
  file,
  system,
}: PromptParserArguments) => {
  const parsedFile = fileParser(file ?? "");
  return `### Prompt\n${prompt}\n### File\n${
    !!file ? parsedFile : "(File not received)"
  }\nEOF\n${system && `### System Prompt\n${system}`}`;
};

export const responseParser = ({ text }: GenerateContentResponse) => {
  const [review, summary] = text?.split(String.fromCharCode(65520)) || [];
  const json = jsonParser(review.trim());
  const summary_content = summary.trim().split("\n")[1].trim();
  return { json, summary: summary_content };
};

export const jsonParser = (jsonString: string) => {
  let isString = false;
  let result: string[] = [];
  let currentString: string[] = [];

  for (let i = 0; i < jsonString.length; i++) {
    let char = jsonString.charAt(i);

    if (char === '"' && (i === 0 || jsonString[i - 1] !== "\\")) {
      isString = !isString;
      if (!isString) {
        result.push(`"${currentString.join("")}"`);
        currentString = [];
        continue;
      }
    }

    if (isString) {
      if (char === '"' || char === "\u3164") continue;
      else if (char === "\n") currentString.push("\\n");
      else if (char === "\t") currentString.push("\\t");
      else if (char === "\r") currentString.push("\\r");
      else if (char === "\\") {
        currentString.push(`\\${jsonString.charAt(1 + i)}`);
        i++;
      } else currentString.push(char);
    } else {
      if (char === "\n") result.push(" ");
      else result.push(char);
    }
  }

  try {
    return parseLLMJson(result.join(""));
  } catch (err) {
    return null;
  }
};

export const fileParser = (file: string) => {
  const lines = file.split("\n");
  return lines.map((val, idx) => `${idx + 1}|\u3164${val}`).join("\n");
};

export function parseLLMJson<T>(response: string): T {
  const trimmedResponse = response.trim();
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = trimmedResponse.match(markdownRegex);
  const jsonString = match ? match[1] : trimmedResponse;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
