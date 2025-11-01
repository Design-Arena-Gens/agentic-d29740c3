import { NextResponse } from 'next/server';

type HistoryItem = { role: 'user' | 'assistant' | 'system'; content: string };

type RequestBody = {
  message?: string;
  history?: HistoryItem[];
};

function generateReply(message: string, history: HistoryItem[] = []): string {
  const lower = message.toLowerCase();

  if (/(hello|hi|hey)\b/.test(lower)) {
    return 'Hello! This is a demo chat endpoint suitable for VS Code chat integration. Ask me about how to connect or send any question.';
  }

  if (/vscode|vs code|visual studio code/.test(lower) && /chat|integration|connect|endpoint/.test(lower)) {
    return 'To integrate with VS Code: send POST requests to /api/chat with JSON {message, history}. The reply field contains the assistant response. In an extension, use fetch with the deployed URL.';
  }

  if (/\?$/.test(message.trim())) {
    return `Good question: ${message.trim()} ? in this demo, responses are rule-based. For production, back this route with your LLM or business logic.`;
  }

  const lastUser = [...history].reverse().find((h) => h.role === 'user')?.content ?? message;
  return `You said: "${lastUser}". This endpoint is ready for your VS Code chat client.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const message = body.message?.toString() ?? '';
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message.trim()) {
      return NextResponse.json(
        { error: 'Missing "message" in request body' },
        { status: 400 }
      );
    }

    const reply = generateReply(message, history);
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
