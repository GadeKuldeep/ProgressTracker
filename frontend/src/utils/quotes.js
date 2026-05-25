const quotes = [
  "一期一会 — Every moment is once in a lifetime.",
  "七転び八起き — Fall seven times, stand up eight.",
  "継続は力なり — Continuity is power.",
  "石の上にも三年 — Persistence prevails.",
  "急がば回れ — Haste makes waste.",
  "花鳥風月 — Appreciate the beauty in nature.",
  "和 — Harmony above all.",
  "無為自然 — Act without forcing.",
  "侘寂 — Beauty in imperfection.",
  "初心忘るべからず — Never forget beginner's mind.",
  "明日は明日の風が吹く — Tomorrow brings new winds.",
  "静かな水は深い — Still water runs deep.",
  "少しずつ、前へ — Little by little, forward.",
  "心の平和 — Peace of mind.",
  "今を生きる — Live in the present."
];

export const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getDailyQuote = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
};

export default quotes;
