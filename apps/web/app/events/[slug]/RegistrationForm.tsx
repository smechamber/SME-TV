'use client';
import { FormEvent, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const fields = [
  ['name', 'Name'],
  ['designation', 'Designation'],
  ['companyName', 'Company name'],
  ['businessActivity', 'Business activity'],
  ['specificInterest', 'Specific interest'],
  ['email', 'Email'],
  ['mobile', 'Mobile number'],
  ['city', 'City'],
  ['state', 'State'],
] as const;
export default function RegistrationForm({ eventId }: { eventId: string }) {
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const body = { ...data, consent: new FormData(form).has('consent') };
    try {
      const response = await fetch(`${API}/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'Registration could not be completed');
      setNotice('Thank you. Your event interest has been registered.');
      form.reset();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Registration could not be completed');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="mt-8 max-w-[650px] border-t-2 border-[#d92867] bg-[#fffaf8] p-6 sm:p-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_p]:mt-2 [&_p]:text-xs [&_p]:text-[#6e6b7c] [&_label]:mt-4 [&_label]:grid [&_label]:gap-2 [&_label]:text-xs [&_label]:font-bold [&_input:not([type=checkbox])]:rounded [&_input:not([type=checkbox])]:border [&_input:not([type=checkbox])]:border-[#eeeaf0] [&_input:not([type=checkbox])]:px-3 [&_input:not([type=checkbox])]:py-3" onSubmit={submit}>
      <h2>Register your interest</h2>
      <p>Fields marked * are required.</p>
      {fields.map(([name, label]) => (
        <label key={name}>
          {label} *
          <input
            name={name}
            required
            type={name === 'email' ? 'email' : 'text'}
            autoComplete={name === 'email' ? 'email' : 'on'}
          />
        </label>
      ))}
      <label className="mt-4 flex items-start gap-3 text-xs font-normal leading-5">
        <input required type="checkbox" name="consent" /> I agree to be contacted about this event
        and accept the privacy notice.
      </label>
      {notice && (
        <p className={notice.startsWith('Thank') ? 'mt-4 text-sm font-semibold text-[#28744f]' : 'mt-4 text-sm font-semibold text-[#a33232]'} role="status">
          {notice}
        </p>
      )}
      <button className="mt-5 inline-flex items-center justify-center rounded bg-[#d92867] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b81d53] disabled:cursor-not-allowed disabled:opacity-60" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit registration ?'}
      </button>
    </form>
  );
}
