import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subscription: 'basic' | 'premium' | 'vip';
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  memberId: string;
  registrationMethod: string;
  requestMessage?: string;
  createdAt: string;
}

const STATUS_BADGE: Record<string, string> = {
  active:    'badge-green',
  pending:   'badge-orange',
  rejected:  'badge-red',
  suspended: 'badge-red',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Actif', pending: 'En attente', rejected: 'Refusé', suspended: 'Suspendu',
};

const SUBSCRIPTION_BADGE: Record<string, string> = {
  basic: 'badge-muted', premium: 'badge-orange', vip: 'badge-gold',
};

export default function AdminUsers() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<'all' | 'pending' | 'active'>('all');
  const [selected, setSelected] = useState<User | null>(null);
  const [stats,   setStats]   = useState({ totalUsers: 0, activeUsers: 0, pendingUsers: 0 });
  const [toast,   setToast]   = useState('');

  useEffect(() => {
    Promise.all([adminAPI.getUsers(), adminAPI.getStats()])
      .then(([u, s]) => { setUsers(u.data); setStats(s.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const updateUser = async (id: string, data: { status?: string; subscription?: string }) => {
    try {
      const res = await adminAPI.updateUser(id, data);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, ...res.data } : u));
      if (selected?._id === id) setSelected((s) => s ? { ...s, ...res.data } : null);
      showToast('Mis à jour');
    } catch {
      showToast('Erreur de mise à jour');
    }
  };

  const filtered = users.filter((u) =>
    filter === 'all' ? true : u.status === filter
  );

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, color: 'var(--white)', marginBottom: 8 }}>Gestion des membres</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Validez, refusez et gérez les abonnements.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total membres', value: stats.totalUsers },
          { label: 'Actifs',        value: stats.activeUsers },
          { label: 'En attente',    value: stats.pendingUsers },
        ].map((s) => (
          <div key={s.label} className="card">
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--white)', fontWeight: 600 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'pending', 'active'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500,
              border: `1px solid ${filter === f ? 'var(--gold)' : 'var(--border)'}`,
              background: filter === f ? 'var(--gold-glow)' : 'transparent',
              color: filter === f ? 'var(--gold)' : 'var(--muted)',
              cursor: 'pointer', transition: 'var(--transition)',
            }}
          >
            {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Actifs'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Membre</th>
                <th>Email</th>
                <th>ID</th>
                <th>Abonnement</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--gold-glow)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: 'var(--gold)',
                      }}>
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gold)' }}>{u.memberId}</td>
                  <td>
                    <span className={`badge ${SUBSCRIPTION_BADGE[u.subscription]}`}>
                      {u.subscription.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[u.status]}`}>
                      {STATUS_LABEL[u.status]}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-gold"
                            style={{ padding: '5px 12px', fontSize: 12 }}
                            onClick={() => updateUser(u._id, { status: 'active' })}
                          >
                            Valider
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '5px 12px', fontSize: 12, color: 'var(--red)', borderColor: 'rgba(207,102,121,0.3)' }}
                            onClick={() => updateUser(u._id, { status: 'rejected' })}
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '5px 10px', fontSize: 12 }}
                        onClick={() => setSelected(u)}
                      >
                        Détails
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--black-card)', border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-xl)', padding: '36px', width: '100%', maxWidth: 480,
            }}
          >
            <h2 style={{ fontSize: 20, color: 'var(--white)', marginBottom: 24 }}>
              {selected.firstName} {selected.lastName}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Email',   value: selected.email },
                { label: 'Tél',     value: selected.phone ?? '—' },
                { label: 'ID',      value: selected.memberId },
                { label: 'Méthode', value: selected.registrationMethod },
                { label: 'Statut',  value: STATUS_LABEL[selected.status] },
              ].map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--white)' }}>{r.value}</span>
                </div>
              ))}
              {selected.requestMessage && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Message de candidature
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.6,
                    background: 'var(--black-mid)', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                  }}>
                    {selected.requestMessage}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <select
                className="input-field"
                style={{ flex: 1 }}
                value={selected.status}
                onChange={(e) => updateUser(selected._id, { status: e.target.value })}
              >
                <option value="pending">En attente</option>
                <option value="active">Actif</option>
                <option value="rejected">Refusé</option>
                <option value="suspended">Suspendu</option>
              </select>
              <select
                className="input-field"
                style={{ flex: 1 }}
                value={selected.subscription}
                onChange={(e) => updateUser(selected._id, { subscription: e.target.value })}
              >
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <button className="btn btn-ghost" onClick={() => setSelected(null)} style={{ width: '100%', justifyContent: 'center' }}>
              Fermer
            </button>
          </motion.div>
        </div>
      )}

      {toast && <div className="toast-container"><div className="toast success">{toast}</div></div>}
    </div>
  );
}
