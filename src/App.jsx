import React, { useState, useEffect } from 'react';
import BoardHeader from './components/BoardHeader';
import KanbanBoard from './components/KanbanBoard';
import CardDetailModal from './components/CardDetailModal';
import BoardModal from './components/BoardModal';
import { loadInitialData, saveState, resetToDemoData } from './utils/storage';

export default function App() {
  const [data, setData] = useState(() => loadInitialData());
  const { boards, cards: cardsMap, tags, members, activeBoardId } = data;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('ALL');

  const [activeCardDetail, setActiveCardDetail] = useState(null);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  // Sync to localStorage whenever state updates
  useEffect(() => {
    saveState(boards, cardsMap, tags, members, activeBoardId);
  }, [boards, cardsMap, tags, members, activeBoardId]);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  // Drag and Drop Handler
  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 1. Reorder LISTS
    if (type === 'LIST') {
      const newLists = Array.from(activeBoard.lists);
      const [reorderedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, reorderedList);

      const updatedBoards = boards.map((b) =>
        b.id === activeBoard.id ? { ...b, lists: newLists } : b
      );

      setData((prev) => ({ ...prev, boards: updatedBoards }));
      return;
    }

    // 2. Reorder or Move CARDS
    const sourceList = activeBoard.lists.find((l) => l.id === source.droppableId);
    const destList = activeBoard.lists.find((l) => l.id === destination.droppableId);

    if (!sourceList || !destList) return;

    // Moving within the same list
    if (sourceList.id === destList.id) {
      const newCardIds = Array.from(sourceList.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newLists = activeBoard.lists.map((l) =>
        l.id === sourceList.id ? { ...l, cardIds: newCardIds } : l
      );

      const updatedBoards = boards.map((b) =>
        b.id === activeBoard.id ? { ...b, lists: newLists } : b
      );

      setData((prev) => ({ ...prev, boards: updatedBoards }));
    } else {
      // Moving across different lists
      const sourceCardIds = Array.from(sourceList.cardIds);
      sourceCardIds.splice(source.index, 1);

      const destCardIds = Array.from(destList.cardIds);
      destCardIds.splice(destination.index, 0, draggableId);

      const newLists = activeBoard.lists.map((l) => {
        if (l.id === sourceList.id) return { ...l, cardIds: sourceCardIds };
        if (l.id === destList.id) return { ...l, cardIds: destCardIds };
        return l;
      });

      const updatedBoards = boards.map((b) =>
        b.id === activeBoard.id ? { ...b, lists: newLists } : b
      );

      // Log movement in card activity
      const targetCard = cardsMap[draggableId];
      let updatedCardsMap = cardsMap;
      if (targetCard) {
        const activityItem = {
          text: `Moved from "${sourceList.title}" to "${destList.title}"`,
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        };
        updatedCardsMap = {
          ...cardsMap,
          [draggableId]: {
            ...targetCard,
            activity: [...(targetCard.activity || []), activityItem]
          }
        };
      }

      setData((prev) => ({
        ...prev,
        boards: updatedBoards,
        cards: updatedCardsMap
      }));
    }
  };

  // Create List
  const handleAddList = (title) => {
    const newList = {
      id: `l-${Date.now()}`,
      title,
      cardIds: []
    };

    const updatedBoards = boards.map((b) =>
      b.id === activeBoard.id ? { ...b, lists: [...b.lists, newList] } : b
    );

    setData((prev) => ({ ...prev, boards: updatedBoards }));
  };

  // Delete List
  const handleDeleteList = (listId) => {
    const updatedLists = activeBoard.lists.filter((l) => l.id !== listId);
    const updatedBoards = boards.map((b) =>
      b.id === activeBoard.id ? { ...b, lists: updatedLists } : b
    );

    setData((prev) => ({ ...prev, boards: updatedBoards }));
  };

  // Edit List Title
  const handleEditListTitle = (listId, newTitle) => {
    const updatedLists = activeBoard.lists.map((l) =>
      l.id === listId ? { ...l, title: newTitle } : l
    );

    const updatedBoards = boards.map((b) =>
      b.id === activeBoard.id ? { ...b, lists: updatedLists } : b
    );

    setData((prev) => ({ ...prev, boards: updatedBoards }));
  };

  // Create Card
  const handleAddCard = (listId, title) => {
    const cardId = `c-${Date.now()}`;
    const newCard = {
      id: cardId,
      title,
      description: '',
      tagIds: ['t-2'], // default Frontend tag
      memberIds: [members[0]?.id || 'm-1'],
      dueDate: '',
      comments: [],
      activity: [
        {
          text: 'Card created',
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        }
      ]
    };

    const updatedCardsMap = { ...cardsMap, [cardId]: newCard };
    const updatedLists = activeBoard.lists.map((l) =>
      l.id === listId ? { ...l, cardIds: [...l.cardIds, cardId] } : l
    );

    const updatedBoards = boards.map((b) =>
      b.id === activeBoard.id ? { ...b, lists: updatedLists } : b
    );

    setData((prev) => ({
      ...prev,
      boards: updatedBoards,
      cards: updatedCardsMap
    }));
  };

  // Update Card Attributes
  const handleUpdateCard = (cardId, updates) => {
    const existing = cardsMap[cardId];
    if (!existing) return;

    const updatedCard = { ...existing, ...updates };
    const updatedCardsMap = { ...cardsMap, [cardId]: updatedCard };

    setData((prev) => ({ ...prev, cards: updatedCardsMap }));
    if (activeCardDetail?.id === cardId) {
      setActiveCardDetail(updatedCard);
    }
  };

  // Delete Card
  const handleDeleteCard = (cardId) => {
    const newCardsMap = { ...cardsMap };
    delete newCardsMap[cardId];

    const updatedLists = activeBoard.lists.map((l) => ({
      ...l,
      cardIds: l.cardIds.filter((id) => id !== cardId)
    }));

    const updatedBoards = boards.map((b) =>
      b.id === activeBoard.id ? { ...b, lists: updatedLists } : b
    );

    setData((prev) => ({
      ...prev,
      boards: updatedBoards,
      cards: newCardsMap
    }));

    if (activeCardDetail?.id === cardId) {
      setActiveCardDetail(null);
    }
  };

  // Move Card via Modal select dropdown
  const handleMoveCardFromModal = (cardId, targetListId) => {
    let sourceListId = null;
    activeBoard.lists.forEach((l) => {
      if (l.cardIds.includes(cardId)) sourceListId = l.id;
    });

    if (!sourceListId || sourceListId === targetListId) return;

    const sourceList = activeBoard.lists.find((l) => l.id === sourceListId);
    const destList = activeBoard.lists.find((l) => l.id === targetListId);

    const updatedLists = activeBoard.lists.map((l) => {
      if (l.id === sourceListId) return { ...l, cardIds: l.cardIds.filter((id) => id !== cardId) };
      if (l.id === targetListId) return { ...l, cardIds: [...l.cardIds, cardId] };
      return l;
    });

    const updatedBoards = boards.map((b) =>
      b.id === activeBoard.id ? { ...b, lists: updatedLists } : b
    );

    const targetCard = cardsMap[cardId];
    const activityItem = {
      text: `Moved to "${destList.title}"`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    };
    const updatedCard = {
      ...targetCard,
      activity: [...(targetCard.activity || []), activityItem]
    };

    setData((prev) => ({
      ...prev,
      boards: updatedBoards,
      cards: { ...cardsMap, [cardId]: updatedCard }
    }));

    setActiveCardDetail(updatedCard);
  };

  // Create New Board
  const handleCreateBoard = ({ title, description, color }) => {
    const newBoardId = `b-${Date.now()}`;
    const newBoard = {
      id: newBoardId,
      title,
      description,
      color,
      createdAt: new Date().toISOString().split('T')[0],
      lists: [
        { id: `l-${Date.now()}-1`, title: '📋 Backlog', cardIds: [] },
        { id: `l-${Date.now()}-2`, title: '⚡ In Progress', cardIds: [] },
        { id: `l-${Date.now()}-3`, title: '🎉 Done', cardIds: [] }
      ]
    };

    setData((prev) => ({
      ...prev,
      boards: [...prev.boards, newBoard],
      activeBoardId: newBoardId
    }));
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Reset Kanban board to original demo data?')) {
      const reset = resetToDemoData();
      setData(reset);
      setActiveCardDetail(null);
    }
  };

  // Calculate card stats
  const totalCards = activeBoard?.lists.reduce((acc, l) => acc + l.cardIds.length, 0) || 0;
  const doneList = activeBoard?.lists.find((l) => l.title.toLowerCase().includes('done'));
  const completedCards = doneList ? doneList.cardIds.length : 0;

  // Find list containing current detail modal card
  let currentListIdForDetail = null;
  if (activeCardDetail && activeBoard) {
    activeBoard.lists.forEach((l) => {
      if (l.cardIds.includes(activeCardDetail.id)) {
        currentListIdForDetail = l.id;
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Navigation & Controls Header */}
      <BoardHeader
        boards={boards}
        activeBoard={activeBoard}
        onSelectBoard={(id) => setData((prev) => ({ ...prev, activeBoardId: id }))}
        onOpenCreateBoard={() => setIsCreateBoardOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTagFilter={selectedTagFilter}
        onTagFilterChange={setSelectedTagFilter}
        selectedMemberFilter={selectedMemberFilter}
        onMemberFilterChange={setSelectedMemberFilter}
        tags={tags}
        members={members}
        onResetData={handleResetData}
        totalCards={totalCards}
        completedCards={completedCards}
      />

      {/* Main Board Horizontal Drag & Drop Canvas */}
      <KanbanBoard
        activeBoard={activeBoard}
        cardsMap={cardsMap}
        tags={tags}
        members={members}
        onDragEnd={handleDragEnd}
        onAddList={handleAddList}
        onAddCard={handleAddCard}
        onOpenCardDetail={(card) => setActiveCardDetail(card)}
        onDeleteList={handleDeleteList}
        onEditListTitle={handleEditListTitle}
        searchQuery={searchQuery}
        selectedTagFilter={selectedTagFilter}
        selectedMemberFilter={selectedMemberFilter}
      />

      {/* Card Detail Modal */}
      {activeCardDetail && (
        <CardDetailModal
          card={activeCardDetail}
          lists={activeBoard?.lists || []}
          tags={tags}
          members={members}
          currentListId={currentListIdForDetail}
          onClose={() => setActiveCardDetail(null)}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          onMoveCard={handleMoveCardFromModal}
        />
      )}

      {/* Create Board Modal */}
      {isCreateBoardOpen && (
        <BoardModal
          onClose={() => setIsCreateBoardOpen(false)}
          onCreateBoard={handleCreateBoard}
        />
      )}
    </div>
  );
}
