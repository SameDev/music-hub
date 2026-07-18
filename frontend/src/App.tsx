import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './routes/Dashboard';
import { LibraryPage } from './routes/Library';
import { DownloadsPage } from './routes/Downloads';
import { SettingsPage } from './routes/Settings';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="downloads" element={<DownloadsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
