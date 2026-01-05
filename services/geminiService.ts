
import { GoogleGenAI } from "@google/genai";
import { GroundingSource, TrendAnalysisResponse } from "../types";

export class GeminiService {
  /**
   * Analyzes market trends using Gemini 3 Flash with Google Search grounding.
   */
  async analyzeTrends(licenseName: string, category: string): Promise<{ data: TrendAnalysisResponse | null, error?: string }> {
    // Priority 1: Check environment variable injected via Vite/Vercel
    // Priority 2: The SDK will automatically check for keys selected via window.aistudio.openSelectKey()
    const apiKey = process.env.API_KEY;
    
    // Initialize per-request to ensure the latest API key (from env or dialog) is used
    const ai = new GoogleGenAI({ apiKey: apiKey || "" });
    
    const prompt = `Perform real-time demand sensing for the license: "${licenseName}" (Category: ${category || 'General'}). 
      Current Date: January 2025.
      
      Task:
      1. Use Google Search to find specific news from the last 14 days.
      2. Provide a detailed demand analysis.
      3. Output your findings STRICTLY as a JSON block.
      
      Structure:
      {
        "name": "string",
        "category": "string",
        "action": "TEST|SCALE|HOLD|AVOID|KILL",
        "impact": "LOW|MEDIUM|HIGH",
        "reasoning": "string",
        "confidence": number,
        "trendScore": number,
        "sensitivity": number,
        "analog": "string",
        "points": [number, number, number, number],
        "awarenessSignals": [
          { "type": "search"|"news"|"social", "source": "string", "description": "string", "intensity": number, "timestamp": "YYYY-MM-DD" }
        ]
      }`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      const responseText = response.text;
      if (!responseText) {
        return { data: null, error: "Model returned an empty response." };
      }

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

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
          data: {
            ...data,
            groundingSources: groundingSources.length > 0 ? groundingSources : undefined
          } as TrendAnalysisResponse
        };
      } catch (parseError) {
        console.error("JSON Parse Error:", responseText);
        return { data: null, error: "Failed to parse trend data. The model response was malformed." };
      }
    } catch (apiError: any) {
      console.error("Gemini API Error Detail:", apiError);
      let errorMessage = apiError.message || "Unknown API error";
      
      if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not found")) {
        errorMessage = "Invalid API Key. Please check your Vercel Environment Variables.";
      } else if (errorMessage.includes("User location is not supported")) {
        errorMessage = "Gemini Search is not available in your region.";
      } else if (errorMessage.includes("Requested entity was not found")) {
        errorMessage = "Model or Search tool not found. Check project settings.";
      }
      
      return { data: null, error: errorMessage };
    }
  }
}

export const geminiService = new GeminiService();
