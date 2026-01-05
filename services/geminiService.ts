
import { GoogleGenAI, Type } from "@google/genai";
import { ActionType, ImpactLevel, GroundingSource } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeTrends(licenseName: string, category: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Explicit instruction to provide real-time signals with current dates
    const prompt = `Perform real-time demand sensing for: "${licenseName}" (${category}). 
      Current Date: January 2025.
      
      Use Google Search to find specific news from the last 14 days (trailers, release dates, events).
      
      Return a JSON object with:
      1. action: (TEST, SCALE, HOLD, AVOID, KILL)
      2. impact: (LOW, MEDIUM, HIGH)
      3. reasoning: Professional AP/Merchandising explanation.
      4. confidence: 0-100 percentage.
      5. trendScore: 0-100 current momentum.
      6. sensitivity: Weeks remaining in cycle.
      7. analog: A similar past license performance.
      8. awarenessSignals: Array of { type: 'search'|'news'|'social', source: string, description: string, intensity: number, timestamp: string (YYYY-MM-DD) }
      9. points: Array of 4 numbers for a recent trend chart (0-100).
      
      Ensure all dates and events are accurate for late 2024 or 2025.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
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
          required: ["action", "impact", "reasoning", "confidence", "trendScore", "sensitivity", "awarenessSignals", "points"]
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

    try {
      const data = JSON.parse(response.text);
      return {
        ...data,
        groundingSources
      };
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON", e);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
