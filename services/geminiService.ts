
import { GoogleGenAI } from "@google/genai";
import { GroundingSource, TrendAnalysisResponse } from "../types";

export class GeminiService {
  /**
   * Analyzes market trends using Gemini 3 Flash with Google Search grounding.
   */
  async analyzeTrends(licenseName: string, category: string): Promise<{ data: TrendAnalysisResponse | null, error?: string }> {
    // Fix: Initialize GoogleGenAI using process.env.API_KEY directly per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Perform real-time demand sensing for the license: "${licenseName}" (Category: ${category || 'General'}). 
      Current Date: January 2025.
      
      Task:
      1. Use Google Search to find specific news from the last 14 days (trailers, release dates, leaks, social spikes).
      2. Provide a detailed demand analysis for merchandising and sourcing teams.
      3. Output findings STRICTLY as a JSON block.
      
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

      // Fix: Access .text property directly (not as a method)
      const responseText = response.text;
      if (!responseText) {
        return { data: null, error: "Empty response from engine." };
      }

      // Robust JSON extraction - handle cases where citations are added outside the block
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
        return { data: null, error: "The sensing engine returned data in an invalid format. Please try again." };
      }
    } catch (apiError: any) {
      console.error("Gemini API Error:", apiError);
      let errorMessage = apiError.message || "Connection failed";
      
      if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not found")) {
        errorMessage = "API Key not found or invalid. Please check Vercel settings.";
      } else if (errorMessage.includes("location is not supported")) {
        errorMessage = "Sensing tool (Google Search) is not supported in your current region.";
      }
      
      return { data: null, error: errorMessage };
    }
  }
}

export const geminiService = new GeminiService();
