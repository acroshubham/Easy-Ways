import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

interface LogoutScreenProps {
  onReturn: () => void;
}

export const LogoutScreen: React.FC<LogoutScreenProps> = ({ onReturn }) => {
  const { loginWithGoogle } = useUser();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setPending(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-16 text-white">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.5em] text-indigo-200">Success Story</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Logged out, not defeated.
          </h1>
          <p className="mt-4 text-base text-slate-200 sm:text-lg">
            Take a breath, then jump back in. Your calendar, journal, and buddy are waiting to keep your streak unbreakable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl"
        >
          <div className="space-y-4">
            <button
              type="button"
              onClick={onReturn}
              className="w-full rounded-2xl bg-white text-base font-semibold text-slate-900 py-3 shadow-lg transition hover:bg-slate-100"
            >
              Sign In / Sign Up
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={pending}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/5 py-3 text-base font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
            >
              <span className="text-lg">⚡</span>
              {pending ? 'Connecting…' : 'Login with Google'}
            </button>
            {error && (
              <p className="rounded-2xl bg-red-500/20 px-4 py-3 text-sm text-red-100">{error}</p>
            )}
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60">
            Your data stays protected on Supabase
          </p>
        </motion.div>
      </div>
    </div>
  );
};
