import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, Settings, MessageSquare, Key, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { to: '/admin/utilisateurs', label: 'Membres',  icon: <Users size={17} /> },
  { to: '/admin/demandes',     label: 'Demandes', icon: <MessageSquare size={17} /> },
  { to: '/admin/services',     label: 'Services', icon: <Settings size={17} /> },
  { to: '/admin/codes',        label: 'Codes VIP',icon: <Key size={17} /> },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--black-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.06em', marginBottom: 4 }}>
            MAVORA
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', marginLeft: 6, verticalAlign: 'middle' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em' }}>ADMINISTRATION</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? 'var(--gold)' : 'var(--white-dim)',
                background: isActive ? 'var(--gold-glow)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--border-mid)' : 'transparent'}`,
                transition: 'var(--transition)',
                textDecoration: 'none',
              })}
            >
              {n.icon}
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', marginBottom: 8,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'var(--black)',
            }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>
                {user?.firstName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Admin</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 14px', width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: 13, borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
            }}
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
