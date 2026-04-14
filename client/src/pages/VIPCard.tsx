import { useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Shield, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const TIER_META = {
  basic:   { label: 'Basic Member',   color: '#C8C2B8', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #242424 100%)' },
  premium: { label: 'Premium Member', color: '#C9A84C', gradient: 'linear-gradient(135deg, #1a1500 0%, #2a2000 50%, #1a1a1a 100%)' },
  vip:     { label: 'VIP Member',     color: '#E8C96C', gradient: 'linear-gradient(135deg, #0a0800 0%, #1e1800 40%, #111 100%)' },
};

export default function VIPCard() {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const tier = TIER_META[user.subscription] ?? TIER_META.basic;
  const qrValue = `${window.location.origin}/profil?id=${user.memberId}`;
  const memberSince = new Date().getFullYear();

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Ma Carte Mavora',
        text: `Membre ${user.subscription.toUpperCase()} — ${user.memberId}`,
        url: qrValue,
      });
    }
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      <div className="page" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>Identité membre</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--white)', marginBottom: 8 }}>
            Votre Carte VIP
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>
            Présentez ce QR code pour valider votre statut membre Mavora.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start', flexWrap: 'wrap' }}>
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            ref={cardRef}
            className="vip-card"
            style={{
              background: tier.gradient,
              maxWidth: 480,
              minHeight: 280,
              padding: '36px 40px',
            }}
          >
            {/* Card top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--white)',
                }}>
                  MAVORA
                  <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: tier.color, marginLeft: 6, verticalAlign: 'middle' }} />
                </div>
                <div style={{ fontSize: 10, letterSpacing: '0.16em', color: tier.color, marginTop: 2, opacity: 0.8 }}>
                  CONCIERGERIE PRIVÉE
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                border: `1px solid ${tier.color}44`,
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: tier.color,
              }}>
                {user.subscription === 'vip' ? <Star size={11} fill="currentColor" /> : <Shield size={11} />}
                {tier.label}
              </div>
            </div>

            {/* Member info */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                NOM DU MEMBRE
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--white)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
              </div>
            </div>

            {/* Card bottom */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                  ID MEMBRE
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 16, color: tier.color, letterSpacing: '0.12em', fontWeight: 700 }}>
                  {user.memberId}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  Membre depuis {memberSince}
                </div>
              </div>

              {/* Decorative gold lines */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
                {[40, 56, 32, 48, 24].map((h, i) => (
                  <div key={i} style={{
                    width: 3,
                    height: h,
                    background: `linear-gradient(to top, ${tier.color}, transparent)`,
                    borderRadius: 99,
                    opacity: 0.6,
                  }} />
                ))}
              </div>
            </div>

            {/* Holographic shimmer effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
              pointerEvents: 'none',
              borderRadius: 'inherit',
            }} />
          </motion.div>

          {/* QR + actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
          >
            <div style={{
              background: 'var(--white)',
              padding: 20,
              borderRadius: 'var(--radius-lg)',
              border: '4px solid var(--gold)',
            }}>
              <QRCodeSVG
                value={qrValue}
                size={160}
                bgColor="#F8F4EE"
                fgColor="#080808"
                level="H"
                includeMargin={false}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--white-dim)', fontWeight: 600, marginBottom: 4 }}>
                Scanner pour vérifier
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {user.memberId}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={handleShare} style={{ gap: 8 }}>
                <Share2 size={15} /> Partager
              </button>
              <button
                className="btn btn-gold"
                onClick={() => window.print()}
                style={{ gap: 8 }}
              >
                <Download size={15} /> Imprimer
              </button>
            </div>
          </motion.div>
        </div>

        {/* Info below */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 48, maxWidth: 480 }}
        >
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Nom complet',    value: `${user.firstName} ${user.lastName}` },
                { label: 'Email',          value: user.email },
                { label: 'ID membre',      value: user.memberId },
                { label: 'Abonnement',     value: user.subscription.toUpperCase() },
                { label: 'Statut',         value: user.status === 'active' ? 'Actif' : 'En attente' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{row.label}</span>
                  <span style={{ fontSize: 14, color: 'var(--white)', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media print {
          nav, .btn, button { display: none !important; }
          body { background: white; }
        }
        @media (max-width: 768px) {
          .page > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
