'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'sys-1',
      role: 'system',
      content:
        'You are connected to a demo chat service intended for VS Code chat integration. Ask a question to begin.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || isSending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: messages.concat(userMessage).map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok) throw new Error('Request failed');
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: data.reply },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, something went wrong sending your message. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }, [input, isSending, messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="chat">
      <div className="chat-window">
        {messages.map((m) => (
          <div key={m.id} className={`msg msg-${m.role}`}>
            <div className="msg-role">{m.role}</div>
            <div className="msg-content">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="composer">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={isSending}
        />
        <button onClick={sendMessage} disabled={isSending || !input.trim()}>
          {isSending ? 'Sending?' : 'Send'}
        </button>
      </div>
      <section className="howto">
        <h2>VS Code Integration</h2>
        <p>
          Point your VS Code extension or chat client to the HTTP endpoint at
          <code> /api/chat </code> with a JSON POST payload:
        </p>
        <pre className="code">
{`POST /api/chat
Content-Type: application/json

{
  "message": "Hello",
  "history": [{"role":"user","content":"Hello"}]
}`}
        </pre>
        <p>Response JSON:</p>
        <pre className="code">{`{ "reply": "string" }`}</pre>
      </section>
    </div>
  );
}
