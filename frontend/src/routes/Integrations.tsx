import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Trash2, Webhook as WebhookIcon } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

const WEBHOOK_EVENTS = ['download.completed', 'download.failed'] as const;

interface Webhook {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
}

export function IntegrationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>([...WEBHOOK_EVENTS]);
  const [formError, setFormError] = useState<string | null>(null);

  const webhooksQuery = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => apiFetch<Webhook[]>('/integrations/webhooks'),
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ['webhooks'] });

  const create = useMutation({
    mutationFn: () =>
      apiFetch<Webhook>('/integrations/webhooks', { method: 'POST', body: JSON.stringify({ url, events }) }),
    onSuccess: () => {
      setUrl('');
      setFormError(null);
      invalidate();
      toast.success(t('toast.webhookCreated'));
    },
    onError: (error: Error) => setFormError(error.message),
  });

  const toggleEnabled = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      apiFetch<Webhook>(`/integrations/webhooks/${id}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
    onSuccess: invalidate,
    onError: () => toast.error(t('toast.webhookUpdateError')),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/integrations/webhooks/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      invalidate();
      toast.success(t('toast.webhookDeleted'));
    },
    onError: () => toast.error(t('toast.webhookDeleteError')),
  });

  function toggleEvent(event: string) {
    setEvents((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (url.trim() && events.length > 0) create.mutate();
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">{t('nav.integrations')}</h1>
      <p className="mb-6 max-w-xl text-sm text-slate-400">{t('integrations.description')}</p>

      <form onSubmit={handleSubmit} className="mb-6 max-w-xl rounded-lg border border-surface-border bg-surface-raised p-4">
        <label className="mb-1 block text-sm text-slate-400" htmlFor="webhookUrl">
          {t('integrations.url')}
        </label>
        <input
          id="webhookUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/webhook"
          className="mb-3 w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent"
        />

        <div className="mb-3 flex gap-4 text-sm text-slate-300">
          {WEBHOOK_EVENTS.map((event) => (
            <label key={event} className="flex items-center gap-2">
              <input type="checkbox" checked={events.includes(event)} onChange={() => toggleEvent(event)} />
              {event}
            </label>
          ))}
        </div>

        {formError && <p className="mb-3 text-sm text-red-400">{formError}</p>}

        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {t('integrations.add')}
        </button>
      </form>

      {webhooksQuery.data && webhooksQuery.data.length === 0 && (
        <p className="text-sm text-slate-500">{t('integrations.empty')}</p>
      )}

      <div className="flex max-w-xl flex-col gap-2">
        {webhooksQuery.data?.map((webhook) => (
          <div
            key={webhook.id}
            className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-raised p-3"
          >
            <div className="flex items-center gap-3">
              <WebhookIcon size={16} className="text-accent-hover" />
              <div>
                <div className="text-sm text-slate-100">{webhook.url}</div>
                <div className="text-xs text-slate-500">{webhook.events.join(', ')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={webhook.enabled}
                  onChange={() => toggleEnabled.mutate({ id: webhook.id, enabled: !webhook.enabled })}
                />
                {t('integrations.enabled')}
              </label>
              <button type="button" onClick={() => remove.mutate(webhook.id)} className="text-slate-400 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
