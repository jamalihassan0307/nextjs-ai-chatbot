import { generateUUID } from "@/lib/utils";
import { model } from "@/lib/ai";

export async function createDocument({
  title,
  kind,
  content,
}: {
  title: string;
  kind: string;
  content?: string;
}) {
  const id = generateUUID();

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Create a document with title: ${title}, kind: ${kind}${
                content ? `, content: ${content}` : ""
              }`,
            },
          ],
        },
      ],
    });

    return {
      id,
      title,
      kind,
      content: result.response.text(),
    };
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}
