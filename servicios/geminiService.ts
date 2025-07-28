import { GoogleGenAI, Type } from "@google/genai";
import { Article } from '../types';

const translationSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The translated title of the article."
    },
    summary: {
      type: Type.STRING,
      description: "The translated summary of the article."
    },
    fullContent: {
        type: Type.STRING,
        description: "The translated full content of the article."
    }
  },
  required: ["title", "summary", "fullContent"]
};

const newsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER, description: "A unique integer ID for the article." },
      title: { type: Type.STRING, description: "The title of the news article." },
      summary: { type: Type.STRING, description: "A short summary of the article." },
      fullContent: { type: Type.STRING, description: "The full content of the article, at least 3 paragraphs long." },
      source: { type: Type.STRING, description: "The plausible source of the news (e.g., The Verge, TechCrunch)." },
      imageUrl: { type: Type.STRING, description: "A placeholder image URL from picsum.photos." },
      lang: { type: Type.STRING, description: "The language of the article, either 'en' for English or 'es' for Spanish." }
    },
    required: ["id", "title", "summary", "fullContent", "source", "imageUrl", "lang"],
  },
};

export const fetchLatestTechNews = async (apiKey: string): Promise<Omit<Article, 'url'>[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Act as a tech news aggregator. Generate a list of 10 recent and realistic-sounding tech news articles from the last week. 
        For each article, provide a unique integer ID, a title, a short summary, a longer full content (at least 3 paragraphs), a plausible source (e.g., The Verge, TechCrunch, Wired, Xataka), a placeholder image URL from picsum.photos in the format https://picsum.photos/seed/UNIQUE_SEED/600/400, and the language of the article ('en' for English or 'es' for Spanish).
        Ensure the articles are diverse and cover topics like AI, hardware, software, and tech policy. At least 3 of the articles must be generated in perfect Spanish. The rest must be in English.
        Provide the response as a JSON object adhering to the provided schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedArticles = JSON.parse(jsonText) as Omit<Article, 'url'>[];
        
        if (Array.isArray(parsedArticles)) {
          return parsedArticles;
        } else {
          throw new Error("API returned data in an unexpected format.");
        }

    } catch (error) {
        console.error("Error fetching latest tech news from Gemini:", error);
        throw new Error("No se pudieron generar las noticias. Verifica que tu API Key sea correcta o el estado del servicio de Google AI.");
    }
}

export const translateArticleToSpanish = async (apiKey: string, article: Article): Promise<{ title: string; summary: string; fullContent: string; }> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Translate the following article title, summary, and full content to Spanish. Provide the response as a JSON object with 'title', 'summary', and 'fullContent' keys.

    Original Title: "${article.title}"
    Original Summary: "${article.summary}"
    Original Full Content: "${article.fullContent}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: translationSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as { title: string; summary: string; fullContent: string; };

  } catch (error) {
    console.error("Error translating article:", error);
    throw new Error(`Fallo al traducir el artículo: ${article.title}`);
  }
};
