import { LogOut, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export function Topbar() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-surface-border px-5">
      <div className="flex w-full max-w-md items-center gap-2 rounded-md border border-surface-border bg-surface px-3 py-1.5 text-sm text-slate-400">
        <Search size={16} />
        <input
          type="search"
          placeholder={t('search.placeholder')}
          className="w-full bg-transparent outline-none placeholder:text-slate-500"
        />
      </div>
      <button
        type="button"
        onClick={() => void logout()}
        className="ml-auto flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
      >
        <LogOut size={16} />
        {t('common.logout')}
      </button>
    </header>
  );
}
