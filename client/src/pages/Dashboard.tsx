import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CreditCard, Clock, CheckCircle, AlertCircle, Plus, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { requestsAPI, servicesAPI } from '../services/api';

interface Request {
  _id: string;
  subject: string;
  status: 'pending' | 'inprogress' | 'completed' | 'cancelled';
  service?: { name: string };
  createdAt: string;
}

const STATUS_META = {
  pending:    { label: 'En attente',  badge: 'badge-orange', icon: <Clock size={13} /> },
  inprogress: { label: 'En cours',    badge: 'badge-gold',   icon: <AlertCircle size={13} /> },
  completed:  { label: 'Complété',    badge: 'badge-green',  icon: <CheckCircle size={13} /> },
  cancelled:  { label: 'Annulé',      badge: 'badge-red',    icon: <AlertCircle size={13} /> },
};

const TIER_LABEL: Record<string, string> = {
  basic: 'Basic', premium: 'Premium', vip: 'VIP',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [requests,     setRequests]     = useState<Request[]>([]);
  const [serviceCount, setServiceCount] = useState(0);
  const [showForm,     setShowForm]     = useState(false);
  const [form,         setForm]         = useState({ subject: '', message: '' });
  const [submitting,   setSubmitting]   = useState(false);
  const [toast,        setToast]        = useState('');

  useEffect(() => {
    if (user?.status === 'active') {
      requestsAPI.getMy().then((r) => setRequests(r.data)).catch(() => {});
      servicesAPI.getAll().then((r) => setServiceCount(r.data.filter((s: any) => s.hasAccess).length)).catch(() => {});
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleRequest = async () => {
    if (!form.subject || !form.message) return;
    setSubmitting(true);
    try {
      const res = await requestsAPI.create(form);
      setRequests((p) => [res.data, ...p]);
      setForm({ subject: '', message: '' });
      setShowForm(false);
      showToast('Demande envoyée avec succès ✦');
    } catch {
      showToast('Erreur lors de l\'envoi');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  const isPending = user.status !== 'active';

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      <div className="page" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: 12 }}>Espace Membre</div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--white)', marginBottom: 4 }}>
                Bienvenue, <span style={{ fontStyle: 'italic' }}>{user.firstName}</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 15 }}>
                Membre {TIER_LABEL[user.subscription]} · {user.memberId}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/carte-vip" className="btn btn-outline" style={{ gap: 8 }}>
                <CreditCard size={15} /> Ma carte VIP
              </Link>
              {!isPending && (
                <button className="btn btn-gold" onClick={() => setShowForm(true)}>
                  <Plus size={15} /> Nouvelle demande
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pending warning */}
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              background: 'rgba(232,168,76,0.08)',
              border: '1px solid rgba(232,168,76,0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 28px',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <Clock size={22} style={{ color: 'var(--orange)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
                Votre compte est en cours de validation
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                Notre équipe examine votre demande. Vous recevrez une confirmation sous 48h.
                Pour toute urgence, contactez-nous sur WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/${import.meta.env['VITE_WHATSAPP'] || '22890000000'}?text=Bonjour, je suis ${user.firstName} ${user.lastName} (${user.memberId}). Mon compte est en attente de validation.`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ flexShrink: 0 }}
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </motion.div>
        )}

        {/* Stats grid */}
        {!isPending && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { label: 'Services accessibles', value: serviceCount, icon: '✦' },
              { label: 'Demandes totales',      value: requests.length, icon: '📋' },
              { label: 'En cours',              value: requests.filter((r) => r.status === 'inprogress').length, icon: '⏳' },
              { label: 'Complétées',            value: requests.filter((r) => r.status === 'completed').length, icon: '✅' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card"
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--white)', fontWeight: 600 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        {!isPending && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { to: '/services',  label: 'Nos Services',  desc: 'Explorez nos offres exclusives', icon: '🌟' },
              { to: '/carte-vip', label: 'Carte VIP',     desc: 'Votre identité membre digitale', icon: '💳' },
              { to: '/profil',    label: 'Mon Profil',    desc: 'Gérez vos informations',         icon: '👤' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{item.desc}</div>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--muted)' }} />
              </Link>
            ))}
          </div>
        )}

        {/* Recent requests */}
        {!isPending && requests.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, color: 'var(--white)' }}>Mes demandes récentes</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {requests.slice(0, 5).map((req) => {
                const meta = STATUS_META[req.status];
                return (
                  <div key={req._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, color: 'var(--white)', fontWeight: 500, marginBottom: 4 }}>
                        {req.subject}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {req.service?.name && `${req.service.name} · `}
                        {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <span className={`badge ${meta.badge}`} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* New request modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--black-card)',
              border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              width: '100%',
              maxWidth: 480,
            }}
          >
            <h2 style={{ fontSize: 22, color: 'var(--white)', marginBottom: 24 }}>Nouvelle demande</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label">Objet</label>
                <input className="input-field" placeholder="Ex: Réservation hôtel 2 nuits"
                  value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Message</label>
                <textarea className="input-field" placeholder="Décrivez votre demande en détail..."
                  rows={4} value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, justifyContent: 'center' }}>
                  Annuler
                </button>
                <button className="btn btn-gold" onClick={handleRequest} disabled={submitting || !form.subject || !form.message}
                  style={{ flex: 1, justifyContent: 'center' }}>
                  {submitting ? <div className="spinner" /> : 'Envoyer'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast success">{toast}</div>
        </div>
      )}
    </div>
  );
}
