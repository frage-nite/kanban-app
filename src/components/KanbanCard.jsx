import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { 
  Clock, 
  MessageSquare, 
  GripVertical, 
  AlertCircle
} from 'lucide-react';

export default function KanbanCard({
  card,
  index,
  tags,
  members,
  onOpenCardDetail
}) {
  const cardTags = tags.filter((t) => card.tagIds?.includes(t.id));
  const cardMembers = members.filter((m) => card.memberIds?.includes(m.id));

  // Calculate Due Date Status
  const getDueStatus = () => {
    if (!card.dueDate) return null;
    const due = new Date(card.dueDate);
    const now = new Date();
    const diffHours = (due - now) / (1000 * 60 * 60);

    const formattedDate = due.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });

    if (diffHours < 0) {
      return { label: `Overdue · ${formattedDate}`, cls: 'badge-overdue', icon: AlertCircle };
    } else if (diffHours <= 24) {
      return { label: `Due soon · ${formattedDate}`, cls: 'badge-duesoon', icon: Clock };
    }
    return { label: formattedDate, cls: 'bg-[#E6ECEF] text-slate-600 border border-slate-300 shadow-inner', icon: Clock };
  };

  const dueStatus = getDueStatus();
  const IconComp = dueStatus?.icon;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`neu-raised-interactive p-4 mb-3 group relative cursor-grab active:cursor-grabbing select-none ${
            snapshot.isDragging ? 'card-dragging' : ''
          }`}
          style={{
            ...provided.draggableProps.style
          }}
        >
          {/* Tags & Tactile Grip Indicator */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex flex-wrap gap-1.5 items-center flex-1">
              {cardTags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: `${tag.color}15`,
                    color: tag.color,
                    border: `1px solid ${tag.color}30`
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="text-slate-400 group-hover:text-indigo-600 p-0.5 rounded opacity-50 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4" />
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={(e) => {
              e.stopPropagation();
              onOpenCardDetail(card);
            }}
            className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug tracking-tight"
          >
            {card.title}
          </h3>

          {/* Description snippet */}
          {card.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed font-medium">
              {card.description}
            </p>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-300/40 mt-1 text-[11px]">
            <div className="flex items-center gap-2">
              {dueStatus && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${dueStatus.cls}`}>
                  {IconComp && <IconComp className="w-3 h-3" />}
                  <span>{dueStatus.label}</span>
                </span>
              )}

              {card.comments?.length > 0 && (
                <span className="flex items-center gap-1 text-slate-500 font-semibold text-[10px] bg-[#E6ECEF] px-2 py-0.5 rounded-full shadow-inner">
                  <MessageSquare className="w-3 h-3 text-indigo-500" />
                  <span>{card.comments.length}</span>
                </span>
              )}
            </div>

            {/* Member Avatars */}
            <div className="flex items-center -space-x-2 overflow-hidden">
              {cardMembers.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  title={member.name}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-[#E6ECEF] shadow-md hover:scale-110 transition-transform"
                />
              ))}
            </div>
          </div>

        </div>
      )}
    </Draggable>
  );
}
