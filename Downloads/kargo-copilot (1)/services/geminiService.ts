
import { GoogleGenAI, Type } from "@google/genai";
import { HSCodeResult, ProductData } from '../types';
import { getSettings } from './settingsService';
import { checkCompliance } from './complianceService';

/**
 * Helper to get an authenticated Gemini instance
 */
const getGenAI = async () => {
  const settings = await getSettings();
  // Prioritize User Setting -> Env Var
  const apiKey = settings.geminiKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please configure it in the Settings page.");
  }
  
  return new GoogleGenAI({ apiKey });
};

/**
 * Classifies a product using Gemini 2.5 Flash (Text Only).
 */
export const classifyProductWithGemini = async (
  product: ProductData
): Promise<HSCodeResult> => {
  try {
    const ai = await getGenAI();
    const modelId = 'gemini-2.5-flash';
    
    // Construct a detailed prompt based on the user's requirements
    const promptText = `
      You are an expert International Trade Compliance Specialist and Customs Broker.
      Your task is to classify the following product into the correct 6-digit HS Code (Harmonized System Code).

      PRODUCT INFORMATION:
      Title: ${product.title}
      Description: ${product.description}
      Material: ${product.material || 'Not specified'}
      Product Type: ${product.product_type || 'Not specified'}
      Vendor: ${product.vendor || 'Not specified'}
      Origin Country: ${product.origin_country || 'Not specified'}

      HS CODE CLASSIFICATION RULES:
      1. Focus on material composition first (Chapter 1-97).
      2. Then consider function/purpose.
      3. If multiple chapters are possible, choose the most specific one.
      4. Always provide a 6-digit code (e.g., 6109.10).
      5. Provide 2 alternative codes if there is ambiguity.

      Analyze the product details based on the text provided.
    `;

    // Pure text request
    const parts: any[] = [{ text: promptText }];

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hs_code: { type: Type.STRING, description: "The primary 6-digit HS Code" },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
            description: { type: Type.STRING, description: "Official description of the HS code" },
            reasoning: { type: Type.STRING, description: "Step-by-step explanation of why this code was chosen" },
            chapter: { type: Type.STRING, description: "The Chapter number and name (e.g., '61 - Apparel')" },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                }
              }
            },
            requires_review: { type: Type.BOOLEAN, description: "True if confidence is below 80" },
          },
          required: ["hs_code", "confidence", "description", "reasoning", "chapter", "alternatives", "requires_review"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(response.text);
    
    // Run Compliance Checks
    const complianceAlerts = checkCompliance(product, data.hs_code);

    return {
      hs_code: data.hs_code,
      confidence: data.confidence,
      description: data.description,
      reasoning: data.reasoning,
      chapter: data.chapter,
      alternatives: data.alternatives || [],
      requires_review: data.requires_review,
      alerts: complianceAlerts, // Attach alerts
      source: 'AI_TEXT',
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Gemini Classification Error:", error);
    throw error;
  }
};

/**
 * Classifies a product using Gemini Vision (Text + Image).
 */
export const classifyProductWithVision = async (
  product: ProductData
): Promise<HSCodeResult> => {
  try {
    const ai = await getGenAI();
    const modelId = 'gemini-2.5-flash';

    if (!product.images || product.images.length === 0) {
      throw new Error("No image provided for vision classification.");
    }

    // Prepare Image Part
    // Assume input is Base64 Data URL: "data:image/png;base64,..."
    const base64Data = product.images[0].split(',')[1];
    const mimeType = product.images[0].split(',')[0].split(':')[1].split(';')[0];

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };
    
    const promptText = `
      You are an expert International Trade Compliance Specialist.
      Classify the product shown in the image and described below into the correct 6-digit HS Code.

      PRODUCT INFORMATION:
      Title: ${product.title}
      Description: ${product.description}
      
      Look closely at the image to identify:
      1. Material composition (texture, appearance).
      2. Function and usage.
      3. Components or assembly.

      Compare the visual evidence with the description. If they conflict, prioritize visual evidence for material composition.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: [imagePart, { text: promptText }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hs_code: { type: Type.STRING, description: "The primary 6-digit HS Code" },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
            description: { type: Type.STRING, description: "Official description of the HS code" },
            reasoning: { type: Type.STRING, description: "Explain what visual features influenced this decision." },
            chapter: { type: Type.STRING, description: "The Chapter number and name" },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                }
              }
            },
            requires_review: { type: Type.BOOLEAN, description: "True if confidence is below 80" },
          },
          required: ["hs_code", "confidence", "description", "reasoning", "chapter", "alternatives", "requires_review"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(response.text);
    const complianceAlerts = checkCompliance(product, data.hs_code);

    return {
      hs_code: data.hs_code,
      confidence: data.confidence,
      description: data.description,
      reasoning: data.reasoning,
      chapter: data.chapter,
      alternatives: data.alternatives || [],
      requires_review: data.requires_review,
      alerts: complianceAlerts,
      source: 'AI_VISION',
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};

/**
 * Uses Gemini to expand a vague product description into a customs-ready description.
 */
export const enhanceProductDescription = async (title: string, currentDescription: string): Promise<string> => {
  try {
    const ai = await getGenAI();
    const modelId = 'gemini-2.5-flash';
    const prompt = `
      You are a logistics expert. Rewrite and expand the following product description to be optimized for Customs Classification.
      
      Rules:
      1. Include likely material composition if implied by the title (e.g., "T-shirt" implies cotton/poly).
      2. Describe the function and usage.
      3. Keep it professional, factual, and under 300 characters.
      4. Do NOT invent specific specs like "Size 10" unless stated.
      
      Product Title: ${title}
      Current Description: ${currentDescription || "None provided"}
      
      Return only the new description text.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || currentDescription;
  } catch (error) {
    console.error("Enhancement Error:", error);
    return currentDescription;
  }
};

export const learnFromCorrection = async (productId: string, correctCode: string, reason: string) => {
  // Mock function to simulate sending feedback to the backend
  console.log(`Learning triggered for ${productId}: User corrected to ${correctCode} because ${reason}`);
  return { success: true };
};
