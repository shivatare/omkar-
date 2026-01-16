
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  // Enhanced: Quick mood analysis and short thought with mode context
  async getQuickMoodThought(mood: string, mode: 'focus' | 'gym'): Promise<string> {
    const ai = getAI();
    const modeContext = mode === 'focus' 
      ? "Work/Focus mode. The goal is productivity, mental clarity, and deep work." 
      : "Gym/Workout mode. The goal is physical strength, endurance, and high energy.";
      
    const prompt = `User current mood is "${mood}" and they are in ${modeContext}. 
    Give a one-sentence, highly encouraging and relevant thought or quote that aligns with both their mood and their current activity. 
    Keep it punchy and inspiring.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim() || "You've got this! Focus on one small step at a time.";
    } catch (error) {
      console.error("Error fetching thought:", error);
      return "Every effort counts. Keep moving forward.";
    }
  },

  // Get a specific fitness motivation thought
  async getFitnessMotivation(bodyPart: string): Promise<string> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is about to start a workout for their ${bodyPart}. Give a short, powerful motivational boost (one sentence) related to pushing physical limits.`,
    });
    return response.text?.trim() || "Stronger every rep, better every day.";
  },

  // Thinking Mode: Complex advice for productivity or fitness blockages
  async getDeepCoaching(mood: string, challenge: string, mode: 'focus' | 'gym'): Promise<string> {
    const ai = getAI();
    const context = mode === 'focus' ? "productivity coach" : "pro fitness trainer and sports psychologist";
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `I am currently feeling ${mood} in ${mode} mode. My challenge is: ${challenge}. As an expert ${context}, provide a deep, step-by-step strategy to overcome this feeling and achieve high-quality results. Be empathetic but practical.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "Take a deep breath. Let's start with a single step.";
  },

  // Search Grounding: Fetch a real-world positive fact or news based on mood
  async getMoodRewardFact(mood: string): Promise<{ text: string, links: any[] }> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for a positive, up-to-date news story or a fascinating scientific fact that would be rewarding and uplifting for someone who just finished a 30-minute focus session and is feeling ${mood}. Provide a summary.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      text: response.text || "You did great!",
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // TTS: Read the text aloud
  async speakText(text: string) {
    if (!text) return;
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decoded = this._decodeBase64(base64Audio);
        const audioBuffer = await this._decodeAudioData(decoded, audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.error("TTS failed", error);
    }
  },

  _decodeBase64(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  },

  async _decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
};
