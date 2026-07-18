import { useTranslation } from 'react-i18next';

export function DownloadsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-xl font-semibold">{t('nav.downloads')}</h1>
      <p className="mt-2 text-sm text-slate-400">{t('common.comingSoon')}</p>
    </div>
  );
}
