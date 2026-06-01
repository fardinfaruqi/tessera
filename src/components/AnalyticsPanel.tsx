import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import { analyticsData } from '../data/MockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}{entry.name === 'Focus Score' ? '%' : ' min'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPanel() {
  const avgFocus = Math.round(analyticsData.reduce((sum, d) => sum + d.focusScore, 0) / analyticsData.length);
  const totalTimeSaved = analyticsData.reduce((sum, d) => sum + d.timeSaved, 0);
  const totalTasksCompleted = analyticsData.reduce((sum, d) => sum + d.tasksCompleted, 0);

  const stats = [
    {
      label: 'Avg Focus Score',
      value: `${avgFocus}%`,
      icon: Zap,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
    },
    {
      label: 'Time Saved',
      value: `${totalTimeSaved}m`,
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Tasks Done',
      value: totalTasksCompleted.toString(),
      icon: CheckCircle2,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
    },
    {
      label: 'Productivity',
      value: '+18%',
      icon: TrendingUp,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-5 backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-slate-400 text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
            <p className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Score Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-200 mb-1 tracking-tight">Focus Score Tracker</h3>
          <p className="text-sm text-slate-500 mb-6">Daily cognitive performance this week</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="focusScore"
                name="Focus Score"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#focusGradient)"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Time Saved Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-200 mb-1 tracking-tight">Time Saved This Week</h3>
          <p className="text-sm text-slate-500 mb-6">Minutes recovered through AI realignment</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={1} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="timeSaved"
                name="Time Saved"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
