import { useState, type FormEvent } from 'react';
import { LogOut, Menu, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/library?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header className="flex h-14 items-center gap-2 border-b border-surface-border px-3 sm:gap-3 sm:px-5">
      <button
        type="button"
        onClick={onMenuClick}
        className="shrink-0 text-slate-400 hover:text-slate-100 md:hidden"
        aria-label={t('common.menu')}
      >
        <Menu size={22} />
      </button>

      <form
        onSubmit={handleSubmit}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-surface-border bg-surface px-3 py-1.5 text-sm text-slate-400 sm:max-w-md sm:flex-initial"
      >
        <Search size={16} className="shrink-0" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-500"
        />
      </form>

      <button
        type="button"
        onClick={() => void logout()}
        className="ml-auto flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 sm:px-3"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">{t('common.logout')}</span>
      </button>
    </header>
  );
}
