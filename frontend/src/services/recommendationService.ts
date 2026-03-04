// src/services/recommendationService.ts
import { api } from "@/lib/api";

export const getRecommendations = async (text: string) => {
  const res = await api.post("/services/geminiService/suggestions", { userInput: text });
  return res.data;
};
