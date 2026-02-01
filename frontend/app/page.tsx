'use client';

import { useState, useEffect, useRef } from 'react';
import SliderNav from '../components/SliderNav';
import ProfileSidebar from '../components/ProfileSidebar';
import Onboarding from '../components/Onboarding';
import CosmicBackground from '../components/CosmicBackground';
import Toast from '../components/Toast';
import { Send, Sparkles } from 'lucide-react';

const BACKEND_URL = 'https://portfolio-agent-268314723675.us-central1.run.app';
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

  // Engagement Features State
  const [currentQuery, setCurrentQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastActionLabel, setToastActionLabel] = useState('');
  const [toastAction, setToastAction] = useState<(() => void) | null>(null);

  const textDisplayRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(0);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const currentQueryRef = useRef(currentQuery);
  const sendMessageRef = useRef<((message: string, isUserQuery?: boolean) => Promise<void>) | null>(null);

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
    // Auto-trigger Intro query after onboarding
    setTimeout(() => {
      sendMessage('Tell me about yourself');
    }, 100);
  };

  const sendMessage = async (message: string, isUserQuery: boolean = true) => {
    console.log('[sendMessage] Called with:', { message, isUserQuery, sessionId, isStreaming, userId });
    if (!message.trim() || !sessionId || isStreaming || !userId) {
      console.log('[sendMessage] Early return - guard condition failed:', {
        emptyMessage: !message.trim(),
        noSession: !sessionId,
        isStreaming,
        noUser: !userId
      });
      return;
    }

    if (isUserQuery) {
      setCurrentQuery(message);
      currentQueryRef.current = message;
    }
    if (!hasStarted) setHasStarted(true);
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

  // Keep sendMessageRef updated to avoid stale closures in toast actions
  sendMessageRef.current = sendMessage;

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (!hasStarted || !streamedText) return;

    inactivityTimer.current = setTimeout(() => {
      if (!currentQueryRef.current) return;
      setToastMessage("Would you like more details?");
      setToastActionLabel("Tell me more");
      setToastAction(() => () => {
        sendMessageRef.current?.(`${currentQueryRef.current};give a detailed answer`, false);
        setShowToast(false);
      });
      setShowToast(true);
    }, 30000); // 30 seconds
  };

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    // Scroll is handled separately

    resetInactivityTimer(); // Start timer

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [hasStarted, streamedText, currentQuery]);

  const handleScroll = () => {
    resetInactivityTimer();
    if (!textDisplayRef.current) return;

    const now = Date.now();
    const currentScrollTop = textDisplayRef.current.scrollTop;
    const timeDiff = now - lastScrollTime.current;

    // Check every 100ms
    if (timeDiff > 100) {
      const scrollDiff = Math.abs(currentScrollTop - lastScrollTop.current);
      const speed = (scrollDiff / timeDiff) * 1000; // px/sec

      // If scrolling fast (e.g., > 2000px/s) and we have content
      if (speed > 2000 && streamedText.length > 500 && !showToast) {
        setToastMessage("You seem to be in a hurry.");
        setToastActionLabel("Get a TL;DR version");
        setToastAction(() => () => {
          sendMessageRef.current?.(`TL;DR version of: ${currentQueryRef.current}`, false);
          setShowToast(false);
        });
        setShowToast(true);
      }

      lastScrollTime.current = now;
      lastScrollTop.current = currentScrollTop;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  return (
    <main className="min-h-screen text-white relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      <CosmicBackground />
      <Toast
        message={toastMessage}
        actionLabel={toastActionLabel}
        onAction={toastAction || undefined}
        onClose={() => setShowToast(false)}
        isVisible={showToast}
      />
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <h1
          className="text-2xl md:text-4xl font-bold tracking-tighter"
          style={{
            textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)'
          }}
        >
          Vishwajeet
        </h1>
      </div>

      <SliderNav onQuery={(q) => sendMessage(q)} />
      <ProfileSidebar />

      {/* Main Content Area */}
      {!hasStarted ? (
        <div className="flex flex-col h-screen items-center justify-center p-4 relative z-40">
          <Onboarding onComplete={handleUserSelection} />
        </div>
      ) : (
        <div className="flex flex-col h-screen items-center justify-center p-4 max-w-4xl mx-auto pt-20 pb-32 relative z-10">
          {/* Output Display */}
          <div
            ref={textDisplayRef}
            onScroll={handleScroll}
            className="flex-1 w-full flex flex-col items-center justify-start text-center space-y-8 overflow-y-auto scrollbar-hide p-4 pt-36 pb-36"
          >
            {!streamedText && !isStreaming && (
              <div className="opacity-50 space-y-4">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <p className="text-2xl font-light">Ask me anything about my projects, vision, or skills.</p>
              </div>
            )}
            {(streamedText || isStreaming) && (
              <div className="w-full text-center mb-24">
                <div className="text-2xl md:text-3xl font-light leading-relaxed animate-in fade-in duration-500 whitespace-pre-wrap">
                  {streamedText}
                  {isStreaming && <span className="animate-pulse inline-block ml-1">_</span>}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="w-full max-w-2xl relative z-50 mt-8">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
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
      )}
    </main>
  );
}
