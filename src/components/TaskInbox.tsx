import { motion } from 'framer-motion';
import type { TesseraBlock } from '../types';
import { GripVertical, Clock, Zap, Target, CheckCircle2, Circle } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskInboxProps {
  tasks: TesseraBlock[];
  onToggleComplete: (id: string) => void;
}

export default function TaskInbox({ tasks, onToggleComplete }: TaskInboxProps) {
  const { setNodeRef: setDropRef } = useDroppable({
    id: 'inbox-droppable',
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-md border-l border-slate-800">
      <div className="p-5 border-b border-slate-800">
        <h2 className="text-xl font-semibold text-slate-100 tracking-tight flex items-center gap-2">
          Smart Inbox
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {tasks.length} pending
          </span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">Unscheduled tasks and backlog</p>
      </div>

      <div ref={setDropRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 pb-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
            </div>
            <p className="text-sm font-medium">Inbox Zero achieved!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTaskItem({ task, onToggleComplete }: { task: TesseraBlock, onToggleComplete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deep-work': return <Zap className="w-3.5 h-3.5" />;
      case 'meeting': return <Target className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex gap-3 p-4 border rounded-xl transition-colors hover:shadow-lg ${
        task.status === 'completed' 
          ? 'bg-slate-800/20 border-emerald-500/20 opacity-60' 
          : 'bg-slate-800/40 hover:bg-slate-800/80 hover:border-indigo-500/30 border-slate-700/50'
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="pt-1 flex-shrink-0 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
              className="flex-shrink-0 mt-0.5 focus:outline-none"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
              )}
            </button>
            <h3 className={`text-sm font-medium truncate transition-colors ${
              task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-200 group-hover:text-white'
            }`}>
              {task.title}
            </h3>
          </div>
          <span className={`flex-shrink-0 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="text-xs text-slate-400 truncate mb-2 ml-6">{task.description}</p>
        )}
        
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 ml-6">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/50">
            {getTypeIcon(task.type)}
            <span className="capitalize">{task.type.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/50">
            <Clock className="w-3.5 h-3.5" />
            <span>{task.duration}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
