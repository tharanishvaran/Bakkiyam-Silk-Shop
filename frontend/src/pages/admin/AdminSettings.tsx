import { useState, useEffect } from 'react';
import { Save, Key, Lock } from 'lucide-react';
import { getSettings, updateSettings, changePassword } from '../../api';
import type { SiteSettings } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import toast from 'react-hot-toast';

const SETTING_FIELDS = [
  { section: 'Showroom Contact Persons & Phone Numbers', fields: [
    { key: 'contact_phone_1_name', label: 'Primary Contact Person Name (e.g. V. Kannan)' },
    { key: 'contact_phone_1', label: 'Primary Contact Phone Number (e.g. 9159808720)' },
    { key: 'contact_phone_2_name', label: 'Secondary Contact Person Name (e.g. V. Kannan)' },
    { key: 'contact_phone_2', label: 'Secondary Contact Phone Number (e.g. 7871620812)' },
    { key: 'contact_phone_3_name', label: 'Partner / Third Contact Name (e.g. S.K. Veerappan)' },
    { key: 'contact_phone_3', label: 'Partner / Third Contact Phone Number (e.g. 9865975616)' },
    { key: 'whatsapp_number', label: 'WhatsApp Number (with country code, e.g. 919159808720)' },
  ]},
  { section: 'Shop Address & Google Maps Location Link', fields: [
    { key: 'address', label: 'Full Showroom Physical Address (Listed directly on Home Page & Footer)', textarea: true },
    { key: 'maps_url', label: 'Google Maps Direct Location Link (URL to your shop on Google Maps)' },
  ]},
  { section: 'Social Media & Online Presence', fields: [
    { key: 'instagram_url', label: 'Instagram Profile URL (e.g. https://www.instagram.com/bhakkiyam_pattu_center?stkn=...)' },
  ]},
  { section: 'Hero Section Text', fields: [
    { key: 'hero_title', label: 'Hero Title' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', textarea: true },
  ]},
  { section: 'About Us Section', fields: [
    { key: 'about_text', label: 'About Text', textarea: true },
  ]},
];

export default function AdminSettings() {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<SiteSettings & Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    getSettings().then(data => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('All settings saved successfully!');
      await refreshSettings();
      const fresh = await getSettings();
      if (fresh) setSettings(fresh);
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err?.response?.data?.error || 'Failed to save settings. Please verify login.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to change password');
    }
    finally { setPwSaving(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark-text)', marginBottom: '0.25rem' }}>Settings</h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem' }}>Manage website content, social links and contact information</p>
        </div>
        <button onClick={handleSaveSettings} className="btn btn-primary" disabled={saving}>
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Site Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        {SETTING_FIELDS.map(section => (
          <div key={section.section} style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '6px', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {section.section}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {section.fields.map(f => (
                <div key={f.key} className="form-group" style={{ gridColumn: (f as any).textarea ? '1 / -1' : 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <label className="form-label" htmlFor={`setting-${f.key}`}>{f.label}</label>
                    {f.key === 'maps_url' && settings.maps_url && (
                      <a
                        href={settings.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          color: 'var(--gold)',
                          textDecoration: 'none',
                          fontWeight: 600,
                          background: 'rgba(201,168,76,0.1)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(201,168,76,0.3)',
                        }}
                      >
                        <span>Test Map Link ↗</span>
                      </a>
                    )}
                  </div>
                  {(f as any).textarea ? (
                    <textarea
                      id={`setting-${f.key}`}
                      className="form-textarea"
                      value={settings[f.key] || ''}
                      onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ minHeight: '80px' }}
                    />
                  ) : (
                    <input
                      id={`setting-${f.key}`}
                      type="text"
                      className="form-input"
                      value={settings[f.key] || ''}
                      onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleSaveSettings} className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Change Password */}
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '6px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Key size={18} color="var(--gold)" />
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Change Admin Password
          </h3>
        </div>
        <form onSubmit={handleChangePassword} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="pw-current">Current Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dark-text-muted)' }} />
              <input id="pw-current" type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} style={{ paddingLeft: '2.5rem' }} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="pw-new">New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dark-text-muted)' }} />
              <input id="pw-new" type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} style={{ paddingLeft: '2.5rem' }} required minLength={6} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="pw-confirm">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dark-text-muted)' }} />
              <input id="pw-confirm" type="password" className="form-input" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} style={{ paddingLeft: '2.5rem' }} required minLength={6} />
            </div>
          </div>
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={pwSaving} style={{ width: '100%', justifyContent: 'center' }}>
              <Key size={16} />
              <span>{pwSaving ? 'Changing...' : 'Change Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
