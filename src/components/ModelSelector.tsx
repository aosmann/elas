import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Model } from '../types';

const MODELS: { value: Model; label: string; desc: string }[] = [
  { value: 'ElastixAI', label: 'ElastixAI', desc: 'Balanced · Fast' },
  { value: 'ElastixAI Pro', label: 'ElastixAI Pro', desc: 'Most capable' },
  { value: 'ElastixAI Mini', label: 'ElastixAI Mini', desc: 'Lightweight · Fastest' },
];

interface ModelSelectorProps {
  model: Model;
  onChange: (m: Model) => void;
}

export default function ModelSelector({ model, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="model-selector" ref={ref}>
      <button className="model-btn" onClick={() => setOpen((o) => !o)}>
        <span>{model}</span>
        <ChevronDown size={14} className={`model-chevron ${open ? 'model-chevron--open' : ''}`} />
      </button>
      {open && (
        <div className="model-dropdown">
          {MODELS.map((m) => (
            <button
              key={m.value}
              className={`model-option ${model === m.value ? 'model-option--active' : ''}`}
              onClick={() => { onChange(m.value); setOpen(false); }}
            >
              <div className="model-option-text">
                <span className="model-option-name">{m.label}</span>
                <span className="model-option-desc">{m.desc}</span>
              </div>
              {model === m.value && <Check size={14} className="model-option-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
