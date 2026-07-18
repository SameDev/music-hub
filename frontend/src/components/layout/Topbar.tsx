import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Topbar() {
  const { t } = useTranslation();

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
    </header>
  );
}
