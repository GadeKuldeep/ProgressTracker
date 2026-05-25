import { motion } from 'framer-motion';

const Analytics = ({ analytics }) => {
  const weeklyData = analytics?.weeklyHabitData || [];
  const heatmapData = analytics?.heatmapData || [];
  const overview = analytics?.overview || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="zen-card p-6 h-full flex flex-col justify-between"
      id="analytics-section"
    >
      {/* Background Watermark - Insight / Wisdom (知) */}
      <div className="zen-watermark font-serif">知</div>

      <div className="z-10 w-full">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-zen-800 uppercase tracking-widest font-serif">
            Weekly Insights
          </h2>
          <p className="text-[10px] text-zen-400 font-serif italic mt-0.5">
            洞察録 · Weekly consistency & focus patterns
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/45 backdrop-blur-md rounded-xl p-3 text-center border border-white/50 shadow-sm">
            <p className="text-xl font-light text-zen-850 font-sans">
              {overview.completedGoals || 0}
            </p>
            <p className="text-[9px] text-zen-500 font-bold uppercase tracking-widest mt-1">
              Goals Met
            </p>
          </div>
          <div className="bg-white/45 backdrop-blur-md rounded-xl p-3 text-center border border-white/50 shadow-sm">
            <p className="text-xl font-light text-zen-850 font-sans">
              {overview.weekPomodoros || 0}
            </p>
            <p className="text-[9px] text-zen-500 font-bold uppercase tracking-widest mt-1">
              Focus Ses.
            </p>
          </div>
          <div className="bg-white/45 backdrop-blur-md rounded-xl p-3 text-center border border-white/50 shadow-sm">
            <p className="text-xl font-light text-zen-850 font-sans">
              {overview.avgProgress || 0}%
            </p>
            <p className="text-[9px] text-zen-500 font-bold uppercase tracking-widest mt-1">
              Avg. Progress
            </p>
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="mb-6 bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm">
          <p className="text-[10px] text-zen-500 font-bold uppercase tracking-widest mb-3.5">
            Weekly Completion Rates
          </p>
          <div className="flex items-end gap-3 h-[95px] px-1">
            {weeklyData.length > 0 ? weeklyData.map((day, i) => (
              <div key={day.date} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip on Hover */}
                <span className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[9px] bg-[#1a1a1a] text-[#fafaf7] px-1.5 py-0.5 rounded shadow pointer-events-none transition-all z-20">
                  {day.percentage}%
                </span>
                
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, (day.percentage / 100) * 75)}px` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
                  className="w-full rounded-t-md cursor-pointer"
                  style={{
                    background: day.percentage > 0
                      ? 'linear-gradient(180deg, #c9a84c 0%, #c0392b 100%)' // Gold to Vermillion
                      : 'rgba(168, 159, 145, 0.15)'
                  }}
                />
                <p className="text-[9px] text-zen-500 font-semibold mt-2 uppercase font-sans">
                  {day.day}
                </p>
              </div>
            )) : (
              Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full h-1 rounded-t-md bg-zen-100" />
                  <p className="text-[9px] text-zen-300 mt-2 font-semibold">—</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Focus Heatmap */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm">
          <p className="text-[10px] text-zen-500 font-bold uppercase tracking-widest mb-3.5">
            Focus Intensity Map (30 Days)
          </p>
          <div className="flex flex-wrap gap-[4px] justify-center sm:justify-start">
            {heatmapData.length > 0 ? heatmapData.map((cell, i) => {
              const intensityColors = [
                'rgba(168, 159, 145, 0.12)', // level 0 - light stone gray
                'rgba(201, 168, 76, 0.3)',    // level 1 - light gold
                'rgba(201, 168, 76, 0.75)',   // level 2 - gold
                'rgba(192, 57, 43, 0.55)',    // level 3 - light vermillion
                'rgba(192, 57, 43, 0.95)'     // level 4 - deep vermillion
              ];
              return (
                <motion.div
                  key={cell.date}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.01 }}
                  className="w-[14px] h-[14px] rounded-[3px] shadow-sm hover:scale-110 transition-transform cursor-help"
                  style={{ backgroundColor: intensityColors[cell.intensity] }}
                  title={`${cell.date}: ${cell.intensity} Focus activities`}
                />
              );
            }) : (
              Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="w-[14px] h-[14px] rounded-[3px] bg-zen-100/50" />
              ))
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-[9px] text-zen-400 uppercase tracking-widest font-semibold">Stillness</span>
            {['rgba(168, 159, 145, 0.12)', 'rgba(201, 168, 76, 0.3)', 'rgba(201, 168, 76, 0.75)', 'rgba(192, 57, 43, 0.55)', 'rgba(192, 57, 43, 0.95)'].map((c, i) => (
              <div key={i} className="w-[11px] h-[11px] rounded-[2px] shadow-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[9px] text-zen-400 uppercase tracking-widest font-semibold">Intensity</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
