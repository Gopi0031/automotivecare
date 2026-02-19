"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";

// ── Shared Helpers ──────────────────────────────────────────────────────────
const SVG = ({ path, className = "icon-md" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const uploadToCloudinary = async (file, folder) => {
  const sig = await fetch(`/api/upload-signature?folder=${folder}`).then(r => r.json());
  if (sig.error) throw new Error(sig.error);
  const fd = new FormData();
  fd.append("file", file);
  fd.append("timestamp", sig.timestamp);
  fd.append("signature", sig.signature);
  fd.append("api_key", sig.apiKey);
  fd.append("folder", sig.folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: fd }).then(r => r.json());
  if (res.error) throw new Error(res.error.message);
  return { url: res.secure_url, publicId: res.public_id };
};

const slugify = str => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── Sub-components ──────────────────────────────────────────────────────────
const EmptyState = ({ icon, text, sub }) => (
  <div className="empty-state">
    <SVG path={icon} className="empty-icon" />
    <p className="empty-text">{text}</p>
    {sub && <p className="text-sm text-gray mt-2">{sub}</p>}
  </div>
);

const ImagePreview = ({ src, style }) => src ? <img src={src} alt="preview" style={{ borderRadius: "0.5rem", marginTop: "1rem", ...style }} /> : null;

const FormActions = ({ uploading, editing, onCancel, saveLabel }) => (
  <div className="form-actions">
    <button type="submit" disabled={uploading} className="btn-primary" style={{ flex: 1 }}>
      {uploading ? "Saving..." : editing ? `Update ${saveLabel}` : `Add ${saveLabel}`}
    </button>
    <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
  </div>
);

// ── Bookings Tab ────────────────────────────────────────────────────────────
function BookingsTab({ bookings, onAccept, onDelete }) {
  const grouped = bookings.reduce((acc, b) => {
    acc[b.bookingDate] = acc[b.bookingDate] || [];
    acc[b.bookingDate].push(b);
    return acc;
  }, {});

  const getServices = b => [b.serviceName, ...(b.additionalServices || []).map(s => s.name)].filter(Boolean);

  if (!bookings.length) return <EmptyState icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" text="No bookings yet" />;

  return (
    <div>
      <div className="section-header">
        <div><h2 className="section-title">Bookings</h2><p className="section-subtitle">Manage customer bookings</p></div>
      </div>
      <div className="space-y-4">
        {Object.entries(grouped).sort(([a], [b]) => new Date(b) - new Date(a)).map(([date, items]) => (
          <div key={date} className="date-group">
            <div className="date-header">
              <SVG path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="date-icon" />
              {new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              <span className="date-count">{items.length} booking{items.length > 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-4">
              {items.map(b => {
                const svcs = getServices(b);
                return (
                  <div key={b._id} className="booking-card">
                    <div className="booking-grid">
                      <div>
                        <p className="booking-label">Customer</p>
                        <p className="booking-value">{b.name}</p>
                        <p className="text-gray text-sm mt-2">{b.email}</p>
                        <p className="text-gray text-sm">{b.phone}</p>
                      </div>
                      <div>
                        <p className="booking-label">Service Details</p>
                        {svcs.length > 1 ? (
                          <><p className="text-sm font-semibold mb-1" style={{ color: "rgb(147,197,253)" }}>{svcs.length} Services</p>
                            <div className="badge-grid">{svcs.map((s, i) => <span key={i} className="badge" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>{s}</span>)}</div></>
                        ) : <p className="booking-value">{svcs[0] || "No service selected"}</p>}
                        <p className="text-sm text-gray mt-2">Vehicle: {b.vehicleBrand} {b.vehicleModel}</p>
                        <p className="text-sm text-gray">Time: {b.bookingTime}</p>
                      </div>
                      <div>
                        <p className="booking-label">Status</p>
                        <span className={`status-badge ${b.status === "confirmed" ? "status-confirmed" : "status-pending"}`}>
                          {b.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
                        </span>
                        <div className="space-y-2 mt-4">
                          {b.status === "pending" && (
                            <button type="button" onClick={() => onAccept(b)} className="btn-accept">
                              <SVG path="M5 13l4 4L19 7" className="icon-sm" /> Accept
                            </button>
                          )}
                          <button type="button" onClick={() => onDelete(b)} className="btn-delete" style={{ width: "100%" }}>
                            <SVG path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="icon-sm" /> Delete
                          </button>
                        </div>
                        {b.notes && (
                          <div className="mt-3 p-2" style={{ background: "rgba(59,130,246,0.1)", borderRadius: "0.375rem", borderLeft: "3px solid rgb(59,130,246)" }}>
                            <p className="text-xs text-gray mb-1">📝 Notes:</p>
                            <p className="text-sm text-gray">{b.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Services Tab ────────────────────────────────────────────────────────────
function ServicesTab({ services, onRefresh, setMessage }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", features: "", order: 0, image: "", cloudinaryPublicId: "" });

  const reset = () => { setShow(false); setEditing(null); setForm({ name: "", description: "", features: "", order: 0, image: "", cloudinaryPublicId: "" }); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const file = document.querySelector('input[name="serviceImage"]')?.files[0];
      let imageUrl = form.image, publicId = form.cloudinaryPublicId;
      if (file) { const r = await uploadToCloudinary(file, "automotive-carcare/services"); imageUrl = r.url; publicId = r.publicId; }
      const res = await fetch("/api/services", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, image: imageUrl, cloudinaryPublicId: publicId, slug: slugify(form.name), ...(editing ? { _id: editing._id } : {}) }) });
      const data = await res.json();
      if (data.success) { setMessage(editing ? "✅ Service updated!" : "✅ Service added!"); reset(); onRefresh(); setTimeout(() => setMessage(""), 3000); }
      else throw new Error(data.error);
    } catch (err) { setMessage("❌ " + err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    const data = await fetch(`/api/services?id=${id}`, { method: "DELETE" }).then(r => r.json());
    if (data.success) { setMessage("✅ Service deleted!"); onRefresh(); setTimeout(() => setMessage(""), 3000); }
  };

  return (
    <div>
      <div className="section-header">
        <div><h2 className="section-title">Services</h2><p className="section-subtitle">Manage car care services</p></div>
        <button type="button" onClick={() => { setShow(true); setEditing(null); setForm({ name: "", description: "", features: "", order: services.length, image: "", cloudinaryPublicId: "" }); setPreview(null); }} className="btn-primary">
          <SVG path="M12 4v16m8-8H4" className="icon-sm" /> Add Service
        </button>
      </div>
      {show && (
        <div className="form-card">
          <h3 className="form-title">{editing ? "Edit Service" : "Add Service"}</h3>
          <form onSubmit={handleSubmit}>
            {[["name", "Service Name *", "Premium Car Wash"], ["description", "Description *", "Brief description", true], ["features", "Features (comma-separated)", "Exterior wash, Interior vacuum", true]].map(([n, l, p, ta]) => (
              <div key={n} className="form-group">
                <label className="form-label">{l}</label>
                {ta ? <textarea name={n} value={form[n]} onChange={e => setForm({ ...form, [n]: e.target.value })} rows={n === "description" ? 3 : 2} placeholder={p} className="form-textarea" required={n === "description"} />
                  : <input type="text" name={n} value={form[n]} onChange={e => setForm({ ...form, [n]: e.target.value })} required placeholder={p} className="form-input" />}
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Service Image * {editing && "(Upload new to replace)"}</label>
              <input type="file" name="serviceImage" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); }} className="form-input" style={{ padding: "0.5rem" }} required={!editing} />
              <ImagePreview src={preview || (editing && !preview && form.image ? form.image : null)} style={{ width: "10rem", height: "10rem", objectFit: "cover" }} />
            </div>
            <FormActions uploading={uploading} editing={editing} onCancel={reset} saveLabel="Service" />
          </form>
        </div>
      )}
      {!services.length ? <EmptyState icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" text="No services added" /> : (
        <div className="card-grid">
          {services.map(s => (
            <div key={s._id} className="card">
              {s.image && <img src={s.image} alt={s.name} style={{ width: "100%", height: "12rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "1rem" }} />}
              <h3 className="card-title">{s.name}</h3>
              <p className="card-subtitle">Slug: {s.slug}</p>
              <p className="text-gray text-sm mb-4">{s.description}</p>
              {s.features && <div className="badge-grid mb-4">{s.features.split(",").map((f, i) => <span key={i} className="badge">{f.trim()}</span>)}</div>}
              <div className="card-actions">
                <button type="button" onClick={() => { setEditing(s); setForm(s); setShow(true); setPreview(null); }} className="btn-edit">Edit</button>
                <button type="button" onClick={() => handleDelete(s._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Detailed Services Tab ───────────────────────────────────────────────────
function DetailedServicesTab({ services, onRefresh, setMessage }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [heroPreview, setHeroPreview] = useState(null);
  const [contentPreview, setContentPreview] = useState(null);
  const blankForm = { name: "", tagline: "", description: "", content: "", features: "", order: 0, image: "", cloudinaryPublicId: "", contentImage: "", contentImagePublicId: "" };
  const [form, setForm] = useState(blankForm);

  const reset = () => { setShow(false); setEditing(null); setForm(blankForm); setHeroPreview(null); setContentPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const heroFile = document.querySelector('input[name="dsHeroImage"]')?.files[0];
      const contentFile = document.querySelector('input[name="dsContentImage"]')?.files[0];
      let heroUrl = form.image, heroPublicId = form.cloudinaryPublicId, contentUrl = form.contentImage, contentPublicId = form.contentImagePublicId;
      if (heroFile) { const r = await uploadToCloudinary(heroFile, "automotive-carcare/detailed-services/hero"); heroUrl = r.url; heroPublicId = r.publicId; }
      if (contentFile) { const r = await uploadToCloudinary(contentFile, "automotive-carcare/detailed-services/content"); contentUrl = r.url; contentPublicId = r.publicId; }
      if (!heroUrl || !contentUrl) throw new Error("Both images are required");
      const body = { ...form, image: heroUrl, cloudinaryPublicId: heroPublicId, contentImage: contentUrl, contentImagePublicId: contentPublicId, slug: slugify(form.name), ...(editing ? { _id: editing._id } : {}) };
      const data = await fetch("/api/detailed-services", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
      if (data.success) { setMessage(editing ? "✅ Service updated!" : "✅ Service added!"); reset(); onRefresh(); setTimeout(() => setMessage(""), 3000); }
      else throw new Error(data.error);
    } catch (err) { setMessage("❌ " + err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    const data = await fetch(`/api/detailed-services?id=${id}`, { method: "DELETE" }).then(r => r.json());
    if (data.success) { setMessage("✅ Deleted!"); onRefresh(); setTimeout(() => setMessage(""), 3000); }
  };

  return (
    <div>
      <div className="section-header">
        <div><h2 className="section-title">⚙️ General Services</h2><p className="section-subtitle">Hero + content image, tagline & full details</p></div>
        <button onClick={() => { setShow(true); setEditing(null); setForm({ ...blankForm, order: services.length }); }} className="btn-primary">
          <SVG path="M12 4v16m8-8H4" className="icon-sm" /> Add Service
        </button>
      </div>
      {show && (
        <div className="form-card">
          <h3 className="form-title">{editing ? "Edit Service" : "Add Service"}</h3>
          <form onSubmit={handleSubmit}>
            {[["name", "Service Name *", "Mechanical Works"], ["tagline", "Tagline *", "Precision. Power. Performance."]].map(([k, l, p]) => (
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <input type="text" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required placeholder={p} className="form-input" />
              </div>
            ))}
            {[["description", "Short Description *", "Brief description", 2, true], ["content", "Full Content *", "Full service description", 5, true], ["features", "Features (comma-separated)", "Feature 1, Feature 2", 2, false]].map(([k, l, p, rows, req]) => (
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <textarea value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required={req} rows={rows} placeholder={p} className="form-textarea" />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Hero Image * {editing && "— upload new to replace"}</label>
              <input type="file" name="dsHeroImage" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setHeroPreview(URL.createObjectURL(f)); }} className="form-input" style={{ padding: "0.5rem" }} required={!editing} />
              <p className="text-xs text-gray mt-1">💡 Landscape 1920×1080px</p>
              <ImagePreview src={heroPreview || (!heroPreview && editing && form.image ? form.image : null)} style={{ width: "100%", maxWidth: "24rem", height: "auto" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Content Image * {editing && "— upload new to replace"}</label>
              <input type="file" name="dsContentImage" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setContentPreview(URL.createObjectURL(f)); }} className="form-input" style={{ padding: "0.5rem" }} required={!editing} />
              <p className="text-xs text-gray mt-1">💡 Portrait 500×700px</p>
              <ImagePreview src={contentPreview || (!contentPreview && editing && form.contentImage ? form.contentImage : null)} style={{ width: "100%", maxWidth: "16rem", height: "auto" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} min="0" className="form-input" />
            </div>
            <FormActions uploading={uploading} editing={editing} onCancel={reset} saveLabel="Service" />
          </form>
        </div>
      )}
      {!services.length ? <EmptyState icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" text="No general services added" sub='Click "Add Service" to get started' /> : (
        <div className="card-grid">
          {[...services].sort((a, b) => a.order - b.order).map(s => (
            <div key={s._id} className="card">
              {s.image && <img src={s.image} alt={s.name} style={{ width: "100%", height: "12rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "1rem" }} />}
              <h3 className="card-title">{s.name}</h3>
              <p className="card-subtitle" style={{ color: "rgb(134,239,172)", fontStyle: "italic" }}>"{s.tagline}"</p>
              <p className="text-gray text-sm mb-2">📌 Slug: {s.slug}</p>
              <p className="text-gray text-sm mb-3" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.description}</p>
              {s.contentImage && <div className="mb-3 p-3" style={{ background: "rgba(59,130,246,0.1)", borderRadius: "0.5rem" }}><p className="text-xs mb-2" style={{ color: "rgb(147,197,253)" }}>✓ Content Image</p><img src={s.contentImage} alt="Content" style={{ width: "100%", height: "7rem", objectFit: "cover", borderRadius: "0.375rem" }} /></div>}
              <p className="text-xs text-gray mb-4">Order: #{s.order}</p>
              <div className="card-actions">
                <button type="button" onClick={() => { setEditing(s); setForm(s); setShow(true); setHeroPreview(null); setContentPreview(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-edit">Edit</button>
                <button type="button" onClick={() => handleDelete(s._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Special Services Tab ────────────────────────────────────────────────────
function SpecialServicesTab({ services, onRefresh, setMessage }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [heroPreview, setHeroPreview] = useState(null);
  const [contentPreview, setContentPreview] = useState(null);
  const blankForm = { name: "", tagline: "", description: "", content: "", heroImage: "", heroImagePublicId: "", contentImage: "", contentImagePublicId: "", order: 0 };
  const [form, setForm] = useState(blankForm);

  const reset = () => { setShow(false); setEditing(null); setForm(blankForm); setHeroPreview(null); setContentPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const heroFile = document.querySelector('input[name="ssHeroImage"]')?.files[0];
      const contentFile = document.querySelector('input[name="ssContentImage"]')?.files[0];
      let heroUrl = form.heroImage, heroPublicId = form.heroImagePublicId, contentUrl = form.contentImage, contentPublicId = form.contentImagePublicId;
      if (heroFile) { const r = await uploadToCloudinary(heroFile, "automotive-carcare/special-services/hero"); heroUrl = r.url; heroPublicId = r.publicId; }
      if (contentFile) { const r = await uploadToCloudinary(contentFile, "automotive-carcare/special-services/content"); contentUrl = r.url; contentPublicId = r.publicId; }
      if (!heroUrl || !contentUrl) throw new Error("Both images are required");
      const body = { ...form, heroImage: heroUrl, heroImagePublicId: heroPublicId, contentImage: contentUrl, contentImagePublicId: contentPublicId, slug: slugify(form.name), ...(editing ? { _id: editing._id } : {}) };
      const data = await fetch("/api/special-services", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
      if (data.success) { setMessage(editing ? "✅ Updated!" : "✅ Added!"); reset(); onRefresh(); setTimeout(() => setMessage(""), 3000); }
      else throw new Error(data.error);
    } catch (err) { setMessage("❌ " + err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    const data = await fetch(`/api/special-services?id=${id}`, { method: "DELETE" }).then(r => r.json());
    if (data.success) { setMessage("✅ Deleted!"); onRefresh(); setTimeout(() => setMessage(""), 3000); }
  };

  return (
    <div>
      <div className="section-header">
        <div><h2 className="section-title">⭐ Special Services</h2><p className="section-subtitle">Hero + content image, tagline & details</p></div>
        <button onClick={() => { setShow(true); setEditing(null); setForm({ ...blankForm, order: services.length }); }} className="btn-primary">
          <SVG path="M12 4v16m8-8H4" className="icon-sm" /> Add Special Service
        </button>
      </div>
      {show && (
        <div className="form-card">
          <h3 className="form-title">{editing ? "Edit Special Service" : "Add Special Service"}</h3>
          <form onSubmit={handleSubmit}>
            {[["name", "Service Name *", "Automatic Gear Box Repairing"], ["tagline", "Tagline *", "Smooth Shifting. Zero Compromise."]].map(([k, l, p]) => (
              <div key={k} className="form-group"><label className="form-label">{l}</label><input type="text" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required placeholder={p} className="form-input" /></div>
            ))}
            {[["description", "Short Description *", "Brief description", 2, true], ["content", "Full Content *", "Full service details", 5, true]].map(([k, l, p, rows, req]) => (
              <div key={k} className="form-group"><label className="form-label">{l}</label><textarea value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required={req} rows={rows} placeholder={p} className="form-textarea" /></div>
            ))}
            <div className="form-group">
              <label className="form-label">Hero Image * {editing && "— upload new to replace"}</label>
              <input type="file" name="ssHeroImage" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setHeroPreview(URL.createObjectURL(f)); }} className="form-input" style={{ padding: "0.5rem" }} required={!editing} />
              <ImagePreview src={heroPreview || (!heroPreview && editing && form.heroImage ? form.heroImage : null)} style={{ width: "100%", maxWidth: "24rem", height: "auto" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Content Image * {editing && "— upload new to replace"}</label>
              <input type="file" name="ssContentImage" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setContentPreview(URL.createObjectURL(f)); }} className="form-input" style={{ padding: "0.5rem" }} required={!editing} />
              <ImagePreview src={contentPreview || (!contentPreview && editing && form.contentImage ? form.contentImage : null)} style={{ width: "100%", maxWidth: "16rem", height: "auto" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} min="0" className="form-input" />
            </div>
            <FormActions uploading={uploading} editing={editing} onCancel={reset} saveLabel="Special Service" />
          </form>
        </div>
      )}
      {!services.length ? <EmptyState icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" text="No special services added" sub='Click "Add Special Service" to get started' /> : (
        <div className="card-grid">
          {[...services].sort((a, b) => a.order - b.order).map(s => (
            <div key={s._id} className="card">
              {s.heroImage && <img src={s.heroImage} alt={s.name} style={{ width: "100%", height: "12rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "1rem" }} />}
              <h3 className="card-title">{s.name}</h3>
              <p className="card-subtitle" style={{ color: "rgb(252,165,165)", fontStyle: "italic" }}>"{s.tagline}"</p>
              <p className="text-gray text-sm mb-3">{s.description?.substring(0, 100)}...</p>
              {s.contentImage && <div className="mb-3 p-3" style={{ background: "rgba(59,130,246,0.1)", borderRadius: "0.5rem" }}><img src={s.contentImage} alt="content" style={{ width: "100%", height: "7rem", objectFit: "cover", borderRadius: "0.375rem" }} /></div>}
              <p className="text-xs text-gray mb-4">Order: #{s.order}</p>
              <div className="card-actions">
                <button type="button" onClick={() => { setEditing(s); setForm(s); setShow(true); setHeroPreview(null); setContentPreview(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-edit">Edit</button>
                <button type="button" onClick={() => handleDelete(s._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Vehicle Brands Tab ──────────────────────────────────────────────────────
function VehicleBrandsTab({ brands, onRefresh, setMessage }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", models: "" });

  const reset = () => { setShow(false); setEditing(null); setForm({ name: "", models: "" }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const models = form.models.split(",").map(m => m.trim()).filter(Boolean);
      const body = editing ? { ...form, models, _id: editing._id } : { ...form, models };
      const data = await fetch("/api/vehicle-brands", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
      if (data.success) { setMessage(editing ? "✅ Brand updated!" : "✅ Brand added!"); reset(); onRefresh(); setTimeout(() => setMessage(""), 3000); }
      else throw new Error(data.error);
    } catch (err) { setMessage("❌ " + err.message); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    const data = await fetch(`/api/vehicle-brands?id=${id}`, { method: "DELETE" }).then(r => r.json());
    if (data.success) { setMessage("✅ Deleted!"); onRefresh(); setTimeout(() => setMessage(""), 3000); }
  };

  return (
    <div>
      <div className="section-header">
        <div><h2 className="section-title">Vehicle Brands</h2><p className="section-subtitle">Brands & models for booking form</p></div>
        <button onClick={() => { setShow(true); setEditing(null); setForm({ name: "", models: "" }); }} className="btn-primary">
          <SVG path="M12 4v16m8-8H4" className="icon-sm" /> Add Brand
        </button>
      </div>
      {show && (
        <div className="form-card">
          <h3 className="form-title">{editing ? "Edit Brand" : "Add Brand"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Brand Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Mahindra" className="form-input" /></div>
            <div className="form-group"><label className="form-label">Models * (comma-separated)</label><textarea value={form.models} onChange={e => setForm({ ...form, models: e.target.value })} required rows={3} placeholder="Thar, Scorpio, XUV700" className="form-textarea" /></div>
            <FormActions uploading={loading} editing={editing} onCancel={reset} saveLabel="Brand" />
          </form>
        </div>
      )}
      {!brands.length ? <EmptyState icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" text="No brands added" /> : (
        <div className="card-grid">
          {brands.map(b => (
            <div key={b._id} className="card">
              <h3 className="card-title"><span className="card-icon">🏢</span>{b.name}</h3>
              <p className="card-subtitle">Slug: {b.slug}</p>
              <div className="badge-grid mb-4">{(b.models || []).map((m, i) => <span key={i} className="badge">{m}</span>)}</div>
              <div className="card-actions">
                <button type="button" onClick={() => { setEditing(b); setForm({ name: b.name, models: b.models.join(", ") }); setShow(true); }} className="btn-edit">Edit</button>
                <button type="button" onClick={() => handleDelete(b._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Car Brands Tab ──────────────────────────────────────────────────────────
function CarBrandsTab({ brands, onRefresh, setMessage }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: "", logo: "", cloudinaryPublicId: "" });

  const reset = () => { setShow(false); setEditing(null); setForm({ name: "", logo: "", cloudinaryPublicId: "" }); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const file = document.querySelector('input[name="carBrandLogo"]')?.files[0];
      let logoUrl = form.logo, publicId = form.cloudinaryPublicId;
      if (file) { const r = await uploadToCloudinary(file, "automotive-carcare/car-brands"); logoUrl = r.url; publicId = r.publicId; }
      if (!logoUrl || !publicId) throw new Error("Please select a logo");
      const body = editing ? { ...form, logo: logoUrl, cloudinaryPublicId: publicId, _id: editing._id } : { ...form, logo: logoUrl, cloudinaryPublicId: publicId };
      const data = await fetch("/api/car-brands", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
      if (data.success) { setMessage(editing ? "✅ Brand updated!" : "✅ Brand added!"); reset(); onRefresh(); setTimeout(() => setMessage(""), 3000); }
      else throw new Error(data.error);
    } catch (err) { setMessage("❌ " + err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    const data = await fetch(`/api/car-brands?id=${id}`, { method: "DELETE" }).then(r => r.json());
    if (data.success) { setMessage("✅ Deleted!"); onRefresh(); setTimeout(() => setMessage(""), 3000); }
  };

  return (
    <div>
      <div className="section-header">
        <div><h2 className="section-title">🏢 Car Brands</h2><p className="section-subtitle">Brands with logos for brand pages</p></div>
        <button onClick={() => { setShow(true); setEditing(null); setForm({ name: "", logo: "", cloudinaryPublicId: "" }); setPreview(null); }} className="btn-primary">
          <SVG path="M12 4v16m8-8H4" className="icon-sm" /> Add Brand
        </button>
      </div>
      {show && (
        <div className="form-card">
          <h3 className="form-title">{editing ? "Edit Brand" : "Add Brand"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Brand Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Toyota" className="form-input" /></div>
            <div className="form-group">
              <label className="form-label">Brand Logo * {editing && "(Upload new to replace)"}</label>
              <input type="file" name="carBrandLogo" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); }} className="form-input" style={{ padding: "0.5rem" }} required={!editing} />
              <ImagePreview src={preview || (!preview && editing && form.logo ? form.logo : null)} style={{ width: "10rem", height: "10rem", objectFit: "contain", background: "#f3f4f6" }} />
            </div>
            <FormActions uploading={uploading} editing={editing} onCancel={reset} saveLabel="Brand" />
          </form>
        </div>
      )}
      {!brands.length ? <EmptyState icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" text="No car brands added" /> : (
        <div className="card-grid">
          {brands.map(b => (
            <div key={b._id} className="card">
              <img src={b.logo} alt={b.name} style={{ width: "100%", height: "10rem", objectFit: "contain", borderRadius: "0.5rem", marginBottom: "1rem", background: "#f3f4f6" }} />
              <h3 className="card-title">{b.name}</h3>
              <p className="text-sm text-gray mb-4">Slug: {b.brandSlug}</p>
              <div className="card-actions">
                <button onClick={() => { setEditing(b); setForm(b); setShow(true); setPreview(null); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Car Models Tab ──────────────────────────────────────────────────────────
function CarModelsTab({ models, onRefresh, setMessage }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ brand: "", name: "", image: "", cloudinaryPublicId: "", serviceCount: 6 });

  const reset = () => { setShow(false); setEditing(null); setForm({ brand: "", name: "", image: "", cloudinaryPublicId: "", serviceCount: 6 }); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const file = document.querySelector('input[name="carModelImage"]')?.files[0];
      let imageUrl = form.image, publicId = form.cloudinaryPublicId;
      if (file) { const r = await uploadToCloudinary(file, "automotive-carcare/car-models"); imageUrl = r.url; publicId = r.publicId; }
      if (!imageUrl || !publicId) throw new Error("Please select an image");
      const body = editing ? { ...form, image: imageUrl, cloudinaryPublicId: publicId, _id: editing._id } : { ...form, image: imageUrl, cloudinaryPublicId: publicId };
      const data = await fetch("/api/car-models", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
      if (data.success) { setMessage(editing ? "✅ Model updated!" : "✅ Model added!"); reset(); onRefresh(); setTimeout(() => setMessage(""), 3000); }
      else throw new Error(data.error);
    } catch (err) { setMessage("❌ " + err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    const data = await fetch(`/api/car-models?id=${id}`, { method: "DELETE" }).then(r => r.json());
    if (data.success) { setMessage("✅ Deleted!"); onRefresh(); setTimeout(() => setMessage(""), 3000); }
  };

  return (
    <div>
      <div className="section-header">
        <div><h2 className="section-title">🚗 Car Models</h2><p className="section-subtitle">Models with images for brand pages</p></div>
        <button onClick={() => { setShow(true); setEditing(null); setForm({ brand: "", name: "", image: "", cloudinaryPublicId: "", serviceCount: 6 }); setPreview(null); }} className="btn-primary">
          <SVG path="M12 4v16m8-8H4" className="icon-sm" /> Add Model
        </button>
      </div>
      {show && (
        <div className="form-card">
          <h3 className="form-title">{editing ? "Edit Car Model" : "Add Car Model"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Brand Name *</label><input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required placeholder="Toyota" className="form-input" /></div>
            <div className="form-group"><label className="form-label">Model Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Fortuner" className="form-input" /></div>
            <div className="form-group"><label className="form-label">Service Count</label><input type="number" value={form.serviceCount} onChange={e => setForm({ ...form, serviceCount: parseInt(e.target.value) })} min="1" className="form-input" /></div>
            <div className="form-group">
              <label className="form-label">Model Image * {editing && "(Upload new to replace)"}</label>
              <input type="file" name="carModelImage" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); }} className="form-input" style={{ padding: "0.5rem" }} required={!editing} />
              <ImagePreview src={preview || (!preview && editing && form.image ? form.image : null)} style={{ width: "16rem", height: "10rem", objectFit: "contain", background: "#f3f4f6" }} />
            </div>
            <FormActions uploading={uploading} editing={editing} onCancel={reset} saveLabel="Model" />
          </form>
        </div>
      )}
      {!models.length ? <EmptyState icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" text="No car models added" /> : (
        <div className="card-grid">
          {models.map(m => (
            <div key={m._id} className="card">
              <img src={m.image} alt={m.name} style={{ width: "100%", height: "10rem", objectFit: "contain", borderRadius: "0.5rem", marginBottom: "1rem", background: "#f3f4f6" }} />
              <h3 className="card-title">{m.name}</h3>
              <p className="card-subtitle">🏢 {m.brand}</p>
              <p className="text-sm text-gray mb-2">Slug: {m.slug}</p>
              <p className="text-sm text-gray mb-4">📋 {m.serviceCount} Services</p>
              <div className="card-actions">
                <button onClick={() => { setEditing(m); setForm(m); setShow(true); setPreview(null); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(m._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Hero Images Tab ─────────────────────────────────────────────────────────
function HeroImagesTab({ images, onRefresh, setMessage }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return setMessage("Please select a file");
    setUploading(true);
    try {
      await uploadToCloudinary(file, "automotive-carcare/hero-images");
      setMessage("✅ Image uploaded!"); setPreview(null); e.target.reset(); onRefresh();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { setMessage("❌ " + err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (publicId) => {
    if (!confirm("Delete this image?")) return;
    const data = await fetch("/api/cloudinary-delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId }) }).then(r => r.json());
    if (data.success) { setMessage("✅ Deleted!"); onRefresh(); setTimeout(() => setMessage(""), 3000); }
  };

  return (
    <div>
      <div className="section-header"><div><h2 className="section-title">Hero Images</h2><p className="section-subtitle">Homepage hero carousel images</p></div></div>
      <div className="form-card">
        <h3 className="form-title">Upload New Hero Image</h3>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label className="form-label">Select Image *</label>
            <input type="file" name="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); }} required className="form-input" style={{ padding: "0.5rem" }} />
            <ImagePreview src={preview} style={{ width: "100%", maxWidth: "20rem", height: "auto" }} />
          </div>
          <button type="submit" disabled={uploading} className="btn-primary" style={{ width: "100%" }}>
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>
      {!images.length ? <EmptyState icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" text="No hero images uploaded" /> : (
        <div className="card-grid">
          {images.map(img => (
            <div key={img.public_id} className="card">
              <img src={img.secure_url} alt="Hero" style={{ width: "100%", height: "12rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "1rem" }} />
              <p className="text-xs text-gray mb-2 truncate">ID: {img.public_id}</p>
              <p className="text-xs text-gray mb-4">Size: {(img.bytes / 1024).toFixed(2)} KB</p>
              <button onClick={() => handleDelete(img.public_id)} className="btn-delete" style={{ width: "100%" }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Root Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [data, setData] = useState({ bookings: [], services: [], detailedServices: [], specialServices: [], vehicleBrands: [], carBrands: [], carModels: [], heroImages: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoints = [
        ["/api/bookings", "bookings"],
        ["/api/cloudinary-images", "images"],
        ["/api/services", "services"],
        ["/api/detailed-services", "services", "detailedServices"],
        ["/api/vehicle-brands", "brands", "vehicleBrands"],
        ["/api/car-brands", "brands", "carBrands"],
        ["/api/car-models", "models", "carModels"],
        ["/api/special-services", "services", "specialServices"],
      ];
      const results = await Promise.all(endpoints.map(([url]) => fetch(url).then(r => r.ok ? r.json() : {}).catch(() => ({}))));
      setData({
        bookings: results[0].bookings || [],
        heroImages: results[1].images || [],
        services: results[2].services || [],
        detailedServices: results[3].services || [],
        vehicleBrands: results[4].brands || [],
        carBrands: results[5].brands || [],
        carModels: results[6].models || [],
        specialServices: results[7].services || [],
      });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) { router.push("/admin-login"); return; }
    fetchData();
  }, [router, fetchData]);

  const tabs = [
    { id: "bookings", label: "Bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", count: data.bookings.length },
    { id: "services", label: "Services", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", count: data.services.length },
    { id: "detailed-services", label: "General Services", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", count: data.detailedServices.length },
    { id: "special-services", label: "Special Services", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", count: data.specialServices.length },
    { id: "vehicle-brands", label: "Vehicle Brands", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", count: data.vehicleBrands.length },
    { id: "car-brands", label: "Car Brands", icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18", count: data.carBrands.length },
    { id: "car-models", label: "Car Models", icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z", count: data.carModels.length },
    { id: "hero-images", label: "Hero Images", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", count: data.heroImages.length },
  ];

  const handleAcceptBooking = async (booking) => {
    if (!confirm(`Accept booking from ${booking.name}?`)) return;
    const id = typeof booking._id === "object" ? (booking._id.$oid || booking._id.toString()) : booking._id;
    const res = await fetch("/api/bookings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id: id, status: "confirmed" }) }).then(r => r.json());
    if (res.success) { setMessage("✅ Booking accepted!"); fetchData(); setTimeout(() => setMessage(""), 3000); }
  };

  const handleDeleteBooking = async (booking) => {
    if (!confirm(`Delete booking from ${booking.name}?`)) return;
    const id = typeof booking._id === "object" ? booking._id.toString() : booking._id;
    const res = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" }).then(r => r.json());
    if (res.success) { setMessage("✅ Booking deleted!"); fetchData(); setTimeout(() => setMessage(""), 3000); }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-content"><div className="spinner"></div><div className="loading-text">Loading...</div></div>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button type="button" onClick={() => { localStorage.removeItem("adminAuth"); router.push("/admin-login"); }} className="logout-btn">
            <SVG path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Main Content */}
        <main className="main-content">
          {message && (
            <div className={`message-box ${message.includes("✅") || message.includes("success") ? "success" : "error"}`}>
              <SVG path={message.includes("✅") || message.includes("success") ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"} className="message-icon" />
              <span>{message}</span>
            </div>
          )}
          {activeTab === "bookings" && <BookingsTab bookings={data.bookings} onAccept={handleAcceptBooking} onDelete={handleDeleteBooking} />}
          {activeTab === "services" && <ServicesTab services={data.services} onRefresh={fetchData} setMessage={setMessage} />}
          {activeTab === "detailed-services" && <DetailedServicesTab services={data.detailedServices} onRefresh={fetchData} setMessage={setMessage} />}
          {activeTab === "special-services" && <SpecialServicesTab services={data.specialServices} onRefresh={fetchData} setMessage={setMessage} />}
          {activeTab === "vehicle-brands" && <VehicleBrandsTab brands={data.vehicleBrands} onRefresh={fetchData} setMessage={setMessage} />}
          {activeTab === "car-brands" && <CarBrandsTab brands={data.carBrands} onRefresh={fetchData} setMessage={setMessage} />}
          {activeTab === "car-models" && <CarModelsTab models={data.carModels} onRefresh={fetchData} setMessage={setMessage} />}
          {activeTab === "hero-images" && <HeroImagesTab images={data.heroImages} onRefresh={fetchData} setMessage={setMessage} />}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <p className="sidebar-label">Navigation</p>
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}>
                <SVG path={tab.icon} className="icon-sm" />
                <span className="sidebar-tab-label">{tab.label}</span>
                <span className="sidebar-count">{tab.count}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}