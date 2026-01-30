'use client';
import { useState } from 'react';

const PERSONAS = ['Tech Recruiter', 'Investor', 'Curious Human', 'Student'];
const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Mandarin',
  'Japanese',
  'Korean',
  'Portuguese',
  'Italian',
  'Russian',
  'Arabic',
  'Dutch',
  'Turkish',
  'Vietnamese',
  'Indonesian'
];

export default function Onboarding({ onComplete }: { onComplete: (persona: string, language: string) => void }) {
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
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto min-h-[60vh] p-4 animate-in fade-in zoom-in duration-500">
        <div className="w-full text-center">
          <h2 className="text-4xl font-bold mb-12 text-white tracking-tight">What best describes you?</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {PERSONAS.map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`px-6 py-3 rounded-full border text-lg font-medium transition-all duration-200 ${
                  persona === p
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50 scale-105'
                    : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:scale-105'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={!persona}
            onClick={() => setStep(2)}
            className="mt-12 px-12 py-4 bg-white text-black font-semibold text-lg rounded-full disabled:opacity-50 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto min-h-[60vh] p-4 animate-in fade-in zoom-in duration-500">
      <div className="w-full text-center">
        <h2 className="text-4xl font-bold mb-12 text-white tracking-tight">Preferred Language</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-6 py-3 rounded-full border text-lg font-medium transition-all duration-200 ${
                language === l
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50 scale-105'
                  : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:scale-105'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          disabled={!language}
          onClick={handleSubmit}
          className="mt-12 px-12 py-4 bg-white text-black font-semibold text-lg rounded-full disabled:opacity-50 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          Enter Portfolio
        </button>
      </div>
    </div>
  );
}
