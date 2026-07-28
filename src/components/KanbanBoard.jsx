import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import KanbanList from './KanbanList';
import { Plus } from 'lucide-react';

export default function KanbanBoard({
  activeBoard,
  cardsMap,
  tags,
  members,
  onDragEnd,
  onAddList,
  onAddCard,
  onOpenCardDetail,
  onDeleteList,
  onEditListTitle
}) {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  if (!activeBoard) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
        <div>
          <p className="text-base font-extrabold text-slate-700 mb-1">No Workspace Selected</p>
          <p className="text-xs text-slate-500 font-medium">Select or create a new board to get started.</p>
        </div>
      </div>
    );
  }

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    onAddList(newListTitle.trim());
    setNewListTitle('');
    setIsAddingList(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 overflow-x-auto p-6 min-h-[calc(100vh-140px)]">
        <div className="flex items-start gap-5 min-w-max pb-4">
          {activeBoard.lists.map((list, index) => {
            const listCards = list.cardIds
              .map((id) => cardsMap[id])
              .filter(Boolean);

            return (
              <KanbanList
                key={list.id}
                list={list}
                index={index}
                cards={listCards}
                tags={tags}
                members={members}
                onAddCard={onAddCard}
                onOpenCardDetail={onOpenCardDetail}
                onDeleteList={onDeleteList}
                onEditListTitle={onEditListTitle}
                allLists={activeBoard.lists}
              />
            );
          })}

          {/* Add Column Button / Form */}
          <div className="w-[320px] shrink-0">
            {isAddingList ? (
              <div className="p-4 rounded-2xl neu-raised space-y-3 animate-neu-pop border border-indigo-200">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">New Column</h3>
                <form onSubmit={handleCreateList} className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Column title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    autoFocus
                    className="w-full p-2.5 text-xs neu-input font-bold"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="neu-btn-primary text-xs px-3.5 py-1.5 shadow-sm"
                    >
                      Create List
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsAddingList(false); setNewListTitle(''); }}
                      className="neu-btn-secondary text-xs px-3 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-full py-4 px-4 rounded-2xl neu-raised-interactive border-2 border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 font-extrabold text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add Column</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
