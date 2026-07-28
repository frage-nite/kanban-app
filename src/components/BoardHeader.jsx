import React, { useState, useRef, useEffect } from 'react';
import { 
  Layout, 
  Plus, 
  Search, 
  User, 
  Tag, 
  RotateCcw, 
  ChevronDown, 
  Layers,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function BoardHeader({
  boards,
  activeBoard,
  onSelectBoard,
  onOpenCreateBoard,
  searchQuery,
  onSearchChange,
  selectedTagFilter,
  onTagFilterChange,
  selectedMemberFilter,
  onMemberFilterChange,
  tags,
  members,
  onResetData,
  totalCards,
  completedCards
}) {
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!boardDropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBoardDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [boardDropdownOpen]);

  const progressPercent = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 px-6 py-4 transition-all bg-[#E6ECEF] border-b border-slate-300/60 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Board Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl neu-raised flex items-center justify-center text-indigo-600 shadow-md">
              <Sparkles className="w-5 h-5 fill-indigo-600/10 text-indigo-600" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-800 flex items-center gap-2">
                ForgeFlow
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 uppercase tracking-widest shadow-inner">
                  SOFT UI
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold">Neumorphic Productivity System</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>

          {/* Board Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setBoardDropdownOpen(!boardDropdownOpen)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl neu-btn-secondary text-xs font-bold text-slate-800 shadow-sm"
            >
              <Layout className="w-4 h-4 text-indigo-600" />
              <span className="max-w-[180px] truncate">{activeBoard ? activeBoard.title : 'Select Board'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${boardDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {boardDropdownOpen && (
              <div className="absolute left-0 mt-3 w-72 rounded-2xl neu-raised shadow-2xl p-2 z-50 animate-neu-pop">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                  Workspaces ({boards.length})
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {boards.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBoard(b.id);
                        setBoardDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        activeBoard?.id === b.id
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-inner'
                          : 'text-slate-700 hover:bg-slate-200/60'
                      }`}
                    >
                      <span className="truncate">{b.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded-full shadow-inner">
                        {b.lists.reduce((acc, l) => acc + l.cardIds.length, 0)} cards
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-300/60 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setBoardDropdownOpen(false);
                      onOpenCreateBoard();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search & Recessed Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Recessed Search Bar */}
          <div className="relative flex-1 min-w-[200px] sm:w-60">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search cards, specs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs neu-input font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <select
              value={selectedTagFilter}
              onChange={(e) => onTagFilterChange(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-xs neu-input font-bold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Member Filter */}
          <div className="relative">
            <select
              value={selectedMemberFilter}
              onChange={(e) => onMemberFilterChange(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-xs neu-input font-bold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Primary Raised Action Button */}
          <button
            onClick={onOpenCreateBoard}
            className="neu-btn-primary flex items-center gap-2 px-4 py-2 text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Board</span>
          </button>

          <button
            onClick={onResetData}
            title="Reset to initial demo data"
            className="p-2 rounded-xl neu-btn-secondary text-slate-400 hover:text-rose-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Tactile Progress Pill */}
      {activeBoard && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-300/40 flex items-center justify-between text-xs text-slate-600 font-bold">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{activeBoard.lists.length} Lists</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{totalCards} Cards</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedCards} Completed</span>
            </span>

            {/* Recessed Progress Bar */}
            {totalCards > 0 && (
              <div className="hidden sm:flex items-center gap-2.5 neu-inset px-3 py-1 rounded-full">
                <div className="w-24 h-2 rounded-full bg-slate-300 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-extrabold text-slate-700">{progressPercent}%</span>
              </div>
            )}
          </div>

          {activeBoard.description && (
            <span className="hidden md:inline truncate max-w-sm text-slate-500 font-medium">
              {activeBoard.description}
            </span>
          )}
        </div>
      )}
    </header>
  );
}
