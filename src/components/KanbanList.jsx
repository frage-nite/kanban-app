import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import { Plus, MoreVertical, Trash2, Edit2, GripHorizontal } from 'lucide-react';

export default function KanbanList({
  list,
  cards,
  tags,
  members,
  onAddCard,
  onOpenCardDetail,
  onDeleteList,
  onEditListTitle,
  allLists
}) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(list.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Keep title in sync when list prop changes
  useEffect(() => {
    setTitleText(list.title);
  }, [list.title]);

  // Close context menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    onAddCard(list.id, newCardTitle.trim());
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  const handleSaveTitle = () => {
    if (titleText.trim() && titleText !== list.title) {
      onEditListTitle(list.id, titleText.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="w-[320px] shrink-0 flex flex-col rounded-2xl neu-raised border border-slate-300/60 shadow-md">
      {/* List Header */}
      <div className="p-4 flex items-center justify-between group select-none border-b border-slate-300/40 bg-[#E6ECEF] rounded-t-2xl">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <GripHorizontal className="w-4 h-4 text-slate-400 opacity-50 shrink-0" />
          
          {isEditingTitle ? (
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="neu-input px-3 py-1 text-xs font-bold text-slate-800 focus:outline-none w-full"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="font-extrabold text-xs text-slate-800 hover:text-indigo-600 cursor-pointer truncate flex items-center gap-2.5 tracking-tight uppercase"
            >
              <span>{list.title}</span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#E6ECEF] text-indigo-600 font-bold border border-slate-300/60 shadow-inner">
                {cards.length}
              </span>
            </h2>
          )}
        </div>

        {/* Context Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl neu-btn-secondary text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 neu-raised shadow-2xl p-1.5 z-50 animate-neu-pop bg-[#E6ECEF]">
              <button
                onClick={() => {
                  setIsEditingTitle(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/60 rounded-xl text-left transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Rename List</span>
              </button>

              <button
                onClick={() => {
                  onDeleteList(list.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl text-left transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete List</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards Droppable Inset Canvas */}
      <Droppable droppableId={list.id} type="CARD">
        {(dropProvided, dropSnapshot) => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            className={`p-3 flex-1 min-h-[160px] m-2 rounded-xl transition-colors duration-150 ${
              dropSnapshot.isDraggingOver ? 'neu-inset-deep bg-indigo-50/50' : 'neu-inset'
            }`}
          >
            {cards.map((card, cardIndex) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={cardIndex}
                tags={tags}
                members={members}
                onOpenCardDetail={onOpenCardDetail}
                lists={allLists}
              />
            ))}
            {dropProvided.placeholder}

            {/* Empty State */}
            {cards.length === 0 && !isAddingCard && (
              <div className="h-28 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                Drop tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Footer Quick Add Button */}
      <div className="p-3 border-t border-slate-300/40 bg-[#E6ECEF] rounded-b-2xl">
        {isAddingCard ? (
          <form onSubmit={handleCreateCard} className="space-y-2.5 animate-neu-fade">
            <textarea
              placeholder="Task title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              autoFocus
              rows={2}
              className="w-full p-3 text-xs neu-input font-medium focus:outline-none resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateCard(e);
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="neu-btn-primary text-xs px-3.5 py-1.5 shadow-sm"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => { setIsAddingCard(false); setNewCardTitle(''); }}
                className="neu-btn-secondary text-xs px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full py-2.5 px-3 rounded-xl neu-btn-secondary text-slate-700 hover:text-indigo-600 text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Task Card</span>
          </button>
        )}
      </div>
    </div>
  );
}
