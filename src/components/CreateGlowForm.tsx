'use client';

import { useState } from 'react';
import { createGlow } from '@/app/actions/glows';

const COLORS = [
  { id: 'yellow', label: 'Yellow', bgClass: 'bg-note-yellow text-black' },
  { id: 'pink', label: 'Pink', bgClass: 'bg-note-pink text-black' },
  { id: 'blue', label: 'Blue', bgClass: 'bg-note-blue text-black' },
  { id: 'green', label: 'Green', bgClass: 'bg-note-green text-black' },
  { id: 'purple', label: 'Purple', bgClass: 'bg-note-purple text-black' },
];

export function CreateGlowForm() {
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (content.trim().length === 0) return;
    
    setIsSubmitting(true);
    try {
      await createGlow(content, color);
      setContent(''); // Reset form on success
    } catch (err: any) {
      setError(err.message || 'Failed to post Glow.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedColorObj = COLORS.find(c => c.id === color) || COLORS[0];

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-black/10">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-accent">✦</span> Post a Glow
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`p-6 transition-colors duration-300 ${selectedColorObj.bgClass}`}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's sticking in your world today?"
            maxLength={280}
            className="w-full resize-none bg-transparent text-lg placeholder:text-black/50 focus:outline-none min-h-[120px]"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c.id ? 'border-foreground shadow-sm scale-110' : 'border-transparent'
                } ${c.bgClass.split(' ')[0]}`}
                aria-label={`Select ${c.label} color`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className={`text-sm ${content.length > 250 ? 'text-danger' : 'text-muted'}`}>
              {content.length}/280
            </span>
            <button
              type="submit"
              disabled={isSubmitting || content.trim().length === 0}
              className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-background transition-all hover:bg-accent-hover hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sticking...' : 'Glow'}
            </button>
          </div>
        </div>
      </form>
      {error && (
        <div className="bg-danger/10 px-4 py-3 text-sm text-danger text-center border-t border-danger/20">
          {error}
        </div>
      )}
    </div>
  );
}
