import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage, Simulation } from "../types/simulation";
import { buildChatPrompt, buildFinancialEducatorPrompt } from "./prompt";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Definimos o modelo fixo e estável para evitar erros de 404
const modelName = "gemini-1.5-flash";

function assertConfigured() {
  if (!apiKey) {
    throw new Error("Configure VITE_GEMINI_API_KEY no arquivo .env para gerar insights com IA.");
  }
}

async function generateText(prompt: string): Promise<string> {
  assertConfigured();
  const client = new GoogleGenerativeAI(apiKey!);
  
  // Usamos o modelo garantido e sem forçar versão de API (v1beta)
  const model = client.getGenerativeModel({ model: modelName });
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export function generateSimulationInsights(simulation: Simulation): Promise<string> {
  return generateText(buildFinancialEducatorPrompt(simulation));
}

export function sendFinancialChatMessage(messages: ChatMessage[], content: string): Promise<string> {
  const history = messages
    .slice(-8)
    .map((message) => `${message.role === "user" ? "Usuario" : "Assistente"}: ${message.content}`)
    .join("\n");

  return generateText(buildChatPrompt(history, content));
}