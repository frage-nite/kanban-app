import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Tag, 
  User, 
  MessageSquare, 
  History, 
  MoveRight,
  Send,
  Calendar,
  AlignLeft
} from 'lucide-react';

export default function CardDetailModal({
  card,
  lists,
  tags,
  members,
  currentListId,
  onClose,
  onUpdateCard,
  onDeleteCard,
  onMoveCard
}) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [selectedTagIds, setSelectedTagIds] = useState(card.tagIds || []);
  const [selectedMemberIds, setSelectedMemberIds] = useState(card.memberIds || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  // Re-sync local state when card prop changes
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setDueDate(card.dueDate || '');
    setSelectedTagIds(card.tagIds || []);
    setSelectedMemberIds(card.memberIds || []);
  }, [card.id, card.title, card.description, card.dueDate, card.tagIds, card.memberIds]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSaveTitleDesc = () => {
    if (!title.trim()) return;
    onUpdateCard(card.id, {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      tagIds: selectedTagIds,
      memberIds: selectedMemberIds
    });
  };

  const toggleTag = (tagId) => {
    const updated = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    setSelectedTagIds(updated);
    onUpdateCard(card.id, { tagIds: updated });
  };

  const toggleMember = (memberId) => {
    const updated = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter((id) => id !== memberId)
      : [...selectedMemberIds, memberId];
    setSelectedMemberIds(updated);
    onUpdateCard(card.id, { memberIds: updated });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const comment = {
      id: `cm-${Date.now()}`,
      memberId: selectedMemberIds[0] || members[0]?.id || 'm-1',
      text: newCommentText.trim(),
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    };
    const updatedComments = [...(card.comments || []), comment];
    const updatedActivity = [
      ...(card.activity || []),
      { text: `Added comment: "${newCommentText.trim().slice(0, 30)}..."`, timestamp: new Date().toLocaleString() }
    ];
    onUpdateCard(card.id, { comments: updatedComments, activity: updatedActivity });
    setNewCommentText('');
  };

  const handleDueDateChange = (e) => {
    const val = e.target.value;
    setDueDate(val);
    onUpdateCard(card.id, { dueDate: val });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-neu-fade"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl neu-raised overflow-hidden flex flex-col max-h-[90vh] animate-neu-pop border border-slate-300/60 shadow-2xl">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-300/40 flex items-center justify-between bg-[#E6ECEF]">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full neu-inset text-indigo-600 font-extrabold">
              CARD #{card.id}
            </span>
            <div className="flex items-center gap-1 neu-inset p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'details' ? 'neu-raised text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Details & Comments
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'activity' ? 'neu-raised text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Activity Log ({card.activity?.length || 0})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onDeleteCard(card.id); onClose(); }}
              className="p-2 rounded-xl neu-btn-secondary text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl neu-btn-secondary text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#E6ECEF]">
          {activeTab === 'details' ? (
            <>
              {/* Title Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSaveTitleDesc}
                  className="w-full text-base font-extrabold text-slate-800 neu-input p-3 focus:outline-none"
                  placeholder="Task title..."
                />
              </div>

              {/* Move Column & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 neu-inset p-4 rounded-2xl">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <MoveRight className="w-3.5 h-3.5 text-indigo-600" />
                    Move to Column
                  </label>
                  <select
                    value={currentListId}
                    onChange={(e) => onMoveCard(card.id, e.target.value)}
                    className="w-full neu-input text-slate-800 text-xs font-bold p-2.5 cursor-pointer"
                  >
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={handleDueDateChange}
                    className="w-full neu-input text-slate-800 text-xs font-bold p-2.5"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlignLeft className="w-4 h-4 text-indigo-600" />
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSaveTitleDesc}
                  placeholder="Task specifications, instructions, or criteria..."
                  className="w-full p-3.5 text-xs neu-input text-slate-800 font-medium focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Tags / Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-all ${
                          isSelected
                            ? 'neu-btn-primary shadow-md scale-105'
                            : 'neu-btn-secondary opacity-75 hover:opacity-100'
                        }`}
                        style={
                          !isSelected ? {
                            backgroundColor: `${tag.color}15`,
                            color: tag.color,
                            border: `1px solid ${tag.color}30`
                          } : {}
                        }
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assign Members */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="w-4 h-4 text-indigo-600" />
                  Assign Members
                </label>
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => {
                    const isAssigned = selectedMemberIds.includes(member.id);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleMember(member.id)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isAssigned
                            ? 'neu-raised text-indigo-600 shadow-md border-indigo-300'
                            : 'neu-btn-secondary text-slate-600'
                        }`}
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{member.name}</span>
                        {isAssigned && <span className="text-indigo-600 font-extrabold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-4 border-t border-slate-300/40">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Comments ({card.comments?.length || 0})
                </label>

                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {card.comments?.map((cm) => {
                    const author = members.find((m) => m.id === cm.memberId) || members[0];
                    return (
                      <div key={cm.id} className="p-3.5 rounded-xl neu-raised space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2 font-bold text-slate-800">
                            <img src={author?.avatar} alt="" className="w-4 h-4 rounded-full" />
                            <span>{author?.name}</span>
                          </div>
                          <span className="text-slate-400 font-mono text-[10px]">{cm.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed font-medium">{cm.text}</p>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 p-2.5 text-xs neu-input font-medium"
                  />
                  <button
                    type="submit"
                    className="neu-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Activity Tab */
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <History className="w-4 h-4 text-indigo-600" />
                Audit Trail & Activity Log
              </h3>
              <div className="space-y-2">
                {card.activity?.map((act, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl neu-raised text-xs flex justify-between items-center">
                    <span className="text-slate-700 font-bold">{act.text}</span>
                    <span className="text-[10px] font-mono text-slate-400">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-300/40 bg-[#E6ECEF] flex items-center justify-end">
          <button
            onClick={onClose}
            className="neu-btn-primary px-6 py-2 text-xs font-bold shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
