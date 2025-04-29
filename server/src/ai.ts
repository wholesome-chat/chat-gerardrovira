import ollama from "ollama";
import { User } from "../../shared/websocketData";

export const AI_USER: User = {
  id: crypto.randomUUID(),
  name: "AI",
  email: "test1@example.com",
};

export async function* streamChatResponse(
  prompt: string
): AsyncIterable<string> {
  const prefixedPrompt = `You are a helpful assistant in a chat application. Keep the answers concise. Respond to the following message thoughtfully:\n${prompt}`;
  const message = { role: "user", content: prefixedPrompt };
  const response = await ollama.chat({
    model: "deepseek-r1:1.5b",
    messages: [message],
    stream: true,
  });
  let content = "";
  for await (const part of response) {
    content += part.message.content;
    const index = content.indexOf("/think>");
    if (index !== -1) {
      yield content.substring(index + "/think>".length);
    }
  }
}
