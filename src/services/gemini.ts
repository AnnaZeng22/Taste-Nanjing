import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY as string 
});

export interface MenuAnalysisResult {
  dishName: string;
  originalName: string;
  translation: string;
  description: string;
  ingredients: string[];
  dietaryFlags: {
    halal: boolean;
    vegan: boolean;
    noPork: boolean;
    noAlcohol: boolean;
    nutFree: boolean;
    spiceLevel: 0 | 1 | 2 | 3;
  };
  culturalContext?: string;
  uncertaintyScore: number; // 0-100
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    dishes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          originalName: { type: Type.STRING },
          translation: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          dietaryFlags: {
            type: Type.OBJECT,
            properties: {
              halal: { type: Type.BOOLEAN },
              vegan: { type: Type.BOOLEAN },
              noPork: { type: Type.BOOLEAN },
              noAlcohol: { type: Type.BOOLEAN },
              nutFree: { type: Type.BOOLEAN },
              spiceLevel: { type: Type.INTEGER, description: "0-3 scale" },
            },
            required: ["halal", "vegan", "noPork", "noAlcohol", "nutFree", "spiceLevel"]
          },
          culturalContext: { type: Type.STRING },
          uncertaintyScore: { type: Type.NUMBER },
        },
        required: ["dishName", "originalName", "translation", "description", "ingredients", "dietaryFlags", "uncertaintyScore"]
      }
    }
  },
  required: ["dishes"]
};

export async function analyzeMenuImage(base64Image: string): Promise<MenuAnalysisResult[]> {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are Taste Nanjing's signature AI, a Professional Menu Translator & Culinary Safety Expert specifically for Nanjing, China.
    
    TASK:
    1. Perform OCR on the provided image to identify Chinese dish names.
    2. For each dish, provide a professional English translation.
    3. REFER to the following "Nanjing Heritage Dishes" for standard translations if detected:
       - 盐水鸭 (Yánshuǐ yā) -> Nanjing Salted Duck (Heritage: 600 years)
       - 鸭血粉丝汤 (Yā xuè fěnsī tāng) -> Duck Blood Ginger Soup (Classic Street Food)
       - 什锦菜 (Shíjǐn cài) -> Nanjing Assorted Braised Vegetables (Lunar New Year Tradition)
       - 状元豆 (Zhuàngyuán dòu) -> Scholars' Braised Soybeans (Confucius Temple Specialty)
       - 牛肉锅贴 (Niúròu guōtiē) -> Pan-fried Beef Dumplings (Ma Xiang Xing style)
       - 桂花糖藕 (Guìhuā táng ǒu) -> Osmanthus Honey Lotus Root (Classic Dessert)
       - 狮子头 (Shīzitóu) -> Nanjing Lion's Head Meatballs (Braised or Steamed)

    4. Analyze ingredients carefully. Identify potential allergens (nuts, seafood) and dietary restrictions.
    5. Flag Halal status (Nanjing has a large Hui population).
    6. Flag Vegan/Vegetarian status.
    7. Flag Pork and Alcohol content.
    8. Provide a short description of taste and texture.
    9. Add 1-2 sentences of "Culinary Heritage" context for famous Nanjing dishes.
    10. Assign an uncertaintyScore (0-100) based on OCR legibility and dish ambiguity.

    DIETARY RULES:
    - Halal: Genuine Qingzhen (Hui) dishes only.
    - Spice Level: 0 (None), 1 (Mild), 2 (Medium), 3 (Hot).

    RESPONSE FORMAT:
    Strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: "Analyze this menu image from a restaurant in Nanjing. Identify all dishes and provide full details in the required JSON format." },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const result = JSON.parse(response.text);
    return result.dishes;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}
