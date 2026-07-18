import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      setError(t('auth.loginError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-surface">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-surface-border bg-surface-raised p-8"
      >
        <h1 className="mb-1 text-xl font-semibold text-slate-100">MusicHub</h1>
        <p className="mb-6 text-sm text-slate-400">{t('auth.loginSubtitle')}</p>

        <label className="mb-1 block text-sm text-slate-400" htmlFor="email">
          {t('auth.email')}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent"
        />

        <label className="mb-1 block text-sm text-slate-400" htmlFor="password">
          {t('auth.password')}
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
        </button>
      </form>
    </div>
  );
}
