
import { GoogleGenAI } from "@google/genai";
import { GroundingSource, TrendAnalysisResponse } from "../types";

export class GeminiService {
  /**
   * Analyzes market trends using Gemini 3 Flash with Google Search grounding.
   * We avoid strict JSON mode here because Search Grounding often appends citations 
   * to the text output, which can break the JSON parser if strict mode is used.
   */
  async analyzeTrends(licenseName: string, category: string): Promise<TrendAnalysisResponse | null> {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      console.error("Gemini API Key is missing. Ensure it is set in Vercel Environment Variables.");
      return null;
    }

    // Initialize per-request to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Perform real-time demand sensing for the license: "${licenseName}" (Category: ${category || 'General'}). 
      Current Date: January 2025.
      
      Task:
      1. Use Google Search to find specific news from the last 14 days (trailers, release dates, leaks, social spikes).
      2. Provide a detailed demand analysis.
      3. Output your findings STRICTLY as a JSON block.
      
      The JSON block must have this exact structure:
      {
        "name": "Confirmed official name",
        "category": "Anime/Gaming/Entertainment/etc",
        "action": "TEST, SCALE, HOLD, or KILL",
        "impact": "LOW, MEDIUM, or HIGH",
        "reasoning": "Merchandising logic based on search signals",
        "confidence": number (0-100),
        "trendScore": number (0-100),
        "sensitivity": number (estimated weeks of peak demand remaining),
        "analog": "Similar past property name",
        "points": [number, number, number, number], (4 numbers representing demand over last 30 days)
        "awarenessSignals": [
          { "type": "search"|"news"|"social", "source": "e.g. Google Trends", "description": "brief description", "intensity": 0-100, "timestamp": "YYYY-MM-DD" }
        ]
      }
      
      Ensure accuracy for late 2024 and 2025 events.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // We do NOT use responseMimeType: "application/json" here because 
          // search grounding often appends text that breaks strict JSON output.
        }
      });

      const responseText = response.text;
      if (!responseText) {
        console.error("Empty response from Sensing Engine");
        return null;
      }

      // Extract JSON from potential markdown wrappers or surrounding text
      let jsonStr = responseText;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      // Extract grounding sources from metadata
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundingSources: GroundingSource[] = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || 'Source',
          uri: chunk.web.uri
        }));

      try {
        const data = JSON.parse(jsonStr);
        return {
          ...data,
          groundingSources: groundingSources.length > 0 ? groundingSources : undefined
        } as TrendAnalysisResponse;
      } catch (parseError) {
        console.error("JSON Parse Error. Raw text from model:", responseText);
        return null;
      }
    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
