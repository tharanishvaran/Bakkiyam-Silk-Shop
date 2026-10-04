import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { login } from '../../api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(username, password);
      localStorage.setItem('admin_token', token);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1c0e18 0%, #0d0810 60%, #060408 100%)',
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated ambient light orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.28, 0.15],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.35), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.12, 0.22, 0.12],
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,27,42,0.45), transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating subtle gold sparkles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ['0vh', '-100vh'],
              opacity: [0, 0.6, 0],
              scale: [0.6, 1.2, 0.6],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              left: `${15 + i * 14}%`,
              bottom: '-5%',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'var(--gold)',
              boxShadow: '0 0 10px var(--gold)',
            }}
          />
        ))}
      </div>

      {/* Login Card with Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'rgba(20, 14, 24, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 168, 76, 0.28)',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 5vw, 2.4rem)',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(201,168,76,0.08)',
          zIndex: 10,
        }}
      >
        {/* Animated Top Golden Silk Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #6B1B2A, #C9A84C, #E8D5A3, #3D1F5C, #C9A84C)',
            backgroundSize: '200% 100%',
            borderRadius: '16px 16px 0 0',
            animation: 'shimmer 4s ease-in-out infinite alternate',
          }}
        />

        {/* SINGLE, perfectly positioned Back to Website button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(201, 168, 76, 0.08)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: 'var(--gold)',
              fontSize: '0.78rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.18)';
              e.currentTarget.style.borderColor = 'var(--gold)';
              e.currentTarget.style.transform = 'translateX(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Website</span>
          </Link>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              color: 'rgba(245, 236, 215, 0.5)',
              letterSpacing: '0.04em',
            }}
          >
            <ShieldCheck size={13} style={{ color: 'var(--gold)' }} />
            <span>Secure Portal</span>
          </span>
        </div>

        {/* Logo with gentle floating animation */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-block' }}
          >
            <img
              src="/logo.png"
              alt="Bakkiyam Pattu Center"
              style={{
                height: '84px',
                margin: '0 auto',
                display: 'block',
                marginBottom: '0.75rem',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 16px rgba(201,168,76,0.3))',
              }}
            />
          </motion.div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 600,
              color: 'var(--dark-text)',
              marginBottom: '0.2rem',
              letterSpacing: '0.02em',
            }}
          >
            Admin Portal
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              color: 'var(--dark-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={12} style={{ color: 'var(--gold)' }} />
            <span>Bakkiyam Pattu Center, Rasipuram</span>
          </p>
        </div>

        {/* Subtle separator */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
            marginBottom: '1.5rem',
          }}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              padding: '0.75rem 0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
              color: '#FCA5A5',
              fontSize: '0.82rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label
              htmlFor="admin-username"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'rgba(245, 236, 215, 0.75)',
                marginBottom: '0.4rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gold)',
                  opacity: 0.7,
                }}
              />
              <input
                id="admin-username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--dark-text)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                  e.target.style.boxShadow = '0 0 15px rgba(201, 168, 76, 0.25)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(201, 168, 76, 0.25)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'rgba(245, 236, 215, 0.75)',
                marginBottom: '0.4rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gold)',
                  opacity: 0.7,
                }}
              />
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.8rem 0.75rem 2.6rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--dark-text)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                  e.target.style.boxShadow = '0 0 15px rgba(201, 168, 76, 0.25)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(201, 168, 76, 0.25)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(245, 236, 215, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245, 236, 215, 0.5)')}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              marginTop: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #E8D5A3 0%, #C9A84C 50%, #9B7B2C 100%)',
              color: '#0D0A0E',
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 18px rgba(201, 168, 76, 0.35)',
              transition: 'box-shadow 0.2s',
            }}
          >
            {loading ? (
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(13,10,14,0.3)',
                  borderTopColor: '#0D0A0E',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <Lock size={15} />
            )}
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
          </motion.button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              color: 'rgba(245, 236, 215, 0.4)',
              lineHeight: 1.5,
            }}
          >
            Bakkiyam Silk Sarees Management Portal
          </p>
        </div>
      </motion.div>
    </div>
  );
}
