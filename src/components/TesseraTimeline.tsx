import { motion } from 'framer-motion';
import type { TesseraBlock } from '../types';
import { Clock, Zap, Target, LayoutGrid, CheckCircle2, Circle, GripHorizontal } from 'lucide-react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TesseraTimelineProps {
  blocks: TesseraBlock[];
  onToggleComplete: (id: string) => void;
}

export default function TesseraTimeline({ blocks, onToggleComplete }: TesseraTimelineProps) {
  const { setNodeRef: setTimelineRef } = useDroppable({
    id: 'timeline-droppable',
  });

  const START_HOUR = 9; // 09:00
  const END_HOUR = 18; // 18:00
  const PIXELS_PER_MINUTE = 3.0; // Controls vertical scale

  const scheduledBlocks = blocks.filter(b => b.status === 'scheduled');
  const overflowBlocks = blocks.filter(b => b.status === 'overflow');

  const getTopPosition = (startTime?: string) => {
    if (!startTime) return 0;
    const [hours, minutes] = startTime.split(':').map(Number);
    const minutesFromStart = (hours - START_HOUR) * 60 + minutes;
    return minutesFromStart * PIXELS_PER_MINUTE;
  };

  const getHeight = (duration: number) => duration * PIXELS_PER_MINUTE;

  const hours = [];
  for (let i = START_HOUR; i <= END_HOUR; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-900">
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl z-10 relative">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
            Tessera Flow
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
            Deep Work
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></div>
            Meeting
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
            Admin
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative custom-scrollbar pb-32">
        <div ref={setTimelineRef} className="relative min-w-[600px] px-6 py-4">
          <div className="absolute top-4 left-6 bottom-0 w-16 border-r border-slate-800 z-0">
            {hours.map((hour, i) => (
              <div 
                key={hour} 
                className="absolute w-full flex justify-end pr-4 text-xs font-medium text-slate-500"
                style={{ top: `${i * 60 * PIXELS_PER_MINUTE}px`, transform: 'translateY(-50%)' }}
              >
                {hour}
              </div>
            ))}
          </div>

          <div className="absolute top-4 left-[5.5rem] right-6 bottom-0 z-0">
            {hours.map((hour, i) => (
              <div 
                key={hour} 
                className="absolute w-full border-t border-slate-800/60"
                style={{ top: `${i * 60 * PIXELS_PER_MINUTE}px` }}
              />
            ))}
          </div>

          <div className="relative ml-[4.5rem] mt-4 z-10" style={{ height: `${(END_HOUR - START_HOUR) * 60 * PIXELS_PER_MINUTE}px` }}>
            {scheduledBlocks.map((block) => (
              <TimelineBlock 
                key={block.id} 
                block={block} 
                top={getTopPosition(block.startTime)} 
                height={getHeight(block.duration)} 
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>

        {overflowBlocks.length > 0 && (
          <div className="mt-12 px-6 pb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest bg-slate-900 px-2">
                Overflow (Tomorrow)
              </span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 ml-[4.5rem]">
              {overflowBlocks.map((block, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={block.id}
                  className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-300">{block.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{block.duration} mins • {block.priority}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineBlock({ block, top, height, onToggleComplete }: { block: TesseraBlock, top: number, height: number, onToggleComplete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });

  const style = {
    top: `${top}px`,
    height: `${height}px`,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 10,
  };

  const color = block.color || '#6366f1';

  const getTypeIcon = (type: string, className = "w-4 h-4") => {
    switch (type) {
      case 'deep-work': return <Zap className={className} />;
      case 'meeting': return <Target className={className} />;
      default: return <LayoutGrid className={className} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: `${color}20`,
        borderLeft: `4px solid ${color}`,
      }}
      className="absolute w-[calc(100%-1rem)] rounded-xl border border-white/10 shadow-lg overflow-hidden group hover:z-20 transition-shadow hover:shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="p-3 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleComplete(block.id); }}
                className="flex-shrink-0 mt-0.5 focus:outline-none pointer-events-auto"
              >
                {block.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4" style={{ color }} />
                ) : (
                  <Circle className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" style={{ color }} />
                )}
              </button>
              <h3 className={`text-sm font-semibold tracking-tight leading-tight transition-colors ${
                block.status === 'completed' ? 'text-slate-400 line-through' : 'text-white group-hover:text-indigo-100'
              }`}>
                {block.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium opacity-70" style={{ color }}>
                {block.startTime} - {block.duration}m
              </span>
              <div 
                {...attributes} 
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors pointer-events-auto"
              >
                <GripHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>
          {block.description && height > 60 && (
            <p className="text-xs text-slate-300 opacity-80 line-clamp-2 mt-1 ml-6">
              {block.description}
            </p>
          )}
        </div>
        
        {height >= 45 && (
          <div className="flex items-center gap-2 mt-auto ml-6">
            <div className="p-1.5 rounded-md bg-black/20 text-white/70" style={{ color }}>
              {getTypeIcon(block.type)}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/20" style={{ color }}>
              {block.priority}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
