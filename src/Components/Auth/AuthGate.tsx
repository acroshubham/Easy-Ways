import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

interface FormState {
  name: string;
  email: string;
  password: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  password: ''
};

export const AuthGate = () => {
  const { signInWithEmail, signUpWithEmail, loginWithGoogle } = useUser();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      if (mode === 'signin') {
        await signInWithEmail({ email: form.email, password: form.password });
      } else {
        await signUpWithEmail({ name: form.name, email: form.email, password: form.password });
      }
      setForm(initialState);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setPending(false);
    }
  };

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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid gap-10 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Success Story</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white lg:text-5xl">
            Build atomic habits with a buddy who never lets you quit.
          </h1>
          <p className="mt-4 text-base text-slate-200 lg:text-lg">
            Sign in to sync your calendar, journals, motivation engine, and unlock the interactive buddy who keeps you accountable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/20 px-3 py-1">Calendar Guardians</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Journal Vault</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Buddy AI</span>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ translateY: -2 }}
          className="rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</p>
              <h2 className="text-2xl font-semibold text-white">
                {mode === 'signin' ? 'Sign in to continue' : 'Join Success Story'}
              </h2>
            </div>
            <button
              type="button"
              onClick={switchMode}
              className="text-sm font-semibold text-indigo-200 underline-offset-4 hover:underline"
            >
              {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm text-indigo-100">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
                  placeholder="e.g. Saiyan Hustler"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-indigo-100">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-indigo-100">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-2xl bg-red-500/20 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 text-lg font-semibold text-white shadow-lg transition hover:shadow-indigo-500/40 disabled:opacity-60"
          >
            {pending ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="mt-4 text-center text-xs text-slate-400">
            or
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={pending}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            <span className="text-lg">🔗</span>
            Login with Google
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            Protected by Supabase Auth • Encrypted sync • Cancel anytime
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};
