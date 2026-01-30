'use client';

import { useState, useEffect, useRef } from 'react';
import TimelineNav from '../components/TimelineNav';
import ProfileSidebar from '../components/ProfileSidebar';
import UserSelectionModal from '../components/UserSelectionModal';
import { Send, Sparkles } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';
const APP_NAME = 'portfolio_agent';

export default function Home() {
  const [persona, setPersona] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let uid = localStorage.getItem('user_id');
    if (!uid) {
      uid = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', uid);
    }
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const initSession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/apps/${APP_NAME}/users/${userId}/sessions`, {
          method: 'POST',
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Session created:', data.id);
          setSessionId(data.id);
        } else {
          console.error('Failed to create session');
        }
      } catch (e) {
        console.error('Error connecting to backend:', e);
      }
    };

    initSession();
  }, [userId]);

  const handleUserSelection = (p: string, l: string) => {
    setPersona(p);
    setLanguage(l);
    setHasStarted(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isStreaming || !userId) return;

    const message = input;
    setInput('');
    setStreamedText('');
    setIsStreaming(true);

    try {
      const context = `[User Context: Persona=${persona}, Language=${language}] `;
      const fullMessage = context + message;

      const res = await fetch(`${BACKEND_URL}/run_sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_name: APP_NAME,
          user_id: userId,
          session_id: sessionId,
          new_message: {
            parts: [{ text: fullMessage }],
            role: 'user',
          },
          streaming: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to run agent');
      if (!res.body) throw new Error('No body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE format: "data: {...}\n\n"
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6);
              const event = JSON.parse(jsonStr);
              // Extract text from event - only process partial events to avoid duplication
              // ADK sends both streaming (partial) events and a final complete event
              // We only want the partial events to avoid getting the full text twice
              if (event.partial === true && event.content && event.content.parts) {
                for (const part of event.content.parts) {
                  if (part.text) {
                    setStreamedText(prev => prev + part.text);
                  }
                }
              }
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      }

    } catch (e) {
      console.error(e);
      setStreamedText(prev => prev + '\n\nError: Could not get response from agent. (Check API Key)');
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {!hasStarted && <UserSelectionModal onComplete={handleUserSelection} />}

      <div className="fixed top-8 left-8 z-50">
        <h1 className="text-4xl font-bold tracking-tighter">
          Vishwajeet<span className="text-blue-500">.</span>
        </h1>
      </div>

      <TimelineNav />
      <ProfileSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col h-screen items-center justify-center p-4 max-w-4xl mx-auto pt-20 pb-32">
        {/* Output Display */}
        <div className="flex-1 w-full flex flex-col items-center justify-center text-center space-y-8 overflow-y-auto scrollbar-hide p-4">
          {!streamedText && !isStreaming && (
            <div className="opacity-50 space-y-4">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <p className="text-2xl font-light">Ask me anything about my projects, vision, or skills.</p>
            </div>
          )}
          {(streamedText || isStreaming) && (
            <div className="w-full text-center">
              <div className="text-2xl md:text-3xl font-light leading-relaxed animate-in fade-in duration-500 whitespace-pre-wrap">
                {streamedText}
                {isStreaming && <span className="animate-pulse inline-block ml-1">_</span>}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="w-full max-w-2xl relative z-50">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={hasStarted ? "Type your question..." : "Waiting for setup..."}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-full px-8 py-4 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md"
              disabled={isStreaming || !sessionId}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming || !sessionId}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-black rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-4 text-center text-xs text-white/30">
            AI Agent powered by Gemini • Context: {persona || 'None'}, {language || 'None'}
          </div>
        </div>
      </div>
    </main>
  );
}
