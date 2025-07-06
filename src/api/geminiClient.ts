import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generatePlaylist = async (prompt: string): Promise<
  { title: string; artist: string }[]
> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fullPrompt = `
      You are a music expert AI. Based on this user's request: "${prompt}", 
      generate a playlist of 10 YouTube-friendly songs.
      Return only an array of objects in this JSON format:
      [
        { "title": "Song Title", "artist": "Artist Name" },
        ...
      ]
    `;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    // Parse only the JSON from the AI response
    const match = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (!match) throw new Error("Failed to parse playlist");

    const playlist = JSON.parse(match[0]);
    return playlist;
  } catch (err) {
    console.error("Error generating playlist:", err);
    return [];
  }
};
