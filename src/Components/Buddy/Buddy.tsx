import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { buddyOptions, type BuddyProfile, type BuddyVariant } from './buddyData';

interface BuddyProps {
  variant: BuddyVariant;
}

export const Buddy: React.FC<BuddyProps> = ({ variant }) => {
  const profile = useMemo(() => buddyOptions.find((option) => option.id === variant) ?? buddyOptions[0], [variant]);
  const [activeMessage, setActiveMessage] = useState(profile.defaultMessage);
  const [lastAction, setLastAction] = useState<string>('summon');

  const handleAction = (action: BuddyProfile['actions'][number]) => {
    setActiveMessage(action.message);
    setLastAction(action.id);
  };

  return (
    <motion.div
      drag
      dragElastic={0.12}
      dragMomentum={false}
      className="fixed bottom-28 right-6 z-50 cursor-grab select-none"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
    >
      <div className="w-72 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="text-5xl drop-shadow-sm">
            {profile.emoji}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Active Buddy
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {profile.name}
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">
              {profile.title}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50/80 p-3 text-sm text-slate-700 shadow-inner dark:bg-slate-800/70 dark:text-slate-100">
          {activeMessage}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {profile.actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-200 ${
                lastAction === action.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200'
                  : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-base">
                {action.icon}
              </span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
