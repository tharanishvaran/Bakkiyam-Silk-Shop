import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Eye, EyeOff, Edit, Save, X, CheckSquare, Layers } from 'lucide-react';
import { getAdminGallery, addGalleryImage, updateGalleryItem, deleteGalleryItem } from '../../api';
import type { GalleryItem } from '../../types';
import toast from 'react-hot-toast';

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', published: 1 });
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    getAdminGallery()
      .then(data => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const arr = Array.from(files);
      for (const file of arr) {
        await addGalleryImage(file);
      }
      toast.success(`${arr.length} image(s) uploaded successfully`);
      load();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(it => it.id));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try {
      await deleteGalleryItem(id);
      setSelectedIds(prev => prev.filter(x => x !== id));
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected gallery image(s)? This cannot be undone.`)) return;
    setBulkProcessing(true);
    try {
      for (const id of selectedIds) {
        await deleteGalleryItem(id);
      }
      toast.success(`${selectedIds.length} images deleted`);
      setSelectedIds([]);
      load();
    } catch {
      toast.error('Failed to delete some images');
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkPublish = async (published: number) => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);
    try {
      for (const id of selectedIds) {
        const item = items.find(it => it.id === id);
        if (item) {
          await updateGalleryItem(id, { ...item, published });
        }
      }
      toast.success(`${selectedIds.length} images ${published ? 'published' : 'hidden'}`);
      load();
    } catch {
      toast.error('Failed to update images');
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      await updateGalleryItem(id, editForm);
      toast.success('Updated');
      setEditingId(null);
      load();
    } catch {
      toast.error('Failed to update image details');
    }
  };

  const handleToggle = async (item: GalleryItem) => {
    try {
      await updateGalleryItem(item.id, { ...item, published: item.published ? 0 : 1 });
      load();
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark-text)' }}>Gallery Management</h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem' }}>{items.length} images in gallery</p>
        </div>

        {items.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={toggleSelectAll}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
            >
              <CheckSquare size={14} />
              <span>{selectedIds.length === items.length ? 'Deselect All' : `Select All (${items.length})`}</span>
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div style={{
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid var(--gold)',
          borderRadius: '8px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--gold)" />
            <span style={{ fontWeight: 600, color: 'var(--dark-text)', fontSize: '0.9rem' }}>
              {selectedIds.length} image{selectedIds.length === 1 ? '' : 's'} selected
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleBulkPublish(1)}
              className="btn btn-primary"
              disabled={bulkProcessing}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
            >
              <Eye size={13} /> Publish Selected
            </button>
            <button
              onClick={() => handleBulkPublish(0)}
              className="btn btn-ghost"
              disabled={bulkProcessing}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
            >
              <EyeOff size={13} /> Hide Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="btn btn-outline"
              disabled={bulkProcessing}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', borderColor: '#E57373', color: '#E57373' }}
            >
              <Trash2 size={13} /> Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        style={{ marginBottom: '2rem' }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files); }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(201,168,76,0.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.85rem' }}>Uploading images...</p>
          </div>
        ) : (
          <>
            <Upload size={28} color="var(--gold)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--dark-text)', fontSize: '0.9rem', fontWeight: 500 }}>Upload Gallery Images</p>
            <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Drag and drop or click to browse. Select multiple images simultaneously.
            </p>
          </>
        )}
        <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
      </div>

      {/* Gallery Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {items.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              style={{
                background: 'var(--dark-card)',
                border: isSelected ? '2px solid var(--gold)' : '1px solid var(--dark-border)',
                borderRadius: '6px',
                overflow: 'hidden',
                opacity: item.published ? 1 : 0.65,
                position: 'relative',
                transition: 'all 0.2s',
              }}
            >
              {/* Select Checkbox at top-left */}
              <div
                onClick={() => toggleSelect(item.id)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  left: '0.5rem',
                  zIndex: 4,
                  background: isSelected ? 'var(--gold)' : 'rgba(0,0,0,0.7)',
                  color: isSelected ? '#0D0A0E' : 'white',
                  borderRadius: '4px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.4)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {isSelected ? '✓' : ''}
              </div>

              <div style={{ position: 'relative' }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                  onClick={() => toggleSelect(item.id)}
                />
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem', zIndex: 4 }}>
                  <button
                    onClick={() => handleToggle(item)}
                    style={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}
                    title={item.published ? 'Hide' : 'Publish'}
                  >
                    {item.published ? <Eye size={13} color="#4CAF82" /> : <EyeOff size={13} color="#E57373" />}
                  </button>
                  <button
                    onClick={() => { setEditingId(item.id); setEditForm({ title: item.title || '', description: item.description || '', published: item.published }); }}
                    style={{ background: 'rgba(201,168,76,0.85)', border: 'none', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}
                    title="Edit"
                  >
                    <Edit size={13} color="white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: 'rgba(229,115,115,0.85)', border: 'none', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}
                    title="Delete"
                  >
                    <Trash2 size={13} color="white" />
                  </button>
                </div>
              </div>

              {editingId === item.id ? (
                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    className="form-input"
                    placeholder="Title"
                    value={editForm.title}
                    onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                    style={{ fontSize: '0.8rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(item.id)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.4rem', fontSize: '0.75rem' }}>
                      <Save size={12} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn btn-ghost" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--dark-text)', fontWeight: 600, marginBottom: '0.2rem' }}>
                    {item.title || 'Untitled Saree'}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--dark-text-muted)' }}>
                    {item.published ? '✓ Published' : '✗ Hidden'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--dark-text-muted)' }}>
          No gallery images yet. Upload your first image above.
        </div>
      )}
    </div>
  );
}
