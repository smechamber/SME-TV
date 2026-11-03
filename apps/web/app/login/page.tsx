'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const r = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p.message ?? 'Unable to sign in');
      localStorage.setItem('smetv-user-token', p.data.token);
      setNotice(`Welcome back, ${p.data.user.name}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto grid min-h-[62vh] w-full max-w-[1180px] place-items-center px-4 py-14 sm:px-6">
      <form className="w-full max-w-[440px] border border-[#eeeaf0] bg-white p-8 shadow-[0_12px_36px_#32203c0c] sm:p-9 [&_h1]:my-3 [&_h1]:text-3xl [&_h1]:font-black [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-6 [&_p]:text-[#6e6b7c] [&_label]:mt-4 [&_label]:grid [&_label]:gap-2 [&_label]:text-xs [&_label]:font-bold [&_input]:w-full [&_input]:rounded [&_input]:border [&_input]:border-[#eeeaf0] [&_input]:px-3 [&_input]:py-3 [&_small]:font-normal [&_small]:text-[#6e6b7c] [&_a]:font-semibold [&_a]:text-[#d92867] [&_button]:w-full" onSubmit={submit}>
        <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">SME TV ACCOUNT</span>
        <h1>Sign in</h1>
        <p>Sign in to manage your profile and event registrations.</p>
        <label>
          Email address
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {notice && (
          <p role="status" className="mt-4 rounded bg-[#f7f3f7] p-3 text-sm text-[#542c71]">
            {notice}
          </p>
        )}
        <button className="mt-4 inline-flex items-center justify-center gap-2 rounded bg-[#d92867] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b81d53] disabled:cursor-not-allowed disabled:opacity-60" disabled={busy}>
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
        <p>
          New to SME TV? <Link href="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
