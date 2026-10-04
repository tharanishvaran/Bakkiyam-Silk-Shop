import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';
import {
  getAdminSaree, getAdminCategories, createSaree, updateSaree,
  uploadSareeImages, deleteSareeImage, setPrimaryImage
} from '../../api';
import type { Category, SareeImage } from '../../types';
import toast from 'react-hot-toast';

const FIELDS = [
  { key: 'name', label: 'Saree Name', required: true, full: true },
  { key: 'short_description', label: 'Short Description', full: true, textarea: true, rows: 2 },
  { key: 'description', label: 'Full Description', full: true, textarea: true, rows: 4 },
  { key: 'fabric', label: 'Fabric / Material' },
  { key: 'color', label: 'Color' },
  { key: 'design_style', label: 'Design Style' },
  { key: 'occasion', label: 'Occasion' },
  { key: 'weave_details', label: 'Weave Details', full: true, textarea: true, rows: 2 },
  { key: 'border_details', label: 'Border Details', full: true, textarea: true, rows: 2 },
  { key: 'pallu_details', label: 'Pallu Details', full: true, textarea: true, rows: 2 },
];

interface PendingFile {
  file: File;
  preview: string;
  isPrimary: boolean;
}

export default function AdminSareeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<SareeImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Record<string, any>>({
    name: '', category_id: '', short_description: '', description: '',
    fabric: '', color: '', design_style: '', occasion: '',
    weave_details: '', border_details: '', pallu_details: '',
    featured: false, new_arrival: false, published: true,
  });

  useEffect(() => {
    getAdminCategories().then(data => {
      if (Array.isArray(data)) setCategories(data);
    });

    if (isEdit) {
      getAdminSaree(parseInt(id!)).then(saree => {
        setForm({
          name: saree.name || '',
          category_id: saree.category_id || '',
          short_description: saree.short_description || '',
          description: saree.description || '',
          fabric: saree.fabric || '',
          color: saree.color || '',
          design_style: saree.design_style || '',
          occasion: saree.occasion || '',
          weave_details: saree.weave_details || '',
          border_details: saree.border_details || '',
          pallu_details: saree.pallu_details || '',
          featured: !!saree.featured,
          new_arrival: !!saree.new_arrival,
          published: saree.published !== 0,
        });
        setImages(saree.images || []);
      }).catch(err => {
        console.error('Failed to load saree:', err);
        toast.error('Failed to load saree details');
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Saree name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
      };

      if (isEdit) {
        await updateSaree(parseInt(id!), payload);
        toast.success('Saree updated successfully!');
        navigate('/admin/sarees');
      } else {
        const result = await createSaree(payload);
        const newSareeId = result.id;

        // If user added images while creating, upload them now
        if (pendingFiles.length > 0) {
          const filesToUpload = pendingFiles.map(p => p.file);
          const uploaded = await uploadSareeImages(newSareeId, filesToUpload);

          // If a specific image was marked as primary other than the first
          const primaryIdx = pendingFiles.findIndex(p => p.isPrimary);
          if (primaryIdx > 0 && uploaded[primaryIdx]?.id) {
            await setPrimaryImage(uploaded[primaryIdx].id);
          }
        }

        toast.success('New Saree created successfully with images!');
        navigate('/admin/sarees');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to save saree. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);

    if (isEdit) {
      try {
        const result = await uploadSareeImages(parseInt(id!), arr);
        setImages(prev => [...prev, ...result]);
        toast.success(`${arr.length} image(s) uploaded`);
      } catch (err) {
        console.error(err);
        toast.error('Upload failed');
      }
    } else {
      // Pending uploads for new saree
      const newPending = arr.map((f, i) => ({
        file: f,
        preview: URL.createObjectURL(f),
        isPrimary: pendingFiles.length === 0 && i === 0,
      }));
      setPendingFiles(prev => [...prev, ...newPending]);
      toast.success(`${arr.length} image(s) attached`);
    }
  };

  const handleDeleteImage = async (imgId: number) => {
    try {
      await deleteSareeImage(imgId);
      setImages(prev => prev.filter(i => i.id !== imgId));
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles(prev => {
      const copy = [...prev];
      const removed = copy.splice(index, 1);
      if (removed[0]?.preview) URL.revokeObjectURL(removed[0].preview);
      if (removed[0]?.isPrimary && copy.length > 0) {
        copy[0].isPrimary = true;
      }
      return copy;
    });
  };

  const handleSetPrimary = async (imgId: number) => {
    try {
      await setPrimaryImage(imgId);
      setImages(prev => prev.map(i => ({ ...i, is_primary: i.id === imgId ? 1 : 0 })));
      toast.success('Primary image set');
    } catch {
      toast.error('Failed to update primary image');
    }
  };

  const handleSetPendingPrimary = (index: number) => {
    setPendingFiles(prev =>
      prev.map((item, i) => ({ ...item, isPrimary: i === index }))
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/admin/sarees')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--dark-border)',
            borderRadius: '6px',
            padding: '0.5rem',
            cursor: 'pointer',
            color: 'var(--dark-text)',
            display: 'flex',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--dark-text)' }}>
            {isEdit ? 'Edit Saree' : 'Add New Saree'}
          </h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.8rem' }}>
            Fill in the details below. Images can be attached directly.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 360px)', gap: '1.5rem', alignItems: 'start' }} className="admin-saree-form-layout">
        {/* Form Details */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '6px', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {FIELDS.map(f => (
                <div key={f.key} className="form-group" style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                  <label className="form-label" htmlFor={`field-${f.key}`}>
                    {f.label} {f.required && <span style={{ color: 'var(--gold)' }}>*</span>}
                  </label>
                  {f.textarea ? (
                    <textarea
                      id={`field-${f.key}`}
                      className="form-textarea"
                      value={form[f.key] || ''}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ minHeight: `${(f.rows || 3) * 28}px` }}
                      required={f.required}
                    />
                  ) : (
                    <input
                      id={`field-${f.key}`}
                      type="text"
                      className="form-input"
                      value={form[f.key] || ''}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      required={f.required}
                    />
                  )}
                </div>
              ))}

              {/* Category */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="field-category">Category</label>
                <select
                  id="field-category"
                  className="form-select"
                  value={form.category_id || ''}
                  onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                >
                  <option value="">— Select Category —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Toggles */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  {[
                    { key: 'published', label: 'Published (visible on website)' },
                    { key: 'featured', label: 'Featured Collection' },
                    { key: 'new_arrival', label: 'New Arrival' },
                  ].map(toggle => (
                    <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <div
                        onClick={() => setForm(p => ({ ...p, [toggle.key]: !p[toggle.key] }))}
                        style={{
                          width: '44px', height: '24px', borderRadius: '12px',
                          background: form[toggle.key] ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                          border: `1px solid ${form[toggle.key] ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                          position: 'relative', transition: 'all 0.2s', cursor: 'pointer',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: '2px',
                          left: form[toggle.key] ? '22px' : '2px',
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: 'white', transition: 'left 0.2s',
                        }} />
                      </div>
                      <span style={{ color: 'var(--dark-text)', fontSize: '0.875rem' }}>{toggle.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--dark-border)', display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : isEdit ? 'Update Saree' : 'Create Saree'}
              </button>
              <button type="button" onClick={() => navigate('/admin/sarees')} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>

        {/* Image Manager (Both Edit & Create modes) */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '6px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--dark-text)', fontSize: '0.95rem' }}>
              {isEdit ? 'Saree Images' : 'Attach Images'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>
              {isEdit ? `${images.length} uploaded` : `${pendingFiles.length} selected`}
            </span>
          </div>

          {/* Upload Zone */}
          <div
            className={`upload-zone ${dragging ? 'dragging' : ''}`}
            style={{
              marginBottom: '1.25rem',
              border: '2px dashed rgba(201,168,76,0.35)',
              borderRadius: '6px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s',
            }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          >
            <Upload size={24} color="var(--gold)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--dark-text)', fontWeight: 500 }}>
              {isEdit ? 'Upload Saree Photos' : 'Add Saree Photos'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)', marginTop: '0.25rem' }}>
              Drag & drop or click to browse
            </p>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          {/* Existing Images (Edit mode) */}
          {isEdit && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
              {images.map(img => (
                <div
                  key={img.id}
                  style={{
                    position: 'relative',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: `1px solid ${img.is_primary ? 'var(--gold)' : 'var(--dark-border)'}`,
                  }}
                >
                  <img
                    src={img.image_url}
                    alt="Saree"
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', top: '0.35rem', right: '0.35rem', display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      title="Set as primary"
                      style={{ background: 'rgba(0,0,0,0.75)', border: 'none', borderRadius: '3px', padding: '0.3rem', cursor: 'pointer', display: 'flex' }}
                    >
                      <Star size={12} color={img.is_primary ? 'var(--gold)' : 'white'} fill={img.is_primary ? 'var(--gold)' : 'transparent'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      title="Delete"
                      style={{ background: 'rgba(229,115,115,0.85)', border: 'none', borderRadius: '3px', padding: '0.3rem', cursor: 'pointer', display: 'flex' }}
                    >
                      <X size={12} color="white" />
                    </button>
                  </div>
                  {img.is_primary === 1 && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(201,168,76,0.9)', padding: '0.2rem', textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#0D0A0E' }}>
                      PRIMARY
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pending Previews (Create mode) */}
          {!isEdit && pendingFiles.length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                Click the star icon to choose which photo is the primary cover image:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                {pendingFiles.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: `2px solid ${item.isPrimary ? 'var(--gold)' : 'var(--dark-border)'}`,
                    }}
                  >
                    <img
                      src={item.preview}
                      alt={`Pending ${idx}`}
                      style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', top: '0.35rem', right: '0.35rem', display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => handleSetPendingPrimary(idx)}
                        title="Set as primary"
                        style={{ background: 'rgba(0,0,0,0.75)', border: 'none', borderRadius: '3px', padding: '0.3rem', cursor: 'pointer', display: 'flex' }}
                      >
                        <Star size={12} color={item.isPrimary ? 'var(--gold)' : 'white'} fill={item.isPrimary ? 'var(--gold)' : 'transparent'} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePending(idx)}
                        title="Remove"
                        style={{ background: 'rgba(229,115,115,0.85)', border: 'none', borderRadius: '3px', padding: '0.3rem', cursor: 'pointer', display: 'flex' }}
                      >
                        <X size={12} color="white" />
                      </button>
                    </div>
                    {item.isPrimary && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(201,168,76,0.9)', padding: '0.2rem', textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#0D0A0E' }}>
                        PRIMARY COVER
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isEdit && images.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--dark-text-muted)', fontSize: '0.8rem', padding: '1rem 0' }}>
              No images uploaded yet.
            </p>
          )}

          {!isEdit && pendingFiles.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--dark-text-muted)', fontSize: '0.8rem', padding: '1rem 0' }}>
              No photos selected yet. You can attach images now or edit later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
