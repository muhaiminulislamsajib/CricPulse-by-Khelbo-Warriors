import { GoogleGenAI } from "@google/genai";
import { Match, BallData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateBallCommentary(match: Match, ball: BallData) {
  const model = "gemini-3-flash-preview";
  
  const currentInning = match.liveData?.innnings[match.liveData.currentInning - 1];
  
  const prompt = `
    You are a professional cricket commentator with a witty and energetic style like Harsha Bhogle or Richie Benaud.
    Context:
    - Match: ${match.teamAId} vs ${match.teamBId}
    - Score: ${currentInning?.score}/${currentInning?.wickets} (${currentInning?.overs} overs)
    - Target: ${match.liveData?.target || 'N/A'}
    
    This Ball:
    - Bowler: ${ball.bowlerId}
    - Striker: ${ball.strikerId}
    - Outcome: ${ball.runs} runs${ball.extrasType !== 'none' ? `, Extra: ${ball.extrasType}` : ''}${ball.isWicket ? `, WICKET!` : ''}
    
    Generate a short (1-2 sentence) commentary for this specific ball. Be creative and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "Professional commentary unavailable at the moment.";
  } catch (error) {
    console.error("AI Commentary Error:", error);
    return "The crowd is silent as the ball beats the bat.";
  }
}
