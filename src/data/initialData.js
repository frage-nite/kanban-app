// Initial pre-seeded demo data for the Apple/Linear Refined Glass Kanban App

export const INITIAL_MEMBERS = [
  { id: 'm-1', name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Lead Frontend Eng', email: 'alex@forgeflow.ai' },
  { id: 'm-2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'AI Agent Architect', email: 'sarah@forgeflow.ai' },
  { id: 'm-3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Backend / Laravel Lead', email: 'marcus@forgeflow.ai' },
  { id: 'm-4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Product Designer', email: 'elena@forgeflow.ai' }
];

export const INITIAL_TAGS = [
  { id: 't-1', name: 'AI Agent', color: '#5E6AD2' },      // Linear Violet
  { id: 't-2', name: 'Frontend', color: '#0284C7' },      // Apple Ocean
  { id: 't-3', name: 'Backend API', color: '#10B981' },   // Emerald
  { id: 't-4', name: 'UI/UX Polish', color: '#DB2777' },  // Magenta Pink
  { id: 't-5', name: 'Security', color: '#D97706' }       // Amber
];

export const INITIAL_BOARDS = [
  {
    id: 'b-1',
    title: 'Sprint 24 — AI Agent Platform',
    description: 'NMG Forge 2 Qualifier: Kanban Web App with Hermes Agent & OpenClaw Orchestration',
    color: '#5E6AD2',
    createdAt: '2026-07-28',
    lists: [
      {
        id: 'l-1',
        title: '📋 Backlog',
        cardIds: ['c-1', 'c-2']
      },
      {
        id: 'l-2',
        title: '⚡ In Progress',
        cardIds: ['c-3', 'c-4']
      },
      {
        id: 'l-3',
        title: '🔍 In Review',
        cardIds: ['c-5']
      },
      {
        id: 'l-4',
        title: '🎉 Done',
        cardIds: ['c-6']
      }
    ]
  },
  {
    id: 'b-2',
    title: 'Mobile App Redesign',
    description: 'iOS & Android design system migration',
    color: '#EC4899',
    createdAt: '2026-07-25',
    lists: [
      { id: 'l-201', title: 'To Do', cardIds: ['c-201'] },
      { id: 'l-202', title: 'Done', cardIds: [] }
    ]
  }
];

export const INITIAL_CARDS = {
  'c-1': {
    id: 'c-1',
    title: 'Configure Slack Gateway Integration',
    description: 'Set up socket mode on OpenClaw and map channels `#sprint-main`, `#agent-coder`, and `#agent-log`.',
    tagIds: ['t-1', 't-5'],
    memberIds: ['m-2'],
    dueDate: '2026-07-30T18:00',
    comments: [
      { id: 'cm-1', memberId: 'm-2', text: 'App-level tokens generated with `connections:write` scope.', createdAt: '2026-07-28 14:20' }
    ],
    activity: [
      { text: 'Created card', timestamp: '2026-07-28 10:00' },
      { text: 'Assigned to Sarah Chen', timestamp: '2026-07-28 10:05' }
    ]
  },
  'c-2': {
    id: 'c-2',
    title: 'Implement Dark & Light Glassmorphism Themes',
    description: 'Apply Apple-level glass design tokens, smooth spring animations, and multi-layer backdrop blurs across all panels.',
    tagIds: ['t-2', 't-4'],
    memberIds: ['m-1', 'm-4'],
    dueDate: '2026-07-29T12:00',
    comments: [
      { id: 'cm-2', memberId: 'm-4', text: 'Fluid spring curves applied! Translucent blur active.', createdAt: '2026-07-28 11:30' }
    ],
    activity: [
      { text: 'Created card', timestamp: '2026-07-28 09:30' }
    ]
  },
  'c-3': {
    id: 'c-3',
    title: 'Build Drag and Drop Column & Card System',
    description: 'Integrate `@hello-pangea/dnd` with smooth spring reordering animations and persistent LocalStorage state.',
    tagIds: ['t-2'],
    memberIds: ['m-1'],
    dueDate: '2026-07-28T20:00',
    comments: [
      { id: 'cm-3', memberId: 'm-1', text: 'Fluid drag handle micro-feedback active.', createdAt: '2026-07-28 15:45' }
    ],
    activity: [
      { text: 'Moved to In Progress', timestamp: '2026-07-28 12:00' }
    ]
  },
  'c-4': {
    id: 'c-4',
    title: 'Laravel API SQLite Database Migrations',
    description: 'Scaffold Boards, Lists, Cards, Tags, and Members models with SQLite relational schema.',
    tagIds: ['t-3'],
    memberIds: ['m-3'],
    dueDate: '2026-07-27T18:00',
    comments: [],
    activity: [
      { text: 'Moved to In Progress', timestamp: '2026-07-28 11:00' }
    ]
  },
  'c-5': {
    id: 'c-5',
    title: 'Card Search & Tag/Member Filter Engine',
    description: 'Add instant live search input and tag/member multi-filter dropdown to top header bar.',
    tagIds: ['t-2', 't-4'],
    memberIds: ['m-1'],
    dueDate: '2026-07-29T17:00',
    comments: [
      { id: 'cm-4', memberId: 'm-1', text: 'Filtering logic supports combination queries seamlessly.', createdAt: '2026-07-28 16:10' }
    ],
    activity: [
      { text: 'Moved to In Review', timestamp: '2026-07-28 16:00' }
    ]
  },
  'c-6': {
    id: 'c-6',
    title: 'Establish 5 Required Entities Architecture',
    description: 'Defined Board, List, Card, Tag, and Member entities with high performance state management.',
    tagIds: ['t-1', 't-3'],
    memberIds: ['m-2', 'm-3'],
    dueDate: '2026-07-28T10:00',
    comments: [
      { id: 'cm-5', memberId: 'm-3', text: 'All models verified and validated.', createdAt: '2026-07-28 10:15' }
    ],
    activity: [
      { text: 'Moved to Done', timestamp: '2026-07-28 10:15' }
    ]
  },
  'c-201': {
    id: 'c-201',
    title: 'Design Mobile Nav Component',
    description: 'Figma mockups for iOS bottom navigation bar.',
    tagIds: ['t-4'],
    memberIds: ['m-4'],
    dueDate: '2026-08-01T12:00',
    comments: [],
    activity: [{ text: 'Created card', timestamp: '2026-07-25 10:00' }]
  }
};
