import React, { useState } from 'react';
import shippOceanBg from '@/assets/shipp-ocean.png';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onShowToast }) => {
  const [email, setEmail] = useState('admin@devifisheries.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onShowToast?.('Signed in successfully as Enterprise Administrator');
      onLogin();
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden selection:bg-[#00a7bc]/30 selection:text-white">
      {/* 1. Full-bleed Ocean Background from shipp-ocean.png */}
      <img
        src={shippOceanBg}
        alt="Calm ocean water background"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />

      {/* 2. Centered Sign in Dialog */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 flex items-center justify-center">
        {/* Centered Sign in Dialog */}
        <div className="w-full max-w-[440px] sm:max-w-[460px] bg-white rounded-[28px] shadow-[0_25px_80px_rgba(0,0,0,0.32)] border border-white/90 p-8 sm:p-10 md:p-12 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Sign in
            </h1>
            <p className="text-sm font-medium text-content-muted mt-1.5">
              Devi Fisheries Enterprise Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-content-main">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@devifisheries.com"
                startIcon={<Mail className="w-4 h-4 text-content-muted" />}
                autoComplete="email"
                inputSize="md"
                radius="pill"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-content-main">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                startIcon={<Lock className="w-4 h-4 text-content-muted" />}
                autoComplete="current-password"
                inputSize="md"
                radius="pill"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              variant="black"
              size="lg"
              type="submit"
              disabled={loading}
              className="w-full mt-2 font-bold cursor-pointer rounded-full h-12 text-sm shadow-[0_4px_16px_rgba(11,15,25,0.2)]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
