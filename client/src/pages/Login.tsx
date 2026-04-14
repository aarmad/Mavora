import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Redirect if already logged in
  if (user) {
    navigate(user.isAdmin ? '/admin' : '/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <Link to="/" style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.06em' }}>
          MAVORA
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginLeft: 8, verticalAlign: 'middle' }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', marginTop: 4 }}>
          CONCIERGERIE PRIVÉE
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--black-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <div className="divider" />
          <h1 style={{ fontSize: 28, color: 'var(--white)', marginTop: 16, marginBottom: 8 }}>
            Connexion
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            Accédez à votre espace membre privé.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(207,102,121,0.1)',
            border: '1px solid rgba(207,102,121,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: 14,
            color: 'var(--red)',
            marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="input-label">Adresse email</label>
            <input
              type="email"
              className="input-field"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="input-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  padding: 4,
                  display: 'flex',
                }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px' }}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <>Se connecter <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          Pas encore membre ?{' '}
          <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 500 }}>
            Demander l'accès
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
