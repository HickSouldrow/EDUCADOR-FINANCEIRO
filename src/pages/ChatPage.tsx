import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { sendFinancialChatMessage } from "../services/gemini";
import type { ChatMessage } from "../types/simulation";
import { Button } from "../components/form/ui/Button";

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Olá! Posso ajudar a transformar sua simulação em próximos passos financeiros mais claros.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setContent("");
    setError("");
    setIsLoading(true);

    try {
      const response = await sendFinancialChatMessage(nextMessages, trimmed);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível enviar sua mensagem.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-normal">Chat com IA</h1>
        <p className="mt-1 text-muted">
          Converse com o educador financeiro sobre metas, dívidas e organização
          mensal.
        </p>
      </div>

      <section className="min-h-[28rem] border border-border bg-surface p-4 sm:p-6">
        <div className="flex max-h-[32rem] flex-col gap-4 overflow-y-auto pr-1">
          {messages.map((message) => (
            <div
              className={`max-w-[86%] px-4 py-3 text-sm leading-6 border ${
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground border-primary"
                  : "mr-auto bg-elevated text-foreground border-border"
              }`}
              key={message.id}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="mr-auto inline-flex items-center gap-2 border border-border bg-elevated px-4 py-3 text-sm text-muted">
              <Loader2 className="animate-spin neon-icon" size={16} />
              Pensando...
            </div>
          )}
        </div>
      </section>

      {error && (
        <p className="border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <form
        className="flex flex-col gap-3 border border-border bg-surface p-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <input
          className="min-h-12 flex-1 border border-border bg-elevated px-4 outline-none transition placeholder:text-muted focus:border-neon focus:ring-1 focus:ring-neon"
          onChange={(event) => setContent(event.target.value)}
          placeholder="Digite sua pergunta financeira..."
          value={content}
        />
        <Button
          disabled={!content.trim() || isLoading}
          icon={<Send size={18} className="text-current" />}
          type="submit"
        >
          Enviar
        </Button>
      </form>
    </div>
  );
}
