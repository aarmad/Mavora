import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { requestsAPI } from '../../services/api';

interface Request {
  _id: string;
  subject: string;
  message: string;
  status: 'pending' | 'inprogress' | 'completed' | 'cancelled';
  adminNote?: string;
  user: { firstName: string; lastName: string; email: string; memberId: string; subscription: string };
  service?: { name: string };
  createdAt: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending:    'badge-orange',
  inprogress: 'badge-gold',
  completed:  'badge-green',
  cancelled:  'badge-red',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente', inprogress: 'En cours', completed: 'Complété', cancelled: 'Annulé',
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<Request | null>(null);
  const [note,     setNote]     = useState('');
  const [toast,    setToast]    = useState('');
  const [filter,   setFilter]   = useState<string>('all');

  useEffect(() => {
    requestsAPI.getAll()
      .then((r) => setRequests(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const updateRequest = async (id: string, status: string, adminNote?: string) => {
    try {
      const res = await requestsAPI.update(id, { status, adminNote });
      setRequests((p) => p.map((r) => r._id === id ? { ...r, ...res.data } : r));
      if (selected?._id === id) setSelected((s) => s ? { ...s, ...res.data } : null);
      showToast('Statut mis à jour ✦');
    } catch {
      showToast('Erreur');
    }
  };

  const filtered = requests.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, color: 'var(--white)', marginBottom: 8 }}>Demandes clients</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gérez et suivez les demandes de vos membres.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'pending', 'inprogress', 'completed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 500,
              border: `1px solid ${filter === f ? 'var(--gold)' : 'var(--border)'}`,
              background: filter === f ? 'var(--gold-glow)' : 'transparent',
              color: filter === f ? 'var(--gold)' : 'var(--muted)',
              cursor: 'pointer', transition: 'var(--transition)',
            }}
          >
            {f === 'all' ? 'Tous' : STATUS_LABEL[f]}
            {' '}({f === 'all' ? requests.length : requests.filter((r) => r.status === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((req) => (
            <div key={req._id} className="card" style={{ cursor: 'pointer' }} onClick={() => { setSelected(req); setNote(req.adminNote ?? ''); }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)' }}>{req.subject}</span>
                    {req.service && (
                      <span className="badge badge-muted" style={{ fontSize: 10 }}>{req.service.name}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
                    {req.user.firstName} {req.user.lastName} · <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>{req.user.memberId}</span> · {req.user.subscription.toUpperCase()}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.5 }}>
                    {req.message.slice(0, 120)}{req.message.length > 120 ? '…' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <span className={`badge ${STATUS_BADGE[req.status]}`}>{STATUS_LABEL[req.status]}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              Aucune demande dans cette catégorie.
            </div>
          )}
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
              borderRadius: 'var(--radius-xl)', padding: '36px', width: '100%', maxWidth: 520,
              maxHeight: '85vh', overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, color: 'var(--white)' }}>{selected.subject}</h2>
              <span className={`badge ${STATUS_BADGE[selected.status]}`}>{STATUS_LABEL[selected.status]}</span>
            </div>

            <div style={{ background: 'var(--black-mid)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message</div>
              <p style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.6 }}>{selected.message}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Membre', value: `${selected.user.firstName} ${selected.user.lastName}` },
                { label: 'Email',  value: selected.user.email },
                { label: 'ID',     value: selected.user.memberId },
                { label: 'Abonnement', value: selected.user.subscription.toUpperCase() },
              ].map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--white)' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Note admin (optionnelle)</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Ajouter une note interne..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {(['pending', 'inprogress', 'completed', 'cancelled'] as const).map((s) => (
                <button
                  key={s}
                  className={`btn ${selected.status === s ? 'btn-gold' : 'btn-outline'}`}
                  style={{ justifyContent: 'center', fontSize: 13, padding: '10px' }}
                  onClick={() => updateRequest(selected._id, s, note)}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
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
