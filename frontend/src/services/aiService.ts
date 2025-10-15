import { api } from "@/lib/api";

export const aiService = {
  analyzeVoice: async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await api.post('/analyze/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  analyzeText: async (text: string) => {
    const response = await api.post('/analyze/text', { text });
    return response.data;
  },

  generateRecommendations: async (
    mood: string,
    energyLevel: number,
    detectedEmotions: string[] = []
  ) => {
    const response = await api.post('/recommendations', {
      mood,
      energyLevel,
      detectedEmotions,
    });
    
    return response.data;
  },

  generateSummary: async (checkIns: any[]) => {
    const response = await api.post('/summary', { checkIns });
    return response.data;
  },

  generatePdfReport: async (checkIns: any[]) => {
    const response = await api.post('/report/pdf', { checkIns }, {
      responseType: 'blob',
    });
    
    return response.data;
  },
};
