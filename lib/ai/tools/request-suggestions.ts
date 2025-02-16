import { Session } from "next-auth";
import { getDocumentById, saveSuggestions } from "@/lib/db/queries";
import { Suggestion } from "@/lib/db/schema";
import { model } from "@/lib/ai";
import { generateUUID } from "@/lib/utils";

export async function requestSuggestions(
  {
    documentId,
    title,
  }: {
    documentId: string;
    title: string;
  },
  session: Session
) {
  if (!session?.user?.id) {
    throw new Error("Unauthorized: User ID is required");
  }

  const userId = session.user.id;
  const document = await getDocumentById({ id: documentId });

  if (!document) {
    throw new Error("Document not found");
  }

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Provide suggestions for improving this document titled "${title}": ${document.content}`,
            },
          ],
        },
      ],
    });

    const suggestions = result.response.text().split("\n").filter(Boolean);

    const savedSuggestions = await saveSuggestions({
      suggestions: suggestions.map((s) => ({
        id: generateUUID(),
        documentId,
        userId,
        createdAt: new Date(),
        documentCreatedAt: document.createdAt,
        description: null,
        originalText: document.content || "",
        suggestedText: s,
        isResolved: false as const,
      })),
    });

    return savedSuggestions;
  } catch (error) {
    console.error("Error requesting suggestions:", error);
    throw error;
  }
}
