import { useTranslation } from 'react-i18next';

export function LibraryPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-xl font-semibold">{t('nav.library')}</h1>
      <p className="mt-2 text-sm text-slate-400">{t('common.comingSoon')}</p>
    </div>
  );
}
