import { useTranslation } from 'react-i18next';

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-xl font-semibold">{t('nav.dashboard')}</h1>
      <p className="mt-2 text-sm text-slate-400">{t('common.comingSoon')}</p>
    </div>
  );
}
