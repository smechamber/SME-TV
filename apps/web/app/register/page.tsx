'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const r = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p.message ?? 'Unable to create account');
      const login = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const session = await login.json();
      if (!login.ok) throw new Error(session.message ?? 'Account created. Please sign in.');
      localStorage.setItem('smetv-user-token', session.data.token);
      setNotice('Your account is ready. Welcome to SME TV.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to create account');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="site-width auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">JOIN SME TV</span>
        <h1>Create an account</h1>
        <p>Save stories and manage your event participation.</p>
        <label>
          Your name
          <input
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
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
            minLength={10}
            maxLength={128}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small>Use at least 10 characters.</small>
        </label>
        {notice && (
          <p role="status" className="auth-notice">
            {notice}
          </p>
        )}
        <button className="primary-button" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'}
        </button>
        <p>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
