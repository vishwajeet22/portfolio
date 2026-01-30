'use client';
import { useState } from 'react';

const PERSONAS = ['Tech Recruiter', 'Investor', 'Curious Human', 'Student'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi'];

export default function UserSelectionModal({ onComplete }: { onComplete: (persona: string, language: string) => void }) {
  const [persona, setPersona] = useState('');
  const [language, setLanguage] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    if (persona && language) {
      onComplete(persona, language);
    }
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
        <div className="bg-zinc-900 text-white p-8 rounded-2xl max-w-md w-full border border-zinc-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">What best describes you?</h2>
          <div className="space-y-3">
            {PERSONAS.map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  persona === p
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50'
                    : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={!persona}
            onClick={() => setStep(2)}
            className="mt-8 w-full bg-white text-black font-semibold p-4 rounded-xl disabled:opacity-50 hover:bg-zinc-200 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 text-white p-8 rounded-2xl max-w-md w-full border border-zinc-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Preferred Language</h2>
        <div className="space-y-3">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                language === l
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          disabled={!language}
          onClick={handleSubmit}
          className="mt-8 w-full bg-white text-black font-semibold p-4 rounded-xl disabled:opacity-50 hover:bg-zinc-200 transition-colors"
        >
          Enter Portfolio
        </button>
      </div>
    </div>
  );
}
