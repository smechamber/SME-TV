'use client';

import type { FormEvent } from 'react';

type AdminLoginProps = {
  email: string;
  password: string;
  busy: boolean;
  notice: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

export default function AdminLogin({
  email,
  password,
  busy,
  notice,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginProps) {
  return (
    <main className="admin-login">
      <form onSubmit={onSubmit} className="login-card">
        <span className="admin-logo">
          SME<span>TV</span>
        </span>
        <p className="admin-kicker">CONTENT MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="admin-muted">
          Sign in with an administrator account to manage content across SME TV.
        </p>
        {notice && <div className="admin-notice error">{notice}</div>}
        <label>
          Email address
          <input
            required
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
          />
        </label>
        <button className="admin-button" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <span className="login-footnote">
          Administrator access is managed by your platform administrator.
        </span>
      </form>
    </main>
  );
}
