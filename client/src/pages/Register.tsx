import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Key, Users, FileText } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterPayload } from '../services/api';

type Method = 'invitation' | 'recommendation' | 'request';

const METHODS: { id: Method; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'invitation',     label: 'Code d\'invitation', desc: 'Vous avez reçu un code d\'accès',    icon: <Key size={20} /> },
  { id: 'recommendation', label: 'Recommandation',     desc: 'Un membre vous recommande',           icon: <Users size={20} /> },
  { id: 'request',        label: 'Demande libre',      desc: 'Soumettez votre candidature',         icon: <FileText size={20} /> },
];

export default function Register() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [step,   setStep]   = useState<1 | 2>(1);
  const [method, setMethod] = useState<Method | null>(null);
  const [form,   setForm]   = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
    inviteCode: '', recommendedBy: '', requestMessage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!method) return;
    setError('');
    setLoading(true);
    try {
      const payload: RegisterPayload = {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        password:  form.password,
        phone:     form.phone,
        registrationMethod: method,
        ...(method === 'invitation'     && { inviteCode: form.inviteCode }),
        ...(method === 'recommendation' && { recommendedBy: form.recommendedBy }),
        ...(method === 'request'        && { requestMessage: form.requestMessage }),
      };
      const res = await authAPI.register(payload);
      setAuth(res.data.token, res.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur lors de l\'inscription');
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
      <Link to="/" style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.06em' }}>
          MAVORA
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginLeft: 8, verticalAlign: 'middle' }} />
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--black-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
        }}
      >
        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: s <= step ? 'var(--gold)' : 'var(--black-mid)',
                border: `1px solid ${s <= step ? 'var(--gold)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: s <= step ? 'var(--black)' : 'var(--muted)',
              }}>
                {s}
              </div>
              <span style={{ fontSize: 12, color: s === step ? 'var(--white)' : 'var(--muted)' }}>
                {s === 1 ? 'Méthode' : 'Informations'}
              </span>
              {s < 2 && <div style={{ width: 24, height: 1, background: step > s ? 'var(--gold)' : 'var(--border)' }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="divider" />
              <h1 style={{ fontSize: 26, color: 'var(--white)', marginTop: 16, marginBottom: 8 }}>
                Comment rejoindre ?
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>
                Choisissez votre méthode d'accès à Mavora.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '18px 20px',
                      background: method === m.id ? 'var(--gold-glow)' : 'var(--black-mid)',
                      border: `1px solid ${method === m.id ? 'var(--gold)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition)',
                      width: '100%',
                    }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-sm)',
                      background: method === m.id ? 'rgba(201,168,76,0.2)' : 'var(--black-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: method === m.id ? 'var(--gold)' : 'var(--muted)',
                      flexShrink: 0,
                    }}>
                      {m.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: method === m.id ? 'var(--white)' : 'var(--white-dim)', marginBottom: 2 }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="btn btn-gold"
                disabled={!method}
                onClick={() => setStep(2)}
                style={{ width: '100%', justifyContent: 'center', marginTop: 28, padding: '14px' }}
              >
                Continuer <ArrowRight size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                ← Retour
              </button>

              <div className="divider" />
              <h1 style={{ fontSize: 26, color: 'var(--white)', marginTop: 16, marginBottom: 24 }}>
                Vos informations
              </h1>

              {error && (
                <div style={{
                  background: 'rgba(207,102,121,0.1)',
                  border: '1px solid rgba(207,102,121,0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  fontSize: 14,
                  color: 'var(--red)',
                  marginBottom: 20,
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Prénom</label>
                    <input className="input-field" placeholder="Jean" value={form.firstName}
                      onChange={(e) => set('firstName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Nom</label>
                    <input className="input-field" placeholder="Dupont" value={form.lastName}
                      onChange={(e) => set('lastName', e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="input-label">Email</label>
                  <input type="email" className="input-field" placeholder="votre@email.com"
                    value={form.email} onChange={(e) => set('email', e.target.value)} required />
                </div>

                <div>
                  <label className="input-label">Téléphone</label>
                  <input type="tel" className="input-field" placeholder="+228 90 00 00 00"
                    value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Mot de passe</label>
                  <input type="password" className="input-field" placeholder="Minimum 8 caractères"
                    value={form.password} onChange={(e) => set('password', e.target.value)}
                    required minLength={8} />
                </div>

                {/* Method-specific fields */}
                {method === 'invitation' && (
                  <div>
                    <label className="input-label">Code d'invitation</label>
                    <input className="input-field" placeholder="XXXXXXXX" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}
                      value={form.inviteCode} onChange={(e) => set('inviteCode', e.target.value.toUpperCase())} required />
                  </div>
                )}
                {method === 'recommendation' && (
                  <div>
                    <label className="input-label">Recommandé par (nom du membre)</label>
                    <input className="input-field" placeholder="Nom ou ID du membre"
                      value={form.recommendedBy} onChange={(e) => set('recommendedBy', e.target.value)} required />
                  </div>
                )}
                {method === 'request' && (
                  <div>
                    <label className="input-label">Message de candidature</label>
                    <textarea
                      className="input-field"
                      placeholder="Présentez-vous et expliquez pourquoi vous souhaitez rejoindre Mavora..."
                      value={form.requestMessage}
                      onChange={(e) => set('requestMessage', e.target.value)}
                      rows={4}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                )}

                {method === 'request' && (
                  <div style={{
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px',
                    fontSize: 13,
                    color: 'var(--muted)',
                  }}>
                    ℹ️ Votre demande sera examinée par notre équipe sous 48h.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-gold"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }}
                >
                  {loading ? <div className="spinner" /> : <>Créer mon compte <ArrowRight size={16} /></>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          Déjà membre ?{' '}
          <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 500 }}>Se connecter</Link>
        </div>
      </motion.div>
    </div>
  );
}
