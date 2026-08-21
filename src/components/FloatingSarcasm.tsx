import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MEMES = [
  { text: "This shelf just judged your old decor.", emoji: "👀" },
  { text: "Not mass-produced. Mass-approved by your future self.", emoji: "🔥" },
  { text: "Printed layer by layer. Just like your personality.", emoji: "🧠" },
  { text: "Your desk called. It wants better friends.", emoji: "📞" },
  { text: "Factory made is for people who fear uniqueness.", emoji: "🏭" },
  { text: "One of one. Zero of boring.", emoji: "✨" },
  { text: "Scroll slower. These prints deserve respect.", emoji: "🙏" },
  { text: "Warning: may cause sudden shelf upgrades.", emoji: "⚠️" },
  { text: "Hand-finished. Ego-finished.", emoji: "💅" },
  { text: "Buy it before your shelf starts complaining again.", emoji: "😤" },
  { text: "This is what 'main character energy' looks like in plastic.", emoji: "👑" },
  { text: "Mass production called. We left it on read.", emoji: "📵" },
];

/** Floating sarcastic meme quotes that cycle as you browse. Pure UI. */
export default function FloatingSarcasm() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MEMES.length);
        setVisible(true);
      }, 400);
    }, 5200);
    return () => clearInterval(cycle);
  }, []);

  const meme = MEMES[index];

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 px-4">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-md items-center gap-2 rounded-full border border-ink-900/10 bg-ink-900/90 px-4 py-2.5 text-sm text-white shadow-soft backdrop-blur-xl"
          >
            <span className="text-base">{meme.emoji}</span>
            <span className="font-medium leading-snug">{meme.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
