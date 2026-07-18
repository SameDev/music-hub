import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Library, Download, Settings, ListMusic, History, Webhook, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/library', labelKey: 'nav.library', icon: Library },
  { to: '/playlists', labelKey: 'nav.playlists', icon: ListMusic },
  { to: '/history', labelKey: 'nav.history', icon: History },
  { to: '/downloads', labelKey: 'nav.downloads', icon: Download },
  { to: '/integrations', labelKey: 'nav.integrations', icon: Webhook },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-surface-border bg-surface-raised transition-transform duration-200 ease-out md:static md:z-auto md:w-56 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="text-lg font-semibold tracking-tight">MusicHub</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 md:hidden"
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent-hover'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`
              }
            >
              <Icon size={18} />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
