import { useEffect, useState } from 'react';
import { Plus, Copy, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface Code {
  _id: string;
  code: string;
  subscription: 'basic' | 'premium' | 'vip';
  isUsed: boolean;
  usedBy?: { firstName: string; lastName: string };
  createdBy?: { firstName: string; lastName: string };
  createdAt: string;
}

const TIER_BADGE: Record<string, string> = {
  basic: 'badge-muted', premium: 'badge-orange', vip: 'badge-gold',
};

export default function AdminCodes() {
  const [codes,    setCodes]    = useState<Code[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tier,     setTier]     = useState<'basic' | 'premium' | 'vip'>('basic');
  const [creating, setCreating] = useState(false);
  const [toast,    setToast]    = useState('');
  const [copied,   setCopied]   = useState<string | null>(null);

  useEffect(() => {
    adminAPI.getInviteCodes()
      .then((r) => setCodes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const createCode = async () => {
    setCreating(true);
    try {
      const res = await adminAPI.createInviteCode(tier);
      setCodes((p) => [res.data, ...p]);
      showToast(`Code ${res.data.code} créé ✦`);
    } catch {
      showToast('Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, color: 'var(--white)', marginBottom: 8 }}>Codes d'invitation</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Générez des codes pour inviter de nouveaux membres.</p>
      </div>

      {/* Generate new */}
      <div className="card" style={{ marginBottom: 32, maxWidth: 480 }}>
        <h3 style={{ fontSize: 16, color: 'var(--white)', marginBottom: 20, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
          Générer un code
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="input-label">Niveau d'abonnement</label>
            <select
              className="input-field"
              value={tier}
              onChange={(e) => setTier(e.target.value as 'basic' | 'premium' | 'vip')}
            >
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <button
            className="btn btn-gold"
            onClick={createCode}
            disabled={creating}
            style={{ gap: 8, flexShrink: 0 }}
          >
            {creating ? <div className="spinner" /> : <><Plus size={15} /> Générer</>}
          </button>
        </div>
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
                <th>Code</th>
                <th>Niveau</th>
                <th>Statut</th>
                <th>Utilisé par</th>
                <th>Créé le</th>
                <th>Copier</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c._id}>
                  <td>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: 15,
                      letterSpacing: '0.15em',
                      color: c.isUsed ? 'var(--muted)' : 'var(--gold)',
                      fontWeight: 700,
                    }}>
                      {c.code}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${TIER_BADGE[c.subscription]}`}>
                      {c.subscription.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${c.isUsed ? 'badge-red' : 'badge-green'}`}>
                      {c.isUsed ? 'Utilisé' : 'Disponible'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {c.usedBy ? `${c.usedBy.firstName} ${c.usedBy.lastName}` : '—'}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    {!c.isUsed && (
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '6px 10px', gap: 6, fontSize: 12 }}
                        onClick={() => copyCode(c.code)}
                      >
                        {copied === c.code ? <Check size={13} style={{ color: 'var(--green)' }} /> : <Copy size={13} />}
                        {copied === c.code ? 'Copié' : 'Copier'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {codes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)', fontSize: 14 }}>
              Aucun code généré pour l'instant.
            </div>
          )}
        </div>
      )}

      {toast && <div className="toast-container"><div className="toast success">{toast}</div></div>}
    </div>
  );
}
