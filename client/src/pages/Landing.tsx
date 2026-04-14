import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Shield, Zap, Phone, Mail, MapPin, Sparkle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { servicesAPI } from '../services/api';

interface PublicService {
  _id: string;
  name: string;
  shortDescription: string;
  category: string;
  icon: string;
  minTier: string;
}

const STATS = [
  { value: '+200', label: 'Membres élite' },
  { value: '24/7', label: 'Disponibilité' },
  { value: '15+', label: 'Services premium' },
  { value: '5★',  label: 'Excellence' },
];

const TIERS = [
  {
    name: 'Basic',
    price: 'Sur demande',
    color: 'var(--white-dim)',
    features: ['Accès aux services essentiels', 'Support WhatsApp', 'Profil membre'],
  },
  {
    name: 'Premium',
    price: 'Sur demande',
    color: 'var(--gold)',
    badge: 'Populaire',
    features: ['Tous les services Basic', 'Conciergerie prioritaire', 'Chauffeur privé', 'Réservations VIP'],
  },
  {
    name: 'VIP',
    price: 'Sur invitation',
    color: 'var(--gold-light)',
    features: ['Accès illimité', 'Concierge dédié', 'Événements exclusifs', 'Services sur mesure', 'Carte VIP physique'],
  },
];

export default function Landing() {
  const [services, setServices] = useState<PublicService[]>([]);

  useEffect(() => {
    servicesAPI.getPublic()
      .then((r) => setServices(r.data))
      .catch(() => {});
  }, []);

  const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero Bento ───────────────────────────────────── */}
      <section style={{ padding: '40px 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: 16,
        }}>
          {/* Main hero card */}
          <motion.div
            initial="hidden" animate="show" variants={fade} transition={{ duration: 0.6 }}
            style={{
              gridColumn: '1 / 3',
              gridRow: '1 / 2',
              background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '52px 48px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 340,
            }}
          >
            {/* Gold orb */}
            <div style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div className="badge badge-gold" style={{ marginBottom: 24, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkle size={11} /> Conciergerie Privée — Togo
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: 'var(--white)', marginBottom: 20, lineHeight: 1.05 }}>
              L'Excellence<br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>à votre service</span>
            </h1>

            <p style={{ color: 'var(--white-dim)', fontSize: 16, maxWidth: 420, marginBottom: 36, lineHeight: 1.7 }}>
              Mavora est une conciergerie privée réservée à ses membres.
              Hôtels, villas, chauffeurs, événements — nous gérons l'exception.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-gold">
                Demander l'accès <ArrowUpRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-outline">
                Connexion membre
              </Link>
            </div>

            <div style={{
              position: 'absolute',
              bottom: 28,
              right: 28,
              fontFamily: 'var(--font-serif)',
              fontSize: 80,
              fontWeight: 700,
              color: 'rgba(201,168,76,0.06)',
              lineHeight: 1,
              userSelect: 'none',
            }}>
              M
            </div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial="hidden" animate="show" variants={fade} transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              gridColumn: '3 / 4',
              gridRow: '1 / 2',
              background: 'linear-gradient(160deg, #C9A84C 0%, #E8C96C 50%, #C9A84C 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 340,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(8,8,8,0.6)',
            }}>
              Chiffres clés
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 36,
                    fontWeight: 700,
                    color: 'var(--black)',
                    lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(8,8,8,0.55)', marginTop: 4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tagline card */}
          <motion.div
            initial="hidden" animate="show" variants={fade} transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              gridColumn: '1 / 2',
              gridRow: '2 / 3',
              background: 'var(--black-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 28,
              fontStyle: 'italic',
              color: 'var(--white)',
              lineHeight: 1.3,
            }}>
              "L'art de vivre sans compromis."
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
              <Shield size={16} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Accès sur invitation uniquement</span>
            </div>
          </motion.div>

          {/* Service preview card */}
          <motion.div
            initial="hidden" animate="show" variants={fade} transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              gridColumn: '2 / 3',
              gridRow: '2 / 3',
              background: 'var(--black-mid)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Nos services
            </div>
            {['Hôtels & Villas', 'Chauffeur privé', 'Événements VIP'].map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ color: 'var(--gold)', display: 'flex' }}><Sparkle size={16} /></span>
                <span style={{ fontSize: 14, color: 'var(--white-dim)' }}>{s}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA card */}
          <motion.div
            initial="hidden" animate="show" variants={fade} transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              gridColumn: '3 / 4',
              gridRow: '2 / 3',
              background: 'var(--black-card)',
              border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Zap size={24} style={{ color: 'var(--gold)', marginBottom: 16 }} />
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--white)', marginBottom: 8 }}>
                Rejoindre le cercle
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                Accès par code d'invitation, recommandation ou demande validée.
              </div>
            </div>
            <Link
              to="/register"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 24,
                padding: '14px 18px',
                background: 'var(--gold-glow)',
                border: '1px solid var(--border-mid)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--gold)',
                fontSize: 14,
                fontWeight: 500,
                transition: 'var(--transition)',
              }}
            >
              Demander l'accès
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Services preview ─────────────────────────────── */}
      <section id="services" style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="badge badge-gold" style={{ marginBottom: 16 }}>Nos services</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--white)', marginBottom: 12 }}>
            L'exception en toutes circonstances
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 560, marginBottom: 48, fontSize: 16 }}>
            De la réservation d'hôtels de luxe à l'organisation d'événements privés,
            votre concierge Mavora s'occupe de tout.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {(services.length > 0 ? services : defaultServices).map((s, i) => (
            <motion.div
              key={s._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card"
              style={{ cursor: 'default' }}
            >
              <div style={{
                width: 44,
                height: 44,
                background: 'var(--gold-glow)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 16,
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                {s.category}
              </div>
              <h3 style={{ fontSize: 18, fontFamily: 'var(--font-serif)', color: 'var(--white)', marginBottom: 8 }}>
                {s.name}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                {s.shortDescription}
              </p>
              <div style={{ marginTop: 16 }}>
                <span className={`badge ${
                  s.minTier === 'vip' ? 'badge-gold' :
                  s.minTier === 'premium' ? 'badge-orange' : 'badge-muted'
                }`}>
                  {s.minTier === 'basic' ? 'Basic+' : s.minTier === 'premium' ? 'Premium+' : 'VIP'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/register" className="btn btn-outline">
            Accéder à tous les services <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Membership tiers ─────────────────────────────── */}
      <section id="about" style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="badge badge-gold" style={{ marginBottom: 16 }}>Abonnements</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--white)', marginBottom: 12 }}>
            Choisissez votre niveau d'excellence
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 500, margin: '0 auto' }}>
            Chaque niveau offre une expérience unique. Contactez-nous pour les tarifs personnalisés.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          maxWidth: 900,
          margin: '0 auto',
        }}>
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: 'var(--black-card)',
                border: `1px solid ${tier.name === 'Premium' ? 'var(--border-mid)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '36px 32px',
                position: 'relative',
                transform: tier.name === 'Premium' ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {tier.badge && (
                <div className="badge badge-gold" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Sparkle size={11} /> {tier.badge}
                </div>
              )}
              <div style={{ color: tier.color, fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                {tier.name}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--white)', marginBottom: 8 }}>
                {tier.price}
              </div>
              <div style={{ width: 40, height: 1, background: tier.color, marginBottom: 24, opacity: 0.5 }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--white-dim)' }}>
                    <span style={{ color: tier.color, flexShrink: 0, display: 'flex' }}><Sparkle size={12} /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-outline" style={{ marginTop: 32, width: '100%', justifyContent: 'center' }}>
                Commencer
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 24px',
        maxWidth: 1280,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 8,
            }}>
              MAVORA
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginLeft: 8, verticalAlign: 'middle' }} />
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 280 }}>
              Conciergerie privée d'exception au Togo. Accès réservé aux membres.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>Contact</div>
            {[
              { icon: <Phone size={14} />, text: '+228 90 00 00 00' },
              { icon: <Mail size={14} />, text: 'contact@mavora.tg' },
              { icon: <MapPin size={14} />, text: 'Lomé, Togo' },
            ].map((c) => (
              <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--white-dim)' }}>
                <span style={{ color: 'var(--gold)' }}>{c.icon}</span>
                {c.text}
              </div>
            ))}
          </div>
        </div>
        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            © 2024 Mavora. Tous droits réservés.
          </span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            Conçu avec excellence <Sparkle size={12} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
          </span>
        </div>
      </footer>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: repeat(3"] > div {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

const defaultServices = [
  { _id: '1', name: 'Hôtels & Villas',    shortDescription: 'Réservation dans les plus beaux établissements du Togo et d\'Afrique.', category: 'Hébergement', icon: '🏨', minTier: 'basic' },
  { _id: '2', name: 'Chauffeur Privé',    shortDescription: 'Transferts aéroport, déplacements VIP, véhicules de prestige.', category: 'Transport', icon: '🚗', minTier: 'basic' },
  { _id: '3', name: 'Événements Privés',  shortDescription: 'Organisation de soirées, réceptions et célébrations sur mesure.', category: 'Événements', icon: '🥂', minTier: 'premium' },
  { _id: '4', name: 'Jet & Aviation',     shortDescription: 'Location de jets privés et hélicoptères pour vos déplacements.', category: 'Transport', icon: '✈️', minTier: 'vip' },
  { _id: '5', name: 'Sécurité & Escorte', shortDescription: 'Services de protection rapprochée et convois sécurisés.', category: 'Sécurité', icon: '🛡️', minTier: 'vip' },
  { _id: '6', name: 'Restauration',       shortDescription: 'Réservation en exclusivité dans les meilleurs restaurants.', category: 'Gastronomie', icon: '🍽️', minTier: 'basic' },
];
