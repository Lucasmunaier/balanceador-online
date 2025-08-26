
import { GoogleGenAI } from "@google/genai";
import { Team } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function formatTeamsForPrompt(teams: Team[]): string {
    return teams.map(team => 
        `**${team.name}** (Nota Total: ${team.totalRating})\n` +
        team.players.map(p => `- ${p.name} (Nota: ${p.rating})`).join('\n')
    ).join('\n\n');
}

export const getAiCommentary = async (teams: Team[]): Promise<string> => {
    const model = 'gemini-2.5-flash';

    const formattedTeams = formatTeamsForPrompt(teams);
    const highestRatedPlayer = teams
        .flatMap(t => t.players)
        .sort((a, b) => b.rating - a.rating)[0];

    const prompt = `Você é um comentarista esportivo divertido e espirituoso, especializado em partidas amadoras. Os seguintes times foram montados para uma partida amistosa:

${formattedTeams}

O jogador estrela do dia é **${highestRatedPlayer.name}** com uma nota de **${highestRatedPlayer.rating}**.

Sua tarefa é fornecer uma breve análise no estilo de um comentarista:
1.  Comece com uma saudação animada.
2.  Analise brevemente os times. Qual parece ser o "time a ser batido"? Existe um "azarão" em potencial?
3.  Mencione o jogador estrela e como ele pode impactar o jogo.
4.  Termine com um comentário encorajador e divertido para todos os jogadores.

Use formatação markdown (negrito com **) para enfatizar. Mantenha o tom leve, divertido e positivo. A resposta deve ser em Português do Brasil.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get AI commentary.");
    }
};
