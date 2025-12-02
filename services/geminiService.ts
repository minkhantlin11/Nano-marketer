import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateImageProps {
  baseImageBase64: string;
  baseImageMimeType: string;
  logoImageBase64?: string;
  logoImageMimeType?: string;
  prompt: string;
}

export const generateMarketingAsset = async ({
  baseImageBase64,
  baseImageMimeType,
  logoImageBase64,
  logoImageMimeType,
  prompt
}: GenerateImageProps): Promise<string> => {
  
  const parts: any[] = [
    {
      inlineData: {
        data: baseImageBase64,
        mimeType: baseImageMimeType
      }
    }
  ];

  if (logoImageBase64 && logoImageMimeType) {
    parts.push({
      inlineData: {
        data: logoImageBase64,
        mimeType: logoImageMimeType
      }
    });
    parts.push({
      text: "The second image provided is the brand logo. Please incorporate it tastefully into the design if the user asks for it or if it fits the context."
    });
  }

  // The prompt acts as the instruction for editing/generating
  parts.push({
    text: prompt
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
    });

    // Iterate to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    throw new Error("No image generated. The model might have returned only text.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};