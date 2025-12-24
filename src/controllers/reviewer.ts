import { Request, Response } from "express";
import { llmReviewer } from "../services/llm-reviewer";

export async function reviewController(req: Request, res: Response) {
  try {
    const { prompt, file } =
      (req.body as { prompt?: any; file?: string }) || {};
    console.log(req.body);
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed for request body",
      });
    }
    const review = await llmReviewer(prompt, file);
    return res.status(200).json({
      message: "review has been made.",
      review,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "internal server error", message: (err as Error).message });
  }
}
