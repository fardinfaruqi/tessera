import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, X, ChevronRight } from 'lucide-react';

interface MendBannerProps {
  conflicts: string[];
  onMend: () => void;
  isMending: boolean;
  mendResult: string | null;
  onDismissResult: () => void;
}

export default function MendBanner({
  conflicts,
  onMend,
  isMending,
  mendResult,
  onDismissResult,
}: MendBannerProps) {
  const [showConflicts, setShowConflicts] = useState(false);

  return (
    <div className="space-y-3">
      {/* Conflict Warning Banner */}
      <AnimatePresence>
        {conflicts.length > 0 && !mendResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-200">
                    {conflicts.length} Schedule Conflict{conflicts.length > 1 ? 's' : ''} Detected
                  </p>
                  <p className="text-xs text-amber-300/60 mt-0.5">
                    Tessera AI can resolve these automatically
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConflicts(!showConflicts)}
                  className="text-xs text-amber-400/80 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-500/10"
                >
                  {showConflicts ? 'Hide' : 'View'} Details
                </button>
                <motion.button
                  onClick={onMend}
                  disabled={isMending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-70 transition-all"
                >
                  {isMending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      <span>Realigning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Trigger Tessera Shift</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Conflict Details */}
            <AnimatePresence>
              {showConflicts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-1.5">
                    {conflicts.map((conflict, i) => (
                      <p key={i} className="text-xs text-amber-300/70 pl-1">
                        {conflict}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Result Banner */}
      <AnimatePresence>
        {mendResult && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-200">Schedule Optimized</p>
                  <p className="text-xs text-emerald-300/70 mt-1 leading-relaxed">{mendResult}</p>
                </div>
              </div>
              <button
                onClick={onDismissResult}
                className="text-emerald-400/50 hover:text-emerald-300 transition-colors p-1 rounded-lg hover:bg-emerald-500/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
