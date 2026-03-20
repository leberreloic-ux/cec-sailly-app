import { useState, useRef } from "react";

const TABS = ["Accueil", "Actualités", "Agenda", "Facebook", "Carte", "Astuces", "Contact"];
const ICONS = ["🏠", "🔔", "📅", "📘", "💳", "💡", "📞"];
const ADMIN_PIN = "1411";

const NEWS_INIT = [
  { id: 1, date: "20 mars 2026", title: "Entraînement annulé", body: "L'entraînement du samedi 21 mars est annulé en raison des conditions météo. Reprise le 28 mars.", tag: "Info" },
  { id: 2, date: "15 mars 2026", title: "Concours régional", body: "Inscriptions ouvertes pour le concours régional d'obéissance le 12 avril. Contactez le bureau.", tag: "Événement" },
];

const TAG_COLORS = {
  Info: "bg-gray-100 text-gray-600",
  Événement: "bg-fuchsia-100 text-fuchsia-700",
  Horaires: "bg-pink-100 text-pink-700",
};

const FB_POSTS = [
  { id: 1, time: "Il y a 2h", text: "🐕 Super séance d'agilité ce matin avec nos jeunes chiens ! Bravo à tous les maîtres pour leur implication. À samedi !", likes: 24, comments: 5 },
  { id: 2, time: "Il y a 1 jour", text: "📅 Rappel : réunion de bureau mardi 24 mars à 20h à la salle des fêtes. Tous les membres sont les bienvenus.", likes: 12, comments: 2 },
];

const INIT_EVENTS = [
  { id: 1, date: "28 mars", day: "Sam", title: "Reprise entraînement", time: "09h00 – 12h00", place: "Rue de la Gare, Sailly-sur-la-Lys" },
  { id: 2, date: "12 avr.", day: "Dim", title: "Concours régional obéissance", time: "08h30 – 17h00", place: "Stade de Lille" },
];

const ASTUCES = [
  { id: 1, emoji: "🐕", titre: "Gérer l'agressivité du chien en laisse", résumé: "Stratégies et Fleurs de Bach pour garder son sang-froid en balade face à la réactivité en laisse.", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/agressivite-chien-laisse-fleurs-de-bach" },
  { id: 2, emoji: "🧦", titre: "Mon chien a mangé une chaussette", résumé: "Chiot ou adulte, votre chien peut avaler un vêtement. Que faire si vous le prenez sur le fait ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-mangé-une-chaussette" },
  { id: 3, emoji: "🧴", titre: "Mon chien a bu du détergent", résumé: "La maison peut être dangereuse pour votre chien. Que faire en cas d'ingestion de produit ménager ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-bu-du-détergent" },
  { id: 4, emoji: "🕷️", titre: "Les tiques", résumé: "La tique est un acarien parasite qui guette le passage d'un hôte. Comment la reconnaître et la retirer ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/les-tiques" },
  { id: 5, emoji: "🐸", titre: "Mon chien a mangé un crapaud", résumé: "Nos compagnons sont très curieux et peuvent tomber nez à nez avec un crapaud. Les bons réflexes.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-mangé-un-crapaud" },
  { id: 6, emoji: "🩹", titre: "Mon chien s'est fait une plaie", résumé: "Comme nous, les chiens peuvent se blesser. En fonction de la gravité, voici comment réagir.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-s-est-fait-une-plaie" },
  { id: 7, emoji: "🪼", titre: "Piqûre de méduse", résumé: "Vous emmenez votre chien à la mer ? Voici quoi faire en cas de contact avec une méduse.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/piqûre-de-méduse" },
  { id: 8, emoji: "🐾", titre: "Coupure du coussinet", résumé: "En promenade ou à la maison, votre chien peut s'ouvrir les coussinets. Les gestes à adopter.", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/coupure-du-coussinet" },
  { id: 9, emoji: "🐝", titre: "Piqûre de guêpe ou abeille", résumé: "La curiosité de nos compagnons peut leur coûter cher face à une guêpe ou une abeille.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/piqûre-de-guêpe-ou-abeille" },
  { id: 10, emoji: "🐶", titre: "Morsures entre congénères", résumé: "Les chiens ne peuvent pas toujours s'entendre. Comment réagir en cas de morsure par un autre chien ?", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/morsures-congénères" },
  { id: 11, emoji: "🔥", titre: "Brûlures", résumé: "Barbecue, huile de friture ou sol trop chaud : comment soigner une brûlure chez le chien.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/brulures" },
  { id: 12, emoji: "🐍", titre: "Morsure de serpent", résumé: "En France, les vipères sont dangereuses pour nos chiens. Les bons réflexes si cela arrive.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-s-est-fait-mordre-par-un-serpent" },
  { id: 13, emoji: "🚗", titre: "Mon chien a été percuté par une voiture", résumé: "Si votre chien se fait renverser, voici la marche à suivre pour ne pas aggraver la situation.", tag: "Premier secours", url: "https://www.cec-saillysurlalys.com/post/mon-chien-a-été-percuté-par-une-voiture" },
  { id: 14, emoji: "🤕", titre: "Mon chien boîte : entorse", résumé: "Comme pour l'humain, une entorse peut être plus ou moins grave. Comment la reconnaître ?", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/mon-chien-boîte-entorse" },
  { id: 15, emoji: "🚙", titre: "Mon chien est malade en voiture", résumé: "Vomissements, salivation, prostration : les solutions pour que les trajets se passent mieux.", tag: "Les bons gestes", url: "https://www.cec-saillysurlalys.com/post/mon-chien-est-malade-en-voiture" },
];

const TAG_ASTUCES = {
  "Les bons gestes": "bg-fuchsia-100 text-fuchsia-700",
  "Premier secours": "bg-red-100 text-red-600",
};

function PinModal({ onSuccess, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const handleDigit = (d) => {
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (next === ADMIN_PIN) { onSuccess(); }
      else { setError(true); setTimeout(() => { setPin(""); setError(false); }, 800); }
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-xl">
        <div className="text-center mb-4">
          <div className="text-2xl mb-1">🔐</div>
          <div className="font-bold text-gray-800">Code administrateur</div>
          <div className="text-xs text-gray-400 mt-1">Entrez votre code PIN à 4 chiffres</div>
        </div>
        <div className="flex justify-center gap-3 mb-4">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-colors ${error ? "border-red-400 bg-red-50" : pin.length > i ? "border-fuchsia-500 bg-fuchsia-50" : "border-gray-200"}`}>
              {pin.length > i ? "●" : ""}
            </div>
          ))}
        </div>
        {error && <div className="text-center text-xs text-red-500 mb-2">Code incorrect</div>}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d, i) => (
            <button key={i} onClick={() => { if (d === "⌫") setPin(p => p.slice(0,-1)); else if (d !== "") handleDigit(String(d)); }} disabled={d === ""}
              className={`h-12 rounded-xl text-lg font-semibold transition-colors active:scale-95 ${d === "" ? "invisible" : "bg-gray-100 text-gray-800"}`}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={onCancel} className="w-full py-2 text-sm text-gray-400">Annuler</button>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="px-4 py-4 text-white flex items-center gap-3 shadow-lg"
      style={{ background: "linear-gradient(135deg,#6b7280 0%,#9ca3af 50%,#ec4899 100%)" }}>
      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src="/logo.png" alt="CEC" className="w-full h-full object-contain p-1" />
      </div>
      <div>
        <div className="font-bold text-base leading-tight">CEC Sailly-sur-la-Lys</div>
        <div className="text-white/70 text-xs">Club d'Éducation Canine</div>
      </div>
    </div>
  );
}

function Home({ setTab }) {
  return (
    <div className="p-4 space-y-4">
      <div className="rounded-2xl p-4 border" style={{ background: "linear-gradient(135deg,#f9fafb,#fce7f3)", borderColor: "#f9a8d4" }}>
        <p className="font-bold text-sm" style={{ color: "#be185d" }}>Bienvenue ! 👋</p>
        <p className="text-xs text-gray-500 mt-1">CEC Sailly-sur-la-Lys — Club d'Éducation Canine</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "🔔", label: "Actualités", sub: "Infos du club", tab: 1, grad: "linear-gradient(135deg,#6b7280,#9ca3af)" },
          { icon: "📅", label: "Agenda", sub: "Événements", tab: 2, grad: "linear-gradient(135deg,#ec4899,#f9a8d4)" },
          { icon: "📘", label: "Facebook", sub: "Posts récents", tab: 3, grad: "linear-gradient(135deg,#3b82f6,#6366f1)" },
          { icon: "💳", label: "Ma Carte", sub: "Photo de carte", tab: 4, grad: "linear-gradient(135deg,#be185d,#ec4899)" },
        ].map(item => (
          <button key={item.label} onClick={() => setTab(item.tab)}
            className="rounded-2xl p-4 text-white text-left shadow-sm active:scale-95 transition-transform"
            style={{ background: item.grad }}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-semibold text-sm">{item.label}</div>
            <div className="text-xs text-white/75 mt-0.5">{item.sub}</div>
          </button>
        ))}
      </div>
      <button onClick={() => setTab(6)}
        className="w-full py-3 rounded-xl text-white text-sm font-medium shadow"
        style={{ background: "linear-gradient(135deg,#6b7280,#ec4899)" }}>
        📞 Contacter le président
      </button>
    </div>
  );
}

function News() {
  const [news, setNews] = useState(NEWS_INIT);
  const [expanded, setExpanded] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tag: "Info" });

  const handleAdd = () => {
    if (!form.title || !form.body) return;
    const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    setNews([{ id: Date.now(), date: today, ...form }, ...news]);
    setForm({ title: "", body: "", tag: "Info" });
    setShowForm(false);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">🔔 Actualités</h2>
        <button onClick={() => setShowPin(true)}
          className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
          style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>+ Ajouter</button>
      </div>
      {news.map(n => (
        <button key={n.id} onClick={() => setExpanded(expanded === n.id ? null : n.id)}
          className="w-full text-left bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-1 active:scale-95 transition-transform">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[n.tag] || "bg-gray-100 text-gray-600"}`}>{n.tag}</span>
            <span className="text-xs text-gray-400">{n.date}</span>
          </div>
          <div className="font-semibold text-sm text-gray-800">{n.title}</div>
          {expanded === n.id
            ? <div className="text-xs text-gray-600 mt-1 leading-relaxed">{n.body}
                <div className="mt-2"><button onClick={e => { e.stopPropagation(); setNews(news.filter(x => x.id !== n.id)); setExpanded(null); }} className="text-xs text-red-400 underline">🗑 Supprimer</button></div>
              </div>
            : <div className="text-xs text-gray-400">Appuyer pour lire…</div>}
        </button>
      ))}
      {showPin && <PinModal onSuccess={() => { setShowPin(false); setShowForm(true); }} onCancel={() => setShowPin(false)} />}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-xl space-y-3">
            <div className="font-bold text-gray-800 text-center">📢 Nouvelle actualité</div>
            <div><div className="text-xs text-gray-500 mb-1">Titre *</div>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ex: Entraînement annulé"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-fuchsia-400" /></div>
            <div><div className="text-xs text-gray-500 mb-1">Message *</div>
              <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} placeholder="Détails…" rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-fuchsia-400 resize-none" /></div>
            <div><div className="text-xs text-gray-500 mb-1">Catégorie</div>
              <div className="flex gap-2">
                {["Info","Événement","Horaires"].map(t => (
                  <button key={t} onClick={() => setForm({...form, tag: t})}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form.tag === t ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-500"}`}
                    style={form.tag === t ? { background: "linear-gradient(135deg,#ec4899,#be185d)" } : {}}>{t}</button>
                ))}
              </div></div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500">Annuler</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>Publier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Agenda() {
  const [events, setEvents] = useState(INIT_EVENTS);
  const [selected, setSelected] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", day: "", title: "", time: "", place: "" });

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    setEvents([...events, { ...form, id: Date.now() }]);
    setForm({ date: "", day: "", title: "", time: "", place: "" });
    setShowForm(false);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">📅 Agenda du club</h2>
        <button onClick={() => setShowPin(true)}
          className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
          style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>+ Ajouter</button>
      </div>
      {events.map(e => (
        <button key={e.id} onClick={() => setSelected(selected === e.id ? null : e.id)}
          className="w-full text-left bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-95 transition-transform">
          <div className="flex items-center gap-3">
            <div className="rounded-xl text-center px-2.5 py-1.5 text-white text-xs font-bold flex-shrink-0 w-14"
              style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>
              {e.day && <div className="text-white/80 text-xs">{e.day}</div>}
              <div className="text-sm font-bold leading-tight">{e.date}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-800 truncate">{e.title}</div>
              {e.time && <div className="text-xs text-gray-400">{e.time}</div>}
              {selected === e.id && (
                <div className="mt-2 space-y-1">
                  {e.place && <div className="text-xs text-gray-600">📍 {e.place}</div>}
                  <button onClick={ev => { ev.stopPropagation(); setEvents(events.filter(x => x.id !== e.id)); setSelected(null); }}
                    className="text-xs text-red-400 underline">🗑 Supprimer</button>
                </div>
              )}
            </div>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#ec4899" }} />
          </div>
        </button>
      ))}
      {showPin && <PinModal onSuccess={() => { setShowPin(false); setShowForm(true); }} onCancel={() => setShowPin(false)} />}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-xl space-y-3">
            <div className="font-bold text-gray-800 text-center">➕ Nouvel événement</div>
            {[{label:"Titre *",key:"title",ph:"Ex: Entraînement"},{label:"Date *",key:"date",ph:"Ex: 5 avr."},{label:"Jour",key:"day",ph:"Ex: Sam"},{label:"Horaire",key:"time",ph:"Ex: 09h00 – 12h00"},{label:"Lieu",key:"place",ph:"Ex: Rue de la Gare"}].map(f => (
              <div key={f.key}><div className="text-xs text-gray-500 mb-1">{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} placeholder={f.ph}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-fuchsia-400" /></div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500">Annuler</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Facebook() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">f</div>
        <h2 className="text-base font-bold text-gray-800">Page Facebook</h2>
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: "#be185d", background: "#fce7f3" }}>● En direct</span>
      </div>
      <div className="rounded-xl px-3 py-2 text-xs border" style={{ background: "#fce7f3", borderColor: "#f9a8d4", color: "#be185d" }}>
        Connecté à : <strong>CEC Sailly-sur-la-Lys</strong>
      </div>
      {FB_POSTS.map(p => (
        <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6b7280,#ec4899)" }}>CEC</div>
            <div>
              <div className="text-xs font-semibold text-gray-800">CEC Sailly-sur-la-Lys</div>
              <div className="text-xs text-gray-400">{p.time}</div>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{p.text}</p>
          <div className="flex gap-4 pt-1 border-t border-gray-50">
            <span className="text-xs text-gray-400">👍 {p.likes}</span>
            <span className="text-xs text-gray-400">💬 {p.comments}</span>
          </div>
        </div>
      ))}
      <a href="https://www.facebook.com/cecsaillysurlalys" target="_blank" rel="noreferrer"
        className="block w-full py-2.5 rounded-xl text-white text-sm font-medium text-center" style={{ background: "#1877f2" }}>
        Voir la page complète →
      </a>
    </div>
  );
}

function MemberCard() {
  const [photo, setPhoto] = useState(null);
  const [captured, setCaptured] = useState(false);
  const fileRef = useRef();
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setPhoto(ev.target.result); setCaptured(true); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-base font-bold text-gray-800">💳 Ma Carte de Membre</h2>
      <p className="text-xs text-gray-500">Prenez en photo votre carte de membre pour la retrouver rapidement.</p>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      {photo ? (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
            <img src={photo} alt="carte membre" className="w-full object-cover" style={{ maxHeight: "220px" }} />
          </div>
          <button onClick={() => { setPhoto(null); setCaptured(false); }}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500">🔄 Reprendre la photo</button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center py-12 gap-3 cursor-pointer"
          onClick={() => fileRef.current.click()}>
          <div className="text-5xl">📷</div>
          <div className="text-sm text-gray-500 font-medium">Photographier ma carte</div>
          <div className="text-xs text-gray-400">Appuyez pour ouvrir l'appareil photo</div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => fileRef.current.click()}
          className="text-white rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2"
          style={{ background: "#ec4899" }}>📸 Appareil photo</button>
        <button onClick={() => fileRef.current.click()}
          className="bg-white border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2">🖼️ Galerie</button>
      </div>
      {captured && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium text-center border" style={{ background: "#fce7f3", borderColor: "#f9a8d4", color: "#be185d" }}>
          ✅ Carte enregistrée !
        </div>
      )}
    </div>
  );
}

function Astuces() {
  const [filtre, setFiltre] = useState("Tous");
  const categories = ["Tous", "Premier secours", "Les bons gestes"];
  const filtered = filtre === "Tous" ? ASTUCES : ASTUCES.filter(a => a.tag === filtre);
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">💡 Trucs & Astuces</h2>
        <a href="https://www.cec-saillysurlalys.com/blog" target="_blank" rel="noreferrer"
          className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
          style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>Voir le blog ↗</a>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setFiltre(c)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors"
            style={filtre === c ? { background: "linear-gradient(135deg,#ec4899,#be185d)", color: "white", borderColor: "transparent" } : { background: "white", color: "#6b7280", borderColor: "#e5e7eb" }}>
            {c}
          </button>
        ))}
      </div>
      {filtered.map(a => (
        <a key={a.id} href={a.url} target="_blank" rel="noreferrer"
          className="block bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-95 transition-transform">
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0 mt-0.5">{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TAG_ASTUCES[a.tag]}`}>{a.tag}</span>
              <div className="font-semibold text-sm text-gray-800 mt-1">{a.titre}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.résumé}</div>
              <div className="text-xs mt-2 font-medium" style={{ color: "#ec4899" }}>Lire l'article →</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function Contact() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-base font-bold text-gray-800">📞 Contact</h2>
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full text-2xl flex items-center justify-center flex-shrink-0" style={{ background: "#fce7f3" }}>👨‍💼</div>
        <div className="flex-1">
          <div className="text-xs text-gray-400">Président</div>
          <div className="font-bold text-sm text-gray-800">M. Yannick Le Berre</div>
          <div className="text-xs mt-0.5 font-medium" style={{ color: "#ec4899" }}>06 22 85 96 46</div>
        </div>
        <a href="tel:0622859646" className="w-11 h-11 rounded-full text-white flex items-center justify-center text-lg shadow flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>📞</a>
      </div>
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <div className="text-sm font-semibold text-gray-700">📍 Adresse</div>
        <div className="text-sm text-gray-600">Rue de la Gare<br />62840 Sailly-sur-la-Lys</div>
        <a href="https://maps.google.com/?q=Rue+de+la+Gare+62840+Sailly-sur-la-Lys" target="_blank" rel="noreferrer"
          className="block w-full py-2.5 rounded-xl text-white text-sm font-medium text-center"
          style={{ background: "linear-gradient(135deg,#6b7280,#9ca3af)" }}>🗺️ Ouvrir dans Google Maps</a>
      </div>
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
        <div className="text-sm font-semibold text-gray-700">📧 Email</div>
        <a href="mailto:saillysurlalys.cec@gmail.com" className="text-sm break-all" style={{ color: "#ec4899" }}>saillysurlalys.cec@gmail.com</a>
        <div className="text-sm font-semibold text-gray-700 pt-2">🕐 Horaires d'entraînement</div>
        <div className="text-sm text-gray-600">Samedi : 09h00 – 12h00<br />Mercredi : 19h00 – 21h00</div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const screens = [
    <Home setTab={setTab} />,
    <News />,
    <Agenda />,
    <Facebook />,
    <MemberCard />,
    <Astuces />,
    <Contact />,
  ];
  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Header />
      <div className="flex-1 overflow-y-auto pb-24">{screens[tab]}</div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 shadow-lg">
        <div className="flex">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)}
              className="flex-shrink-0 flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-colors min-w-0"
              style={{ color: tab === i ? "#ec4899" : "#9ca3af" }}>
              <span className="text-lg">{ICONS[i]}</span>
              <span style={{ fontSize: "9px" }} className="font-medium">{label}</span>
              {tab === i && <span className="w-1 h-1 rounded-full" style={{ background: "#ec4899" }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
