'use client';

import { useState } from 'react';
import { publicFetch } from '@/lib/api';

/**
 * "Get featured" reel submission — renders ONLY when the instagram-reels
 * plugin has both campaign.enabled and campaign.allowSubmissions on (the
 * server component gates on the public API's meta). Every submission lands in
 * the brand's moderation queue as Pending; the endpoint is rate-limited
 * server-side, so this stays a thin form.
 */
export default function ReelSubmitForm() {
  const [url, setUrl] = useState('');
  const [handle, setHandle] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === 'sending') return;
    setState('sending');
    try {
      await publicFetch('/instagram-reels/submissions', {
        method: 'POST',
        body: JSON.stringify({ url: url.trim(), handle: handle.trim() || undefined }),
        headers: { 'Content-Type': 'application/json' },
        noSession: true,
        noStore: true,
      });
      setState('done');
    } catch (err) {
      setState('error');
      setMessage(
        err instanceof Error && err.message
          ? err.message
          : 'That link did not go through — copy it from the reel’s share menu and try again.',
      );
    }
  };

  if (state === 'done') {
    return (
      <p className="mx-auto mt-6 max-w-md text-center text-sm text-rose-deep">
        Sent for review ♥ — if it&apos;s a fit, you&apos;ll see it featured here.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-6 flex max-w-xl flex-col gap-2 sm:flex-row">
      <input
        type="url"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste your reel’s link"
        className="flex-1 rounded-full border border-border bg-background px-5 py-2.5 text-sm outline-none focus:border-rose-deep"
        aria-label="Your Instagram reel link"
      />
      <input
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="@your_handle (optional)"
        className="rounded-full border border-border bg-background px-5 py-2.5 text-sm outline-none focus:border-rose-deep sm:w-48"
        aria-label="Your Instagram handle (optional)"
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className="rounded-full bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-plum disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Submit'}
      </button>
      {state === 'error' && (
        <p className="w-full text-center text-xs text-destructive sm:text-left">{message}</p>
      )}
    </form>
  );
}
