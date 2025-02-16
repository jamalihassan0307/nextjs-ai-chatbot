import { openai } from "@ai-sdk/openai";
import { createLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

export const customModel = (apiIdentifier: string) => {
  return createLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};

export const imageGenerationModel = openai.image("dall-e-3");
