import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PlayerBar } from './Player';
import { useSyncLanguage } from '../../lib/useSyncLanguage';

export function AppLayout() {
  useSyncLanguage();

  return (
    <div className="flex h-screen bg-surface text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <PlayerBar />
      </div>
    </div>
  );
}
