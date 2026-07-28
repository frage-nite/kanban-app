import { INITIAL_BOARDS, INITIAL_CARDS, INITIAL_TAGS, INITIAL_MEMBERS } from '../data/initialData';

const STORAGE_KEYS = {
  BOARDS: 'ui_ux_kanban_boards',
  CARDS: 'ui_ux_kanban_cards',
  TAGS: 'ui_ux_kanban_tags',
  MEMBERS: 'ui_ux_kanban_members',
  ACTIVE_BOARD: 'ui_ux_kanban_active_board'
};

export function loadInitialData() {
  try {
    const savedBoards = localStorage.getItem(STORAGE_KEYS.BOARDS);
    const savedCards = localStorage.getItem(STORAGE_KEYS.CARDS);
    const savedTags = localStorage.getItem(STORAGE_KEYS.TAGS);
    const savedMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_BOARD);

    return {
      boards: savedBoards ? JSON.parse(savedBoards) : INITIAL_BOARDS,
      cards: savedCards ? JSON.parse(savedCards) : INITIAL_CARDS,
      tags: savedTags ? JSON.parse(savedTags) : INITIAL_TAGS,
      members: savedMembers ? JSON.parse(savedMembers) : INITIAL_MEMBERS,
      activeBoardId: savedActiveId || INITIAL_BOARDS[0].id
    };
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return {
      boards: INITIAL_BOARDS,
      cards: INITIAL_CARDS,
      tags: INITIAL_TAGS,
      members: INITIAL_MEMBERS,
      activeBoardId: INITIAL_BOARDS[0].id
    };
  }
}

export function saveState(boards, cards, tags, members, activeBoardId) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    if (activeBoardId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_BOARD, activeBoardId);
    }
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function resetToDemoData() {
  localStorage.clear();
  return {
    boards: INITIAL_BOARDS,
    cards: INITIAL_CARDS,
    tags: INITIAL_TAGS,
    members: INITIAL_MEMBERS,
    activeBoardId: INITIAL_BOARDS[0].id
  };
}
