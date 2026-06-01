import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Activity, Settings, Zap } from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import TesseraTimeline from './TesseraTimeline';
import TaskInbox from './TaskInbox';
import MendBanner from './MendBanner';
import AnalyticsPanel from './AnalyticsPanel';
import { initialBlocks, pendingTasks, conflictWarnings } from '../data/MockData';
import { mendSchedule } from '../utils/mendEngine';
import type { TesseraBlock } from '../types';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'analytics'>('timeline');
  const [tasks, setTasks] = useState<TesseraBlock[]>([...initialBlocks, ...pendingTasks]);
  const [conflicts, setConflicts] = useState(conflictWarnings);
  const [isMending, setIsMending] = useState(false);
  const [mendResultMsg, setMendResultMsg] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleMend = () => {
    setIsMending(true);
    setTimeout(() => {
      const result = mendSchedule(tasks);
      setTasks(result.updatedBlocks);
      setConflicts([]);
      setMendResultMsg(result.message);
      setIsMending(false);
    }, 1500);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
      }
      return t;
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    setTasks((items) => {
      const activeIndex = items.findIndex(t => t.id === active.id);
      const activeTask = items[activeIndex];
      
      // If dropped on the Timeline Droppable
      if (over.id === 'timeline-droppable') {
        const PIXELS_PER_MINUTE = 3.0; // Must match TesseraTimeline
        const START_HOUR = 9; // 09:00
        
        // Calculate where it was dropped relative to the timeline container
        // active.rect.current.translated is where the item is floating
        // over.rect is the bounding box of the timeline droppable
        const timelineTop = over.rect.top;
        const dropTop = active.rect.current.translated?.top ?? over.rect.top;
        
        let relativeY = dropTop - timelineTop;
        if (relativeY < 0) relativeY = 0; // Don't allow before 9am

        const totalMinutes = Math.round(relativeY / PIXELS_PER_MINUTE);
        // Snap to nearest 15 minutes
        const snappedMinutes = Math.round(totalMinutes / 15) * 15;
        
        const absoluteMinutes = (START_HOUR * 60) + snappedMinutes;
        const hours = Math.floor(absoluteMinutes / 60);
        const mins = absoluteMinutes % 60;
        const startTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

        return items.map(t => {
          if (t.id === active.id) {
            return { ...t, status: 'scheduled', startTime };
          }
          return t;
        });
      }
      
      // If dropped in the Inbox Sortable area
      if (over.id === 'inbox-droppable' || items.find(t => t.id === over.id && t.status === 'pending')) {
        let newItems = [...items];
        
        // Mark as pending and remove startTime
        newItems[activeIndex] = { 
          ...activeTask, 
          status: 'pending', 
          startTime: undefined 
        };

        // If dropping onto another inbox item, reorder
        if (over.id !== 'inbox-droppable') {
          const overIndex = items.findIndex(t => t.id === over.id);
          if (activeIndex !== overIndex) {
            newItems = arrayMove(newItems, activeIndex, overIndex);
          }
        }
        
        return newItems;
      }

      return items;
    });
  };

  const activeTask = useMemo(() => tasks.find(t => t.id === activeId), [activeId, tasks]);
  const pendingTasksFiltered = tasks.filter(t => t.status === 'pending');
  const completedTasksFiltered = tasks.filter(t => t.status === 'completed');

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-slate-950 flex overflow-hidden font-sans">
        {/* Sidebar Navigation */}
        <nav className="w-20 lg:w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between hidden md:flex">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10 text-indigo-400">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden lg:block text-white">Tessera</span>
            </div>

            <div className="space-y-2">
              <NavItem 
                icon={<Calendar className="w-5 h-5" />} 
                label="Timeline" 
                active={activeTab === 'timeline'} 
                onClick={() => setActiveTab('timeline')}
              />
              <NavItem 
                icon={<Activity className="w-5 h-5" />} 
                label="Analytics" 
                active={activeTab === 'analytics'} 
                onClick={() => setActiveTab('analytics')}
              />
              <NavItem 
                icon={<LayoutDashboard className="w-5 h-5" />} 
                label="Projects" 
              />
            </div>
          </div>

          <div className="p-6">
            <NavItem 
              icon={<Settings className="w-5 h-5" />} 
              label="Settings" 
            />
            <div className="mt-6 flex items-center gap-3 pt-6 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                FF
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-slate-200">Fardin Faruqi</p>
                <p className="text-xs text-slate-500">Pro Plan</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-20 flex-shrink-0">
            <div className="max-w-7xl mx-auto">
              <MendBanner 
                conflicts={conflicts} 
                onMend={handleMend} 
                isMending={isMending}
                mendResult={mendResultMsg}
                onDismissResult={() => setMendResultMsg(null)}
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="absolute inset-0 max-w-7xl mx-auto p-6 h-full">
              {activeTab === 'timeline' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col lg:flex-row gap-6"
                >
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
                    <TesseraTimeline blocks={tasks} onToggleComplete={toggleComplete} />
                  </div>
                  
                  <div className="w-full lg:w-96 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 lg:h-full h-[500px]">
                    <TaskInbox tasks={pendingTasksFiltered} completedTasks={completedTasksFiltered} onToggleComplete={toggleComplete} />
                  </div>
                </motion.div>
              ) : (
                <AnalyticsPanel />
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Drag Overlay for smooth dragging visuals */}
      <DragOverlay>
        {activeTask ? (
          <div className="p-3 bg-slate-800 border border-indigo-500/50 rounded-xl shadow-2xl opacity-90 scale-105 cursor-grabbing">
            <h3 className="text-sm font-semibold text-white">{activeTask.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{activeTask.duration}m • {activeTask.priority}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
      }`}
    >
      {icon}
      <span className="font-medium hidden lg:block tracking-wide text-sm">{label}</span>
    </button>
  );
}
