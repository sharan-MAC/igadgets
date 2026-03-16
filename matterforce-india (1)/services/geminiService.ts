import { GoogleGenAI, Type } from "@google/genai";
import { AIProductResult } from "../types";

export const generateHardwareSpecs = async (prompt: string): Promise<AIProductResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are MatterForce India, an Empathetic Engineering Partner.
    Your goal is to analyze the User's Intent (Context, Budget, Skill Level) and engineer the perfect solution.

    1. **INTENT ANALYSIS**: Determine who the user is (e.g., Student, Hobbyist, Farmer, Industrialist).
       - TIER_1_HOBBY: School projects, learning, low budget, safety first (Blue Theme).
       - TIER_2_MAKER: Serious DIY, robust prototyping, mid-budget.
       - TIER_3_INDUSTRIAL: Professional use, durability, high budget, reliability (Orange Theme).

    2. **MARKET SWEEP**: Estimate realistic Lowest Valid Prices in Indian Rupees (INR) from vendors like Robu.in, Amazon.in, and Lajpat Rai Market.
       - Calculate "totalSavings" by comparing your optimized price vs. a standard retail markup (approx 15-20% savings).

    3. **COMPONENT SELECTION**: 
       - Select parts appropriate for the Tier. (e.g., Plastic gears for Tier 1, Metal gears for Tier 3).
       - Provide a specific "reason" for every component choice (e.g., "Safe for kids", "Waterproof for farm use").

    4. **GUIDE GENERATION (Build Process)**: 
       - Generate a COMPLETE Step-by-Step Guide (from Step 1 to Testing).
       - Ensure at least 5-7 distinct steps.
       - **Tier 1 (Student)**: Use simple, encouraging language. (e.g., "Step 1: Carefully glue the motor to the base using double-sided tape.").
       - **Tier 3 (Industrial)**: Use technical, precise language. (e.g., "Step 1: Mount the NEMA 23 stepper using M4 screws and align with the chaotic axis.").

    The output must be strictly JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING, description: "Technical product name" },
          description: { type: Type.STRING, description: "Empathetic description of the solution" },
          intentAnalysis: { type: Type.STRING, description: "Explanation of what you detected (e.g., 'We detected a school project context...')" },
          complexityTier: { type: Type.STRING, enum: ['TIER_1_HOBBY', 'TIER_2_MAKER', 'TIER_3_INDUSTRIAL'] },
          category: { type: Type.STRING },
          technicalSpecs: { type: Type.ARRAY, items: { type: Type.STRING } },
          components: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                specs: { type: Type.STRING },
                vendor: { type: Type.STRING },
                reason: { type: Type.STRING, description: "Why was this specific part chosen for this user tier?" }
              }
            }
          },
          diyPrice: { type: Type.NUMBER },
          assembledPrice: { type: Type.NUMBER },
          totalSavings: { type: Type.NUMBER, description: "Estimated INR saved by optimization" },
          estimatedBuildTime: { type: Type.STRING },
          assemblySteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Full instruction list from start to finish" }
        },
        required: ["productName", "description", "intentAnalysis", "complexityTier", "technicalSpecs", "components", "diyPrice", "assembledPrice", "totalSavings", "estimatedBuildTime", "category", "assemblySteps"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(response.text) as AIProductResult;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Engineering logic failed. Please try again.");
  }
};

export const generateVeoVideo = async (
  imageBase64: string, 
  prompt: string, 
  aspectRatio: '16:9' | '9:16'
): Promise<string> => {
  
  // 1. Check for API Key Selection (Specific for Veo/Paid features)
  if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      if (typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        // Assume success after dialog closes or throw error if strictly needed
      } else {
        throw new Error("Billing Setup Required: Please enable billing in AI Studio.");
      }
    }
  }

  // 2. Initialize Client with current key
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    // 3. Start Generation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Animate this object realistically.", 
      image: {
        imageBytes: imageBase64,
        mimeType: 'image/png', // Assumes PNG or handled by base64 logic, Veo supports common image types
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Veo fast preview
        aspectRatio: aspectRatio
      }
    });

    // 4. Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s between polls
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    // 5. Get URI and Authenticate
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed to return a URI.");

    // The response body contains the MP4 bytes. Must append API key.
    const authenticatedUrl = `${downloadLink}&key=${apiKey}`;
    return authenticatedUrl;

  } catch (error: any) {
    // Handle "Requested entity was not found" race condition/error
    if (error.message && error.message.includes("Requested entity was not found")) {
       if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
          await window.aistudio.openSelectKey();
          throw new Error("Session expired. Please retry to confirm API Key.");
       }
    }
    throw error;
  }
};