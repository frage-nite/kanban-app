import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const ACCENT_COLORS = ['#4F46E5', '#0284C7', '#DB2777', '#10B981', '#D97706', '#7C3AED'];

export default function BoardModal({ onClose, onCreateBoard }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4F46E5');

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateBoard({
      title: title.trim(),
      description: description.trim(),
      color
    });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-neu-fade"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md neu-raised overflow-hidden animate-neu-pop border border-slate-300/60 shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-300/40 flex items-center justify-between bg-[#E6ECEF]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">Create Workspace</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl neu-btn-secondary text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-[#E6ECEF]">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Board Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Growth Roadmap"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full p-3 text-xs neu-input font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Overview of goals and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs neu-input font-medium resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Theme Accent Color</label>
            <div className="flex items-center gap-3 pt-1">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-300/40 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn-secondary text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neu-btn-primary text-xs px-5 py-2 shadow-md"
            >
              Create Board
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
