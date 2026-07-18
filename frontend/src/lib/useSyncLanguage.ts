import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiFetch } from './api';

export function useSyncLanguage(): void {
  const { i18n } = useTranslation();
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch<{ language: string }>('/settings'),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (settingsQuery.data && settingsQuery.data.language !== i18n.language) {
      void i18n.changeLanguage(settingsQuery.data.language);
    }
  }, [settingsQuery.data, i18n]);
}
