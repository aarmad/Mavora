import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, MessageCircle, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { servicesAPI } from '../services/api';
import { requestsAPI } from '../services/api';

interface Service {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  icon: string;
  minTier: 'basic' | 'premium' | 'vip';
  hasAccess: boolean;
  whatsappMessage?: string;
}

const TIER_ORDER = { basic: 0, premium: 1, vip: 2 };

const CATEGORIES = ['Tous', 'Hébergement', 'Transport', 'Événements', 'Gastronomie', 'Sécurité'];

export default function Services() {
  const { user } = useAuth();
  const [services,  setServices]  = useState<Service[]>([]);
  const [filter,    setFilter]    = useState('Tous');
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<Service | null>(null);
  const [toast,     setToast]     = useState('');

  useEffect(() => {
    servicesAPI.getAll()
      .then((r) => setServices(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleRequest = async (s: Service) => {
    try {
      await requestsAPI.create({
        subject: `Demande: ${s.name}`,
        message: `Je souhaite bénéficier du service "${s.name}".`,
        service: s._id,
      });
      showToast(`Demande envoyée pour "${s.name}"`);
      setSelected(null);
    } catch {
      showToast('Erreur lors de l\'envoi');
    }
  };

  const buildWhatsApp = (s: Service) => {
    const msg = s.whatsappMessage
      ?? `Bonjour Mavora, je suis ${user?.firstName} ${user?.lastName} (${user?.memberId}). Je souhaite bénéficier du service "${s.name}".`;
    return `https://wa.me/${import.meta.env['VITE_WHATSAPP'] || '22890000000'}?text=${encodeURIComponent(msg)}`;
  };

  const displayed = services.filter((s) =>
    filter === 'Tous' || s.category === filter
  );

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      <div className="page" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>Catalogue</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--white)', marginBottom: 8 }}>
            Nos Services Exclusifs
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 480 }}>
            Vos accès sont définis par votre niveau d'abonnement <strong style={{ color: 'var(--white)' }}>{user?.subscription?.toUpperCase()}</strong>.
          </p>
        </motion.div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '8px 18px',
                borderRadius: 99,
                border: `1px solid ${filter === c ? 'var(--gold)' : 'var(--border)'}`,
                background: filter === c ? 'var(--gold-glow)' : 'transparent',
                color: filter === c ? 'var(--gold)' : 'var(--muted)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {displayed.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card"
                style={{
                  opacity: s.hasAccess ? 1 : 0.5,
                  cursor: s.hasAccess ? 'pointer' : 'not-allowed',
                  position: 'relative',
                }}
                onClick={() => s.hasAccess && setSelected(s)}
              >
                {!s.hasAccess && (
                  <div style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'var(--black-mid)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--muted)',
                  }}>
                    <Lock size={11} />
                    {s.minTier === 'premium' ? 'Premium' : 'VIP'}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: s.hasAccess ? 'var(--gold-glow)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.category}</div>
                    <div style={{ fontSize: 16, fontFamily: 'var(--font-serif)', color: 'var(--white)', fontWeight: 600 }}>{s.name}</div>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
                  {s.shortDescription}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge ${TIER_ORDER[s.minTier] <= TIER_ORDER[user?.subscription as keyof typeof TIER_ORDER ?? 'basic'] ? 'badge-green' : 'badge-muted'}`}>
                    {s.hasAccess ? 'Accessible' : `Requiert ${s.minTier}`}
                  </span>
                  {s.hasAccess && (
                    <span style={{ fontSize: 12, color: 'var(--gold)' }}>Voir →</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Service detail modal */}
      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              background: 'var(--black-card)',
              border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px',
              width: '100%',
              maxWidth: 520,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, background: 'var(--gold-glow)',
                border: '1px solid var(--border-mid)', borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>
                {selected.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{selected.category}</div>
                <h2 style={{ fontSize: 22, color: 'var(--white)' }}>{selected.name}</h2>
              </div>
            </div>

            <p style={{ color: 'var(--white-dim)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {selected.description || selected.shortDescription}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={buildWhatsApp(selected)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <button
                className="btn btn-outline"
                onClick={() => handleRequest(selected)}
                style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
              >
                <ExternalLink size={15} /> Faire une demande
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setSelected(null)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className="toast success">{toast}</div>
        </div>
      )}
    </div>
  );
}
