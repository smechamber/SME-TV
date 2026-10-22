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
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_85%_10%,#f6e6ef_0,transparent_36%),#f7f6f9] p-6">
      <form onSubmit={onSubmit} className="w-full max-w-[420px] rounded-lg border border-[#ebe8ef] bg-white p-6 shadow-[0_18px_55px_rgba(56,34,70,.07)] md:p-[42px]">
        <span className="text-[29px] font-black tracking-[-1.7px] text-[#d92867]">
          SME<span className="text-[#542c71]">TV</span>
        </span>
        <p className="mb-2 mt-6 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">CONTENT MANAGEMENT</p>
        <h1 className="text-[28px] font-bold tracking-[-.04em]">Welcome back</h1>
        <p className="mt-2 text-[13px] leading-6 text-[#777283]">
          Sign in with an administrator account to manage content across SME TV.
        </p>
        {notice && <div className="my-4 rounded bg-[#fff0f0] px-4 py-3 text-[13px] text-[#a33232]">{notice}</div>}
        <label className="mt-[18px] grid gap-2 text-xs font-bold text-[#504b5b]">
          Email address
          <input
            required
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          className="w-full rounded border border-[#dedbe3] p-3 text-[13px] outline-none focus:border-[#a35a83] focus:ring-4 focus:ring-[#d9286714]" />
        </label>
        <label className="mt-[18px] grid gap-2 text-xs font-bold text-[#504b5b]">
          Password
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
          className="w-full rounded border border-[#dedbe3] p-3 text-[13px] outline-none focus:border-[#a35a83] focus:ring-4 focus:ring-[#d9286714]" />
        </label>
        <button className="mt-[22px] w-full rounded bg-[#d92867] px-4 py-3 text-xs font-bold text-white hover:bg-[#b91e54]" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <span className="mt-[18px] block text-center text-[11px] text-[#777283]">
          Administrator access is managed by your platform administrator.
        </span>
      </form>
    </main>
  );
}
