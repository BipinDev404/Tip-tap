import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) {
      setError('Please enter or paste some text to practice.');
      return;
    }
    if (clean.length < 10) {
      setError('Text must be at least 10 characters long.');
      return;
    }
    setError('');
    onApply(clean);
    onClose();
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/80 text-accent flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Custom Practice Text
              </h3>
              <p className="text-xs text-zinc-400">Paste your own paragraphs, code snippets, or quotes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={e => {
                setText(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste or write anything here to test your typing fluency..."
              rows={6}
              className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none font-sans"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 px-1">
            <span>{wordCount} words · {charCount} characters</span>
            {error && <span className="text-rose-400 font-medium">{error}</span>}
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-accent hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Start Custom Test</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
