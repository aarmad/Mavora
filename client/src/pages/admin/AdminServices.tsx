import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { servicesAPI } from '../../services/api';
import type { ServicePayload } from '../../services/api';

interface Service extends ServicePayload {
  _id: string;
}

const EMPTY: ServicePayload = {
  name: '', description: '', shortDescription: '', category: '',
  icon: '✦', minTier: 'basic', whatsappMessage: '', isActive: true,
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<Service | null>(null);
  const [form,     setForm]     = useState<ServicePayload>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState('');

  useEffect(() => {
    servicesAPI.getPublic()
      .then((r) => setServices(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit   = (s: Service) => { setEditing(s); setForm({ ...s }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const res = await servicesAPI.update(editing._id, form);
        setServices((p) => p.map((s) => s._id === editing._id ? res.data : s));
        showToast('Service mis à jour');
      } else {
        const res = await servicesAPI.create(form);
        setServices((p) => [res.data, ...p]);
        showToast('Service créé');
      }
      setShowForm(false);
    } catch {
      showToast('Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return;
    await servicesAPI.remove(id);
    setServices((p) => p.filter((s) => s._id !== id));
    showToast('Service supprimé');
  };

  const set = (k: keyof ServicePayload, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, color: 'var(--white)', marginBottom: 8 }}>Services</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gérez le catalogue de services Mavora.</p>
        </div>
        <button className="btn btn-gold" onClick={openCreate} style={{ gap: 8 }}>
          <Plus size={16} /> Nouveau service
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {services.map((s) => (
            <div key={s._id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, background: 'var(--gold-glow)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.category}</div>
                  <div style={{ fontSize: 16, fontFamily: 'var(--font-serif)', color: 'var(--white)' }}>{s.name}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
                {s.shortDescription}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${s.minTier === 'vip' ? 'badge-gold' : s.minTier === 'premium' ? 'badge-orange' : 'badge-muted'}`}>
                  {s.minTier.toUpperCase()}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(s)}>
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '6px 10px', color: 'var(--red)' }}
                    onClick={() => handleDelete(s._id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
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
            <h2 style={{ fontSize: 20, color: 'var(--white)', marginBottom: 24 }}>
              {editing ? 'Modifier le service' : 'Nouveau service'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="input-label">Nom</label>
                  <input className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex: Chauffeur VIP" />
                </div>
                <div>
                  <label className="input-label">Icône (emoji)</label>
                  <input className="input-field" value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="🚗" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="input-label">Catégorie</label>
                  <input className="input-field" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Transport" />
                </div>
                <div>
                  <label className="input-label">Niveau minimum</label>
                  <select className="input-field" value={form.minTier} onChange={(e) => set('minTier', e.target.value)}>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Description courte</label>
                <input className="input-field" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} placeholder="Résumé en une phrase" />
              </div>

              <div>
                <label className="input-label">Description complète</label>
                <textarea className="input-field" rows={3} value={form.description}
                  onChange={(e) => set('description', e.target.value)} placeholder="Description détaillée..."
                  style={{ resize: 'vertical' }} />
              </div>

              <div>
                <label className="input-label">Message WhatsApp pré-rempli (optionnel)</label>
                <input className="input-field" value={form.whatsappMessage ?? ''}
                  onChange={(e) => set('whatsappMessage', e.target.value)}
                  placeholder="Bonjour, je souhaite réserver..." />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, justifyContent: 'center' }}>
                  Annuler
                </button>
                <button className="btn btn-gold" onClick={handleSave} disabled={saving || !form.name}
                  style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? <div className="spinner" /> : editing ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {toast && <div className="toast-container"><div className="toast success">{toast}</div></div>}
    </div>
  );
}
