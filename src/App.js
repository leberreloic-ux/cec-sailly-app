import { useState, useRef } from "react";

const TABS = ["Accueil", "Actus", "Agenda", "Facebook", "Carte", "Astuces", "Contact"];
const ICONS = ["🏠", "🔔", "📅", "📘", "💳", "💡", "📞"];
const ADMIN_PIN = "1411";

const FB_POSTS = [
  { id: 1, time: "Il y a 2h", text: "Super séance d'agilité ce matin avec nos jeunes chiens ! Bravo à tous les maîtres. A samedi !", likes: 24, comments: 5 },
  { id: 2, time: "Il y a 1 jour", text: "Rappel : réunion de bureau mardi 24 mars à 20h à la salle des fêtes. Tous les membres sont les bienvenus.", likes: 12, comments: 2 },
];

const ASTUCES = [
  { id: 1, emoji: "🐕", titre: "Gérer l'agressivité du chien en laisse", resume: "Stratégies et Fleurs de Bach pour garder son sang-froid en balade face à la réactivité en laisse.", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/agressivite-chien-laisse-fleurs-de-bach" },
  { id: 2, emoji: "🧦", titre: "Mon chien a mangé une chaussette", resume: "Chiot ou adulte, votre chien peut avaler un vêtement. Que faire si vous le prenez sur le fait ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-mang%C3%A9-une-chaussette" },
  { id: 3, emoji: "🧴", titre: "Mon chien a bu du détergent", resume: "La maison peut être dangereuse pour votre chien. Que faire en cas d'ingestion de produit ménager ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-bu-du-d%C3%A9tergent" },
  { id: 4, emoji: "🕷️", titre: "Les tiques", resume: "La tique est un acarien parasite qui guette le passage d'un hôte. Comment la reconnaître et la retirer ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/les-tiques" },
  { id: 5, emoji: "🐸", titre: "Mon chien a mangé un crapaud", resume: "Nos compagnons sont très curieux et peuvent tomber nez à nez avec un crapaud. Les bons réflexes.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-mang%C3%A9-un-crapaud" },
  { id: 6, emoji: "🩹", titre: "Mon chien s'est fait une plaie", resume: "Comme nous, les chiens peuvent se blesser. En fonction de la gravité, voici comment réagir.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-s-est-fait-une-plaie" },
  { id: 7, emoji: "🪼", titre: "Piqure de méduse", resume: "Vous emmenez votre chien à la mer ? Voici quoi faire en cas de contact avec une méduse.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/piq%C3%BBre-de-m%C3%A9duse" },
  { id: 8, emoji: "🐾", titre: "Coupure du coussinet", resume: "En promenade ou à la maison, votre chien peut s'ouvrir les coussinets. Les gestes à adopter.", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/coupure-du-coussinet" },
  { id: 9, emoji: "🐝", titre: "Piqure de guêpe ou abeille", resume: "La curiosité de nos compagnons peut leur coûter cher face à une guêpe ou une abeille.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/piq%C3%BBre-de-gu%C3%AApe-ou-abeille" },
  { id: 10, emoji: "🐶", titre: "Morsures entre congénères", resume: "Les chiens ne peuvent pas toujours s'entendre. Comment réagir en cas de morsure par un autre chien ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/morsures-cong%C3%A9n%C3%A8res" },
  { id: 11, emoji: "🔥", titre: "Brulures", resume: "Barbecue, huile de friture ou sol trop chaud : comment soigner une brûlure chez le chien.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/brulures" },
  { id: 12, emoji: "🐍", titre: "Morsure de serpent", resume: "En France, les vipères sont dangereuses pour nos chiens. Les bons réflexes si cela arrive.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-s-est-fait-mordre-par-un-serpent" },
  { id: 13, emoji: "🚗", titre: "Mon chien a été percuté par une voiture", resume: "Si votre chien se fait renverser, voici la marche à suivre pour ne pas aggraver la situation.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-%C3%A9t%C3%A9-percut%C3%A9-par-une-voiture" },
  { id: 14, emoji: "🤕", titre: "Mon chien boite : entorse", resume: "Comme pour l'humain, une entorse peut être plus ou moins grave. Comment la reconnaître ?", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/mon-chien-bo%C3%AEte-entorse" },
  { id: 15, emoji: "🚙", titre: "Mon chien est malade en voiture", resume: "Vomissements, salivation, prostration : les solutions pour que les trajets se passent mieux.", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/mon-chien-est-malade-en-voiture" },
];

const S = {
  page: { padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  card: { background: "white", borderRadius: 16, padding: 16, border: "1px solid #f3f4f6" },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  btnPink: { fontSize: 12, padding: "6px 12px", borderRadius: 999, color: "white", fontWeight: 500, background: "linear-gradient(135deg,#ec4899,#be185d)", border: "none", cursor: "pointer" },
  title: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  input: { width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 },
  modal: { background: "white", borderRadius: 24, padding: 24, width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 12 },
};

function PinModal({ onSuccess, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const handleDigit = (d) => {
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (next === ADMIN_PIN) { onSuccess(); setPin(""); }
      else { setError(true); setTimeout(() => { setPin(""); setError(false); }, 800); }
    }
  };
  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28 }}>🔐</div>
          <div style={{ fontWeight: "bold", color: "#1f2937", marginTop: 4 }}>Code administrateur</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Entrez votre code PIN à 4 chiffres</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", border: error ? "2px solid #f87171" : pin.length > i ? "2px solid #a855f7" : "2px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: "bold", background: error ? "#fef2f2" : pin.length > i ? "#faf5ff" : "white" }}>
              {pin.length > i ? "●" : ""}
            </div>
          ))}
        </div>
        {error && <div style={{ textAlign: "center", fontSize: 12, color: "#ef4444" }}>Code incorrect</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d, i) => (
            <button key={i} onClick={() => { if (d === "⌫") setPin(p => p.slice(0,-1)); else if (d !== "") handleDigit(String(d)); }} disabled={d === ""}
              style={{ height: 48, borderRadius: 12, fontSize: 18, fontWeight: "bold", background: d === "" ? "transparent" : "#f3f4f6", color: "#1f2937", border: "none", cursor: d === "" ? "default" : "pointer", visibility: d === "" ? "hidden" : "visible" }}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={onCancel} style={{ width: "100%", padding: 8, fontSize: 14, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>Annuler</button>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ background: "linear-gradient(135deg,#6b7280 0%,#9ca3af 50%,#ec4899 100%)", padding: 16, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
        <img src="/logo.png" alt="CEC" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
      </div>
      <div>
        <div style={{ fontWeight: "bold", fontSize: 16, color: "white", lineHeight: 1.2 }}>CEC Sailly-sur-la-Lys</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Club d'Education Canine</div>
      </div>
    </div>
  );
}

function Home({ setTab }) {
  return (
    <div style={S.page}>
      <div style={{ borderRadius: 16, padding: 16, background: "linear-gradient(135deg,#f9fafb,#fce7f3)", border: "1px solid #f9a8d4" }}>
        <p style={{ fontWeight: "bold", fontSize: 14, color: "#be185d" }}>Bienvenue ! 👋</p>
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>CEC Sailly-sur-la-Lys — Club d'Education Canine</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { icon: "🔔", label: "Actualités", sub: "Infos du club", tab: 1, grad: "linear-gradient(135deg,#6b7280,#9ca3af)" },
          { icon: "📅", label: "Agenda", sub: "Événements", tab: 2, grad: "linear-gradient(135deg,#ec4899,#f9a8d4)" },
          { icon: "📘", label: "Facebook", sub: "Posts récents", tab: 3, grad: "linear-gradient(135deg,#3b82f6,#6366f1)" },
          { icon: "💳", label: "Ma Carte", sub: "Photo de carte", tab: 4, grad: "linear-gradient(135deg,#be185d,#ec4899)" },
        ].map(item => (
          <button key={item.label} onClick={() => setTab(item.tab)}
            style={{ background: item.grad, borderRadius: 16, padding: 16, color: "white", textAlign: "left", border: "none", cursor: "pointer" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{item.sub}</div>
          </button>
        ))}
      </div>
      <button onClick={() => setTab(6)} style={{ width: "100%", padding: 12, borderRadius: 12, color: "white", fontSize: 14, fontWeight: 500, background: "linear-gradient(135deg,#6b7280,#ec4899)", border: "none", cursor: "pointer" }}>
        📞 Contacter le président
      </button>
    </div>
  );
}

function News({ news, setNews }) {
  const [expanded, setExpanded] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [pinAction, setPinAction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tag: "Info" });

  const askPin = (action) => { setPinAction(() => action); setShowPin(true); };

  const handleAdd = () => {
    if (!form.title || !form.body) return;
    const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    setNews([{ id: Date.now(), date: today, ...form }, ...news]);
    setForm({ title: "", body: "", tag: "Info" });
    setShowForm(false);
  };

  return (
    <div style={S.page}>
      <div style={S.row}>
        <h2 style={S.title}>🔔 Actualités</h2>
        <button style={S.btnPink} onClick={() => askPin(() => setShowForm(true))}>+ Ajouter</button>
      </div>
      {news.length === 0 && <div style={{ ...S.card, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Aucune actualité pour le moment</div>}
      {news.map(n => (
        <button key={n.id} onClick={() => setExpanded(expanded === n.id ? null : n.id)}
          style={{ ...S.card, width: "100%", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={S.row}>
            <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: n.tag === "Événement" ? "#fae8ff" : n.tag === "Horaires" ? "#fce7f3" : "#f3f4f6", color: n.tag === "Événement" ? "#a21caf" : n.tag === "Horaires" ? "#be185d" : "#4b5563" }}>{n.tag}</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{n.date}</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>{n.title}</div>
          {expanded === n.id
            ? <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>{n.body}
                <div style={{ marginTop: 8 }}>
                  <button onClick={e => { e.stopPropagation(); askPin(() => { setNews(news.filter(x => x.id !== n.id)); setExpanded(null); }); }}
                    style={{ fontSize: 12, color: "#f87171", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>🗑 Supprimer</button>
                </div>
              </div>
            : <div style={{ fontSize: 12, color: "#9ca3af" }}>Appuyer pour lire…</div>}
        </button>
      ))}
      {showPin && <PinModal onSuccess={() => { setShowPin(false); if (pinAction) { pinAction(); setPinAction(null); } }} onCancel={() => { setShowPin(false); setPinAction(null); }} />}
      {showForm && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{ fontWeight: "bold", textAlign: "center", color: "#1f2937" }}>📢 Nouvelle actualité</div>
            <div><div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Titre *</div>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ex: Entrainement annulé" style={S.input} /></div>
            <div><div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Message *</div>
              <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} placeholder="Détails…" rows={3} style={{ ...S.input, resize: "none" }} /></div>
            <div><div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Catégorie</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Info","Événement","Horaires"].map(t => (
                  <button key={t} onClick={() => setForm({...form, tag: t})}
                    style={{ flex: 1, padding: 6, borderRadius: 12, fontSize: 12, fontWeight: 500, border: form.tag === t ? "none" : "1px solid #e5e7eb", background: form.tag === t ? "linear-gradient(135deg,#ec4899,#be185d)" : "white", color: form.tag === t ? "white" : "#6b7280", cursor: "pointer" }}>{t}</button>
                ))}
              </div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 14, color: "#6b7280", background: "white", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleAdd} style={{ flex: 1, padding: 10, borderRadius: 12, fontSize: 14, color: "white", fontWeight: 500, background: "linear-gradient(135deg,#ec4899,#be185d)", border: "none", cursor: "pointer" }}>Publier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Agenda({ events, setEvents }) {
  const [selected, setSelected] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [pinAction, setPinAction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", day: "", title: "", time: "", place: "" });

  const askPin = (action) => { setPinAction(() => action); setShowPin(true); };

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    setEvents([...events, { ...form, id: Date.now() }]);
    setForm({ date: "", day: "", title: "", time: "", place: "" });
    setShowForm(false);
  };

  return (
    <div style={S.page}>
      <div style={S.row}>
        <h2 style={S.title}>📅 Agenda du club</h2>
        <button style={S.btnPink} onClick={() => askPin(() => setShowForm(true))}>+ Ajouter</button>
      </div>
      {events.length === 0 && <div style={{ ...S.card, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Aucun événement pour le moment</div>}
      {events.map(e => (
        <button key={e.id} onClick={() => setSelected(selected === e.id ? null : e.id)}
          style={{ ...S.card, width: "100%", textAlign: "left", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ borderRadius: 12, textAlign: "center", padding: "6px 10px", color: "white", fontSize: 12, fontWeight: "bold", flexShrink: 0, width: 56, background: "linear-gradient(135deg,#ec4899,#be185d)" }}>
              {e.day && <div style={{ fontSize: 11, opacity: 0.8 }}>{e.day}</div>}
              <div style={{ fontSize: 14, fontWeight: "bold" }}>{e.date}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>{e.title}</div>
              {e.time && <div style={{ fontSize: 12, color: "#9ca3af" }}>{e.time}</div>}
              {selected === e.id && (
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {e.place && <div style={{ fontSize: 12, color: "#4b5563" }}>📍 {e.place}</div>}
                  <button onClick={ev => { ev.stopPropagation(); askPin(() => { setEvents(events.filter(x => x.id !== e.id)); setSelected(null); }); }}
                    style={{ fontSize: 12, color: "#f87171", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textAlign: "left" }}>🗑 Supprimer</button>
                </div>
              )}
            </div>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ec4899", flexShrink: 0 }} />
          </div>
        </button>
      ))}
      {showPin && <PinModal onSuccess={() => { setShowPin(false); if (pinAction) { pinAction(); setPinAction(null); } }} onCancel={() => { setShowPin(false); setPinAction(null); }} />}
      {showForm && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{ fontWeight: "bold", textAlign: "center", color: "#1f2937" }}>Nouvel événement</div>
            {[{label:"Titre *",key:"title",ph:"Ex: Entrainement"},{label:"Date *",key:"date",ph:"Ex: 5 avr."},{label:"Jour",key:"day",ph:"Ex: Sam"},{label:"Horaire",key:"time",ph:"Ex: 09h00 - 12h00"},{label:"Lieu",key:"place",ph:"Ex: Rue de la Gare"}].map(f => (
              <div key={f.key}><div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} placeholder={f.ph} style={S.input} /></div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 14, color: "#6b7280", background: "white", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleAdd} style={{ flex: 1, padding: 10, borderRadius: 12, fontSize: 14, color: "white", fontWeight: 500, background: "linear-gradient(135deg,#ec4899,#be185d)", border: "none", cursor: "pointer" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Facebook() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const PAGE_ID = "587854675045442";
  const TOKEN = process.env.REACT_APP_FB_TOKEN;

  useState(() => {
    fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,created_time,likes.summary(true),comments.summary(true)&access_token=${TOKEN}`)
      .then(r => r.json())
      .then(data => {
        if (data.data) { setPosts(data.data.slice(0, 5)); }
        else { setError(true); }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  };

  return (
    <div style={S.page}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: "bold" }}>f</div>
        <h2 style={S.title}>Page Facebook</h2>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 999, color: "#be185d", background: "#fce7f3" }}>En direct</span>
      </div>
      <div style={{ borderRadius: 12, padding: "8px 12px", fontSize: 12, border: "1px solid #f9a8d4", background: "#fce7f3", color: "#be185d" }}>
        Connecté à : <strong>CEC Sailly-sur-la-Lys</strong>
      </div>
      {loading && <div style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>🐾 Chargement des posts…</div>}
      {error && <div style={{ textAlign: "center", padding: 32, color: "#9ca3af", fontSize: 14 }}>Impossible de charger les posts.<br />Vérifiez le token Facebook.</div>}
      {posts.map(p => (
        <div key={p.id} style={{ ...S.card, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6b7280,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: "bold" }}>CEC</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1f2937" }}>CEC Sailly-sur-la-Lys</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{formatDate(p.created_time)}</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{p.message}</p>
          <div style={{ display: "flex", gap: 16, paddingTop: 8, borderTop: "1px solid #f9fafb" }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>👍 {p.likes?.summary?.total_count || 0}</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>💬 {p.comments?.summary?.total_count || 0}</span>
          </div>
        </div>
      ))}
      <a href="https://www.facebook.com/cecsaillysurlalys" target="_blank" rel="noreferrer"
        style={{ display: "block", width: "100%", padding: 10, borderRadius: 12, color: "white", fontSize: 14, fontWeight: 500, textAlign: "center", background: "#1877f2", textDecoration: "none" }}>
        Voir la page complète
      </a>
    </div>
  );
}

function MemberCard() {
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef();
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={S.page}>
      <h2 style={S.title}>💳 Ma Carte de Membre</h2>
      <p style={{ fontSize: 12, color: "#6b7280" }}>Prenez en photo votre carte de membre pour la retrouver rapidement.</p>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
      {photo ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <img src={photo} alt="carte" style={{ width: "100%", objectFit: "cover", maxHeight: 220 }} />
          </div>
          <button onClick={() => setPhoto(null)} style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 14, color: "#6b7280", background: "white", cursor: "pointer" }}>🔄 Reprendre la photo</button>
        </div>
      ) : (
        <div onClick={() => fileRef.current.click()}
          style={{ borderRadius: 16, border: "2px dashed #e5e7eb", background: "#f9fafb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 12, cursor: "pointer" }}>
          <div style={{ fontSize: 48 }}>📷</div>
          <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>Photographier ma carte</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>Appuyez pour ouvrir l'appareil photo</div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <button onClick={() => fileRef.current.click()} style={{ padding: 12, borderRadius: 12, color: "white", fontSize: 14, fontWeight: 500, background: "#ec4899", border: "none", cursor: "pointer" }}>📸 Appareil photo</button>
        <button onClick={() => fileRef.current.click()} style={{ padding: 12, borderRadius: 12, color: "#374151", fontSize: 14, background: "white", border: "1px solid #e5e7eb", cursor: "pointer" }}>🖼️ Galerie</button>
      </div>
    </div>
  );
}

function Astuces() {
  const [filtre, setFiltre] = useState("Tous");
  const categories = ["Tous", "Premier secours", "Les bons gestes"];
  const filtered = filtre === "Tous" ? ASTUCES : ASTUCES.filter(a => a.tag === filtre);
  return (
    <div style={S.page}>
      <div style={S.row}>
        <h2 style={S.title}>💡 Trucs et Astuces</h2>
        <a href="https://www.cec-saillysurlalys.com/blog" target="_blank" rel="noreferrer"
          style={{ fontSize: 12, padding: "6px 12px", borderRadius: 999, color: "white", fontWeight: 500, background: "linear-gradient(135deg,#ec4899,#be185d)", textDecoration: "none" }}>Voir le blog</a>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFiltre(c)}
            style={{ flexShrink: 0, fontSize: 12, padding: "6px 12px", borderRadius: 999, fontWeight: 500, border: filtre === c ? "none" : "1px solid #e5e7eb", background: filtre === c ? "linear-gradient(135deg,#ec4899,#be185d)" : "white", color: filtre === c ? "white" : "#6b7280", cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>
      {filtered.map(a => (
        <a key={a.id} href={a.url} target="_blank" rel="noreferrer"
          style={{ display: "block", ...S.card, textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{a.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: a.tag === "Les bons gestes" ? "#fae8ff" : "#fee2e2", color: a.tag === "Les bons gestes" ? "#a21caf" : "#dc2626" }}>{a.tag}</span>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937", marginTop: 4 }}>{a.titre}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, lineHeight: 1.5 }}>{a.resume}</div>
              <div style={{ fontSize: 12, marginTop: 8, fontWeight: 500, color: "#ec4899" }}>Lire l'article →</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function Contact() {
  return (
    <div style={S.page}>
      <h2 style={S.title}>📞 Contact</h2>
      <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#fce7f3" }}>👨‍💼</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>Président</div>
          <div style={{ fontWeight: "bold", fontSize: 14, color: "#1f2937" }}>M. Yannick Le Berre</div>
          <div style={{ fontSize: 12, marginTop: 2, fontWeight: 500, color: "#ec4899" }}>06 22 85 96 46</div>
        </div>
        <a href="tel:0622859646" style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#be185d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, textDecoration: "none" }}>📞</a>
      </div>
      <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>📍 Adresse</div>
        <div style={{ fontSize: 14, color: "#4b5563" }}>Rue de la Gare<br />62840 Sailly-sur-la-Lys</div>
        <a href="https://share.google/FciL3IbUO1iIXCVdV" target="_blank" rel="noreferrer"
          style={{ display: "block", width: "100%", padding: 10, borderRadius: 12, color: "white", fontSize: 14, fontWeight: 500, textAlign: "center", background: "linear-gradient(135deg,#6b7280,#9ca3af)", textDecoration: "none" }}>
          🗺️ Ouvrir dans Google Maps
        </a>
      </div>
      <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>📧 Email</div>
        <a href="mailto:saillysurlalys.cec@gmail.com" style={{ fontSize: 14, color: "#ec4899", wordBreak: "break-all", textDecoration: "none" }}>saillysurlalys.cec@gmail.com</a>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginTop: 8 }}>🕐 Horaires d'entraînement</div>
        <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8 }}>
          <strong>Dimanche matin</strong><br />
          09h30 - 10h30 : chiens de plus de 9 mois<br />
          11h00 - 12h00 : chiens de moins de 9 mois<br /><br />
          <strong>Mercredi</strong><br />
          17h30 - 18h30 : sur demande
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  const screens = [
    <Home setTab={setTab} />,
    <News news={news} setNews={setNews} />,
    <Agenda events={events} setEvents={setEvents} />,
    <Facebook />,
    <MemberCard />,
    <Astuces />,
    <Contact />,
  ];

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", background: "#f9fafb", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Header />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>{screens[tab]}</div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "white", borderTop: "1px solid #f3f4f6", boxShadow: "0 -2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex" }}>
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)}
              style={{ flex: 1, padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, border: "none", background: "none", cursor: "pointer", color: tab === i ? "#ec4899" : "#9ca3af" }}>
              <span style={{ fontSize: 18 }}>{ICONS[i]}</span>
              <span style={{ fontSize: 9, fontWeight: 500 }}>{label}</span>
              {tab === i && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#ec4899" }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
