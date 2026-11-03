import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useBrand();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-black text-xl leading-none"
        >
          ✕
        </button>

        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono uppercase tracking-widest text-neutral-600">
            <span>EMBLEM SESSION</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            {isRegisterMode ? 'Create Designer Account' : 'Sign in to Studio'}
          </h2>
          <p className="text-xs text-neutral-500">
            {isRegisterMode
              ? 'Save your Brand DNA architectures and generated vector suites.'
              : 'Access your persistent brand identities and exported kits.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="director@studio.design"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegisterMode ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            className="text-neutral-500 hover:text-black font-medium"
          >
            {isRegisterMode ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

