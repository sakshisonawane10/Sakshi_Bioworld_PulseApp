
import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource, TrendAnalysisResponse } from "../types";

export class GeminiService {
  /**
   * Analyzes market trends using Gemini 3 Flash with Google Search grounding.
   * Initializes a new SDK instance per call to ensure compliance with API key selection best practices.
   */
  async analyzeTrends(licenseName: string, category: string): Promise<TrendAnalysisResponse | null> {
    // Safety check for API key
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      console.error("Gemini API Key is missing. Please set API_KEY in environment variables.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Perform real-time demand sensing for: "${licenseName}" (${category || 'General Merchandise'}). 
      Current Date: January 2025.
      
      Use Google Search to find specific news from the last 14 days (trailers, release dates, events).
      
      Return a JSON object with:
      1. name: Confirmed official name.
      2. category: (Anime, Gaming, Entertainment, Music, etc.)
      3. action: (TEST, SCALE, HOLD, AVOID, KILL)
      4. impact: (LOW, MEDIUM, HIGH)
      5. reasoning: Professional AP/Merchandising explanation.
      6. confidence: 0-100 percentage.
      7. trendScore: 0-100 current momentum.
      8. sensitivity: Weeks remaining in cycle.
      9. analog: A similar past license performance.
      10. awarenessSignals: Array of { type: 'search'|'news'|'social', source: string, description: string, intensity: number, timestamp: string (YYYY-MM-DD) }
      11. points: Array of 4 numbers for a recent trend chart (0-100).
      
      Ensure all dates and events are accurate for late 2024 or 2025.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              action: { type: Type.STRING },
              impact: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              trendScore: { type: Type.NUMBER },
              sensitivity: { type: Type.NUMBER },
              analog: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              awarenessSignals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    source: { type: Type.STRING },
                    description: { type: Type.STRING },
                    intensity: { type: Type.NUMBER },
                    timestamp: { type: Type.STRING }
                  },
                  required: ["type", "source", "description", "intensity", "timestamp"]
                }
              }
            },
            required: ["name", "category", "action", "impact", "reasoning", "confidence", "trendScore", "sensitivity", "awarenessSignals", "points"]
          }
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundingSources: GroundingSource[] = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || 'Source',
          uri: chunk.web.uri
        }));

      const responseText = response.text;
      if (!responseText) {
        console.error("No text response from Gemini");
        return null;
      }

      // Robust cleaning of markdown JSON wrappers if the model returns them despite responseMimeType
      const cleanedJson = responseText.replace(/```json\n?|```/g, '').trim();

      try {
        const data = JSON.parse(cleanedJson);
        return {
          ...data,
          groundingSources
        } as TrendAnalysisResponse;
      } catch (e) {
        console.error("Failed to parse Gemini response as JSON. Raw text:", responseText, e);
        return null;
      }
    } catch (apiError) {
      console.error("Gemini API Request Failed:", apiError);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
