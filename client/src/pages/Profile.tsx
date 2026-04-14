import { motion } from 'framer-motion';
import { User, Mail, Phone, CreditCard, Calendar, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const contactWhatsApp = () => {
    const msg = `Bonjour Mavora, je suis ${user.firstName} ${user.lastName} (${user.memberId}). Je souhaite modifier mon profil.`;
    window.open(`https://wa.me/${import.meta.env['VITE_WHATSAPP'] || '22890000000'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const tierColors: Record<string, string> = {
    basic: 'var(--white-dim)', premium: 'var(--gold)', vip: 'var(--gold-light)',
  };
  const tierColor = tierColors[user.subscription] ?? 'var(--white-dim)';

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      <div className="page" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>Mon compte</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--white)', marginBottom: 8 }}>
            Mon Profil
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 40 }}>
            Vos informations personnelles et statut de membership.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 860 }}>
          {/* Avatar + membership */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 32px' }}
          >
            <div style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${tierColor}33 0%, ${tierColor}66 100%)`,
              border: `2px solid ${tierColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              color: tierColor,
              marginBottom: 20,
            }}>
              {user.firstName[0]}{user.lastName[0]}
            </div>

            <h2 style={{ fontSize: 22, color: 'var(--white)', marginBottom: 4 }}>
              {user.firstName} {user.lastName}
            </h2>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
              {user.email}
            </div>

            <div style={{
              padding: '10px 20px',
              background: `${tierColor}18`,
              border: `1px solid ${tierColor}44`,
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: tierColor,
              marginBottom: 24,
            }}>
              ✦ {user.subscription.toUpperCase()} MEMBER
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 24 }}>
              {user.memberId}
            </div>

            <span className={`badge ${user.status === 'active' ? 'badge-green' : 'badge-orange'}`} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {user.status === 'active'
                ? <><svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg> Actif</>
                : <><svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg> En attente</>
              }
            </span>
          </motion.div>

          {/* Info fields */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="card"
          >
            <h3 style={{ fontSize: 17, color: 'var(--white)', marginBottom: 24, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Informations personnelles
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: <User size={16} />,     label: 'Prénom',      value: user.firstName },
                { icon: <User size={16} />,     label: 'Nom',         value: user.lastName },
                { icon: <Mail size={16} />,     label: 'Email',       value: user.email },
                { icon: <Phone size={16} />,    label: 'Téléphone',   value: user.phone ?? 'Non renseigné' },
                { icon: <CreditCard size={16} />, label: 'ID Membre', value: user.memberId },
                { icon: <Calendar size={16} />, label: 'Abonnement',  value: user.subscription.toUpperCase() },
              ].map((row) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: 'var(--gold)' }}>{row.icon}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {row.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--white)', paddingLeft: 24 }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                Pour modifier vos informations, contactez notre équipe.
              </p>
              <button className="btn btn-outline" onClick={contactWhatsApp} style={{ gap: 8, width: '100%', justifyContent: 'center' }}>
                <MessageCircle size={15} /> Contacter le support
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .page > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
