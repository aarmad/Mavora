import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Espace Membre', icon: <LayoutDashboard size={15} /> },
        { to: '/services',  label: 'Services',      icon: <Star size={15} /> },
        { to: '/carte-vip', label: 'Ma Carte VIP',  icon: null },
        { to: '/profil',    label: 'Profil',         icon: <User size={15} /> },
        ...(user.isAdmin ? [{ to: '/admin', label: 'Admin', icon: null }] : []),
      ]
    : [
        { to: '/#services', label: 'Services', icon: null },
        { to: '/#about',    label: 'À propos', icon: null },
      ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--white)',
          }}>
            MAVORA
          </span>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--gold)',
            flexShrink: 0,
          }} />
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          '@media (max-width: 768px)': { display: 'none' },
        }} className="desktop-nav">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 99,
                fontSize: 14,
                fontWeight: 500,
                color: isActive(l.to) ? 'var(--gold)' : 'var(--white-dim)',
                background: isActive(l.to) ? 'var(--gold-glow)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 14px',
                background: 'var(--black-mid)',
                border: '1px solid var(--border)',
                borderRadius: 99,
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--black)',
                }}>
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <span style={{ fontSize: 13, color: 'var(--white-dim)' }}>
                  {user.firstName}
                </span>
                <span className={`badge badge-${
                  user.subscription === 'vip' ? 'gold' :
                  user.subscription === 'premium' ? 'orange' : 'muted'
                }`} style={{ fontSize: 9, padding: '2px 8px' }}>
                  {user.subscription.toUpperCase()}
                </span>
              </div>
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
                style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: 14 }}>
                Connexion
              </Link>
              <Link to="/register" className="btn btn-gold" style={{ fontSize: 14 }}>
                Demander l'accès
              </Link>
            </>
          )}

          {/* Mobile burger */}
          <button
            className="btn btn-ghost mobile-burger"
            onClick={() => setOpen(!open)}
            style={{ padding: '8px', display: 'none' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: 'var(--black-card)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
        }}>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
                color: isActive(l.to) ? 'var(--gold)' : 'var(--white)',
                fontSize: 15,
              }}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 0',
                color: 'var(--muted)',
                fontSize: 15,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
