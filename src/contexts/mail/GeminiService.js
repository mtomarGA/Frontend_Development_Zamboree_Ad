import { GoogleGenAI } from "@google/genai";



const ai = new GoogleGenAI({ apiKey: "AIzaSyCLqMS6kQGmHumCW_5c1_atux1D1Xger78" });

const GeminiService = {
    GetGemini: async (query) => {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
        });

        return response;


    }
};

export default GeminiService;
