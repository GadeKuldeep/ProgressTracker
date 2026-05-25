import { motion } from 'framer-motion';

const Analytics = ({ analytics }) => {
  const weeklyData = analytics?.weeklyHabitData || [];
  const heatmapData = analytics?.heatmapData || [];
  const overview = analytics?.overview || {};

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: 'easeOut'
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="zen-card p-6 h-full flex flex-col justify-between min-h-[440px]"
      id="analytics-section"
    >
      {/* Background Watermark - Insight / Wisdom (知) */}
      <div className="zen-watermark font-serif">知</div>

      <div className="z-10 w-full flex-1 flex flex-col justify-between">
        <div>
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
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { val: overview.completedGoals || 0, label: 'Goals Met' },
              { val: overview.weekPomodoros || 0, label: 'Focus Ses.' },
              { val: `${overview.avgProgress || 0}%`, label: 'Avg. Progress' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white/45 backdrop-blur-md rounded-xl p-3 text-center border border-white/60 shadow-sm relative overflow-hidden group hover:border-[#c9a84c]/50 transition-colors"
              >
                {/* Thin gold decorative line at the top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xl font-light text-zen-850 font-sans tracking-wide">
                  {stat.val}
                </p>
                <p className="text-[9px] text-zen-500 font-bold uppercase tracking-widest mt-1.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Weekly bar chart */}
          <div className="mb-5 bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm">
            <p className="text-[10px] text-zen-500 font-bold uppercase tracking-widest mb-4">
              Weekly Completion Rates
            </p>
            <div className="flex items-end gap-3.5 h-[95px] px-1">
              {weeklyData.length > 0 ? (
                weeklyData.map((day, i) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip on Hover */}
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 text-[9px] font-sans font-bold bg-[#1a1a1a] text-[#fafaf7] px-2 py-0.5 rounded shadow-md pointer-events-none transition-all duration-200 z-20 whitespace-nowrap">
                      {day.percentage}% completed
                    </span>
                    
                    <div className="w-full bg-zen-100/30 rounded-full h-[75px] flex items-end overflow-hidden border border-white/20">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${day.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
                        className="w-full rounded-full cursor-pointer"
                        style={{
                          background: day.percentage > 0
                            ? 'linear-gradient(180deg, #c9a84c 0%, #c0392b 100%)' // Gold to Vermillion
                            : 'rgba(168, 159, 145, 0.15)'
                        }}
                      />
                    </div>
                    <p className="text-[9px] text-zen-500 font-semibold mt-2.5 uppercase font-sans">
                      {day.day}
                    </p>
                  </div>
                ))
              ) : (
                Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-2 bg-zen-100/30 rounded-full" />
                    <p className="text-[9px] text-zen-350 mt-2 font-semibold font-sans">—</p>
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
            <div className="flex flex-wrap gap-[5px] justify-center sm:justify-start">
              {heatmapData.length > 0 ? (
                heatmapData.map((cell, i) => {
                  const intensityColors = [
                    'rgba(168, 159, 145, 0.12)', // level 0
                    'rgba(201, 168, 76, 0.3)',    // level 1
                    'rgba(201, 168, 76, 0.75)',   // level 2
                    'rgba(192, 57, 43, 0.55)',    // level 3
                    'rgba(192, 57, 43, 0.95)'     // level 4
                  ];
                  return (
                    <motion.div
                      key={cell.date}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.01 }}
                      className="w-[14px] h-[14px] rounded-[4px] shadow-sm hover:scale-115 hover:shadow-md transition-transform cursor-help border border-white/25"
                      style={{ backgroundColor: intensityColors[cell.intensity] }}
                      title={`${cell.date}: ${cell.intensity} Focus activities`}
                    />
                  );
                })
              ) : (
                Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className="w-[14px] h-[14px] rounded-[4px] bg-zen-100/50 border border-white/15" />
                ))
              )}
            </div>
            <div className="flex items-center gap-2 mt-4 justify-end">
              <span className="text-[9px] text-zen-450 uppercase tracking-widest font-semibold font-sans">Stillness</span>
              {['rgba(168, 159, 145, 0.12)', 'rgba(201, 168, 76, 0.3)', 'rgba(201, 168, 76, 0.75)', 'rgba(192, 57, 43, 0.55)', 'rgba(192, 57, 43, 0.95)'].map((c, i) => (
                <div key={i} className="w-[10px] h-[10px] rounded-[3px] shadow-sm border border-white/10" style={{ backgroundColor: c }} />
              ))}
              <span className="text-[9px] text-zen-450 uppercase tracking-widest font-semibold font-sans">Intensity</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
