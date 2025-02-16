import { model } from "@/lib/ai";
import { getDocumentById } from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";

export async function updateDocument({
  documentId,
  content,
}: {
  documentId: string;
  content: string;
}) {
  const document = await getDocumentById({ id: documentId });

  if (!document) {
    throw new Error("Document not found");
  }

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `Update document: ${content}` }],
        },
      ],
    });

    return {
      id: documentId,
      title: document.title,
      kind: document.kind,
      content: result.response.text(),
      message: "Document has been updated",
    };
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}
